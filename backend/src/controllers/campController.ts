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
import { ObjectId } from "mongodb";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;

if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("Missing environment variable: COSMOS_DB_CONNECTION_STRING");
}

export const saveCamp = async (req: Request, res: Response) => {
  const campData = req.body;

  if (!campData) {
    return res.status(400).json({ message: "Missing form data" });
  }

  const errors: string[] = [];

  // Validate fullName
  if (!campData.fullName?.trim()) {
    errors.push("Full name is required.");
  }

  // Validate NIC
  if (!campData.nic?.trim()) {
    errors.push("NIC is required.");
  } else {
    const nicRegex = /^([0-9]{9}[Vv]|[0-9]{12})$/;
    if (!nicRegex.test(campData.nic.trim())) {
      errors.push("Invalid NIC format.");
    }
  }

  // Validate email
  if (!campData.email?.trim()) {
    errors.push("Email is required.");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(campData.email.trim())) {
      errors.push("Invalid email format.");
    }
  }

  // Validate contactNumber
  if (!campData.contactNumber?.trim()) {
    errors.push("Contact number is required.");
  } else {
    const contactRegex = /^0\d{9}$/;
    if (!contactRegex.test(campData.contactNumber.trim())) {
      errors.push("Contact number must be a 10-digit number starting with 0.");
    }
  }

  // Validate province, district, city
  ["province", "district", "city"].forEach((field) => {
    if (!campData[field]?.trim()) {
      errors.push(
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
      );
    }
  });

  // Validate date
  if (!campData.date?.trim()) {
    errors.push("Date is required.");
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(campData.date)) {
      errors.push("Invalid date format. Use YYYY-MM-DD.");
    } else {
      const [year, month, day] = campData.date.split("-").map(Number);
      const campDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      if (isNaN(campDate.getTime())) {
        errors.push("Invalid date.");
      } else if (campDate < todayDate) {
        errors.push("Date cannot be in the past.");
      }
    }
  }

  // Validate time
  if (!campData.startTime?.trim()) {
    errors.push("Time slot is required.");
  }

  if (!campData.endTime?.trim()) {
    errors.push("Time slot is required.");
  }

  // Validate googleMapLink
  if (!campData.googleMapLink?.trim()) {
    errors.push("Google Map link is required.");
  } else {
    try {
      const url = new URL(campData.googleMapLink);
      if (!url.hostname.includes("maps.google.com")) {
        errors.push("Google Map link must be a valid Google Maps URL.");
      }
    } catch (e) {
      errors.push("Invalid Google Map link URL.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

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

// Fetch camp data
export const getCamps = async (req: Request, res: Response) => {
  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);

    // Fetch all camps
    const camps = await collection.find({}).toArray();

    res.status(200).json(camps);

    await client.close();
  } catch (error) {
    console.error("Error fetching camps:", error);
    res.status(500).json({ message: "Error fetching camps", error });
  }
};

export const getCampsByCity = async (req: Request, res: Response) => {
  const { city } = req.params;

  if (!city) {
    return res.status(400).json({ message: "City parameter is required" });
  }

  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);

    // Query camps by city
    const camps = await collection.find({ city }).toArray();

    if (camps.length === 0) {
      return res
        .status(404)
        .json({ message: "No camps found for the specified city" });
    }

    res.status(200).json(camps);

    await client.close();
  } catch (error) {
    console.error("Error fetching camps by city:", error);
    res.status(500).json({ message: "Failed to fetch camps by city", error });
  }
};

// Fetch a single camp by ID
export const getCampById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);

    // Find the camp by ID
    const camp = await collection.findOne({ _id: new ObjectId(id) });

    if (!camp) {
      return res.status(404).json({ message: "Camp is found" });
    }

    res.status(200).json(camp);

    await client.close();
  } catch (error) {
    console.error("Error fetching camp:", error);
    res.status(500).json({ message: "Error fetching camp", error });
  }
};

//Approve pending camp
export const approveCamp = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);
    const objectId = new ObjectId(id);

    const updatedCamp = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { status: "Approved" } },
      { returnDocument: "after" }
    );

    await client.close();

    if (!updatedCamp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json(updatedCamp);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
