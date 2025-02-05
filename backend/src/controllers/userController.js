/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import fetch from "node-fetch";

// Fetch user info from Asgardeo API
const getUserInfo = async (req, res) => {
  const { accessToken } = req.body;

  try {
    const response = await fetch(
      "https://api.asgardeo.io/t/onaliy/oauth2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await response.json();
    const user = {
      sub: userInfo.sub,
      firstName: userInfo.given_name || "Guest",
      lastName: userInfo.family_name || "",
      email: userInfo.email || "No Email",
      birthdate: userInfo.birthdate || "",
      avatar: userInfo.picture || null,
      role: userInfo.roles || null,
    };

    console.log("User info:", user);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Error fetching user info" });
  }
};

// Generate admin token
const fetchAdminToken = async () => {
  const clientId = process.env.VITE_CLIENT_ADMIN_ID;
  const clientSecret = process.env.VITE_CLIENT_SECRET;
  const tokenUrl = "https://api.asgardeo.io/t/onaliy/oauth2/token";

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing Client ID or Client Secret in environment variables"
    );
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "internal_user_mgt_update",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin token");
  }

  const data = await response.json();
  console.log("Admin Token:", data.access_token);
  return data.access_token;
};

// Update user info in Asgardeo
const updateUserInfo = async (req, res) => {
  const { sub, firstName, lastName, email, birthdate } = req.body;

  if (!sub) {
    return res.status(400).json({ message: "User ID (sub) is required" });
  }

  try {
    const adminToken = await fetchAdminToken();

    const response = await fetch(
      `https://api.asgardeo.io/t/onaliy/scim2/Users/${sub}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
          Operations: [
            {
              op: "replace",
              path: "name.givenName",
              value: firstName,
            },
            {
              op: "replace",
              path: "name.familyName",
              value: lastName,
            },
            {
              op: "replace",
              path: "emails",
              value: [{ value: email }],
            },
            {
              op: "replace",
              path: "urn:scim:wso2:schema:dateOfBirth",
              value: birthdate,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to update user info: ${errorDetails}`);
    }

    const updatedUserInfo = await response.json();
    res
      .status(200)
      .json({ message: "User info updated successfully", updatedUserInfo });
  } catch (error) {
    console.error("Error updating user info:", error);
    res
      .status(500)
      .json({ message: "Error updating user info", error: error.message });
  }
};

// const assignUserRole = async (accessToken, userId) => {
//   try {
//     const response = await fetch(
//       `https://api.asgardeo.io/t/onaliy/scim2/Users/${userId}`,
//       {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
//           Operations: [
//             {
//               op: "add",
//               path: "roles",
//               value: [{ value: "User" }],
//             },
//           ],
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorDetails = await response.text();
//       throw new Error(`Failed to assign User role: ${errorDetails}`);
//     }

//     console.log(`User role 'User' assigned successfully to ${userId}`);
//   } catch (error) {
//     console.error("Error assigning user role:", error);
//   }
// };

export { getUserInfo, updateUserInfo };
