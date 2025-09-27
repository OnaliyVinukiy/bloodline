/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^0\d{9}$/;
  return phoneRegex.test(phone);
};

const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Validates a Sri Lankan NIC number (Old 10-char or New 12-digit format).
 * The function also cross-validates the birth date encoded in the NIC against the provided birthdate and gender.
 * @param nic The NIC string to validate.
 * @param birthdate The donor's birthdate string (YYYY-MM-DD format).
 * @param gender The donor's selected gender string ('Male' or 'Female').
 * @returns true if valid, or a string key for a translation if invalid.
 */
export const validateNIC = (nic: string, birthdate: string, gender: string): true | string => {
  if (!nic || !birthdate || !gender) return "error_nic_required"; // Added gender check

  const cleanedNic = nic.trim().toUpperCase();
  const dob = new Date(birthdate);
  const dobYear = dob.getFullYear();

  const isOldNic = /^\d{9}[VX]$/.test(cleanedNic);
  const isNewNic = /^\d{12}$/.test(cleanedNic);

  if (!isOldNic && !isNewNic) {
    return "error_nic_format";
  }

  // --- Date of Year (DOY) Calculation from NIC ---
  let nicYear: number;
  let nicDayCount: number;

  if (isOldNic) {
    // Old NIC: YYDDD...V/X (10 characters)
    const yearDigits = cleanedNic.substring(0, 2);
    // This calculation handles the 19xx vs 20xx ambiguity in old NICs
    // by comparing the 2-digit year to the actual birth year's last two digits.
    const nicFullYear = (yearDigits.startsWith('0') || parseInt(yearDigits, 10) > (dobYear % 100))
        ? 1900 + parseInt(yearDigits, 10) 
        : 2000 + parseInt(yearDigits, 10); 

    nicYear = nicFullYear;
    nicDayCount = parseInt(cleanedNic.substring(2, 5), 10);
  } else {
    // New NIC: YYYYDDD... (12 digits)
    const yearDigits = cleanedNic.substring(0, 4);
    nicYear = parseInt(yearDigits, 10);
    nicDayCount = parseInt(cleanedNic.substring(4, 7), 10);
  }

  // --- 1. Year of Birth Cross-Validation ---
  if (nicYear !== dobYear) {
    return "error_nic_year_mismatch";
  }

  // --- 2. Day Count Cross-Validation ---
  let isFemaleEncoded = false; // Renamed to avoid confusion with parameter 'gender'
  let actualDayCount: number;

  if (nicDayCount > 500) {
    isFemaleEncoded = true;
    actualDayCount = nicDayCount - 500;
  } else {
    isFemaleEncoded = false;
    actualDayCount = nicDayCount;
  }

  // Determine the expected day count from the provided birthdate
  // Converts DOB to a Day of Year (1 to 365/366)
  const startOfYear = new Date(dobYear, 0, 1);
  const timeDifference = dob.getTime() - startOfYear.getTime();
  // +1 added because the NIC day count is 1-based (Jan 1st is day 1)
  const expectedDayCount = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1; 

  // Validate Day Count range
  const maxDays = isLeapYear(nicYear) ? 366 : 365;
  if (actualDayCount < 1 || actualDayCount > maxDays) {
    return "error_nic_invalid_day_count";
  }
  
  // Validate NIC's encoded day count against the actual birthdate's day count
  if (actualDayCount !== expectedDayCount) {
    return "error_nic_dob_mismatch";
  }

  // --- 3. Gender Cross-Validation ---
  // The NIC is valid if the encoded gender matches the selected gender.
  const genderMatches = (isFemaleEncoded && gender === "Female") || 
                        (!isFemaleEncoded && gender === "Male");

  if (!genderMatches) {
    return "error_nic_gender_mismatch";
  }
  
  // All checks passed
  return true;
};

