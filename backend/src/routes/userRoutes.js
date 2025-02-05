/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
const express = require("express");
const { getUserInfo } = require("../controllers/userController");

const router = express.Router();

// Route to fetch user info
router.post("/user-info", getUserInfo);

module.exports = router;
