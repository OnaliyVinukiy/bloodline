/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

export interface Appointment {
  _id: string;
  selectedDate: string;
  selectedSlot: string;
  status: string;
  donorInfo: {
    nic: string;
    fullName: string;
    email: string;
    contactNumber: string;
    address: string;
    birthdate: string;
    age: string;
    bloodGroup: string;
    avatar: string;
    gender: string;
    city: string;
  };
  firstForm: {};
  secondForm: {
    isPregnant: string;
    isTakingTreatment?: string;
    isSurgeryDone?: string;
    isEngageHeavyWork?: string;
  };
  thirdForm: { hadHepatitis?: string; hadTyphoid?: string };
  fourthForm: {
    isMedicallyAdvised: string;
    hadVaccination?: string;
  };
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
  bagIssue: {
    hbLevel: string;
    bloodBagType: string;
    officerSignature: string;
    issuedAt: string;
  };
  bloodCollection: {
    startTime: string;
    endTime: string;
    phlebotomistSignature: string;
    volume: string;
    collectedAt: string;
  };
}

export interface Appointments {
  _id: string;
  donorInfo: {
    fullName: string;
    nic: string;
    contactNumber: string;
    avatar: string;
    city: string;
  };
  selectedDate: string;
  selectedSlot: string;
  status: string;
  fourthform?: { isMedicallyAdvised: string };
  secondForm?: { isPregnant: string };
}
