/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Request, Response } from "express";
import Camp from "../models/donationCampModel";

// Register a new blood donation camp
export const registerCamp = async (req: Request, res: Response) => {
  try {
    const {
      organizerName,
      nic,
      email,
      contact,
      date,
      time,
      province,
      district,
      city,
      organization,
    } = req.body;

    const newCamp = new Camp({
      organizerName,
      nic,
      email,
      contact,
      date,
      time,
      province,
      district,
      city,
      organization,
      status: "Pending",
    });

    await newCamp.save();
    res.status(201).json({
      message: "Blood donation camp registered successfully",
      camp: newCamp,
    });
  } catch (error) {
    console.error("Error registering camp:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch booked slots for a given date
export const getBookedSlots = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const bookedCamps = await Camp.find({ date }).select("time");
    const bookedSlots = bookedCamps.map((camp: any) => camp.time);
    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
