/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import {
  getUserInfo,
  upsertDonor,
  uploadAvatar,
  getDonorByEmail,
} from "../controllers/userController.js";

const router = express.Router();
router.post("/user-info", getUserInfo);
router.post("/upload-avatar", uploadAvatar);
router.post("/update-donor", upsertDonor);
router.get("/donor/:email", getDonorByEmail);

export default router;
