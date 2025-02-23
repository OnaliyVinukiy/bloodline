/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import { MongoClient } from "mongodb";
import {
  COSMOS_DB_CONNECTION_STRING,
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
} from "../config/azureConfig.js";
import dotenv from "dotenv";

dotenv.config();

// Save appointment data
export const saveAppointment = async (req, res) => {
  const appointmentData = req.body;

  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);
    const result = await collection.insertOne(appointmentData);

    res.status(201).json({
      message: "Appointment saved successfully",
      appointmentId: result.insertedId,
    });

    await client.close();
  } catch (error) {
    console.error("Error saving appointment:", error);
    res.status(500).json({ message: "Error saving appointment", error });
  }
};
