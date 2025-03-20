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
import { Donor, User } from "../types/users";
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
        setIsLoading(false);
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
    <Navbar fluid rounded className="shadow-lg md:py-4 py-2">
      <Navbar.Brand href="/" className="md:ml-24 md: h-6 h-4">
        <img
          src="https://bloodlineresources.blob.core.windows.net/assets/logo.png"
          className="mb-10 mt-2 mr-3 h-16 sm:h-16 "
          alt="Bloodline Logo"
        />
        <span className="self-center whitespace-nowrap text-red-800 text-2xl md:text-3xl font-lobster  ">
          Bloodline
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 md:mr-24">
        {isLoading ? (
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
        ) : state?.isAuthenticated ? (
          user && !isAdmin ? (
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
                <div className="flex items-center">
                  <svg
                    className="w-[14px] h-[14px] mr-2 fill-[#8e8e8e]"
                    viewBox="0 0 448 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
                  </svg>
                  <span>Profile</span>
                </div>
              </Dropdown.Item>

              <Dropdown.Item>
                <div className="flex items-center">
                  <svg
                    className="w-[18px] h-[18px] mr-1 fill-[#8e8e8e]"
                    viewBox="0 0 576 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M224 24V80H168c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h56v56c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V176h56c13.3 0 24-10.7 24-24V104c0-13.3-10.7-24-24-24H320V24c0-13.3-10.7-24-24-24H248c-13.3 0-24 10.7-24 24zM559.7 392.2c17.8-13.1 21.6-38.1 8.5-55.9s-38.1-21.6-55.9-8.5L392.6 416H272c-8.8 0-16-7.2-16-16s7.2-16 16-16h16 64c17.7 0 32-14.3 32-32s-14.3-32-32-32H288 272 193.7c-29.1 0-57.3 9.9-80 28L68.8 384H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H192 352.5c29 0 57.3-9.3 80.7-26.5l126.6-93.3zm-367-8.2l.9 0 0 0c-.3 0-.6 0-.9 0z"></path>
                  </svg>
                  <span>Donations</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/appointments")}>
                <div className="flex items-center">
                  <svg
                    className="w-[15px] h-[15px] mr-2 fill-[#8e8e8e]"
                    viewBox="0 0 448 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"></path>
                  </svg>
                  <span>Appointments</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => signOut()}>
                {" "}
                <svg
                  className="w-[15px] h-[15px] mr-2 fill-[#8e8e8e]"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
                Sign out
              </Dropdown.Item>
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
                <svg
                  className="w-[15px] h-[15px] mr-2 fill-[#8e8e8e]"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"></path>
                </svg>
                Admin Dashboard
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/admin/appointments")}>
                {" "}
                <svg
                  className="w-[15px] h-[15px] mr-2 fill-[#8e8e8e]"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"></path>
                </svg>
                Appointments
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/admin/camps")}>
                <svg
                  className="w-[16px] h-[16px] mr-2 fill-[#8e8e8e]"
                  viewBox="0 0 576 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L416 100.7V64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V185l52.8 46.4c8 7 12 15 11 24zM272 192c-8.8 0-16 7.2-16 16v48H208c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V320h48c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H320V208c0-8.8-7.2-16-16-16H272z"></path>
                </svg>
                Camps
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/admin/calendar")}>
                {" "}
                <svg
                  className="w-[16px] h-[16px] mr-2 fill-[#8e8e8e]"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"></path>
                </svg>
                Calendar
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => signOut()}>
                <svg
                  className="w-[15px] h-[15px] mr-2 fill-[#8e8e8e]"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
                Sign out
              </Dropdown.Item>
            </Dropdown>
          ) : null
        ) : (
          <Button
            className="bg-red-800 hover:bg-red-700 text-white text-xs md:text-base text-sm"
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
