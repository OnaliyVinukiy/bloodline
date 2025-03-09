/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import cityRoutes from "./routes/cityRoutes";
import dataService from "./utils/dataService";

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.options("*", cors());

// User Routes
app.use("/api", userRoutes);

// Appointment Routes
app.use("/api/appointments", appointmentRoutes);

app.use("/api/city", cityRoutes);

// Home route
app.get("/", (req: Request, res: Response): void => {
  try {
    res.send("API Working...!");
  } catch (error) {
    res.json({ error });
  }
});

const PORT = process.env.PORT || 5000;
dataService
  .loadData()
  .then(() => {
    app.listen(5000, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to load data:", err);
  });
