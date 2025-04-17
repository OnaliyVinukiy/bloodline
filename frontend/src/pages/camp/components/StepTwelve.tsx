/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { StepperPropsCamps } from "../../../types/stepper";
import { Label, Modal, Toast } from "flowbite-react";
import axios from "axios";
import { Camp } from "../../../types/camp";
import { useAuthContext } from "@asgardeo/auth-react";
import { HiExclamation } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import {
  validatePhoneNumber,
} from "../../../utils/ValidationsUtils";
import { Organization, User } from "../../../types/users";

declare global {
  interface Window {
    google: any;
  }
}

const StepTwelve: React.FC<
  StepperPropsCamps & {
    selectedDate: Date | null;
    startTime: string | null;
    endTime: string | null;
  }
> = ({ onPreviousStep, selectedDate, startTime, endTime }) => {
  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

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

  const [errors, setErrors] = useState<{ [key in keyof Camp]?: string }>({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [organizationOptions, setOrganizationOptions] = useState<string[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<string[]>([]); 
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { getAccessToken } = useAuthContext();

  const memoizedGetAccessToken = useCallback(
    () => getAccessToken(),
    [getAccessToken]
  );

  // Fetch all organizations on page load
  useEffect(() => {
    const fetchAllOrganizations = async () => {
      try {
        const response = await axios.get<Organization[]>(
          `${backendURL}/api/organizations/all-organizations`
        );
        const orgNames = response.data.map((org) => org.organizationName);
        setAllOrganizations(orgNames);

        const accessToken = await memoizedGetAccessToken();
        const { data: userInfo } = await axios.post(
          `${backendURL}/api/user-info`,
          { accessToken },
          { headers: { "Content-Type": "application/json" } }
        );
        setUser(userInfo);

        // Set email when user info is fetched
        setFormData((prev) => ({
          ...prev,
          email: userInfo.email || "",
        }));
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchAllOrganizations();
  }, [backendURL]);

  const [formData, setFormData] = useState<Camp>({
    organizationName: "",
    fullName: "",
    nic: "",
    email: user?.email || "",
    contactNumber: "",
    province: "",
    district: "",
    city: "",
    date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    startTime: startTime || "",
    endTime: endTime || "",
    googleMapLink: "",
    venue: "",
    status: "Pending",
    team: "None",
  });

  // Filter organizations based on user input
  useEffect(() => {
    if (formData.organizationName.trim()) {
      const filteredOrgs = allOrganizations.filter((org) =>
        org.toLowerCase().includes(formData.organizationName.toLowerCase())
      );
      setOrganizationOptions(filteredOrgs);
    } else {
      setOrganizationOptions([]);
    }
  }, [formData.organizationName, allOrganizations]);

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

  //Load google map
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }&libraries=places`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = initializeMap;
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapRef.current && searchInputRef.current) {
        // Initialize map
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 6.9271, lng: 79.8612 },
          zoom: 8,
        });

        // Initialize autocomplete
        const autocomplete = new window.google.maps.places.Autocomplete(
          searchInputRef.current,
          { types: ["establishment", "geocode"] }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry?.location) return;

          // Update form data with venue name and Google Maps link
          setFormData((prev) => ({
            ...prev,
            venue: place.name || "",
            googleMapLink:
              place.url ||
              `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          }));

          // Update map view
          mapInstance.current?.setCenter(place.geometry.location);
          mapInstance.current?.setZoom(17);

          // Update marker
          if (markerInstance.current) markerInstance.current.setMap(null);
          markerInstance.current = new window.google.maps.Marker({
            position: place.geometry.location,
            map: mapInstance.current,
          });
        });

        // Add click listener for manual location selection
        mapInstance.current?.addListener(
          "click",
          async (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;

            const position = e.latLng.toJSON();
            if (markerInstance.current) markerInstance.current.setMap(null);
            markerInstance.current = new window.google.maps.Marker({
              position: e.latLng,
              map: mapInstance.current,
            });

            // Reverse Geocoding to get place name
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: e.latLng },
              (results: any, status: any) => {
                if (status === "OK" && results[0]) {
                  setFormData((prev) => ({
                    ...prev,
                    venue: results[0].formatted_address,
                    googleMapLink: `https://www.google.com/maps/@${position.lat},${position.lng},17z`,
                  }));
                } else {
                  console.error("Geocoder failed due to:", status);
                }
              }
            );
          }
        );
      }
    };

    loadGoogleMapsScript();

    return () => {
      if (markerInstance.current) markerInstance.current.setMap(null);
      if (mapInstance.current)
        window.google.maps.event.clearInstanceListeners(mapInstance.current);
    };
  }, []);

  //Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const token = await getAccessToken();

        // Send updated formData, including the venue
        const response = await axios.post(
          `${backendURL}/api/camps/register`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          setShowModal(true);
          setFormData({
            organizationName: "",
            fullName: "",
            nic: "",
            email: user?.email || "",
            contactNumber: "",
            province: "",
            district: "",
            city: "",
            date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
            startTime: startTime || "",
            endTime: endTime || "",
            googleMapLink: "",
            venue: "",
            status: "Pending",
            team: "None",
          });
        }
      } catch (error: any) {
        console.error("Error saving camp:", error);
        setToastMessage(
          error.response?.data?.errors?.[0] ||
            "There was an error. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
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
                  Registration
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
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    placeholder="Enter organization name"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                    onBlur={() =>
                      setTimeout(() => setOrganizationOptions([]), 200)
                    }
                  />
                  {organizationOptions.length > 0 && (
                    <ul className="absolute z-10 w-3/4 bg-white border border-indigo-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                      {organizationOptions.map((orgName, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-indigo-50 cursor-pointer text-sm text-indigo-900"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              organizationName: orgName,
                            }));
                            setOrganizationOptions([]);
                          }}
                        >
                          {orgName}
                        </li>
                      ))}
                    </ul>
                  )}
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
                    disabled
                    placeholder="Enter email address"
                    className={`bg-indigo-50 border ${
                      isEmailValid ? "border-indigo-300" : "border-red-500"
                    } text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
                    required
                  />
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
                      Province*
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
                      District*
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
                      City*
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
                    htmlFor="searchLocation"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    Search and Select Location on Map*
                  </Label>
                  <input
                    ref={searchInputRef}
                    type="text"
                    id="searchLocation"
                    placeholder="Search for location"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    value={formData.venue} // Bind to formData.venue
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    } // Update venue in state when typing manually
                  />

                  <div
                    ref={mapRef}
                    className="mt-4 h-64 w-full rounded-lg"
                  ></div>
                  <input
                    type="hidden"
                    name="googleMapLink"
                    value={formData.googleMapLink}
                    required
                  />
                  {errors.googleMapLink && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.googleMapLink}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    <span>
                      Search for the venue location and select it on the map.{" "}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="googleMapLink"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    Google Map Link of the Venue*
                  </Label>
                  <input
                    type="text"
                    name="googleMapLink"
                    value={formData.googleMapLink}
                    onChange={handleInputChange}
                    placeholder="Enter link"
                    disabled
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                  {errors.googleMapLink && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.googleMapLink}
                    </p>
                  )}
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
          <Modal show={showModal} onClose={() => handleCloseModal()}>
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
                Request Submitted Successfully!
              </p>
            </Modal.Header>
            <Modal.Body>
              <p className="text-lg text-gray-700">
                Your request for a blood donation camp has been successfully
                submitted. Our team will review your request, and you will
                receive a confirmation email once it has been approved or
                rejected. Thank you for your willingness to save lives make a
                difference!
              </p>
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default StepTwelve;
