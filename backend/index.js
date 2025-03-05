/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";

const app = express();
const allowedOrigins = [
  "https://bloodline-gxfvfrfyg7bqbahz.southeastasia-01.azurewebsites.net",
  "https://bloodlinebackend-avepf5h9fdfsera7.southeastasia-01.azurewebsites.net",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

//User Routes
app.use("/api", userRoutes);

//Appointment Routes
app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
