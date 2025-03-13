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
} from "../controllers/appointmentController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// Route to save appointment data
router.post("/save-appointment", authenticateUser, saveAppointment);

//Routes to fetch appointment data
router.get("/fetch-appointment", authenticateUser, getAppointments);
router.get("/fetch-appointment/:id", authenticateUser, getAppointmentById);

router.get("/:date", authenticateUser, getAppointmentsByDate);

// Route to approve appointment
router.put("/approve-appointment/:id", authenticateUser, approveAppointment);

// Route to reject appointment
router.put("/reject-appointment/:id", authenticateUser, rejectAppointment);

export default router;
