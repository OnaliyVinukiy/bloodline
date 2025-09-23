/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { ObjectId } from "mongodb";

export interface BloodTransaction {
  _id?: ObjectId;
  bloodType: string;
  quantity: number;
  transactionType: "ADDITION" | "ISSUANCE";
  issuedTo?: string;
  performedBy: string;
  performedAt: Date;
}

export interface BloodStock {
  _id?: ObjectId;
  bloodType: string;
  quantity: number;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  expiryDate: Date;
  labelId: string;
}

export interface BloodStockEntry {
  labelId: string;
  quantity: number;
  expiryDate: string;
  updatedBy: string;
  updatedAt: Date;
}

export interface BloodStock {
  bloodType: string;
  entries: BloodStockEntry[];
  totalQuantity: number;
  lastUpdated: Date;
  updatedBy: string;
}

// types/stocks.ts
export interface StockAdditionHistory {
  _id?: ObjectId;
  bloodType: string;
  quantityAdded: number;
  remainingQuantity?: number;
  previousQuantity: number;
  newQuantity: number;
  updatedBy: string;
  updatedAt: Date;
  operationType: "addition" | "issuance";
  issuedTo?: string;
  labelId?: string;
  expiryDate?: string;
}

export interface BloodRequest {
  id: string;
  hospitalId: string;
  hospitalName: string;
  hospitalEmail: string;
  contactNumber: string;
  bloodType: string;
  quantity: number;
  urgency: "low" | "medium" | "high" | "critical";
  purpose: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  requestedAt: Date;
  neededBy: Date;
  rejectionReason?: string;
  fulfilledAt?: Date;
}
