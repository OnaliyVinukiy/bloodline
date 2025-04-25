/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";
import { Button, Label, Modal } from "flowbite-react";
import { UserIcon } from "@heroicons/react/24/solid";
import { Datepicker } from "flowbite-react";
import { User, Donor } from "../../types/users";
import { ValidationModal } from "../../components/ValidationModal";
import { validatePhoneNumber } from "../../utils/ValidationsUtils";

export default function Profile() {
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showAvatarUpdateModel, setShowAvatarUpdateModel] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

  const [province, setProvince] = useState<
    { province_id: string; province_name_en: string }[]
  >([]);

  const [district, setDistrict] = useState<
    { district_id: string; district_name_en: string; province_id: string }[]
  >([]);

  const [city, setCity] = useState<
    { city_id: string; city_name_en: string; district_id: string }[]
  >([]);

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
    status: "active",
  });

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showProfileIncompleteModal, setShowProfileIncompleteModal] =
    useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showValidationModal, setShowValidationModal] = useState(false);

  const handlePhoneNumberChange = (value: string) => {
    setIsPhoneNumberValid(validatePhoneNumber(value));
    handleInputChange("contactNumber", value);
  };

  const [validationModalContent, setValidationModalContent] = useState({
    title: "",
    content: "",
  });

  const showValidationMessage = (title: string, content: string) => {
    setValidationModalContent({ title, content });
    setShowValidationModal(true);
  };

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch user info from Asgardeo
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          const { data: userInfo } = await axios.post(
            `${backendURL}/api/user-info`,
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
            `${backendURL}/api/donor/${userInfo.email}`
          );

          if (donorInfo) {
            setDonor(donorInfo);
            setIsProfileComplete(true);
            fetchDistricts(donorInfo.province);
            fetchCities(donorInfo.district);
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

  useEffect(() => {
    if (!isLoading && !isProfileComplete) {
      setShowProfileIncompleteModal(true);
    }
  }, [isLoading, isProfileComplete]);

  //Fetch provinces list
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/provinces/provinces-list`
        );
        setProvince(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, [backendURL]);

  //Fetch districts list
  const fetchDistricts = async (provinceName: string) => {
    try {
      const response = await fetch(
        `${backendURL}/api/districts/province-name/${provinceName}`
      );
      const districts = await response.json();
      if (response.ok) {
        setDistrict(districts);
      } else {
        setDistrict([]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedProvince = event.target.value;
    setDonor((prev) => ({ ...prev, province: selectedProvince }));
    fetchDistricts(selectedProvince);
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDistrict = event.target.value;
    setDonor((prev) => ({ ...prev, district: selectedDistrict }));
    fetchCities(selectedDistrict);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = event.target.value;
    setDonor((prev) => ({ ...prev, city: selectedCity }));
  };

  //Fetch districts list
  const fetchCities = async (districtName: string) => {
    try {
      const response = await fetch(
        `${backendURL}/api/city/district/${districtName}`
      );
      const cities = await response.json();
      if (response.ok) {
        setCity(cities);
      } else {
        setCity([]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Handle file selection for avatar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create an object URL for image preview
      const imageUrl = URL.createObjectURL(file);
      setDonor((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  // Handle avatar upload
  const handleAvatarUpdate = async () => {
    if (!selectedFile || !user?.email) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", user.email);

    try {
      const { data } = await axios.post(
        `${backendURL}/api/upload-avatar`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update the donor record with new avatar URL
      setDonor((prev) => ({ ...prev, avatar: data.avatarUrl }));

      setShowAvatarUpdateModel(true);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error updating avatar.");
    } finally {
      setIsUploading(false);
      window.location.reload();
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

    // Calculate age from birthdate
    const age = calculateAge(donor.birthdate);

    // Check if the user is under 18
    if (age < 18) {
      showValidationMessage(
        "Age Restriction",
        "You cannot register as a donor unless you are aged 18 or above."
      );
      return;
    }

    // Check if the phone number is valid
    if (!validatePhoneNumber(donor.contactNumber)) {
      showValidationMessage(
        "Invalid Contact Number",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    try {
      setLoading(true);
      const { _id, ...donorData } = donor;

      await axios.post(`${backendURL}/api/update-donor`, donorData);
      setIsProfileComplete(true);
      setLoading(false);
      if (!isProfileComplete) {
        setShowRegistrationModal(true);
      } else {
        setShowUpdateModal(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
      setErrorModal(true);
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
    <div className="flex justify-center items-center bg-gray-50">
      <main className="mt-16 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          {!isProfileComplete ? (
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <p className="text-yellow-700">
                Please complete your profile to register as a donor.
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <p className="text-yellow-700">You are registered as a donor.</p>
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
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mb-6">
              <div className="w-full md:w-1/3">
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

              <div className="w-full md:w-1/3">
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

              <div className="w-full md:w-1/3">
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
            <div className="flex space-x-6 mb-6">
              <div className="w-3/4">
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

              <div className="w-3/4">
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
            </div>

            {/* Provinces, District and Cities Section */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mb-6">
              <div className="w-full md:w-1/3">
                <Label
                  htmlFor="province"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Province
                </Label>
                <select
                  id="province"
                  value={donor.province}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  onChange={handleProvinceChange}
                >
                  <option value="">Select a province</option>
                  {province.map((prov) => (
                    <option
                      key={prov.province_id}
                      value={prov.province_name_en}
                    >
                      {prov.province_name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-1/3">
                <Label
                  htmlFor="district"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  District
                </Label>
                <select
                  id="district"
                  value={donor.district}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  onChange={handleDistrictChange}
                >
                  <option value="">Select a district</option>
                  {district.length > 0 ? (
                    district.map((districtItem) => (
                      <option
                        key={districtItem.district_id}
                        value={districtItem.district_name_en}
                      >
                        {districtItem.district_name_en}
                      </option>
                    ))
                  ) : (
                    <option value="">Please select a province first</option>
                  )}
                </select>
              </div>

              <div className="w-full md:w-1/3">
                <Label
                  htmlFor="city"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  City
                </Label>
                <select
                  id="city"
                  value={donor.city}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  onChange={handleCityChange}
                >
                  <option value="">Select a city</option>
                  {city.length > 0 ? (
                    city.map((cityItem) => (
                      <option
                        key={cityItem.city_id}
                        value={cityItem.city_name_en}
                      >
                        {cityItem.city_name_en}
                      </option>
                    ))
                  ) : (
                    <option value="">Please select a district first</option>
                  )}
                </select>
              </div>
            </div>
            <div>
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                Address
              </Label>
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
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                className={`bg-indigo-50 border ${
                  isPhoneNumberValid ? "border-indigo-300" : "border-red-500"
                } text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
              />
              {!isPhoneNumberValid && (
                <p className="text-sm text-red-500 mt-1">
                  Please enter a valid 10-digit phone number starting from 0.
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                Blood Group
              </Label>
              <select
                value={donor?.bloodGroup || ""}
                onChange={(e) =>
                  handleInputChange("bloodGroup", e.target.value)
                }
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                Date of Birth
              </Label>
              <Datepicker
                value={donor?.birthdate ? new Date(donor.birthdate) : undefined}
                onChange={(date) => {
                  if (date) {
                    const offsetDate = new Date(date);
                    offsetDate.setMinutes(offsetDate.getMinutes() + 330);

                    const formattedDate =
                      offsetDate.toLocaleDateString("en-CA");
                    handleInputChange("birthdate", formattedDate);
                  }
                }}
                maxDate={new Date()}
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              />
            </div>

            {donor?.birthdate && (
              <div>
                <Label
                  htmlFor="first_name"
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

            <div className="flex justify-end mt-6">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-red-500 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 mr-2 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5c0 27.6-22.4 50-50 50S0 78.1 0 50.5 22.4.5 50 .5s50 22.4 50 50z"
                        fill="currentColor"
                        opacity=".2"
                      />
                      <path
                        d="M93.3 50.5c0-23.9-19.4-43.3-43.3-43.3-6.3 0-12.3 1.3-17.8 3.7-1.6.7-2.2 2.6-1.5 4.2.7 1.6 2.6 2.2 4.2 1.5 4.9-2.1 10.2-3.2 15.6-3.2 21.6 0 39.3 17.7 39.3 39.3s-17.7 39.3-39.3 39.3c-21.6 0-39.3-17.7-39.3-39.3 0-6.8 1.7-13.3 5-19.1.9-1.5.4-3.4-1-4.3s-3.4-.4-4.3 1c-3.8 6.4-5.8 13.7-5.8 21.3 0 23.9 19.4 43.3 43.3 43.3s43.3-19.4 43.3-43.3z"
                        fill="currentColor"
                      />
                    </svg>
                    Updating...
                  </>
                ) : isProfileComplete ? (
                  "Update Profile"
                ) : (
                  "Complete Profile"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Registration Confirmation Modal */}
      <Modal
        show={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      >
        <Modal.Header className="flex items-center gap-2 ">
          <p className="flex items-center gap-2 text-xl text-green-600">
            <svg
              className="w-6 h-6 text-green-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
              />
            </svg>
            Registered Successfully!
          </p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            You got successfully registered as a blood donor.
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            color="failure"
            onClick={() => setShowRegistrationModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Update Confirmation Modal */}
      <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <Modal.Header className="flex items-center gap-2 ">
          <p className="flex items-center gap-2 text-xl text-green-600">
            <svg
              className="w-6 h-6 text-green-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
              />
            </svg>
            Details Updated Successfully!
          </p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Your donor details are updated successfully.
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={() => setShowUpdateModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showErrorModal} onClose={() => setErrorModal(false)}>
        <Modal.Header>Oops an Error!</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Error updating the profile. Please try again shortly.
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={() => setErrorModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Profile Completion Modal */}
      <Modal
        show={showProfileIncompleteModal}
        onClose={() => setShowProfileIncompleteModal(false)}
      >
        <Modal.Header>Complete Your Profile</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Please complete your profile to register as a donor.
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            color="failure"
            onClick={() => setShowProfileIncompleteModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Avatar Update Confirmation Modal */}
      <Modal
        show={showAvatarUpdateModel}
        onClose={() => setShowAvatarUpdateModel(false)}
      >
        <Modal.Header className="flex items-center gap-2 ">
          <p className="flex items-center gap-2 text-xl text-green-600">
            <svg
              className="w-6 h-6 text-green-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
              />
            </svg>
            Uploaded Successfully!
          </p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Your profile picture got uploaded successfully.
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            color="failure"
            onClick={() => setShowAvatarUpdateModel(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Validation Modal */}
      <ValidationModal
        show={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title={validationModalContent.title}
        content={validationModalContent.content}
      />
    </div>
  );
}
