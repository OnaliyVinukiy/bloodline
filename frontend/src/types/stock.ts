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
}

export interface StockAddedHistory {
  _id: string;
  bloodType: string;
  quantityAdded: number;
  updatedBy: string;
  updatedAt: string;
}

export interface StockIssuedHistory {
  _id: string;
  bloodType: string;
  quantityIssued: number;
  issuedTo: string;
  updatedBy: string;
  updatedAt: string;
}
