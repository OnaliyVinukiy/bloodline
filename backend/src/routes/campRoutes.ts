/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import {
  getCamps,
  getCampsByCity,
  saveCamp,
} from "../controllers/campController";

const router = express.Router();

router.post("/register", saveCamp);
router.get("/fetch-camps", getCamps);
router.get("/city/:city", getCampsByCity);

export default router;
