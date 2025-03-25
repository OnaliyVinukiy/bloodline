/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import { Request, Response } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import {
  DATABASE_ID,
  DONOR_COLLECTION_ID,
  CONTAINER_NAME,
} from "../config/azureConfig";
import { UserInfo } from "../types/users.js";

const app = express();
app.use(express.json());
dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error(
    "Missing environment variable: AZURE_STORAGE_CONNECTION_STRING"
  );
}
const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;
if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("Missing environment variable: COSMOS_DB_CONNECTION_STRING");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

// Connect to DB using MongoClient.
const connectToCosmos = async () => {
  try {
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    const db = client.db(DATABASE_ID);
    const collection = db.collection(DONOR_COLLECTION_ID);

    console.log("Connected to Cosmos DB");
    return { db, collection, client };
  } catch (error) {
    console.error("Error connecting to Cosmos DB:", error);
    throw error;
  }
};

// Fetch user info from Asgardeo API
export const getUserInfo = async (req: Request, res: Response) => {
  const { accessToken } = req.body;

  // Log token for debugging
  console.log("Access Token:", accessToken);

  if (!accessToken) {
    return res.status(400).json({ message: "Access token is missing" });
  }

  try {
    const response = await fetch(
      "https://api.asgardeo.io/t/onaliy/oauth2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Asgardeo API Response:", errorText);
      throw new Error(`Failed to fetch user info: ${errorText}`);
    }

    const userInfo = (await response.json()) as UserInfo;
    const user = {
      sub: userInfo.sub,
      firstName: userInfo.given_name || "Guest",
      lastName: userInfo.family_name || "",
      email: userInfo.email || "No Email",
      role: userInfo.roles || null,
    };
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = (error as Error).message || error;
    console.error("Error fetching user info:", errorMessage);
    res.status(500).json({
      message: "Error fetching user info",
      error: (error as Error).message || error,
    });
  }
};

// Handle avatar upload to Azure Blob Storage
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { email } = req.body;
    const blobName = `${email}-${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    const avatarUrl = blockBlobClient.url;

    // Update donor record in Cosmos DB
    const mongoClient = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await mongoClient.connect();
    const database = mongoClient.db(DATABASE_ID);
    const donorsCollection = database.collection(DONOR_COLLECTION_ID);

    await donorsCollection.updateOne(
      { email },
      { $set: { avatar: avatarUrl } }
    );

    await mongoClient.close();

    res.status(200).json({ avatarUrl });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};

// Create or update donor record in DB
export const upsertDonor = async (req: Request, res: Response) => {
  const donor = req.body;

  try {
    const { collection, client } = await connectToCosmos();
    const upsertResult = await collection.updateOne(
      { email: donor.email },
      { $set: donor },
      { upsert: true }
    );

    res.status(200).json({
      message: "Donor profile upserted successfully!",
      donor: upsertResult,
    });

    client.close();
  } catch (error) {
    console.error("Error upserting donor profile:", error);
    res.status(500).json({ message: "Error upserting donor profile" });
  }
};

//Fetch all donors
export const getDonors = async (req: Request, res: Response) => {
  try {
    //Connect to database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(DONOR_COLLECTION_ID);

    const donors = await collection.find({}).toArray();

    res.status(200).json(donors);
    await client.close();
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ message: "Error fetching donors", error });
  }
};

//Fetch donor by email
export const getDonorByEmail = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToCosmos();
    const { email } = req.params;
    const donor = await collection.findOne({ email });

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json(donor);
    client.close();
  } catch (error) {
    console.error("Error fetching donor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Fetch donor count
export const getDonorsCount = async (req: Request, res: Response) => {
  try {
    //Connect to database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(DONOR_COLLECTION_ID);

    //Fetch donor count
    const count = await collection.countDocuments();
    res.status(200).json({ count });

    await client.close();
  } catch (error) {
    console.error("Error fetching donor count:", error);
    res.status(500).json({ message: "Error fetching donor count", error });
  }
};
