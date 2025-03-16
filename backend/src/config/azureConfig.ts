/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import dotenv from "dotenv";

dotenv.config();

export const COSMOS_DB_CONNECTION_STRING =
  process.env.COSMOS_DB_CONNECTION_STRING;
export const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
export const DATABASE_ID = "donorDB";
export const APPOINTMENT_COLLECTION_ID = "appointments";
export const CAMP_COLLECTION_ID = "camps";
export const DONOR_COLLECTION_ID = "donors";
export const CONTAINER_NAME = "profile-pictures";
