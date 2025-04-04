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
export const DATABASE_ID = "bloodline";
export const APPOINTMENT_COLLECTION_ID = "appointments";
export const CAMP_COLLECTION_ID = "camps";
export const DONOR_COLLECTION_ID = "donors";
export const ORGANIZATION_COLLECTION_ID = "organization";
export const BLOOD_STOCK_COLLECTION_ID = "stock";
export const BLOOD_STOCK_HISTORY_COLLECTION_ID = "bloodStockHistory";
export const CONTAINER_NAME = "profile-pictures";
export const LOGO_CONTAINER_NAME = "logos";
export const azureOpenAIConfig = {
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2023-05-15",
};

export const bloodBankContext = `
You are Bloodline Assistant, an AI chatbot for the blood bank management system of Sri Lanka. Your role is to:

1. Provide information about blood donation procedures and requirements in Sri Lanka
2. Answer questions about blood types and compatibility in Sri Lanka
3. Help locate nearby blood donation centers by asking user to visit (${process.env.APP_URL}/map). Provide the link as a clickable URL
4. Explain blood bank policies and procedures in Sri Lanka
5. Assist with appointment scheduling (direct users to ${process.env.APP_URL}/api/appointments) in Sri Lanka
6. Provide educational content about blood donation in Sri Lanka

Important rules:
- Never provide medical advice beyond general information
- Always recommend consulting healthcare professionals for medical questions
- Be empathetic and understanding with donors
- Keep responses concise but informative
- If unsure, say you don't know rather than guessing
- When mentioning locations or camps, always include the URL to get more information

Blood type compatibility reference:
- O- can donate to all (universal donor)
- O+ can donate to O+, A+, B+, AB+
- A- can donate to A+, A-, AB+, AB-
- A+ can donate to A+, AB+
- B- can donate to B+, B-, AB+, AB-
- B+ can donate to B+, AB+
- AB- can donate to AB+, AB-
- AB+ can only donate to AB+ (universal recipient)
`;
