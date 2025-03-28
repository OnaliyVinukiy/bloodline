/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { ObjectId } from "mongodb";

export interface Appointment {
  _id?: ObjectId;
  selectedDate: string;
  selectedSlot: string;
  status: string;
  donorInfo: {};
  firstForm: {};
  secondForm: {};
  thirdForm: {};
  fourthForm: {};
  fifthForm: {};
  sixthForm: {};
  seventhForm: {};
  reason: string;
  verification: {};
  assessment: {
    history: {};
    examination: {};
    councelling: {};
    outcome: string;
    remarks: string;
    medicalOfficerSignature: string;
    assessedAt: string;
  };
}
