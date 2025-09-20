// routes/subscriptionRoutes.ts
import express from "express";

const router = express.Router();

router.post("/send", (req, res) => {
  console.log("📩 MSpace Notification Received:", req.body);

  // TODO: Handle the incoming data here (update DB, trigger actions, etc.)
  // Example: Save subscription status to donor record

  res.status(200).send("OK");
  console.log(res);
});

export default router;
