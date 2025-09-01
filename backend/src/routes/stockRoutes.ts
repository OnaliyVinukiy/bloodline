/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import {
  fetchStocks,
  issueBloodStock,
  updateStock,
  getStockAdditionHistory,
  getStockIssuanceHistory,
  getAvailableStockEntries,
} from "../controllers/stockController";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

//Fetch all blood stocks
router.get("/fetch-stocks", authenticateUser, authorizeAdmin, fetchStocks);

//Update blood stock
router.post("/update-stock", authenticateUser, authorizeAdmin, updateStock);

//Issue blood stock
router.post("/issue-stock", authenticateUser, authorizeAdmin, issueBloodStock);

//Fetch blood stock addition history
router.get(
  "/addition-history",
  authenticateUser,
  authorizeAdmin,
  getStockAdditionHistory
);

//Fetch blood stock issuance history
router.get(
  "/issuance-history",
  authenticateUser,
  authorizeAdmin,
  getStockIssuanceHistory
);

//Fetch blood stock history
router.get(
  "/history",
  authenticateUser,
  authorizeAdmin,
  getAvailableStockEntries
);

export default router;
