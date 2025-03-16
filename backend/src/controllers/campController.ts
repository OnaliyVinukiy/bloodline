/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { DATABASE_ID, CAMP_COLLECTION_ID } from "../config/azureConfig";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;

if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("Missing environment variable: COSMOS_DB_CONNECTION_STRING");
}

export const saveCamp = async (req: Request, res: Response) => {
  const campData = req.body;

  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);
    const result = await collection.insertOne(campData);

    res.status(201).json({
      message: "Camp registered successfully",
      campId: result.insertedId,
    });

    await client.close();
  } catch (error) {
    console.error("Error saving camp:", error);
    res.status(500).json({ message: "Failed to register camp" });
  }
};
