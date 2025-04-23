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
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

//Fetch all blood stocks
router.get("/fetch-stocks", authenticateUser, fetchStocks);

//Update blood stock
router.post("/update-stock", authenticateUser, updateStock);

//Issue blood stock
router.post("/issue-stock", authenticateUser, issueBloodStock);

//Fetch blood stock addition history
router.get("/addition-history", getStockAdditionHistory);

//Fetch blood stock issuance history
router.get("/issuance-history", getStockIssuanceHistory);

//Fetch blood stock history
router.get("/history", getAvailableStockEntries);

export default router;
