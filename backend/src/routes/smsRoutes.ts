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

// Type definitions
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

// In-memory stores
const otpStore: Record<string, OtpData> = {};
const subscriptionStore: Record<string, SubscriptionData> = {};

// ✅ Notification endpoint
router.post("/notify", async (req, res) => {
  console.log("📩 Subscription notification received:", JSON.stringify(req.body, null, 2));

  const subscriberId = req.body.subscriberId;
  const status = req.body.status;

  if (!subscriberId) {
    console.log("❌ No subscriberId in request body");
    return res.status(400).send("Missing subscriberId");
  }

  console.log("🔑 Raw subscriberId from MSpace:", subscriberId);

  // Try to extract phone if it's plain tel: format
  let phoneFromMSpace: string | null = null;
  const phoneMatch = subscriberId.match(/tel:(\d+)/);
  if (phoneMatch) {
    phoneFromMSpace = phoneMatch[1];
    console.log("📱 Extracted phone number:", phoneFromMSpace);
  }

  try {
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(DONOR_COLLECTION_ID);

    let query: any = {};

    if (phoneFromMSpace) {
      query = { contactNumber: phoneFromMSpace };
    } else {
      // fallback if only masked ID is available
      query = { maskedNumber: subscriberId };
    }

    const updateResult = await collection.updateOne(
      query,
      {
        $set: {
          isSubscribed: status === "REGISTERED",
          maskedNumber: subscriberId,
          subscriptionUpdatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
          contactNumber: phoneFromMSpace || null,
        },
      },
      { upsert: true }
    );

    console.log("✅ Donor subscription updated:", {
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount,
      upsertedId: updateResult.upsertedId,
    });

    await client.close();
  } catch (error) {
    console.error("❌ Error updating donor subscription:", error);
  }

  res.status(200).send("Notification received");
});

// ✅ Request OTP
router.post("/request-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number is required" });

    const cleanPhone = phone.replace(/\D/g, "");
    const apiUrl = `${process.env.MSPACE_API_URL}/otp/request`;
    console.log("📡 Calling MSpace API:", apiUrl);

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
      { timeout: 10000, headers: { "Content-Type": "application/json" } }
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
    res.json({ success: true, message: "OTP sent successfully", referenceNo: otpResponse.data.referenceNo, subscriptionId });
  } catch (error: any) {
    console.error("❌ Error in OTP request:", error);
    res.status(500).json({ success: false, error: "Failed to send OTP", details: error.message });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, subscriptionId } = req.body;
    if (!phone || !otp || !subscriptionId) {
      return res.status(400).json({ success: false, error: "Phone, OTP, and subscription ID are required" });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const otpData = otpStore[cleanPhone];
    if (!otpData || otpData.status !== "pending") {
      return res.status(400).json({ success: false, error: "Invalid or expired OTP request" });
    }

    const verifyResponse = await axios.post(`${process.env.MSPACE_API_URL}/otp/verify`, {
      applicationId: process.env.MSPACE_APPLICATION_ID,
      password: process.env.MSPACE_PASSWORD,
      referenceNo: otpData.referenceNo,
      otp: otp.toString(),
    });

    if (verifyResponse.data.statusCode !== "S1000") {
      throw new Error(verifyResponse.data.statusDetail || "OTP verification failed");
    }

    otpData.status = "verified";
    const subscription = subscriptionStore[subscriptionId];
    if (subscription) {
      subscription.status = "verifying";
      subscription.verifiedAt = new Date().toISOString();
    }

    // ✅ Update donor in DB safely
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(DONOR_COLLECTION_ID);

    await collection.updateOne(
      { contactNumber: cleanPhone },
      {
        $set: {
          contactNumber: cleanPhone,
          isSubscribed: false,
          subscriptionId,
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    await client.close();

    console.log("OTP verified successfully for:", cleanPhone);
    res.json({ success: true, message: "OTP verified. Processing subscription...", subscriptionId });
  } catch (error: any) {
    console.error("Error in OTP verification:", error);
    res.status(500).json({ success: false, error: "Failed to verify OTP", details: error.message });
  }
});

export default router;
