// routes/subscriptionRoutes.ts
import express from "express";

const router = express.Router();

router.post("/notify", (req, res) => {
  console.log("📩 Subscription notification received:", req.body);

  const maskedNumber = req.body.subscriberId;
  if (maskedNumber) {
    console.log("Masked number:", maskedNumber);
    // TODO: Save maskedNumber to DB or trigger SMS send later
  }

  res.status(200).send("Notification received");
});

export default router;
