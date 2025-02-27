/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    selectedDate: { type: String, required: true },
    selectedSlot: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },

    donorInfo: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
      nic: { type: String, required: true },
      fullName: { type: String, required: true },
      contactNumber: { type: String, required: true },
      address: { type: String, required: true },
      birthdate: { type: String, required: true },
      age: { type: Number, required: true },
      bloodGroup: { type: String, required: true },
      avatar: { type: String },
      userId: { type: String, required: true },
      gender: { type: String, required: true },
    },

    firstForm: {
      isDonatedBefore: { type: String, required: true },
      timesOfDonation: { type: String },
      lastDonationDate: { type: String },
      isAnyDifficulty: { type: String },
      difficulty: { type: String },
      isMedicallyAdvised: { type: String },
      isLeafletRead: { type: String },
    },

    secondForm: {
      isFeelingWell: { type: String, required: true },
      isTakingTreatment: { type: String, required: true },
      isSurgeryDone: { type: String, required: true },
      isPregnant: { type: String, required: true },
      isEngageHeavyWork: { type: String, required: true },
      diseases: { type: [String] },
    },

    thirdForm: {
      hadHepatitis: { type: String, required: true },
      hadTyphoid: { type: String, required: true },
    },

    fourthForm: {
      hadVaccination: { type: String, required: true },
      hadAcupuncture: { type: String, required: true },
      hadImprisoned: { type: String, required: true },
      hadTravelledAbroad: { type: String, required: true },
      hadReceivedBlood: { type: String, required: true },
      hadMaleria: { type: String, required: true },
    },

    fifthForm: {
      hadDengue: { type: String, required: true },
      hadOtherFever: { type: String, required: true },
      hadDentalExtraction: { type: String, required: true },
      hadAntibiotic: { type: String, required: true },
    },

    sixthForm: {
      isInformed: { type: String, required: true },
      isHarmfulCategory: { type: String, required: true },
      hadPersistentFever: { type: String, required: true },
    },

    seventhForm: {
      donatingMonth: { type: Number, required: true },
      donorName: { type: String, required: true },
      dateSigned: { type: String },
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
