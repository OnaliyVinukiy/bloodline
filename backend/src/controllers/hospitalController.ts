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
import { MongoClient, ObjectId } from "mongodb";
import {
  DATABASE_ID,
  HOSPITAL_COLLECTION_ID,
  BLOOD_REQUEST_COLLECTION_ID,
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

// Connect to Hospitals collection
const connectToHospitalsCollection = async () => {
  try {
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    const db = client.db(DATABASE_ID);
    const collection = db.collection(HOSPITAL_COLLECTION_ID);
    return { db, collection, client };
  } catch (error) {
    console.error("Error connecting to Cosmos DB:", error);
    throw error;
  }
};

// Connect to Blood Requests collection
const connectToBloodRequestsCollection = async () => {
  try {
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    const db = client.db(DATABASE_ID);
    const collection = db.collection(BLOOD_REQUEST_COLLECTION_ID);
    return { db, collection, client };
  } catch (error) {
    console.error("Error connecting to Cosmos DB:", error);
    throw error;
  }
};

// Existing hospital functions remain the same...
export const getHospitalByEmail = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToHospitalsCollection();
    const { repEmail } = req.params;
    const hospital = await collection.findOne({ repEmail });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(hospital);
    client.close();
  } catch (error) {
    console.error("Error fetching hospital:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Handle avatar upload to Azure Blob Storage
export const uploadHospitalLogo = async (req: Request, res: Response) => {
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
    const hospitalCollection = database.collection(HOSPITAL_COLLECTION_ID);

    await hospitalCollection.updateOne(
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

// Create or update hospital record in DB
export const upsertHospital = async (req: Request, res: Response) => {
  const hospital = req.body;

  try {
    const { collection, client } = await connectToHospitalsCollection();
    const upsertResult = await collection.updateOne(
      { repEmail: hospital.repEmail },
      { $set: hospital },
      { upsert: true }
    );

    res.status(200).json({
      message: "Hospital updated successfully!",
      organization: upsertResult,
    });

    client.close();
  } catch (error) {
    console.error("Error updating hospital:", error);
    res.status(500).json({ message: "Error updating hospital" });
  }
};

// Fetch hospital data
export const getHospitals = async (req: Request, res: Response) => {
  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(HOSPITAL_COLLECTION_ID);

    // Fetch all hospitals
    const hospitals = await collection.find({}).toArray();

    res.status(200).json(hospitals);

    await client.close();
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Error fetching hospitals", error });
  }
};

// Approve hospital request
export const approveHospital = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToHospitalsCollection();
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "approved",
          approvedAt: new Date(),
          rejectionReason: null,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json({
      message: "Hospital approved successfully",
      hospitalId: id,
    });

    client.close();
  } catch (error) {
    console.error("Error approving hospital:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject hospital request
export const rejectHospital = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToHospitalsCollection();
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim() === "") {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "rejected",
          rejectionReason: rejectionReason.trim(),
          rejectedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json({
      message: "Hospital rejected successfully",
      hospitalId: id,
    });

    client.close();
  } catch (error) {
    console.error("Error rejecting hospital:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit blood request
export const submitBloodRequest = async (req: Request, res: Response) => {
  try {
    const { collection: bloodRequestsCollection, client: bloodClient } =
      await connectToBloodRequestsCollection();
    const { collection: hospitalsCollection, client: hospitalClient } =
      await connectToHospitalsCollection();

    const bloodRequest = req.body;

    // Validate hospital exists and is approved
    const hospital = await hospitalsCollection.findOne({
      _id: new ObjectId(bloodRequest.hospitalId),
      status: "approved",
    });

    if (!hospital) {
      hospitalClient.close();
      bloodClient.close();
      return res
        .status(404)
        .json({ message: "Hospital not found or not approved" });
    }

    // Insert blood request into blood requests collection
    const result = await bloodRequestsCollection.insertOne({
      ...bloodRequest,
      hospitalId: hospital._id,
      hospitalName: hospital.hospitalName,
      hospitalEmail: hospital.hospitalEmail,
      contactNumber: hospital.hosContactNumber,
      createdAt: new Date(),
      requestId: `BR-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`,
      status: "pending",
    });

    hospitalClient.close();
    bloodClient.close();

    res.status(201).json({
      message: "Blood request submitted successfully",
      requestId: result.insertedId,
    });
  } catch (error) {
    console.error("Error submitting blood request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all blood requests for admin
export const getAllBloodRequests = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToBloodRequestsCollection();

    const requests = await collection
      .find({})
      .sort({ requestedAt: -1 })
      .toArray();

    res.status(200).json(requests);
    client.close();
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get blood requests for specific hospital
export const getHospitalBloodRequests = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToBloodRequestsCollection();
    const { hospitalId } = req.params;

    if (!ObjectId.isValid(hospitalId)) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }

    const requests = await collection
      .find({
        hospitalId: new ObjectId(hospitalId),
      })
      .sort({ requestedAt: -1 })
      .toArray();

    res.status(200).json(requests);
    client.close();
  } catch (error) {
    console.error("Error fetching hospital blood requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve blood request
export const approveBloodRequest = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToBloodRequestsCollection();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "approved",
          approvedAt: new Date(),
          rejectionReason: null,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    res.status(200).json({ message: "Blood request approved successfully" });
    client.close();
  } catch (error) {
    console.error("Error approving blood request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject blood request
export const rejectBloodRequest = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToBloodRequestsCollection();
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim() === "") {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "rejected",
          rejectionReason: rejectionReason.trim(),
          rejectedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    res.status(200).json({ message: "Blood request rejected successfully" });
    client.close();
  } catch (error) {
    console.error("Error rejecting blood request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark blood request as fulfilled
export const fulfillBloodRequest = async (req: Request, res: Response) => {
  try {
    const { collection, client } = await connectToBloodRequestsCollection();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "fulfilled",
          fulfilledAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    res.status(200).json({ message: "Blood request marked as fulfilled" });
    client.close();
  } catch (error) {
    console.error("Error fulfilling blood request:", error);
    res.status(500).json({ message: "Server error" });
  }
};
