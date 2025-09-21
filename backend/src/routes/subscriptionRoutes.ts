import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    // Forward the request body directly to the MSpace SMS API
    const response = await axios.post(
      "https://api.mspace.lk/subscription/send",
      req.body,
      {
        headers: { "Content-Type": "application/json;charset=utf-8" },
      }
    );

    console.log("✅ SMS Sent Successfully:", response.data);

    // Send back the response to your client
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(
      "❌ Error sending SMS:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to send SMS notification",
      error: error.response?.data || error.message,
    });
  }
});

export default router;
