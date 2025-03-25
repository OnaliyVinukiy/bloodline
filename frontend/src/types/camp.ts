/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { ObjectId } from "mongodb";

export interface Camp {
  _id?: ObjectId;
  organizationName: string;
  fullName: string;
  nic: string;
  email: string;
  contactNumber: string;
  province: string;
  district: string;
  city: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  googleMapLink: string;
  venue: string;
  status: string;
  team: string;
}
