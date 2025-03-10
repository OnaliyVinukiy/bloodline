/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { UserIcon } from "@heroicons/react/24/solid";
import { Donor, User } from "../../types/users";
import axios from "axios";

export function Navigationbar() {
  const { state, signIn, signOut, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [donor, setDonor] = useState<Donor>({
    nic: "",
    fullName: "",
    email: user?.email || "",
    contactNumber: "",
    province: "",
    district: "",
    city: "",
    address: "",
    birthdate: "",
    age: 0,
    bloodGroup: "",
    avatar: "",
    gender: "",
  });

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch and assign user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          setIsLoading(true);
          const accessToken = await getAccessToken();
          console.log("acess", accessToken);
          const response = await axios.post(
            `${backendURL}/api/user-info`,
            { accessToken },
            { headers: { "Content-Type": "application/json" } }
          );

          setUser(response.data);
          console.log(response.data);
          if (
            response.data.role &&
            response.data.role.includes("Internal/Admin")
          ) {
            setIsAdmin(true);
            console.log("Admin");
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  // Fetch donor info after user info is fetched
  useEffect(() => {
    const fetchDonorInfo = async () => {
      if (user) {
        try {
          setIsLoading(true);

          // Fetch donor info using the user's email
          const { data: donorInfo } = await axios.get(
            `${backendURL}/api/donor/${user.email}`
          );

          if (donorInfo) {
            setDonor(donorInfo);
          }
        } catch (error) {
          console.error("Error fetching donor info:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDonorInfo();
  }, [user]);

  //Loading Animation
  if (isLoading) {
    return (
      <div className="loading flex justify-center items-center h-screen">
        <svg width="64px" height="48px">
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="back"
            stroke="#e53e3e"
            strokeWidth="2"
            fill="none"
          ></polyline>
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="front"
            stroke="#f56565"
            strokeWidth="2"
            fill="none"
          ></polyline>
        </svg>
      </div>
    );
  }

  return (
    <Navbar fluid rounded className="shadow-lg py-4">
      <Navbar.Brand href="/" className="md:ml-24 h-6 sm:h-9">
        <img
          src="https://bloodlineresources.blob.core.windows.net/assets/logo.png"
          className="mb-10 mt-2 mr-3 h-16 sm:h-16 "
          alt="Bloodline Logo"
        />
        <span className="self-center whitespace-nowrap text-red-800 text-3xl font-lobster  ">
          Bloodline
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 md:mr-24">
        {user && !isAdmin ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              user.avatar ? (
                <Avatar alt="User settings" img={user.avatar} rounded />
              ) : donor.avatar ? (
                <Avatar alt="User settings" img={donor.avatar} rounded />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
              )
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {user.firstName} {user.lastName}
              </span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => navigate("/profile")}>
              Profile
            </Dropdown.Item>
            <Dropdown.Item>Donations</Dropdown.Item>
            <Dropdown.Item>Appointments</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : user && isAdmin ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              user.avatar ? (
                <Avatar alt="User settings" img={user.avatar} rounded />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
              )
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {user.firstName} {user.lastName}
              </span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => navigate("/profile")}>
              Admin Dashboard
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/admin/appointments")}>
              {" "}
              Appointments
            </Dropdown.Item>
            <Dropdown.Item>Campaigns</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/admin/calendar")}>
              {" "}
              Calendar
            </Dropdown.Item>
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
        <Navbar.Link
          href="/"
          className="text-xl font-medium font-roboto hover:!text-red-700"
        >
          Home
        </Navbar.Link>
        <Navbar.Link
          href="#"
          className="text-xl font-medium font-roboto hover:!text-red-700"
        >
          About
        </Navbar.Link>
        <Navbar.Link
          href="#"
          className="text-xl font-medium font-roboto hover:!text-red-700"
        >
          Services
        </Navbar.Link>
        <Navbar.Link
          href="#"
          className="text-xl font-medium font-roboto hover:!text-red-700"
        >
          Contact Us
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
