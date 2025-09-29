/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { ObjectId } from "mongodb";

export interface User {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date | null;
  avatar: string | null;
  role: string;
}

export interface Donor {
  _id?: ObjectId;
  nic: string;
  fullName: string;
  email: string;
  contactNumber: string;
  province: string;
  district: string;
  city: string;
  address: string;
  birthdate: string;
  age: number;
  bloodGroup: string;
  avatar: string | null;
  gender: string;
  status: string;
  isSubscribed?: boolean;
  maskedNumber?: string;
}

export interface BloodDonor {
  _id?: ObjectId;
  nic: string;
  fullName: string;
  email: string;
  contactNumber: string;
  province: string;
  district: string;
  city: string;
  address: string;
  birthdate: string;
  age: number;
  bloodGroup: string;
  avatar: string | null;
  gender: string;
  status: string;
}

export interface Organization {
  _id?: ObjectId;
  organizationName: string;
  organizationEmail: string;
  repFullName: string;
  repEmail: string;
  repNIC: string;
  repGender: string;
  orgContactNumber: string;
  repContactNumber: string;
  avatar: string;
  isSubscribed?: boolean;
  maskedNumber?: string;
}

export interface Hospital {
  _id: string;
  hospitalName: string;
  hospitalEmail: string;
  repFullName: string;
  repEmail: string;
  repNIC: string;
  repGender: string;
  hosContactNumber: string;
  repContactNumber: string;
  avatar: string;
  status?: string;
  rejectionReason?: string;
  isSubscribed?: boolean;
  maskedNumber?: string;
}
