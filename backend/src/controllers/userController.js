/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import {
  COSMOS_DB_CONNECTION_STRING,
  DATABASE_ID,
  DONOR_COLLECTION_ID,
  CONTAINER_NAME,
  AZURE_STORAGE_CONNECTION_STRING,
} from "../config/azureConfig.js";

const app = express();
app.use(express.json());
dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

// Connect to DB using MongoClient
const connectToCosmos = async () => {
  try {
    const client = await MongoClient.connect(COSMOS_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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
const getUserInfo = async (req, res) => {
  const { accessToken } = req.body;

  try {
    const response = await fetch(
      "https://api.asgardeo.io/t/onaliy/oauth2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await response.json();
    const user = {
      sub: userInfo.sub,
      firstName: userInfo.given_name || "Guest",
      lastName: userInfo.family_name || "",
      email: userInfo.email || "No Email",
      role: userInfo.roles || null,
    };
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Error fetching user info" });
  }
};

// Handle avatar upload to Azure Blob Storage
const uploadAvatar = async (req, res) => {
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
const upsertDonor = async (req, res) => {
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

//Fetch donor by email
const getDonorByEmail = async (req, res) => {
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

export { getUserInfo, uploadAvatar, upsertDonor, getDonorByEmail };
