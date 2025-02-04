/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";

export function Navigationbar() {
  const { state, signIn, signOut, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  } | null>(null);

  // Fetch and assign user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          const response = await fetch(
            `https://api.asgardeo.io/t/onaliy/oauth2/userinfo`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const userInfo = await response.json();
            console.log("User Info:", userInfo);

            setUser({
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
              email: userInfo.email || "No Email",
              avatar:
                userInfo.picture ||
                userInfo.profile ||
                "https://via.placeholder.com/150",
            });
          } else {
            throw new Error("Failed to fetch user info");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  return (
    <Navbar fluid rounded>
      <Navbar.Brand
        href="https://flowbite-react.com"
        className="md:ml-24 h-6 sm:h-9"
      >
        <img
          src="src/assets/bloodlogo.png"
          className="mr-3 h-6 sm:h-9"
          alt="Bloodline Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Bloodline
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 md:mr-24">
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img={user.avatar} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {user.firstName} {user.lastName}
              </span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Button
            className="bg-red-800 hover:bg-red-700 text-white"
            onClick={() => signIn()}
          >
            Login
          </Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" className="text-lg font-medium" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#" className="text-lg font-medium">
          About
        </Navbar.Link>
        <Navbar.Link href="#" className="text-lg font-medium">
          Services
        </Navbar.Link>
        <Navbar.Link href="#" className="text-lg font-medium">
          Appointments
        </Navbar.Link>
        <Navbar.Link href="#" className="text-lg font-medium">
          Contact Us
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
