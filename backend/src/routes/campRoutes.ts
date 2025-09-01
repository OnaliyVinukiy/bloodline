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
  getCampById,
  approveCamp,
  rejectCamp,
  allocateTeam,
  checkTeamAvailability,
  getCampsCount,
  getCampsByMonth,
  getCampByEmail,
} from "../controllers/campController";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

//Route to save camp data
router.post("/register", saveCamp);

//Route to fetch camp data
router.get("/fetch-camps", getCamps);

//Route to fetch camp data by city
router.get("/city/:city", getCampsByCity);

//Route to fetch camp data by ID
router.get("/fetch-camp/:id", authenticateUser, getCampById);

//Route to fetch camp data by email
router.get("/fetch-camp-email/:repEmail", authenticateUser, getCampByEmail);

// Route to approve camp
router.put("/approve-camp/:id", authenticateUser, authorizeAdmin, approveCamp);

// Route to reject camp
router.put("/reject-camp/:id", authenticateUser, authorizeAdmin, rejectCamp);

// Route to allocate a team
router.put("/allocate-team", authenticateUser, authorizeAdmin, allocateTeam);

//Route to check team availability
router.get("/availability", checkTeamAvailability);

//Route to fetch camp count
router.get("/count", getCampsCount);

//Route to fetch monthly camps
router.get("/monthly", getCampsByMonth);

export default router;
