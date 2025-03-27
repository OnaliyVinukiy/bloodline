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
} from "../controllers/campController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

//Route to save camp data
router.post("/register", saveCamp);

//Route to fetch camp data
router.get("/fetch-camps", getCamps);

//Route to fetch camp data by city
router.get("/city/:city", getCampsByCity);

//Route to fetch camp data by ID
router.get("/fetch-camp/:id", authenticateUser, getCampById);

// Route to approve camp
router.put("/approve-camp/:id", authenticateUser, approveCamp);

// Route to reject camp
router.put("/reject-camp/:id", authenticateUser, rejectCamp);

// Route to allocate a team
router.put("/allocate-team", authenticateUser, allocateTeam);

//Route to check team availability
router.get("/availability", checkTeamAvailability);

//Route to fetch camp count
router.get("/count", getCampsCount);

//Route to fetch monthly camps
router.get("/monthly", getCampsByMonth);

export default router;
