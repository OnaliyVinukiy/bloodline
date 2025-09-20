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

// In-memory storage with proper typing
interface OtpData {
  phone: string;
  referenceNo: string;
  subscriptionId: string;
  status: "pending" | "verified" | "subscribed" | "failed";
  createdAt: number;
}

const otpStore: Record<string, OtpData> = {};

// MSpace API configuration
const MSPACE_API_URL = process.env.MSPACE_API_URL;
const MSPACE_APPLICATION_ID = process.env.MSPACE_APPLICATION_ID;
const MSPACE_PASSWORD = process.env.MSPACE_PASSWORD;

if (!MSPACE_API_URL || !MSPACE_APPLICATION_ID || !MSPACE_PASSWORD) {
  throw new Error("Missing one or more MSpace environment variables");
}

router.post("/notify", async (req, res) => {
  console.log(
    "📩 Subscription notification received:",
    JSON.stringify(req.body, null, 2)
  );

  const maskedNumber = req.body.subscriberId;
  const status = req.body.status;

  if (maskedNumber) {
    console.log("Masked number from MSpace:", maskedNumber);

    // Extract the phone number from the subscriberId (format: tel:94712345678)
    const phoneMatch = maskedNumber.match(/tel:(\d+)/);
    if (phoneMatch) {
      const phoneFromMSpace = phoneMatch[1];
      console.log("Extracted phone number:", phoneFromMSpace);

      try {
        const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
        await client.connect();
        const database = client.db(DATABASE_ID);
        const collection = database.collection(DONOR_COLLECTION_ID);

        // Update the donor record based on the status from MSpace
        const isSubscribed = status === "REGISTERED";
        console.log(`Setting subscription status to ${isSubscribed} for phone: ${phoneFromMSpace}`);

        const updateResult = await collection.updateOne(
          { contactNumber: phoneFromMSpace },
          {
            $set: {
              isSubscribed: isSubscribed,
              maskedNumber: isSubscribed ? maskedNumber : "",
              subscriptionUpdatedAt: new Date().toISOString(),
            },
          }
        );

        console.log("Database update result:", {
          matchedCount: updateResult.matchedCount,
          modifiedCount: updateResult.modifiedCount,
        });

        if (updateResult.modifiedCount > 0) {
          console.log(`Successfully updated subscription for phone: ${phoneFromMSpace}`);
        } else {
          console.log("No documents were modified. Donor may not exist or status is unchanged.");
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
    console.log("No subscriberId found in request body");
  }

  // Acknowledge the notification to MSpace
  res.status(200).send("Notification received");
});

// Request OTP
router.post("/request-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // Check if phone number is already subscribed in the database
    const client = new MongoClient(COSMOS_DB_CONNECTION_STRING);
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(DONOR_COLLECTION_ID);
    const donor = await collection.findOne({ contactNumber: cleanPhone });
    client.close();

    if (donor?.isSubscribed) {
      return res.status(400).json({
        success: false,
        error: "This number is already subscribed.",
        code: "ALREADY_SUBSCRIBED"
      });
    }

    const apiUrl = `${MSPACE_API_URL}/otp/request`;
    const subscriberId = `tel:${cleanPhone}`;

    const otpResponse = await axios.post(
      apiUrl,
      {
        applicationId: MSPACE_APPLICATION_ID,
        password: MSPACE_PASSWORD,
        subscriberId: subscriberId,
        applicationHash: "abcdefgh",
        applicationMetaData: {
          client: "WEBAPP",
          device: "Web Browser",
          os: "Any",
          appCode: "https://bloodlinesrilanka.com/",
        },
      },
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      }
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

    res.json({
      success: true,
      message: "OTP sent successfully",
      referenceNo: otpResponse.data.referenceNo,
      subscriptionId,
    });
  } catch (error) {
    console.error("Error in OTP request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send OTP",
      details: axios.isAxiosError(error) ? error.response?.data?.statusDetail || error.message : "An unexpected error occurred.",
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const storedData = otpStore[cleanPhone];
    if (!storedData || storedData.status !== "pending") {
      return res.status(400).json({ error: "Invalid or expired OTP request" });
    }

    const verifyResponse = await axios.post(
      `${MSPACE_API_URL}/otp/verify`,
      {
        applicationId: MSPACE_APPLICATION_ID,
        password: MSPACE_PASSWORD,
        referenceNo: storedData.referenceNo,
        otp: otp.toString(),
      }
    );

    if (verifyResponse.data.statusCode !== "S1000") {
      throw new Error(verifyResponse.data.statusDetail || "OTP verification failed");
    }

    // Mark OTP as verified locally
    storedData.status = "verified";

    // Clean up temporary OTP data to prevent re-use
    delete otpStore[cleanPhone];

    res.json({
      success: true,
      message: "OTP verified successfully. Waiting for MSpace notification...",
      data: verifyResponse.data,
    });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    res.status(500).json({
      success: false,
      error: "Failed to verify OTP",
      details: axios.isAxiosError(error) ? error.response?.data?.statusDetail || error.message : "An unexpected error occurred.",
    });
  }
});

export default router;
