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
} from "../controllers/appointmentController.js";

const router = express.Router();

// Route to save appointment data
router.post("/save-appointment", saveAppointment);

//Routes to fetch appointment data
router.get("/fetch-appointment", getAppointments);
router.get("/fetch-appointment/:id", getAppointmentById);

router.get("/:date", getAppointmentsByDate);

// Route to approve appointment
router.put("/approve-appointment/:id", approveAppointment);

// Route to reject appointment
router.put("/reject-appointment/:id", rejectAppointment);

export default router;
