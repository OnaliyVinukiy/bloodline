/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import multer from "multer";
import {
  getUserInfo,
  upsertDonor,
  uploadAvatar,
  getDonorByEmail,
  getDonors,
  getDonorsCount,
} from "../controllers/userController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Router to fetch user info
router.post("/user-info", getUserInfo);

//Router to upload avatar
router.post("/upload-avatar", upload.single("file"), uploadAvatar);

//Router to update donor data
router.post("/update-donor", upsertDonor);

//Router to fetch donor by email
router.get("/donor/:email", getDonorByEmail);

//Router to fetch all donors
router.get("/donors", getDonors);

//Router to fetch donor count
router.get("/donors/count", getDonorsCount);

export default router;
