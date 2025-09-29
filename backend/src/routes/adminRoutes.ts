/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import { getAllAdminUsers, addAdminUser } from "../controllers/adminController";

const router = express.Router();

//Route to fetch camp data
router.get("/users", getAllAdminUsers);

router.post("/add-admin", addAdminUser);

export default router;
