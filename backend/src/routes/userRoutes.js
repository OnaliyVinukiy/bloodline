const express = require("express");
const { getUserInfo } = require("../controllers/userController");

const router = express.Router();

// Route to fetch user info
router.post("/user-info", getUserInfo);

module.exports = router;
