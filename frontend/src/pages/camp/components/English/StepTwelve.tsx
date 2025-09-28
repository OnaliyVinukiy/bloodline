/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StepperPropsCamps } from "../../../../types/stepper";
import { Label, Modal, Toast } from "flowbite-react";
import axios from "axios";
import { Camp } from "../../../../types/camp";
import { useAuthContext } from "@asgardeo/auth-react";
import { HiExclamation } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { validatePhoneNumber } from "../../../../utils/ValidationsUtils";
import { Organization } from "../../../../types/users";
import { useUser } from "../../../../contexts/UserContext";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation("campRegistrationFinal");
  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };
  const { user } = useUser();
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  const [province, setProvince] = useState<
    {
      province_id: string;
      province_name_en: string;
      province_name_si: string;
    }[]
  >([]);

  const [district, setDistrict] = useState<
    {
      district_id: string;
      district_name_en: string;
      district_name_si: string;
      province_id: string;
    }[]
  >([]);

  const [city, setCity] = useState<
    {
      city_id: string;
      city_name_en: string;
      city_name_si: string;
      district_id: string;
    }[]
  >([]);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const [errors, setErrors] = useState<{ [key in keyof Camp]?: string }>({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [organizationOptions, setOrganizationOptions] = useState<string[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isFetchingOrgData, setIsFetchingOrgData] = useState(true);
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

  // NEW: Fetch organization data by user email on component mount
  useEffect(() => {
    const fetchOrganizationByEmail = async () => {
      if (!user?.email) {
        setIsFetchingOrgData(false);
        return;
      }

      try {
        setIsFetchingOrgData(true);
        const response = await axios.get(
          `${backendURL}/api/organizations/organization/${encodeURIComponent(user.email)}`
        );
        
        if (response.data) {
          const orgData = response.data;
          setFormData((prev) => ({
            ...prev,
            organizationName: orgData.organizationName || prev.organizationName,
            fullName: orgData.repFullName || prev.fullName,
            nic: orgData.repNIC || prev.nic,
            email: orgData.repEmail || prev.email,
            contactNumber: orgData.repContactNumber || prev.contactNumber,
          }));
          
          if (orgData.repContactNumber) {
            setIsPhoneNumberValid(validatePhoneNumber(orgData.repContactNumber));
          }
        }
      } catch (error) {
        console.error("Error fetching organization by email:", error);
        // Don't show error toast as it's expected that not all users will have organizations
      } finally {
        setIsFetchingOrgData(false);
      }
    };

    fetchOrganizationByEmail();
  }, [user?.email, backendURL]);

  // Filter organizations based on user input (for manual selection if needed)
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
      const currentLang = i18n.language;
      const langParam = currentLang === "si" ? "?lang=si" : "";

      const response = await fetch(
        `${backendURL}/api/districts/province-name/${provinceName}${langParam}`
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

  //Fetch cities list
  const fetchCities = async (districtName: string) => {
    const currentLang = i18n.language;
    const langParam = currentLang === "si" ? "?lang=si" : "";

    try {
      const response = await fetch(
        `${backendURL}/api/city/district/${districtName}${langParam}`
      );
      const cities = await response.json();
      if (response.ok) {
        setCity(cities);
      } else {
        setCity([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
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
      newErrors.fullName = t("error_full_name_required");
    if (!formData.nic.trim()) newErrors.nic = t("error_nic_required");
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = t("error_contact_number_required");
    if (!isPhoneNumberValid)
      newErrors.contactNumber = t("contact_number_invalid");
    if (!formData.province.trim())
      newErrors.province = t("error_province_required");
    if (!formData.district.trim())
      newErrors.district = t("error_district_required");
    if (!formData.city.trim()) newErrors.city = t("error_city_required");
    if (!formData.googleMapLink.trim())
      newErrors.googleMapLink = t("error_google_map_link_required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchOrganizationData = async (orgName: string) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/organizations/name/${encodeURIComponent(orgName)}`
      );
      const orgData = response.data;
      setFormData((prev) => ({
        ...prev,
        organizationName: orgData.organizationName || prev.organizationName,
        fullName: orgData.repFullName || prev.fullName,
        nic: orgData.repNIC || prev.nic,
        email: orgData.repEmail || prev.email,
        contactNumber: orgData.repContactNumber || prev.contactNumber,
      }));
      if (orgData.repContactNumber) {
        setIsPhoneNumberValid(validatePhoneNumber(orgData.repContactNumber));
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
      setToastMessage(t("error_message_toast_default"));
    }
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
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 6.9271, lng: 79.8612 },
          zoom: 8,
        });

        const autocomplete = new window.google.maps.places.Autocomplete(
          searchInputRef.current,
          { types: ["establishment", "geocode"] }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry?.location) return;

          setFormData((prev) => ({
            ...prev,
            venue: place.name || "",
            googleMapLink:
              place.url ||
              `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          }));

          mapInstance.current?.setCenter(place.geometry.location);
          mapInstance.current?.setZoom(17);

          if (markerInstance.current) markerInstance.current.setMap(null);
          markerInstance.current = new window.google.maps.Marker({
            position: place.geometry.location,
            map: mapInstance.current,
          });
        });

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
        const token = await memoizedGetAccessToken();
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
          error.response?.data?.errors?.[0] || t("error_message_toast_default")
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOrganizationSelect = (orgName: string) => {
    setFormData((prev) => ({
      ...prev,
      organizationName: orgName,
    }));
    setOrganizationOptions([]);
    fetchOrganizationData(orgName);
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
                  {t("title")}
                </h2>
              </div>
              <div className="mt-2 text-lg md:text-xl text-gray-600">
                {t("subtitle")}
              </div>
            </div>
            
            {/* Loading indicator for organization data */}
            {isFetchingOrgData && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 mr-2 text-blue-600 animate-spin"
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
                  <span className="text-blue-600 text-sm">
                    {t("loading_organization_data") || "Loading your organization data..."}
                  </span>
                </div>
              </div>
            )}
            
            {/* Form */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <Label
                htmlFor="province"
                className="block mb-6 text-lg font-roboto font-medium text-gray-800"
              >
                {t("organizer_details_title")}
              </Label>
              <div className="mt-4 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="organizationName"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    {" "}
                    {t("organization_name_label")}
                  </Label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    placeholder={t("organization_name_placeholder")}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                    onBlur={() =>
                      setTimeout(() => setOrganizationOptions([]), 200)
                    }
                  />
                  {organizationOptions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-indigo-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                      {organizationOptions.map((orgName, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-indigo-50 cursor-pointer text-sm text-indigo-900"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleOrganizationSelect(orgName)}
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
                    {t("full_name_label")}
                  </Label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t("full_name_placeholder")}
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
                    {t("nic_label")}
                  </Label>
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                    placeholder={t("nic_placeholder")}
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
                    {t("email_label")}
                  </Label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    placeholder={t("email_placeholder")}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="cnumber"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    {" "}
                    {t("contact_number_label")}
                  </Label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder={t("contact_number_placeholder")}
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
                      {t("contact_number_invalid")}
                    </p>
                  )}
                </div>

                <Label
                  htmlFor="province"
                  className="mt-2 block mb-2 text-lg font-medium font-roboto text-gray-800 mt-2"
                >
                  {t("venue_details_title")}
                </Label>

                <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mb-6">
                  <div className="w-full md:w-1/3">
                    <Label
                      htmlFor="province"
                      className="block mb-2 text-sm font-medium text-indigo-900"
                    >
                      {t("province_label")}
                    </Label>
                    <select
                      id="province"
                      value={formData.province}
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      onChange={handleProvinceChange}
                    >
                      <option value="">{t("select_province")}</option>
                      {province.map((prov) => (
                        <option
                          key={prov.province_id}
                          value={
                            i18n.language === "si"
                              ? prov.province_name_si
                              : prov.province_name_en
                          }
                        >
                          {i18n.language === "si"
                            ? prov.province_name_si
                            : prov.province_name_en}
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
                      {t("district_label")}
                    </Label>
                    <select
                      id="district"
                      value={formData.district}
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      onChange={handleDistrictChange}
                    >
                      <option value="">{t("select_district")}</option>
                      {district.length > 0 ? (
                        district.map((districtItem) => (
                          <option
                            key={districtItem.district_id}
                            value={
                              i18n.language === "si"
                                ? districtItem.district_name_si
                                : districtItem.district_name_en
                            }
                          >
                            {i18n.language === "si"
                              ? districtItem.district_name_si
                              : districtItem.district_name_en}
                          </option>
                        ))
                      ) : (
                        <option value="">{t("select_province_first")}</option>
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
                      {t("city_label")}
                    </Label>
                    <select
                      id="city"
                      value={formData.city}
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      onChange={handleCityChange}
                    >
                      <option value="">{t("select_city")}</option>
                      {city.length > 0 ? (
                        city.map((cityItem) => (
                          <option
                            key={cityItem.city_id}
                            value={
                              i18n.language === "si"
                                ? cityItem.city_name_si
                                : cityItem.city_name_en
                            }
                          >
                            {i18n.language === "si"
                              ? cityItem.city_name_si
                              : cityItem.city_name_en}
                          </option>
                        ))
                      ) : (
                        <option value="">{t("select_district_first")}</option>
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
                    {t("search_map_label")}
                  </Label>
                  <input
                    ref={searchInputRef}
                    type="text"
                    id="searchLocation"
                    placeholder={t("search_map_placeholder")}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
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
                    <span>{t("search_map_help_text")}</span>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="googleMapLink"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    {t("google_map_link_label")}
                  </Label>
                  <input
                    type="text"
                    name="googleMapLink"
                    value={formData.googleMapLink}
                    onChange={handleInputChange}
                    placeholder={t("google_map_link_placeholder")}
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
                {t("back_button")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || isFetchingOrgData}
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
                    {t("submitting_button")}
                  </>
                ) : (
                  t("submit_button")
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
                {t("modal_title_success")}
              </p>
            </Modal.Header>
            <Modal.Body>
              <p className="text-lg text-gray-700">
                {t("modal_message_success_part1")}{" "}
                {t("modal_message_success_part2")}
              </p>
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default StepTwelve;