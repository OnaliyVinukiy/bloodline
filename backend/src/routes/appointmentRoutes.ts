/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import {
  saveAppointment,
  getAppointments,
  getAppointmentsByDate,
  getAppointmentById,
  approveAppointment,
  rejectAppointment,
  getAppointmentsByEmail,
  getAppointmentsCount,
  getAppointmentsByMonth,
  updateAppointment,
} from "../controllers/appointmentController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// Route to save appointment data
router.post("/save-appointment", authenticateUser, saveAppointment);

//Route to fetch appointment data
router.get("/fetch-appointment", authenticateUser, getAppointments);

//Route to fetch appointment from ID
router.get("/fetch-appointment/:id", authenticateUser, getAppointmentById);

//Route to fetch appointment data from email
router.get(
  "/fetch-appointments/:email",
  authenticateUser,
  getAppointmentsByEmail
);

//Route to fetch appointment data from date
router.get(
  "/fetch-appointments/date/:date",
  authenticateUser,
  getAppointmentsByDate
);

// Route to approve appointment
router.put("/approve-appointment/:id", authenticateUser, approveAppointment);

// Route to reject appointment
router.put("/reject-appointment/:id", authenticateUser, rejectAppointment);

//Route to fetch appointment count
router.get("/count", getAppointmentsCount);

//Route to fetch monthly appointments
router.get("/monthly", getAppointmentsByMonth);

//Route to update appointment
router.patch("/update-appointment/:id", authenticateUser, updateAppointment);

export default router;
