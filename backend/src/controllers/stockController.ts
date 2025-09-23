/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { MongoClient, ObjectId } from "mongodb";
import {
  DATABASE_ID,
  BLOOD_STOCK_COLLECTION_ID,
  BLOOD_STOCK_HISTORY_COLLECTION_ID,
} from "../config/azureConfig";
import dotenv from "dotenv";
import e, { Request, Response } from "express";
import { BloodStock, StockAdditionHistory } from "../types/stocks";
import nodemailer from "nodemailer";
import axios from "axios";
import { lowStockAlert } from "../emailTemplates/LowStockAlert";

dotenv.config();

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;
if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("Missing environment variable: COSMOS_DB_CONNECTION_STRING");
}
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const DESTINATION_PHONE_NUMBER = process.env.DESTINATION_ADDRESS;
const MSPACE_API_BASE_URL = "https://api.mspace.lk/sms/send";
const MSPACE_API_VERSION = "1.0";
const MSPACE_APPLICATION_ID = process.env.MSPACE_APPLICATION_ID;
const MSPACE_PASSWORD = process.env.MSPACE_PASSWORD;

if (!DESTINATION_PHONE_NUMBER) {
  throw new Error("Missing environment variable: DESTINATION_ADDRESS");
}

// Fetch blood stock
export const fetchStocks = async (req: Request, res: Response) => {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection<BloodStock>(
      BLOOD_STOCK_COLLECTION_ID
    );

    //Fetch all stocks
    const stocks = await collection.find({}).toArray();

    //Sort by blood type
    const sortedStocks = stocks.sort((a, b) =>
      a.bloodType.localeCompare(b.bloodType)
    );

    const formattedStocks = sortedStocks.map((stock) => {
      const updatedAt =
        stock.updatedAt instanceof Date
          ? stock.updatedAt.toISOString()
          : new Date(stock.updatedAt ?? Date.now()).toISOString();

      const expiryDate =
        stock.expiryDate instanceof Date
          ? stock.expiryDate.toISOString()
          : stock.expiryDate
          ? new Date(stock.expiryDate).toISOString()
          : undefined;

      return {
        bloodType: stock.bloodType,
        quantity: stock.quantity,
        lastUpdated: updatedAt,
        updatedBy: stock.updatedBy,
        expiryDate: expiryDate,
        labelId: stock.labelId,
      };
    });

    res.status(200).json(formattedStocks);
  } catch (error) {
    console.error("Error fetching blood stocks:", error);
    res.status(500).json({
      message: "Server error while fetching blood stocks",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (client) await client.close();
  }
};

// Track stock change
export const trackStockChange = async (
  bloodType: string,
  quantityChange: number,
  updatedBy: string,
  operationType: "addition" | "issuance",
  previousQuantity: number,
  issuedTo?: string,
  labelId?: string,
  expiryDate?: string
) => {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection<StockAdditionHistory>(
      BLOOD_STOCK_HISTORY_COLLECTION_ID
    );

    const newQuantity = previousQuantity + quantityChange;

    const historyRecord: StockAdditionHistory = {
      bloodType,
      quantityAdded:
        operationType === "addition" ? quantityChange : -quantityChange,
      remainingQuantity:
        operationType === "addition" ? quantityChange : undefined,
      previousQuantity,
      newQuantity,
      updatedBy,
      updatedAt: new Date(),
      operationType,
      ...(operationType === "issuance" && { issuedTo }),
      ...(operationType === "addition" && { labelId, expiryDate }),
    };

    await collection.insertOne(historyRecord);
  } catch (error) {
    console.error("Error tracking stock change:", error);
    throw error;
  } finally {
    if (client) await client.close();
  }
};

// Fetch stock addition history
export const getStockAdditionHistory = async (req: Request, res: Response) => {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection<StockAdditionHistory>(
      BLOOD_STOCK_HISTORY_COLLECTION_ID
    );

    const history = await collection
      .find({ operationType: "addition" })
      .sort({ updatedAt: -1 })
      .toArray();

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching addition history:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (client) await client.close();
  }
};

// Fetch stock issuance history
export const getStockIssuanceHistory = async (req: Request, res: Response) => {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection<StockAdditionHistory>(
      BLOOD_STOCK_HISTORY_COLLECTION_ID
    );

    //Fetch all issuance records
    const history = await collection
      .find({ operationType: "issuance" })
      .toArray();

    history.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    //Format the response
    const formattedHistory = history.map((record) => ({
      _id: record._id?.toString(),
      bloodType: record.bloodType,
      quantityIssued: Math.abs(record.quantityAdded),
      issuedTo: record.issuedTo,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt.toISOString(),
    }));

    res.status(200).json(formattedHistory);
  } catch (error) {
    console.error("Error fetching stock issuance history:", error);
    res.status(500).json({
      message: "Server error while fetching stock issuance history",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (client) await client.close();
  }
};

// Fetch available stock entries for a blood type
export const getAvailableStockEntries = async (req: Request, res: Response) => {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection<StockAdditionHistory>(
      BLOOD_STOCK_HISTORY_COLLECTION_ID
    );

    const { bloodType } = req.query;
    if (!bloodType || typeof bloodType !== "string") {
      return res.status(400).json({ message: "Blood type is required" });
    }

    const history = await collection
      .find({
        bloodType,
        operationType: "addition",
        $or: [
          { remainingQuantity: { $gt: 0 } },
          { remainingQuantity: { $exists: false }, quantityAdded: { $gt: 0 } },
        ],
      })
      .toArray();

    history.sort(
      (a, b) =>
        new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()
    );

    const formattedHistory = history.map((record) => ({
      _id: record._id?.toString(),
      bloodType: record.bloodType,
      quantityAdded: record.quantityAdded,
      remainingQuantity: record.remainingQuantity ?? record.quantityAdded,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt.toISOString(),
      labelId: record.labelId,
      expiryDate: record.expiryDate,
    }));

    res.status(200).json(formattedHistory);
  } catch (error) {
    console.error("Error fetching available stock entries:", error);
    res.status(500).json({
      message: "Server error while fetching available stock entries",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (client) await client.close();
  }
};
// Update blood stock
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { bloodType, quantity, updatedBy, labelId, expiryDate } = req.body;

    if (!bloodType || !quantity || !updatedBy || !labelId || !expiryDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number" });
    }

    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection<BloodStock>(
      BLOOD_STOCK_COLLECTION_ID
    );

    const result = await collection.findOneAndUpdate(
      { bloodType },
      {
        $inc: { quantity: parsedQuantity },
        $set: { updatedBy, updatedAt: new Date(), labelId, expiryDate },
        $setOnInsert: { createdAt: new Date() },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    if (!result) {
      throw new Error("Failed to update blood stock");
    }

    await trackStockChange(
      bloodType,
      parsedQuantity,
      updatedBy,
      "addition",
      result.quantity - parsedQuantity,
      undefined,
      labelId,
      expiryDate
    );

    res.status(200).json({
      message: "Blood stock updated successfully",
      updatedStock: {
        bloodType: result.bloodType,
        quantity: result.quantity,
        lastUpdated: result.updatedAt?.toISOString(),
        updatedBy: result.updatedBy,
        expiryDate: result.expiryDate,
        labelId: result.labelId,
      },
    });
  } catch (error) {
    console.error("Error updating blood stock:", error);
    res.status(500).json({
      message: "Server error while updating blood stock",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Function to send an email alert
const sendEmailAlert = async (subject: string, message: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: "bloodline.notifications@gmail.com",
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email alert sent successfully.");
  } catch (error) {
    console.error("Error sending email alert:", error);
    throw new Error("Failed to send email notification.");
  }
};

// Function to send an SMS alert
const sendSmsAlert = async (destinationAddress: string, message: string) => {
  try {
    const requestBody = {
      version: MSPACE_API_VERSION,
      applicationId: MSPACE_APPLICATION_ID,
      password: MSPACE_PASSWORD,
      destinationAddresses: [destinationAddress],
      sourceAddress: "BLAPP",
      deliveryStatusRequest: "0",
      encoding: "0",
      message: message,
    };

    const response = await axios.post(MSPACE_API_BASE_URL, requestBody, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    console.log("SMS alert sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    throw new Error("Failed to send SMS notification.");
  }
};

// Function to handle all alerts
const handleStockAlert = async (
  bloodType: string,
  remainingQuantity: number
) => {
  const subject = `Low Blood Stock Alert for ${bloodType}`;
  const emailMessage = lowStockAlert(bloodType, remainingQuantity);
  const smsMessage = `ALERT: Blood stock for ${bloodType} is low at ${remainingQuantity} units.`;

  await sendEmailAlert(subject, emailMessage);
  await sendSmsAlert(DESTINATION_PHONE_NUMBER, smsMessage);
};

// 💉 Issue blood stock
export const issueBloodStock = async (req: Request, res: Response) => {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const stockCollection = database.collection<BloodStock>(
      BLOOD_STOCK_COLLECTION_ID
    );
    const historyCollection = database.collection<StockAdditionHistory>(
      BLOOD_STOCK_HISTORY_COLLECTION_ID
    );

    const { bloodType, quantity, updatedBy, issuedTo, selectedEntries } =
      req.body;

    // Validate input
    if (
      !bloodType ||
      !quantity ||
      !updatedBy ||
      !issuedTo ||
      !selectedEntries ||
      !Array.isArray(selectedEntries)
    ) {
      return res.status(400).json({
        message:
          "All fields are required, and selectedEntries must be an array.",
      });
    }

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be a positive number.",
      });
    }

    // Fetch selected entries
    const entries = await historyCollection
      .find({
        _id: {
          $in: selectedEntries.map((id: string) => new ObjectId(id)),
        },
        bloodType,
        operationType: "addition",
        $or: [
          {
            remainingQuantity: {
              $gt: 0,
            },
          },
          {
            remainingQuantity: {
              $exists: false,
            },
            quantityAdded: {
              $gt: 0,
            },
          },
        ],
      })
      .toArray();

    if (entries.length !== selectedEntries.length) {
      return res.status(400).json({
        message: "One or more selected entries are invalid or unavailable.",
      });
    }

    // Calculate total available quantity from selected entries
    const totalSelectedQuantity = entries.reduce(
      (sum, entry) => sum + (entry.remainingQuantity ?? entry.quantityAdded),
      0
    );

    if (totalSelectedQuantity < parsedQuantity) {
      return res.status(400).json({
        message: "Selected entries do not cover the requested quantity.",
        requested: parsedQuantity,
        available: totalSelectedQuantity,
      });
    }

    // Check if total stock is sufficient
    const stockItem = await stockCollection.findOne({
      bloodType,
    });
    if (!stockItem || stockItem.quantity < parsedQuantity) {
      return res.status(400).json({
        message: "Not enough stock available in inventory.",
      });
    }

    let remainingToIssue = parsedQuantity;
    const updatePromises = entries
      .sort(
        (a, b) =>
          new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()
      )
      .map(async (entry) => {
        if (remainingToIssue <= 0) return;

        const available = entry.remainingQuantity ?? entry.quantityAdded;
        const toDeduct = Math.min(available, remainingToIssue);

        await historyCollection.updateOne(
          {
            _id: entry._id,
          },
          {
            $set: {
              remainingQuantity: available - toDeduct,
            },
          }
        );

        remainingToIssue -= toDeduct;
      });

    await Promise.all(updatePromises);

    if (remainingToIssue > 0) {
      throw new Error(
        "Failed to deduct the full quantity from selected entries."
      );
    }

    // Update total stock
    const updatedQuantity = stockItem.quantity - parsedQuantity;
    await stockCollection.updateOne(
      {
        _id: stockItem._id,
      },
      {
        $set: {
          quantity: updatedQuantity,
          updatedBy,
          updatedAt: new Date(),
        },
      }
    );

    // Track issuance in history
    await trackStockChange(
      bloodType,
      -parsedQuantity,
      updatedBy,
      "issuance",
      stockItem.quantity,
      issuedTo
    );

    if (updatedQuantity < 500) {
      console.log(
        `Low stock alert triggered for ${bloodType}. Remaining: ${updatedQuantity}`
      );
      await handleStockAlert(bloodType, updatedQuantity);
    }

    res.status(200).json({
      message: "Blood stock issued successfully.",
      issuedDetails: {
        bloodType,
        quantity: parsedQuantity,
        issuedTo,
        remainingStock: updatedQuantity,
      },
    });
  } catch (error) {
    console.error("Error issuing blood stock:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (client) await client.close();
  }
};
