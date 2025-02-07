import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";
import { Label } from "flowbite-react";
import { UserIcon } from "@heroicons/react/24/solid";
import { Datepicker } from "flowbite-react";
import { User, Donor } from "../../types/types";

export default function Profile() {
  const { state, signOut, getAccessToken } = useAuthContext();
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
  });

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user info from Asgardeo
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          const response = await fetch("http://localhost:5000/api/user-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken }),
          });

          if (!response.ok) throw new Error("Failed to fetch user info");
          const userInfo = await response.json();
          setUser(userInfo);

          // Set email when user info is fetched
          setDonor((prev) => ({
            ...prev,
            email: userInfo.email || "",
          }));

          // Fetch donor info if user exists
          const donorResponse = await fetch(
            `http://localhost:5000/api/donor/${userInfo.email}`
          );
          if (donorResponse.ok) {
            const donorInfo = await donorResponse.json();
            setDonor(donorInfo);
            setIsProfileComplete(true);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  // Handle file selection for avatar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  // Handle avatar upload
  const handleAvatarUpdate = async () => {
    if (!selectedFile || !user) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.sub);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/upload-avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setDonor((prev) => ({ ...prev, avatar: data.avatarUrl }));
      alert("Avatar updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error updating avatar.");
    } finally {
      setIsUploading(false);
    }
  };

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

  // Handle donor profile update
  const handleUpdate = async () => {
    if (!user || !donor) return;

    try {
      const { _id, ...donorData } = donor;

      await axios.post("http://localhost:5000/api/update-donor", donorData);
      setIsProfileComplete(true);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <main className="mt-16 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          {!isProfileComplete && (
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <p className="text-yellow-700">
                Please complete your profile to register as a donor.
              </p>
            </div>
          )}

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="lg:ml-4 flex justify-center items-center flex-col sm:flex-row sm:space-y-0 sm:space-x-6">
              {donor?.avatar ? (
                <img
                  className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-red-300"
                  src={donor.avatar}
                  alt="User Avatar"
                />
              ) : (
                <div className="w-40 h-40 p-1 rounded-full ring-2 ring-red-300 flex items-center justify-center bg-gray-300">
                  <UserIcon className="w-12 h-12 text-gray-600" />
                </div>
              )}

              <input
                type="file"
                id="avatar"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />

              <div className="ml-4">
                <button
                  onClick={() => document.getElementById("avatar")?.click()}
                  className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Change Avatar
                </button>
                {selectedFile && (
                  <button
                    onClick={handleAvatarUpdate}
                    className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex space-x-6 mb-6">
              <div className="w-1/3">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  First Name
                </Label>
                <input
                  type="text"
                  value={user.firstName}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  disabled
                />
              </div>

              <div className="w-1/3">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Last Name
                </Label>
                <input
                  type="text"
                  value={user.lastName}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  disabled
                />
              </div>

              <div className="w-1/3">
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
            </div>
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
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
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

            <div>
              <Label>Address</Label>
              <input
                type="text"
                value={donor?.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              />
            </div>

            <div className="mb-2 sm:mb-6">
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                {" "}
                Contact Number
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
              <Label>Blood Group</Label>
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
              <Label>Date of Birth</Label>
              <Datepicker
                value={donor?.birthdate ? new Date(donor.birthdate) : undefined}
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
                <Label>Age</Label>
                <input
                  type="text"
                  value={calculateAge(donor.birthdate)}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  disabled
                />
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {isProfileComplete ? "Update Profile" : "Complete Profile"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
