/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { MongoClient } from "mongodb";
import {
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
} from "../config/azureConfig";
import dotenv from "dotenv";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { AppointmentConfirmation } from "../emailTemplates/AppointmentConfirmation";

dotenv.config();
import { ObjectId } from "mongodb";
import { AppointmentRejection } from "../emailTemplates/AppointmentRejection";
import { AppointmentApproval } from "../emailTemplates/AppointmentApproval";

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;
if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("Missing environment variable: COSMOS_DB_CONNECTION_STRING");
}
// Save appointment data
export const saveAppointment = async (req: Request, res: Response) => {
  const appointmentData = req.body;

  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);
    const result = await collection.insertOne(appointmentData);

    // Send confirmation email
    await sendConfirmationEmail(appointmentData);

    res.status(201).json({
      message: "Appointment saved successfully",
      appointmentId: result.insertedId,
    });

    await client.close();
  } catch (error) {
    console.error("Error saving appointment:", error);
    res.status(500).json({ message: "Failed to save appointment" });
  }
};

// Send confirmation email to the donor
const sendConfirmationEmail = async (appointment: any) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.COSMOS_DB_CONNECTION_STRING);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: appointment.donorInfo.email,
    subject: "Blood Donation Appointment Request Placed",
    html: AppointmentConfirmation(appointment),
  };

  await transporter.sendMail(mailOptions);
};

// Fetch appointment data
export const getAppointments = async (req: Request, res: Response) => {
  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

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
export const getAppointmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

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
export const getAppointmentsByDate = async (req: Request, res: Response) => {
  const { date } = req.params;
  try {
    //Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

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
export const approveAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);
    const objectId = new ObjectId(id);

    const updatedAppointment = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { status: "Approved" } },
      { returnDocument: "after" }
    );

    // Send approval email
    await sendApprovalEmail(updatedAppointment);

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

// Send approval email to the donor
const sendApprovalEmail = async (appointment: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: appointment.donorInfo.email,
    subject: "Blood Donation Appointment Approved",
    html: AppointmentApproval(appointment),
  };

  await transporter.sendMail(mailOptions);
};

//Reject pending appointments
export const rejectAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);
    const objectId = new ObjectId(id);

    const updatedAppointment = await collection.findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          status: "Rejected",
          reason,
        },
      },
      { returnDocument: "after" }
    );

    // Send rejection email
    await sendRejectionEmail(updatedAppointment);

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

// Send rejection email to the donor
const sendRejectionEmail = async (appointment: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: appointment.donorInfo.email,
    subject: "Blood Donation Appointment Rejected",
    html: AppointmentRejection(appointment),
  };

  await transporter.sendMail(mailOptions);
};
