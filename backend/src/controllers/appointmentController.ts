/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { MongoClient } from "mongodb";
import { DATABASE_ID, APPOINTMENT_COLLECTION_ID } from "../config/azureConfig";
import dotenv from "dotenv";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { AppointmentConfirmation } from "../emailTemplates/AppointmentConfirmation";
import { AppointmentReminderOneWeek } from "../emailTemplates/AppointmentReminderOneWeek";
import { AppointmentReminderOneDay } from "../emailTemplates/AppointmentReminderOneDay";
import { scheduleJob } from "node-schedule";
import { ObjectId } from "mongodb";
import { AppointmentRejection } from "../emailTemplates/AppointmentRejection";
import { AppointmentApproval } from "../emailTemplates/AppointmentApproval";
import { AppointmentCancellation } from "../emailTemplates/AppointmentCancellation";
import axios from "axios";

dotenv.config();

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

// Fetch appointment count
export const getAppointmentsCount = async (req: Request, res: Response) => {
  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    // Fetch the count of all appointments
    const count = await collection.countDocuments();

    res.status(200).json({ count });
    await client.close();
  } catch (error) {
    console.error("Error fetching appointment count:", error);
    res
      .status(500)
      .json({ message: "Error fetching appointment count", error });
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

// Fetch appointments by donor email
export const getAppointmentsByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    // Find all appointments using donor email
    const appointments = await collection
      .find({ "donorInfo.email": email })
      .toArray();

    if (appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for this email" });
    }

    res.status(200).json(appointments);
    await client.close();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Fetch booked slots for a specific date
export const getAppointmentsByDate = async (req: Request, res: Response) => {
  const { date } = req.params;
  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    // Format date to get appointments for the whole day
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

// Fetch appointments by month
export const getAppointmentsByMonth = async (req: Request, res: Response) => {
  try {
    // Connect to database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    // Group by month and count
    const result = await collection
      .aggregate([
        {
          $group: {
            _id: { $month: { $toDate: "$selectedDate" } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            month: {
              $let: {
                vars: {
                  monthsInString: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                },
                in: {
                  $arrayElemAt: [
                    "$$monthsInString",
                    { $subtract: ["$_id", 1] },
                  ],
                },
              },
            },
            count: 1,
            _id: 0,
          },
        },
        { $sort: { month: 1 } },
      ])
      .toArray();

    res.status(200).json(result);
    await client.close();
  } catch (error) {
    console.error("Error fetching monthly appointments:", error);
    res
      .status(500)
      .json({ message: "Error fetching monthly appointments", error });
  }
};

// Update appointment data
export const updateAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);
    const objectId = new ObjectId(id);

    const updatedAppointment = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" }
    );

    await client.close();

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

// Schedule reminder emails
const scheduleReminderEmails = (appointment: any) => {
  const appointmentDate = new Date(
    `${appointment.selectedDate}T${appointment.selectedSlot}:00+0530`
  );

  // Schedule one week before reminder
  const oneWeekBefore = new Date(appointmentDate);
  oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

  // Schedule one day before reminder
  const oneDayBefore = new Date(appointmentDate);
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);

  const now = new Date();

  // Schedule one-week reminder if in the future
  if (oneWeekBefore > now) {
    console.log(
      `Scheduling one-week reminder for ${appointment._id} at ${oneWeekBefore}`
    );
    scheduleJob(oneWeekBefore, async () => {
      await sendReminderEmail(appointment, "oneWeek");
    });
  } else {
    console.log(
      `One-week reminder for ${appointment._id} not scheduled (past due: ${oneWeekBefore})`
    );
  }

  // Always schedule one-day reminder
  console.log(
    `Scheduling one-day reminder for ${appointment._id} at ${oneDayBefore}`
  );
  scheduleJob(oneDayBefore, async () => {
    await sendReminderEmail(appointment, "oneDay");
  });

  // If one-day reminder is in the past or now, send immediately
  if (oneDayBefore <= now) {
    console.log(
      `One-day reminder for ${appointment._id} is past due (${oneDayBefore}), sending immediately`
    );
    sendReminderEmail(appointment, "oneDay").catch((error) => {
      console.error(
        `Failed to send immediate one-day reminder for ${appointment._id}:`,
        error
      );
    });
  }
};

// Send reminder emails
const sendReminderEmail = async (
  appointment: any,
  reminderType: "oneWeek" | "oneDay"
) => {
  const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
  try {
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    const currentAppointment = await collection.findOne({
      _id: appointment._id,
    });
    if (currentAppointment?.remindersSent?.[reminderType]) {
      return;
    }

    // Send the appropriate email
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
      subject:
        reminderType === "oneWeek"
          ? "Blood Donation Appointment Reminder (1 Week)"
          : "Blood Donation Appointment Reminder (Tomorrow)",
      html:
        reminderType === "oneWeek"
          ? AppointmentReminderOneWeek(appointment)
          : AppointmentReminderOneDay(appointment),
    };

    await transporter.sendMail(mailOptions);

    // Update the database to mark the reminder as sent
    await collection.updateOne(
      { _id: appointment._id },
      { $set: { [`remindersSent.${reminderType}`]: true } }
    );
  } catch (error) {
    console.error(`Error sending ${reminderType} reminder email:`, error);
  } finally {
    await client.close();
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

const MSPACE_API_BASE_URL = "https://bloodlinebackend-avepf5h9fdfsera7.southeastasia-01.azurewebsites.net/sms/send";
const MSPACE_API_VERSION = "1.0";
const MSPACE_APPLICATION_ID = process.env.MSPACE_APPLICATION_ID;
const MSPACE_PASSWORD = process.env.MSPACE_PASSWORD;

const getCurrentTimestamp = () => {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const sendSMS = async (contactNumber: string, message: string) => {
  try {
    const requestBody = {
      timeStamp: getCurrentTimestamp(),
      version: MSPACE_API_VERSION,
      applicationId: MSPACE_APPLICATION_ID,
      password: MSPACE_PASSWORD,
      subscriberId: "tel:94703334321",
      frequency: "monthly",
      status: "REGISTERED."
    };

    console.log("Request Body for SMS:", requestBody);

    const response = await axios.post(MSPACE_API_BASE_URL, requestBody, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    console.log("SMS sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    throw new Error("Failed to send SMS notification");
  }
};

const sendApprovalSMS = async (appointment: any) => {
  const donorContactNumber = appointment.donorInfo.contactNumber;
  if (!donorContactNumber) {
    console.warn("Donor phone number not found. Skipping SMS notification.");
    return;
  }

  const approvalMessage = `Hello ${appointment.donorInfo.name}, your blood donation appointment on ${appointment.appointmentDate} at ${appointment.appointmentTime} has been approved.`;

  await sendSMS(donorContactNumber, approvalMessage);
};

export const approveAppointment = async (req: Request, res: Response) => {
  let client: MongoClient | null = null;
  try {
    const { id } = req.params;

    // Connect to the database
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);
    const objectId = new ObjectId(id);

    const appointment = await collection.findOne({ _id: objectId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update the appointment status
    const updatedAppointment = await collection.findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          status: "Approved",
          remindersSent: {
            oneWeek: false,
            oneDay: false,
          },
        },
      },
      { returnDocument: "after" }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Schedule reminder emails
    scheduleReminderEmails(updatedAppointment);

    // Send approval email
    await sendApprovalEmail(updatedAppointment);

    // Send approval SMS
    await sendApprovalSMS(updatedAppointment);

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

// Reject pending appointments
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

// Cancel appointments
export const cancelAppointment = async (req: Request, res: Response) => {
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
      { $set: { status: "Cancelled" } },
      { returnDocument: "after" }
    );

    // Send cancellation email
    await sendCancellationEmail(updatedAppointment);

    await client.close();

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};

// Send cancellation email to the donor
const sendCancellationEmail = async (appointment: any) => {
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
    subject: "Blood Donation Appointment Cancelled",
    html: AppointmentCancellation(appointment),
  };

  await transporter.sendMail(mailOptions);
};

// Utility function to manually trigger a reminder email
export const triggerReminderEmail = async (
  appointmentId: string,
  reminderType: "oneWeek" | "oneDay"
) => {
  const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
  try {
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    const appointment = await collection.findOne({
      _id: new ObjectId(appointmentId),
    });
    if (!appointment) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    await sendReminderEmail(appointment, reminderType);
    console.log(
      `Manually triggered ${reminderType} reminder for appointment ${appointmentId}`
    );
  } catch (error) {
    console.error(
      `Error triggering ${reminderType} reminder for ${appointmentId}:`,
      error
    );
    throw error;
  } finally {
    await client.close();
  }
};

// Daily cron job to catch missed one-day reminders
scheduleJob("0 0 * * *", async () => {
  const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
  try {
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const appointments = await collection
      .find({
        status: "Approved",
        selectedDate: tomorrow.toISOString().split("T")[0],
        "remindersSent.oneDay": false,
      })
      .toArray();

    for (const appointment of appointments) {
      await sendReminderEmail(appointment, "oneDay");
      console.log(
        `Sent missed one-day reminder for appointment ${appointment._id}`
      );
    }
  } catch (error) {
    console.error("Error in daily reminder check:", error);
  } finally {
    await client.close();
  }
});
