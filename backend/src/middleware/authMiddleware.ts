/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const ASGARDEO_JWT_PUBLIC_KEY = process.env.ASGARDEO_JWT_PUBLIC_KEY;

if (!ASGARDEO_JWT_PUBLIC_KEY) {
  throw new Error("Missing environment variable: ASGARDEO_JWT_PUBLIC_KEY");
}

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ASGARDEO_JWT_PUBLIC_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};
