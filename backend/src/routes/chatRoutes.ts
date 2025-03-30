/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import chatbotController from "../controllers/chatController";

const router = express.Router();

router.post("/chat", chatbotController.handleChat.bind(chatbotController));

export default router;
