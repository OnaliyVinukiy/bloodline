import express from "express";
import { Request, Response } from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { DATABASE_ID, ADMIN_COLLECTION_ID } from "../config/azureConfig";

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
// Connect to DB using MongoClient.
const connectToCosmos = async () => {
  try {
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    const db = client.db(DATABASE_ID);
    const collection = db.collection(ADMIN_COLLECTION_ID);
    return { db, collection, client };
  } catch (error) {
    console.error("Error connecting to Cosmos DB:", error);
    throw error;
  }
};
export const getAllAdminUsers = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToCosmos(); // Assuming 'admin' collection

    // Query to select only the necessary fields
    const projection = {
      _id: 1,
      name: 1,
      email: 1,
      contactNumber: 1,
      isSubscribed: 1,
      maskedNumber: 1,
    };

    const adminUsers = await collection.find({}, { projection }).toArray();

    res.status(200).json(adminUsers);
    client.close();
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addAdminUser = async (req: Request, res: Response) => {
  const { name, email, contactNumber } = req.body;

  if (!name || !email || !contactNumber) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: name, email, and contact number.",
    });
  }

  let client: MongoClient | undefined;
  try {
    const { collection, client: cosmosClient } = await connectToCosmos();
    client = cosmosClient;

    // Check if an admin with this email or contact number already exists
    const existingAdmin = await collection.findOne({
      $or: [{ email: email.toLowerCase() }, { contactNumber: contactNumber }],
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        error: "An admin with this email or contact number already exists.",
      });
    }

    // New Admin document structure
    const newAdminDocument = {
      name: name,
      email: email.toLowerCase(),
      contactNumber: contactNumber,
      isSubscribed: false, // Default to not subscribed
      maskedNumber: "",
      // Add any other required default fields (e.g., createdAt, role: 'admin')
      createdAt: new Date(),
      role: "admin",
    };

    const result = await collection.insertOne(newAdminDocument);

    if (result.acknowledged) {
      // Return the saved document including the new _id
      const savedAdmin = {
        _id: result.insertedId.toHexString(),
        ...newAdminDocument,
      };
      return res.status(201).json({
        success: true,
        message: "Admin user added successfully.",
        admin: savedAdmin,
      });
    } else {
      throw new Error("Failed to insert document into database.");
    }
  } catch (error) {
    console.error("Error adding admin user:", error);
    res.status(500).json({
      success: false,
      error: "Server error occurred while adding admin.",
    });
  } finally {
    if (client) {
      client.close();
    }
  }
};
