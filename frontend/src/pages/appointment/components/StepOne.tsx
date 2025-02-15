/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Datepicker, Label } from "flowbite-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Donor, StepperProps, User } from "../../../types/types";
import { useAuthContext } from "@asgardeo/auth-react";

const StepOne: React.FC<StepperProps> = ({ onNextStep, onPreviousStep }) => {
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [donor, setDonor] = useState<Donor>({
    nic: "",
    fullName: "",
    email: user?.email || "",
    contactNumber: "",
    address: "",
    birthdate: "",
    age: 0,
    bloodGroup: "",
    avatar: "",
    gender: "",
  });

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user info from Asgardeo
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          const { data: userInfo } = await axios.post(
            "http://localhost:5000/api/user-info",
            { accessToken },
            { headers: { "Content-Type": "application/json" } }
          );

          setUser(userInfo);

          // Set email when user info is fetched
          setDonor((prev) => ({
            ...prev,
            email: userInfo.email || "",
          }));

          // Fetch donor info if user exists
          const { data: donorInfo } = await axios.get(
            `http://localhost:5000/api/donor/${userInfo.email}`
          );

          if (donorInfo) {
            setDonor(donorInfo);
            setIsProfileComplete(true);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  // Calculate age from date of birth
  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Handle input changes for donor fields
  const handleInputChange = (field: keyof Donor, value: string) => {
    if (donor) {
      setDonor((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

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
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">
          Please login to view profile data
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-center items-center bg-gray-100">
        <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <div className="mt-4 space-y-6">
              <div className="w-full">
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  Full Name (As in NIC)
                </Label>
                <input
                  type="text"
                  value={donor?.fullName || ""}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
              <div className="w-full">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  Email
                </Label>
                <input
                  type="email"
                  value={user.email}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  disabled
                />
              </div>

              <div className="w-full">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  NIC
                </Label>
                <input
                  type="text"
                  value={donor?.nic || ""}
                  onChange={(e) => handleInputChange("nic", e.target.value)}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>

              <div className="w-full">
                <Label
                  htmlFor="gender"
                  className="mt-1 block mb-2 text-sm font-medium text-indigo-900"
                >
                  Gender
                </Label>
                <div className="mt-4 flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Male"
                    checked={donor?.gender === "Male"}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="mr-2"
                  />
                  <Label
                    htmlFor="male"
                    className="mr-4 text-sm text-indigo-900"
                  >
                    Male
                  </Label>

                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Female"
                    checked={donor?.gender === "Female"}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="mr-2"
                  />
                  <Label htmlFor="female" className="text-sm text-indigo-900">
                    Female
                  </Label>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Address (Home)
                </Label>
                <input
                  type="text"
                  value={donor?.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
              <div>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Address (Office)
                </Label>
                <input
                  type="text"
                  value={donor?.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>

              <div className="w-full">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  Contact Number (Mobile)
                </Label>
                <input
                  type="text"
                  value={donor?.contactNumber || ""}
                  onChange={(e) =>
                    handleInputChange("contactNumber", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
              <div className="w-full">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  Contact Number (Home)
                </Label>
                <input
                  type="text"
                  value={donor?.contactNumber || ""}
                  onChange={(e) =>
                    handleInputChange("contactNumber", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
              <div className="w-full">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  Contact Number (Office)
                </Label>
                <input
                  type="text"
                  value={donor?.contactNumber || ""}
                  onChange={(e) =>
                    handleInputChange("contactNumber", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>

              <div>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Blood Group
                </Label>
                <input
                  type="text"
                  value={donor?.bloodGroup || ""}
                  onChange={(e) =>
                    handleInputChange("bloodGroup", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>

              <div>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Date of Birth
                </Label>
                <Datepicker
                  value={
                    donor?.birthdate ? new Date(donor.birthdate) : undefined
                  }
                  onChange={(date) => {
                    if (date) {
                      handleInputChange(
                        "birthdate",
                        date.toISOString().split("T")[0]
                      );
                    }
                  }}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>

              {donor?.birthdate && (
                <div>
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    Age
                  </Label>
                  <input
                    type="text"
                    value={calculateAge(donor.birthdate)}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    disabled
                  />
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={onPreviousStep}
                  className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={onNextStep}
                  className="px-4 py-2 text-white bg-red-800 rounded-lg hover:bg-red-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StepOne;
