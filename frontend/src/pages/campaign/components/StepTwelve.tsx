/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React, { useEffect, useState } from "react";
import { StepperPropsCampaign } from "../../../types/stepper";
import { Label, Toast } from "flowbite-react";
import axios from "axios";
import { Camp } from "../../../types/camp";
import { useAuthContext } from "@asgardeo/auth-react";
import { HiExclamation } from "react-icons/hi";
import {
  validateEmail,
  validatePhoneNumber,
} from "../../../utils/ValidationsUtils";

const StepTwelve: React.FC<
  StepperPropsCampaign & {
    selectedDate: Date | null;
    selectedSlot: string | null;
  }
> = ({ onNextStep, onPreviousStep, selectedDate, selectedSlot }) => {
  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  const [province, setProvince] = useState<
    { province_id: string; province_name_en: string }[]
  >([]);

  const [district, setDistrict] = useState<
    { district_id: string; district_name_en: string; province_id: string }[]
  >([]);

  const [city, setCity] = useState<
    { city_id: string; city_name_en: string; district_id: string }[]
  >([]);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const [formData, setFormData] = useState<Camp>({
    organizationName: "",
    fullName: "",
    nic: "",
    email: "",
    contactNumber: "",
    province: "",
    district: "",
    city: "",
    date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    time: selectedSlot || "",
    googleMapLink: "",
  });

  const [errors, setErrors] = useState<{ [key in keyof Camp]?: string }>({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const { getAccessToken } = useAuthContext();

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

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedProvince = event.target.value;
    setFormData((prev) => ({ ...prev, province: selectedProvince }));
    fetchDistricts(selectedProvince);
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDistrict = event.target.value;
    setFormData((prev) => ({ ...prev, district: selectedDistrict }));
    fetchCities(selectedDistrict);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = event.target.value;
    setFormData((prev) => ({ ...prev, city: selectedCity }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPhoneNumberValid(validatePhoneNumber(e.target.value));
    handleInputChange(e);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEmailValid(validateEmail(e.target.value));
    handleInputChange(e);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validation function
  const validateForm = () => {
    const newErrors: { [key in keyof Camp]?: string } = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full Name is required.";
    if (!formData.nic.trim()) newErrors.nic = "NIC Number is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact Number is required.";
    if (!formData.province.trim()) newErrors.province = "Province is required.";
    if (!formData.district.trim()) newErrors.district = "District is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.googleMapLink.trim())
      newErrors.googleMapLink = "Google Map Link is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const token = await getAccessToken();

        // Make API call to save camp data
        const response = await axios.post(
          `${backendURL}/api/camps/register`,
          { formData },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          onNextStep();
          setToastMessage("Blood donation camp registered successfully!");
        } else {
          setToastMessage("Failed to register camp. Please try again.");
        }
      } catch (error: any) {
        console.error("Error saving camp:", error);
        const errorMessage =
          error.response?.data?.errors?.[0] ||
          "There was an error. Please try again.";
        setToastMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center bg-white min-h-screen">
      <main className="mt-0 mb-8 w-full max-w-4xl px-4 py-8">
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-xl z-0"></div>

          <div className="relative bg-white rounded-xl p-8 z-10">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="w-12 h-12 text-red-700"
                  aria-hidden="true"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 576 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"
                  />
                </svg>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                  Finding Blood Donors
                </h2>
              </div>
              <div className="mt-2 text-lg md:text-xl text-gray-600">
                Every drop counts. Let’s make a difference together!
              </div>
            </div>
            {/* Form */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <Label
                htmlFor="province"
                className="block mb-6 text-lg font-roboto font-medium text-gray-800"
              >
                Details of the Organizer
              </Label>
              <div className="mt-4 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="organizationName"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    {" "}
                    Organization Name (If Available)
                  </Label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    name="organizationName"
                    placeholder="Enter organization name"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    {" "}
                    Full Name of Organizer (As in NIC)*
                  </Label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="NIC"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    {" "}
                    NIC Number*
                  </Label>
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                    placeholder="Enter NIC number"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                  {errors.nic && (
                    <p className="text-red-500 text-xs mt-1">{errors.nic}</p>
                  )}
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    {" "}
                    Email Address*
                  </Label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    placeholder="Enter email address"
                    className={`bg-indigo-50 border ${
                      isPhoneNumberValid
                        ? "border-indigo-300"
                        : "border-red-500"
                    } text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                  {!isEmailValid && (
                    <p className="text-sm text-red-500 mt-1">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="cnumber"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    {" "}
                    Contact Number*
                  </Label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="Enter contact number"
                    className={`bg-indigo-50 border ${
                      isPhoneNumberValid
                        ? "border-indigo-300"
                        : "border-red-500"
                    } text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
                    required
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactNumber}
                    </p>
                  )}
                  {!isPhoneNumberValid && (
                    <p className="text-sm text-red-500 mt-1">
                      Please enter a valid 10-digit phone number starting from
                      0.
                    </p>
                  )}
                </div>

                <Label
                  htmlFor="province"
                  className="mt-2 block mb-2 text-lg font-medium font-roboto text-gray-800 mt-2"
                >
                  Details of the Venue
                </Label>

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
                      value={formData.province}
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
                    {errors.province && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.province}
                      </p>
                    )}
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
                      value={formData.district}
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
                    {errors.district && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.district}
                      </p>
                    )}
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
                      value={formData.city}
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
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="googleMapLink"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    Google Map Link of the Venue
                  </Label>
                  <input
                    type="text"
                    name="googleMapLink"
                    value={formData.googleMapLink}
                    onChange={handleInputChange}
                    placeholder="Enter link"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                  {errors.googleMapLink && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.googleMapLink}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Don't know how to get the Google Map link? </span>
                    <a
                      href="https://www.youtube.com/watch?v=fGWDogeZMTY"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Learn how to get it here.
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-red-500 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300"
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
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>

          {/* Toast*/}
          {toastMessage && (
            <Toast className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
                <HiExclamation className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{toastMessage}</div>
              <Toast.Toggle onClick={() => setToastMessage(null)} />
            </Toast>
          )}
        </div>
      </main>
    </div>
  );
};

export default StepTwelve;
