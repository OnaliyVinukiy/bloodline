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
    console.log(
      "📩 Subscription notification received:",
      JSON.stringify(req.body, null, 2)
    );

    const subscriberId = req.body.subscriberId;
    const status = req.body.status;
    const referenceNo = req.body.referenceNo; // This is a crucial field from MSpace

    if (!subscriberId) {
      console.log("❌ No subscriberId in request body");
      return res.status(400).send("Missing subscriberId");
    }

    console.log("🔑 Raw subscriberId from MSpace:", subscriberId);

    // Step 1: Find the phone number from the in-memory store using the reference number.
    // Assuming the MSpace webhook sends back the 'referenceNo' from the initial request.
    const subscription = Object.values(subscriptionStore).find(sub => sub.referenceNo === referenceNo);
    let contactNumberFromStore = null;
    if (subscription) {
        contactNumberFromStore = subscription.phone;
        console.log("📱 Found contact number from in-memory store:", contactNumberFromStore);
    } else {
        console.log("⚠️ Could not find contact number from in-memory store for referenceNo:", referenceNo);
    }
    
    try {
        const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
        await client.connect();
        const database = client.db(DATABASE_ID);
        const collection = database.collection(DONOR_COLLECTION_ID);
        
        // Step 2: Use the phone number (or a fallback) to find the correct donor.
        let query = {};
        if (contactNumberFromStore) {
            query = { contactNumber: contactNumberFromStore };
        } else {
            // Fallback: This is a less reliable path. If you can't find the phone number, 
            // the two-document problem will reoccur.
            query = { isSubscribed: true, maskedNumber: { $exists: false } };
            // This fallback is not great, but better than nothing. It tries to find a user
            // who is subscribed but doesn't have a masked number yet.
        }

        const updateDoc = {
            $set: {
                isSubscribed: status === "REGISTERED",
                maskedNumber: subscriberId, // **Crucial:** Save the masked number here
                subscriptionUpdatedAt: new Date().toISOString(),
            },
        };

        const updateResult = await collection.updateOne(query, updateDoc);

        if (updateResult.matchedCount === 0) {
            console.warn("⚠️ No donor document matched the query. The masked number was not saved.");
        } else {
            console.log("✅ Donor subscription updated:", {
                matched: updateResult.matchedCount,
                modified: updateResult.modifiedCount,
            });
        }

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
    if (!phone)
      return res.status(400).json({ error: "Phone number is required" });

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
    res.json({
      success: true,
      message: "OTP sent successfully",
      referenceNo: otpResponse.data.referenceNo,
      subscriptionId,
    });
  } catch (error: any) {
    console.error("❌ Error in OTP request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send OTP",
      details: error.message,
    });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, subscriptionId } = req.body;
    if (!phone || !otp || !subscriptionId) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Phone, OTP, and subscription ID are required",
        });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const otpData = otpStore[cleanPhone];
    if (!otpData || otpData.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired OTP request" });
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

    // Update in-memory stores
    otpData.status = "verified";
    const subscription = subscriptionStore[subscriptionId];
    if (subscription) {
      subscription.status = "verifying";
      subscription.verifiedAt = new Date().toISOString();
    }

    // **Change:** Update donor in DB. Set isSubscribed to true and save the subscriptionId.
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(DONOR_COLLECTION_ID);

    await collection.updateOne(
      { contactNumber: cleanPhone }, // The query to find the correct document
      {
        $set: {
          isSubscribed: true,
          subscriptionId: subscriptionId, // Save the subscriptionId here for later lookup
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    await client.close();

    console.log("OTP verified and donor profile updated successfully for:", cleanPhone);
    res.json({
      success: true,
      message: "OTP verified. The masked number will be saved shortly.",
      subscriptionId,
    });
  } catch (error: any) {
    console.error("❌ Error in OTP verification:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to verify OTP",
        details: error.message,
      });
  }
});

export default router;
