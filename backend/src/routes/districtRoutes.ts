/*!
 * This code includes work from Sri-Lanka-Location-Details by Dineth Siriwardana,
 * licensed under the MIT License.
 *
 * Original Copyright (c) 2025 Dineth Siriwardana
 *
 * ----
 *
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana. All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this software,
 * in whole or in part, is strictly prohibited.
 */
import express from "express";
import {
  getDistricts,
  getDistrictsByProvinceName,
} from "../controllers/districtController";

const router = express.Router();

router.get("/districts-list", getDistricts);
router.get("/province-name/:provinceName", getDistrictsByProvinceName);

export default router;
