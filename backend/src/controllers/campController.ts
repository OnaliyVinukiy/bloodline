/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { DATABASE_ID, CAMP_COLLECTION_ID } from "../config/azureConfig";
import { ObjectId } from "mongodb";
import { CampApproval } from "../emailTemplates/CampApproval";
import { CampRejection } from "../emailTemplates/CampRejected";
import { CampConfirmation } from "../emailTemplates/CampConfirmation";
import Camp from "../models/donationCampModel";

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

    // Send approval email
    await sendConfirmationEmail(campData);

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

//Fetch monthly camps
export const getCampsByMonth = async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);

    // Group by month and count
    const result = await collection
      .aggregate([
        {
          $group: {
            _id: { $month: { $toDate: "$date" } }, // Assuming there's a 'date' field
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
    console.error("Error fetching monthly camps:", error);
    res.status(500).json({ message: "Error fetching monthly camps", error });
  }
};

//Fetch count of all camps
export const getCampsCount = async (req: Request, res: Response) => {
  try {
    //Connect to database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);

    //Fetch count of all camps
    const count = await collection.countDocuments();
    res.status(200).json({ count });

    await client.close();
  } catch (error) {
    console.error("Error fetching camp count:", error);
    res.status(500).json({ message: "Error fetching camp count", error });
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

// Fetch a single camp by Email
export const getCampByEmail = async (req: Request, res: Response) => {
  const { repEmail } = req.params;

  try {
    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);

    // Find the camp by ID
    const camp = await collection.findOne({ repEmail: repEmail });

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

    // Send approval email
    await sendApprovalEmail(updatedCamp);

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

//Reject pending camp
export const rejectCamp = async (req: Request, res: Response) => {
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
    const collection = database.collection(CAMP_COLLECTION_ID);
    const objectId = new ObjectId(id);

    const updatedCamp = await collection.findOneAndUpdate(
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
    await sendRejectionEmail(updatedCamp);

    await client.close();

    if (!updatedCamp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json(updatedCamp);
  } catch (error) {
    console.error("Error updating camp status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const allocateTeam = async (req: Request, res: Response) => {
  try {
    const { campId, team } = req.body;

    if (!campId || !team) {
      return res.status(400).json({ message: "Camp ID and Team are required" });
    }

    // Connect to the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);
    const objectId = new ObjectId(campId);

    // Update the camp with the allocated team
    const updatedCamp = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { team } },
      { returnDocument: "after" }
    );

    await client.close();

    if (!updatedCamp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json(updatedCamp);
  } catch (error) {
    console.error("Error allocating team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send approval email to the donor
const sendApprovalEmail = async (camp: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: camp.email,
    subject: "Blood Donation Camp Approved",
    html: CampApproval(camp),
  };

  await transporter.sendMail(mailOptions);
};

// Send rejection email to the donor
const sendRejectionEmail = async (camp: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: camp.email,
    subject: "Blood Donation Appointment Rejected",
    html: CampRejection(camp),
  };

  await transporter.sendMail(mailOptions);
};

// Send confirmation email
const sendConfirmationEmail = async (camp: any) => {
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
    to: camp.email,
    subject: "Blood Donation Camp Request Placed",
    html: CampConfirmation(camp),
  };

  await transporter.sendMail(mailOptions);
};

// Check teams availability
export const checkTeamAvailability = async (req: Request, res: Response) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Date parameter is required",
    });
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format. Use YYYY-MM-DD",
    });
  }

  let client: MongoClient;

  try {
    // Connect to the database
    client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();

    const database = client.db(DATABASE_ID);
    const collection = database.collection(CAMP_COLLECTION_ID);

    // Find all camps for the specified date
    const camps = await collection
      .find({ date })
      .project({ team: 1, status: 1 })
      .toArray();

    // Check team availability
    const allocatedTeams = camps.map((camp) => camp.team);
    const allTeams = ["Team 1", "Team 2", "Team 3", "Team 4"];
    const availableTeams = allTeams.filter(
      (team) => !allocatedTeams.includes(team)
    );

    // Check if there are pending camps
    const pendingCamps = camps.filter(
      (camp) => camp.status === "Pending"
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalCamps: camps.length,
        allocatedTeams,
        availableTeams,
        pendingCamps,
        isFullyBooked: availableTeams.length === 0,
        hasPendingCamps: pendingCamps > 0,
      },
    });
  } catch (error) {
    console.error("Error checking camp availability:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking camp availability",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (client!) {
      await client
        .close()
        .catch((err) => console.error("Error closing connection:", err));
    }
  }
};
