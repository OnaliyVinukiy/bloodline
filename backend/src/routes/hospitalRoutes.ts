/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import {
  getHospitalByEmail,
  getHospitals,
  uploadHospitalLogo,
  upsertHospital,
} from "../controllers/hospitalController";
import multer from "multer";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Router to fetch organization by email
router.get("/hospital/:repEmail", getHospitalByEmail);

//Router to upload hospital logo
router.post("/uploadHospitalLogo", upload.single("file"), uploadHospitalLogo);

//Router to update hospital data
router.post("/submit-request", upsertHospital);

//Route to fetch hospital data
router.get("/fetch-hospitals", authenticateUser, getHospitals);

export default router;
