/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { MongoClient } from "mongodb";
import { DATABASE_ID, BLOOD_STOCK_COLLECTION_ID } from "../config/azureConfig";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();
import { ObjectId } from "mongodb";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;
if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("Missing environment variable: COSMOS_DB_CONNECTION_STRING");
}

// Blood Stock Type Interface
interface BloodStock {
  _id?: ObjectId;
  bloodType: string;
  quantity: number;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
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
