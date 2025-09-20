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
  console.log("📩 Subscription notification received:", req.body);

  const maskedNumber = req.body.subscriberId;
  if (maskedNumber) {
    console.log("Masked number:", maskedNumber);

    // Extract the phone number from the subscriberId (format: tel:94712345678)
    const phoneMatch = maskedNumber.match(/tel:(\d+)/);
    if (phoneMatch) {
      const phone = phoneMatch[1];

      try {
        // Find the donor with this phone number and update their subscription status
        const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

        await client.connect();
        const database = client.db(DATABASE_ID);
        const collection = database.collection(DONOR_COLLECTION_ID);

        await collection.updateOne(
          { contactNumber: phone },
          {
            $set: {
              isSubscribed: true,
              maskedNumber: maskedNumber,
            },
          }
        );

        client.close();
        console.log(`Updated subscription for phone: ${phone}`);
      } catch (error) {
        console.error("Error updating donor subscription:", error);
      }
    }
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

    // Request OTP from mSpace
    const otpResponse = await axios.post(
      process.env.MSPACE_API_URL + "/otp/request",
      {
        applicationId: process.env.MSPACE_APPLICATION_ID,
        password: process.env.MSPACE_PASSWORD,
        subscriberId: `tel:${cleanPhone}`,
        applicationHash: "abcdefgh",
        applicationMetaData: {
          client: "BLOODLINE_APP",
          device: "Web Browser",
          os: "Any",
          appCode: "bloodline-app",
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
