/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema({
  nic: String,
  fullName: String,
  email: { type: String, required: true, unique: true },
  contactNumber: String,
  address: String,
  birthdate: String,
  age: Number,
  bloodGroup: String,
  avatar: String,
});

module.exports = mongoose.model("Donor", DonorSchema);
