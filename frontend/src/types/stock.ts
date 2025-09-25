/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
export interface BloodStock {
  bloodType: string;
  quantity: number;
  lastUpdated: string;
  updatedBy: string;
  expiryDate: string;
  labelId: string;
}

export interface StockAddedHistory {
  _id?: any;
  bloodType: string;
  quantityAdded: number;
  previousQuantity: number;
  remainingQuantity: number;
  newQuantity: number;
  updatedBy: string;
  updatedAt: Date;
  operationType: "addition" | "issuance";
  issuedTo?: string;
  labelId?: string;
  expiryDate?: string;
}

export interface StockIssuedHistory {
  _id: string;
  bloodType: string;
  quantityIssued: number;
  issuedTo: string;
  updatedBy: string;
  updatedAt: string;
}
export interface StockAdditionHistory {
  _id: string;
  bloodType: string;
  quantityAdded: number;
  remainingQuantity: number;
  labelId?: string;
  expiryDate?: string;
  updatedBy: string;
  updatedAt: Date;
  operationType: "addition" | "issuance";
  issuedTo?: string;
  issuedEntries?: string[];
}

export interface BloodRequest {
  _id: string;
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
