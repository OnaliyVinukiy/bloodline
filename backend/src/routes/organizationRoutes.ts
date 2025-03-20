/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import {
  searchOrganizations,
  getOrganizationByEmail,
  uploadLogo,
  upsertOrganization,
  getAllOrganizations,
} from "../controllers/organizationController";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/organization/:email", getOrganizationByEmail);
router.get("/all-organizations", getAllOrganizations);
router.post("/update-organization", upsertOrganization);
router.post("/upload-logo", upload.single("file"), uploadLogo);
router.get("/search", searchOrganizations);

export default router;
