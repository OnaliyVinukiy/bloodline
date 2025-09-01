/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const ASGARDEO_TENANT = process.env.ASGARDEO_TENANT;
if (!ASGARDEO_TENANT) {
  throw new Error("Missing environment variable: ASGARDEO_TENANT");
}

// JWKS client to fetch public key dynamically
const client = jwksClient({
  jwksUri: `https://api.asgardeo.io/t/${ASGARDEO_TENANT}/oauth2/jwks`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid token", error: err.message });
    }
    req.user = decoded;
    next();
  });
};

export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  console.log("Inspecting req.user in authorizeAdmin:", user);

  if (
    user &&
    user.roles &&
    Array.isArray(user.roles) &&
    user.roles.includes("Admin")
  ) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Access Forbidden: Admin role required" });
};
