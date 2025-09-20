import express from "express";
import axios from "axios";
import { MongoClient } from "mongodb";
import { DATABASE_ID, DONOR_COLLECTION_ID } from "../config/azureConfig";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;
if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("Missing environment variable: COSMOS_DB_CONNECTION_STRING");
}

// Type definitions for OTP and subscription stores
interface OtpData {
  phone: string;
  referenceNo: string;
  subscriptionId: string;
  status: "pending" | "verified" | "subscribed" | "failed";
  createdAt: number;
}

interface SubscriptionData {
  phone: string;
  status: "pending" | "verifying" | "subscribed" | "failed";
  referenceNo: string;
  subscriptionId: string;
  createdAt: string;
  verifiedAt?: string;
  attempts: number;
}

// In-memory storage with proper typing
const otpStore: Record<string, OtpData> = {};
const subscriptionStore: Record<string, SubscriptionData> = {};

router.post("/notify", async (req, res) => {
  console.log(
    "📩 Subscription notification received:",
    JSON.stringify(req.body, null, 2)
  );

  const maskedNumber = req.body.subscriberId;
  if (maskedNumber) {
    console.log("Masked number from MSpace:", maskedNumber);

    // Extract the phone number from the subscriberId (format: tel:94712345678)
    const phoneMatch = maskedNumber.match(/tel:(\d+)/);
    if (phoneMatch) {
      const phoneFromMSpace = phoneMatch[1];
      console.log("Extracted phone number:", phoneFromMSpace);

      try {
        // Find the donor with this phone number and update their subscription status
        const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
        await client.connect();
        const database = client.db(DATABASE_ID);
        const collection = database.collection(DONOR_COLLECTION_ID);

        // Debug: Check what numbers exist in the database
        console.log("Searching for phone number in database:", phoneFromMSpace);

        // Look for the donor by phone number
        const donor = await collection.findOne({
          contactNumber: phoneFromMSpace,
        });

        if (donor) {
          console.log("Found donor:", {
            email: donor.email,
            contactNumber: donor.contactNumber,
            existingMaskedNumber: donor.maskedNumber,
          });

          // Update the donor record
          const updateResult = await collection.updateOne(
            { contactNumber: phoneFromMSpace },
            {
              $set: {
                isSubscribed: true,
                maskedNumber: maskedNumber,
                subscriptionUpdatedAt: new Date().toISOString(),
              },
            }
          );

          console.log("Update result:", {
            matchedCount: updateResult.matchedCount,
            modifiedCount: updateResult.modifiedCount,
          });

          if (updateResult.modifiedCount === 0) {
            console.log(
              "No documents were modified. The values might be the same."
            );
          } else {
            console.log(
              `Successfully updated subscription for phone: ${phoneFromMSpace}`
            );
          }
        } else {
          console.log("No donor found with phone number:", phoneFromMSpace);

          // Debug: Check what phone numbers exist in the database
          const allDonors = await collection
            .find({}, { projection: { contactNumber: 1, email: 1 } })
            .limit(10)
            .toArray();
          console.log(
            "First 10 donors in database:",
            allDonors.map((d) => ({
              email: d.email,
              contactNumber: d.contactNumber,
            }))
          );
        }

        client.close();
      } catch (error) {
        console.error("Error updating donor subscription:", error);
      }
    } else {
      console.log(
        "Could not extract phone number from maskedNumber:",
        maskedNumber
      );
    }
  } else {
    console.log("No maskedNumber found in request body");
  }

  res.status(200).send("Notification received");
});

// Request OTP
router.post("/request-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Clean and validate phone number
    const cleanPhone = phone.replace(/\D/g, "");

    // Check if required environment variables are set
    if (!process.env.MSPACE_API_URL) {
      throw new Error("MSPACE_API_URL environment variable is not set");
    }

    if (!process.env.MSPACE_APPLICATION_ID) {
      throw new Error("MSPACE_APPLICATION_ID environment variable is not set");
    }

    if (!process.env.MSPACE_PASSWORD) {
      throw new Error("MSPACE_PASSWORD environment variable is not set");
    }

    // Construct the full URL and log it (mask password for security)
    const apiUrl = `${process.env.MSPACE_API_URL}/otp/request`;
    console.log("Calling MSpace API:", apiUrl);

    // Request OTP from mSpace
    const otpResponse = await axios.post(
      apiUrl,
      {
        applicationId: process.env.MSPACE_APPLICATION_ID,
        password: process.env.MSPACE_PASSWORD,
        subscriberId: `tel:${cleanPhone}`,
        applicationHash: "abcdefgh",
        applicationMetaData: {
          client: "WEBAPP",
          device: "Web Browser",
          os: "Any",
          appCode: "https://bloodlinesrilanka.com/",
        },
      },
      {
        timeout: 10000, // 10 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (otpResponse.data.statusCode !== "S1000") {
      throw new Error(otpResponse.data.statusDetail || "Failed to send OTP");
    }

    // Create OTP data
    const subscriptionId = uuidv4();
    otpStore[cleanPhone] = {
      phone: cleanPhone,
      referenceNo: otpResponse.data.referenceNo,
      subscriptionId: subscriptionId,
      status: "pending",
      createdAt: Date.now(),
    };

    // Initialize subscription tracking
    subscriptionStore[subscriptionId] = {
      phone: cleanPhone,
      status: "pending",
      referenceNo: otpResponse.data.referenceNo,
      subscriptionId: subscriptionId,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };

    res.json({
      success: true,
      message: "OTP sent successfully",
      referenceNo: otpResponse.data.referenceNo,
      subscriptionId,
    });
  } catch (error: unknown) {
    console.error("Error in OTP request:", error);

    let errorMessage = "Failed to send OTP";
    let errorDetails = "Unknown error";

    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });

      errorDetails = error.response?.data?.statusDetail || error.message;

      // Check if it's a URL issue
      if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
        errorMessage = "Cannot connect to SMS service";
        errorDetails = `Failed to connect to: ${error.config?.url}`;
      } else if (error.message.includes("Invalid URL")) {
        errorMessage = "Invalid SMS service configuration";
        errorDetails = "The SMS service URL is malformed or incorrect";
      }
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: errorDetails,
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, subscriptionId } = req.body;

    if (!phone || !otp || !subscriptionId) {
      return res.status(400).json({
        success: false,
        error: "Phone number, OTP, and subscription ID are required",
      });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const otpData = otpStore[cleanPhone];

    if (!otpData || otpData.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP request",
        code: "INVALID_OTP_REQUEST",
      });
    }

    // Verify OTP with mSpace
    const verifyResponse = await axios.post(
      process.env.MSPACE_API_URL + "/otp/verify",
      {
        applicationId: process.env.MSPACE_APPLICATION_ID,
        password: process.env.MSPACE_PASSWORD,
        referenceNo: otpData.referenceNo,
        otp: otp.toString(),
      }
    );

    if (verifyResponse.data.statusCode !== "S1000") {
      throw new Error(
        verifyResponse.data.statusDetail || "OTP verification failed"
      );
    }

    // Mark OTP as verified
    otpData.status = "verified";

    // Update subscription status
    const subscription = subscriptionStore[subscriptionId];
    if (subscription) {
      subscription.status = "verifying";
      subscription.verifiedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      message: "OTP verified. Processing subscription...",
      subscriptionId,
    });
  } catch (error: unknown) {
    console.error("Error in OTP verification:", error);

    let errorMessage = "Failed to verify OTP";
    let errorDetails = "Unknown error";

    if (axios.isAxiosError(error)) {
      errorDetails = error.response?.data?.statusDetail || error.message;
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: errorDetails,
    });
  }
});

export default router;
