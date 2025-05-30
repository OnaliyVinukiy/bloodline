/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import mongoose from "mongoose";

const CampSchema = new mongoose.Schema({
  organizationName: { type: String },
  fullName: { type: String },
  nic: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  venue: { type: String, required: true },
  googleMapLink: { type: String, required: true },
  status: { type: String, default: "Pending" },
  team: { type: String, default: "None" },
});

const Camp = mongoose.model("Camp", CampSchema);

export default Camp;
