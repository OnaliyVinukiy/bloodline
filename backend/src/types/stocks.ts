/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { ObjectId } from "mongoose";

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
}

export interface StockAdditionHistory {
  _id?: ObjectId;
  bloodType: string;
  quantityAdded: number;
  previousQuantity: number;
  newQuantity: number;
  updatedBy: string;
  updatedAt: Date;
  operationType: "addition" | "issuance";
  issuedTo?: string;
}
