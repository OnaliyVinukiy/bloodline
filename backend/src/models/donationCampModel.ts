/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import mongoose from "mongoose";

const CampSchema = new mongoose.Schema({
  organizerName: { type: String },
  nic: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  organization: { type: String },
  status: { type: String, default: "Pending" },
});

const Camp = mongoose.model("Camp", CampSchema);

export default Camp;
