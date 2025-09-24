/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import {
  approveHospital,
  getHospitalByEmail,
  getHospitals,
  rejectHospital,
  uploadHospitalLogo,
  upsertHospital,
  submitBloodRequest,
  getAllBloodRequests,
  getHospitalBloodRequests,
  approveBloodRequest,
  rejectBloodRequest,
  fulfillBloodRequest,
} from "../controllers/hospitalController";
import multer from "multer";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Hospital routes
router.get("/hospital/:repEmail", getHospitalByEmail);
router.post("/uploadHospitalLogo", upload.single("file"), uploadHospitalLogo);
router.post("/submit-request", upsertHospital);
router.get("/fetch-hospitals", authenticateUser, getHospitals);
router.patch("/:id/approve", approveHospital);
router.patch("/:id/reject", rejectHospital);

// Blood request routes
router.post("/blood-requests", submitBloodRequest);
router.get("/blood-requests", getAllBloodRequests);
router.get("/blood-requests/hospital/:hospitalId", getHospitalBloodRequests);
router.patch("/blood-requests/:id/approve", approveBloodRequest);
router.patch("/blood-requests/:id/reject", rejectBloodRequest);
router.patch("/blood-requests/:id/fulfill", fulfillBloodRequest);

export default router;
