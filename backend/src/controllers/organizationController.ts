/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import { Request, Response } from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import {
  DATABASE_ID,
  ORGANIZATION_COLLECTION_ID,
  LOGO_CONTAINER_NAME,
} from "../config/azureConfig";

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
const containerClient =
  blobServiceClient.getContainerClient(LOGO_CONTAINER_NAME);

// Connect to DB using MongoClient.
const connectToCosmos = async () => {
  try {
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    const db = client.db(DATABASE_ID);
    const collection = db.collection(ORGANIZATION_COLLECTION_ID);

    console.log("Connected to Cosmos DB");
    return { db, collection, client };
  } catch (error) {
    console.error("Error connecting to Cosmos DB:", error);
    throw error;
  }
};

//Fetch camp by email
export const getOrganizationByEmail = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToCosmos();
    const { email } = req.params;
    const camp = await collection.findOne({ email });

    if (!camp) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json(camp);
    client.close();
  } catch (error) {
    console.error("Error fetching camp:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create or update donor record in DB
export const upsertOrganization = async (req: Request, res: Response) => {
  const organization = req.body;

  try {
    const { collection, client } = await connectToCosmos();
    const upsertResult = await collection.updateOne(
      { email: organization.email },
      { $set: organization },
      { upsert: true }
    );

    res.status(200).json({
      message: "Organization upserted successfully!",
      organization: upsertResult,
    });

    client.close();
  } catch (error) {
    console.error("Error upserting organization:", error);
    res.status(500).json({ message: "Error upserting organization" });
  }
};

// Handle avatar upload to Azure Blob Storage
export const uploadLogo = async (req: Request, res: Response) => {
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
    const organizationCollection = database.collection(
      ORGANIZATION_COLLECTION_ID
    );

    await organizationCollection.updateOne(
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

// Search for organizations
export const searchOrganizations = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToCosmos();
    const searchTerm = req.query.name as string;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const query = { organizationName: { $regex: searchTerm, $options: "i" } };
    const organizations = await collection.find(query).limit(10).toArray();

    res.status(200).json(organizations);
    client.close();
  } catch (error) {
    console.error("Error searching organizations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Fetch all organizations
export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToCosmos();

    const organizations = await collection.find({}).toArray();

    res.status(200).json(organizations);
    client.close();
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrganizationsCount = async (req: Request, res: Response) => {
  try {
    //Connect to database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(ORGANIZATION_COLLECTION_ID);

    //Fetch organization count
    const count = await collection.countDocuments();
    res.status(200).json({ count });

    client.close();
  } catch (error) {
    console.error("Error fetching organization count:", error);
    res
      .status(500)
      .json({ message: "Error fetching organization count", error });
  }
};
