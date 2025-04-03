/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { MongoClient } from "mongodb";
import {
  DATABASE_ID,
  BLOOD_STOCK_COLLECTION_ID,
  BLOOD_STOCK_HISTORY_COLLECTION_ID,
} from "../config/azureConfig";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { BloodStock, StockAdditionHistory } from "../types/stocks";

dotenv.config();

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;
if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("Missing environment variable: COSMOS_DB_CONNECTION_STRING");
}

//Fetch blood stock
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

    const formattedStocks = sortedStocks.map((stock) => ({
      bloodType: stock.bloodType,
      quantity: stock.quantity,
      lastUpdated: stock.updatedAt?.toISOString() || new Date().toISOString(),
      updatedBy: stock.updatedBy,
    }));

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

//Track stock change
export const trackStockChange = async (
  bloodType: string,
  quantityChange: number,
  updatedBy: string,
  operationType: "addition" | "issuance",
  previousQuantity: number,
  issuedTo?: string
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
      previousQuantity,
      newQuantity,
      updatedBy,
      updatedAt: new Date(),
      operationType,
      ...(operationType === "issuance" && { issuedTo }),
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

    //Fetch all history records
    const history = await collection
      .find({ operationType: "addition" })
      .toArray();
    history.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    //Format the response
    const formattedHistory = history.map((record) => ({
      _id: record._id?.toString(),
      bloodType: record.bloodType,
      quantityAdded: record.quantityAdded,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt.toISOString(),
    }));

    res.status(200).json(formattedHistory);
  } catch (error) {
    console.error("Error fetching stock addition history:", error);
    res.status(500).json({
      message: "Server error while fetching stock addition history",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (client) await client.close();
  }
};

//Fetch complete stock history
export const getStockHistory = async (req: Request, res: Response) => {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection<StockAdditionHistory>(
      BLOOD_STOCK_HISTORY_COLLECTION_ID
    );

    //Fetch all history records
    const history = await collection
      .find({ operationType: "addition" })
      .toArray();
    history.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    //Format the response
    const formattedHistory = history.map((record) => ({
      _id: record._id?.toString(),
      bloodType: record.bloodType,
      quantityChange: record.quantityAdded,
      previousQuantity: record.previousQuantity,
      newQuantity: record.newQuantity,
      operationType: record.operationType,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt.toISOString(),
      ...(record.operationType === "issuance" && { issuedTo: record.issuedTo }),
    }));

    res.status(200).json(formattedHistory);
  } catch (error) {
    console.error("Error fetching stock history:", error);
    res.status(500).json({
      message: "Server error while fetching stock history",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (client) await client.close();
  }
};

//Update blood stock
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { bloodType, quantity, updatedBy } = req.body;

    // Validate input
    if (!bloodType || !quantity || !updatedBy) {
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

    // Find existing stock or create new if doesn't exist
    const result = await collection.findOneAndUpdate(
      { bloodType },
      {
        $inc: { quantity: parsedQuantity },
        $set: { updatedBy, updatedAt: new Date() },
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
      result.quantity - parsedQuantity
    );

    res.status(200).json({
      message: "Blood stock updated successfully",
      updatedStock: {
        bloodType: result.bloodType,
        quantity: result.quantity,
        lastUpdated: result.updatedAt?.toISOString(),
        updatedBy: result.updatedBy,
      },
    });

    await client.close();
  } catch (error) {
    console.error("Error updating blood stock:", error);
    res.status(500).json({
      message: "Server error while updating blood stock",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

//Issue blood stock
export const issueBloodStock = async (req: Request, res: Response) => {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection<BloodStock>(
      BLOOD_STOCK_COLLECTION_ID
    );

    const { bloodType, quantity, updatedBy, issuedTo } = req.body;

    if (!bloodType || !quantity || !updatedBy || !issuedTo) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number." });
    }

    // Find the current stock for the given blood type
    const stockItem = await collection.findOne({ bloodType });
    if (!stockItem || stockItem.quantity < parsedQuantity) {
      return res.status(400).json({ message: "Not enough stock available." });
    }

    // Deduct the issued quantity from the stock
    const updatedQuantity = stockItem.quantity - parsedQuantity;

    await collection.updateOne(
      { _id: stockItem._id },
      {
        $set: {
          quantity: updatedQuantity,
          updatedBy,
          updatedAt: new Date(),
        },
      }
    );

    //Track stock change
    await trackStockChange(
      bloodType,
      -parsedQuantity,
      updatedBy,
      "issuance",
      stockItem.quantity,
      issuedTo
    );

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
    res.status(500).json({ message: "Internal server error." });
  } finally {
    if (client) {
      await client.close();
    }
  }
};
