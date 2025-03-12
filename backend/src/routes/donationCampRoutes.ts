/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import {
  getBookedSlots,
  registerCamp,
} from "../controllers/donationCampController";

const router = express.Router();

router.post("/register", registerCamp);
router.get("/booked-slots/:date", getBookedSlots);

export default router;
