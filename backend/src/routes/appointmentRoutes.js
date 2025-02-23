/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import { saveAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

// Route to save appointment data
router.post("/save-appointment", saveAppointment);

export default router;
