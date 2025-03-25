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
  getOrganizationsCount,
} from "../controllers/organizationController";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Router to fetch organization by email
router.get("/organization/:email", getOrganizationByEmail);

//Router to fetch all organizations
router.get("/all-organizations", getAllOrganizations);

//Router to update organization data
router.post("/update-organization", upsertOrganization);

//Router to upload organization logo
router.post("/upload-logo", upload.single("file"), uploadLogo);

//Router to search organizations
router.get("/search", searchOrganizations);

//Router to fetch organization count
router.get("/count", getOrganizationsCount);

export default router;
