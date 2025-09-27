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
import axios from "axios";
import nodemailer from "nodemailer";
import { DonorWelcome } from "../emailTemplates/DonorWelcome";

const app = express();
app.use(express.json());
dotenv.config();

const MSPACE_API_BASE_URL = "https://api.mspace.lk/sms/send";
const MSPACE_API_VERSION = "1.0";
const MSPACE_APPLICATION_ID = process.env.MSPACE_APPLICATION_ID;
const MSPACE_PASSWORD = process.env.MSPACE_PASSWORD;
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
    const collection = db.collection(DONOR_COLLECTION_ID);

    return { db, collection, client };
  } catch (error) {
    console.error("Error connecting to Cosmos DB:", error);
    throw error;
  }
};

// Fetch user info from Asgardeo API
export const getUserInfo = async (req: Request, res: Response) => {
  const { accessToken } = req.body;

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
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
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
  let client: MongoClient | null = null;

  try {
    const { collection, client: dbClient } = await connectToCosmos();
    client = dbClient;

    const { _id, ...donorDataWithoutId } = donor;

    // Check if the donor already exists
    const existingDonor = await collection.findOne({ email: donor.email });
    const isNewDonor = !existingDonor;
    if (
      existingDonor &&
      existingDonor.maskedNumber &&
      !donorDataWithoutId.maskedNumber
    ) {
      donorDataWithoutId.maskedNumber = existingDonor.maskedNumber;
    }

    // Perform the upsert operation
    const upsertResult = await collection.updateOne(
      { email: donor.email },
      { $set: donorDataWithoutId },
      { upsert: true }
    );

    // Check for new registration and send notifications
    if (isNewDonor) {
      // Send Welcome Email
      await sendWelcomeEmail(donor);

      // Send Welcome SMS
      if (donor.contactNumber) {
        const welcomeMessage = `Welcome to Bloodline, ${donor.fullName}! Your registration is complete. We're grateful for your commitment to saving lives.`;

        await sendSMS(donor.maskedNumber, welcomeMessage).catch((err) =>
          console.error(
            `Failed to send SMS to ${donor.contactNumber}:`,
            err.message
          )
        );
      }
    }

    res.status(200).json({
      message: isNewDonor
        ? "New donor registered and profile completed!"
        : "Donor profile upserted successfully!",
      donor: upsertResult,
    });
  } catch (error) {
    console.error("Error upserting donor profile:", error);
    res.status(500).json({ message: "Error upserting donor profile" });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

const sendWelcomeEmail = async (donor: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: donor.email,
    subject: "Welcome to Bloodline - Donor Registration Complete!",
    html: DonorWelcome(donor),
  };

  await transporter.sendMail(mailOptions);
};

export const sendSMS = async (destinationAddress: string, message: string) => {
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
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    throw new Error("Failed to send SMS notification");
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

//Fetch donors registered daily
export const getDonorsDaily = async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(DONOR_COLLECTION_ID);

    //Group by day and count donors
    const result = await collection
      .aggregate([
        {
          $group: {
            _id: {
              year: { $year: { $toDate: "$_id" } },
              month: { $month: { $toDate: "$_id" } },
              day: { $dayOfMonth: { $toDate: "$_id" } },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
        {
          $project: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: "$_id.day",
                  },
                },
              },
            },
            count: 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    res.status(200).json(result);
    await client.close();
  } catch (error) {
    console.error("Error fetching daily donors:", error);
    res.status(500).json({ message: "Error fetching daily donors", error });
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

//Fetch donor by email
export const getDonorsByNIC = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToCosmos();
    const { nic } = req.params;
    const donor = await collection.findOne({ nic });

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
