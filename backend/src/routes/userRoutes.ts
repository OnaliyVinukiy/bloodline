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
} from "../controllers/userController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//User routes
router.post("/user-info", getUserInfo);
router.post("/upload-avatar", upload.single("file"), uploadAvatar);
router.post("/update-donor", upsertDonor);
router.get("/donor/:email", getDonorByEmail);

export default router;
