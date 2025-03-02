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
import { ObjectId } from "mongodb";

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

// Fetch appointment data
export const getAppointments = async (req, res) => {
  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    // Fetch all appointments
    const appointments = await collection.find({}).toArray();

    res.status(200).json(appointments);

    await client.close();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Fetch a single appointment by ID
export const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    // Find the appointment by ID
    const appointment = await collection.findOne({ _id: new ObjectId(id) });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);

    await client.close();
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};

// Fetch booked slots for a specific date
export const getAppointmentsByDate = async (req, res) => {
  const { date } = req.params;
  try {
    //Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    //Format date to get appointments for the whole day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const appointments = await collection
      .find({
        selectedDate: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      })
      .toArray();

    res.status(200).json(appointments);

    await client.close();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

//Approve pending appointments
export const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);
    const objectId = new ObjectId(id);

    const updatedAppointment = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { status: "Approved" } },
      { returnDocument: "after" }
    );

    await client.close();

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Reject pending appointments
export const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);
    const objectId = new ObjectId(id);

    const updatedAppointment = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { status: "Rejected" } },
      { returnDocument: "after" }
    );

    await client.close();

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
