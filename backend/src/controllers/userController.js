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
    const roles = userInfo.roles || [];
    const isBloodlineUser = roles.includes("User");

    const user = {
      sub: userInfo.sub,
      firstName: userInfo.given_name || "Guest",
      lastName: userInfo.family_name || "",
      email: userInfo.email || "No Email",
      birthdate: userInfo.birthday || "",
      avatar: userInfo.picture || null,
      role: isBloodlineUser ? "Bloodline User" : "Guest",
    };

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Error fetching user info" });
  }
};

export { getUserInfo };
