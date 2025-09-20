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

// ===== Type Definitions =====
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

// ===== In-Memory Stores =====
const otpStore: Record<string, OtpData> = {};
const subscriptionStore: Record<string, SubscriptionData> = {};

// ===== Notification Endpoint =====
router.post("/notify", async (req, res) => {
  console.log("📩 Subscription notification received:", req.body);

  const maskedNumber: string | undefined = req.body.subscriberId;
  if (!maskedNumber) {
    console.log("❌ No maskedNumber found in request body");
    return res.status(400).send("Missing subscriberId");
  }

  const phoneMatch = maskedNumber.match(/tel:(\d+)/);
  if (!phoneMatch) {
    console.log("❌ Could not extract phone number from:", maskedNumber);
    return res.status(400).send("Invalid subscriberId format");
  }

  const phoneFromMSpace = phoneMatch[1];
  console.log("📞 Extracted phone number:", phoneFromMSpace);

  const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);

  try {
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(DONOR_COLLECTION_ID);

    console.log("🔍 Searching donor by phone:", phoneFromMSpace);

    const donor = await collection.findOne({ contactNumber: phoneFromMSpace });

    if (donor) {
      console.log("✅ Donor found:", {
        email: donor.email,
        contactNumber: donor.contactNumber,
        existingMaskedNumber: donor.maskedNumber,
      });

      const updateResult = await collection.updateOne(
        { contactNumber: phoneFromMSpace },
        {
          $set: {
            isSubscribed: true,
            maskedNumber,
            subscriptionUpdatedAt: new Date().toISOString(),
          },
        }
      );

      console.log("📝 Update result:", updateResult);

      if (updateResult.modifiedCount > 0) {
        console.log(`🎉 Subscription updated for phone: ${phoneFromMSpace}`);
      } else {
        console.log("⚠️ No changes made (values may already be up to date).");
      }
    } else {
      console.log("⚠️ No donor found with phone:", phoneFromMSpace);

      const sampleDonors = await collection
        .find({}, { projection: { contactNumber: 1, email: 1 } })
        .limit(5)
        .toArray();
      console.log("ℹ️ First 5 donors in DB:", sampleDonors);
    }
  } catch (err) {
    console.error("💥 Error updating donor subscription:", err);
    return res.status(500).send("Internal server error");
  } finally {
    await client.close();
  }

  res.status(200).send("Notification received");
});

// ===== Request OTP =====
router.post("/request-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const cleanPhone = phone.replace(/\D/g, "");

    const { MSPACE_API_URL, MSPACE_APPLICATION_ID, MSPACE_PASSWORD } =
      process.env;
    if (!MSPACE_API_URL || !MSPACE_APPLICATION_ID || !MSPACE_PASSWORD) {
      throw new Error("MSpace configuration missing in env variables");
    }

    const apiUrl = `${MSPACE_API_URL}/otp/request`;
    console.log("📡 Calling MSpace API:", apiUrl);

    const otpResponse = await axios.post(
      apiUrl,
      {
        applicationId: MSPACE_APPLICATION_ID,
        password: MSPACE_PASSWORD,
        subscriberId: `tel:${cleanPhone}`,
        applicationHash: "abcdefgh",
        applicationMetaData: {
          client: "WEBAPP",
          device: "Web Browser",
          os: "Any",
          appCode: "https://bloodlinesrilanka.com/",
        },
      },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 }
    );

    if (otpResponse.data.statusCode !== "S1000") {
      throw new Error(otpResponse.data.statusDetail || "Failed to send OTP");
    }

    const subscriptionId = uuidv4();
    otpStore[cleanPhone] = {
      phone: cleanPhone,
      referenceNo: otpResponse.data.referenceNo,
      subscriptionId,
      status: "pending",
      createdAt: Date.now(),
    };

    subscriptionStore[subscriptionId] = {
      phone: cleanPhone,
      status: "pending",
      referenceNo: otpResponse.data.referenceNo,
      subscriptionId,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };

    console.log("✅ OTP requested successfully for:", cleanPhone);

    res.json({
      success: true,
      message: "OTP sent successfully",
      referenceNo: otpResponse.data.referenceNo,
      subscriptionId,
    });
  } catch (error: any) {
    console.error("💥 Error in OTP request:", error);

    let errorMessage = "Failed to send OTP";
    let errorDetails = error.message || "Unknown error";

    if (axios.isAxiosError(error)) {
      errorDetails =
        error.response?.data?.statusDetail ||
        error.message ||
        "Axios request error";
      if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
        errorMessage = "Cannot connect to SMS service";
      }
    }

    res.status(500).json({ success: false, error: errorMessage, details: errorDetails });
  }
});

// ===== Verify OTP =====
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

    const verifyResponse = await axios.post(
      `${process.env.MSPACE_API_URL}/otp/verify`,
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

    otpData.status = "verified";
    if (subscriptionStore[subscriptionId]) {
      subscriptionStore[subscriptionId].status = "verifying";
      subscriptionStore[subscriptionId].verifiedAt = new Date().toISOString();
    }

    console.log("✅ OTP verified successfully for:", cleanPhone);

    res.json({
      success: true,
      message: "OTP verified. Processing subscription...",
      subscriptionId,
    });
  } catch (error: any) {
    console.error("💥 Error in OTP verification:", error);

    let errorMessage = "Failed to verify OTP";
    let errorDetails = error.message || "Unknown error";

    if (axios.isAxiosError(error)) {
      errorDetails =
        error.response?.data?.statusDetail ||
        error.message ||
        "Axios request error";
    }

    res.status(500).json({ success: false, error: errorMessage, details: errorDetails });
  }
});

export default router;
