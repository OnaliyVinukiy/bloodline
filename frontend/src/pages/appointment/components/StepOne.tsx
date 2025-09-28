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
import { UserIcon } from "@heroicons/react/24/solid";
import { StepperProps } from "../../../types/stepper";
import { BloodDonor, User } from "../../../types/users";
import { useAuthContext } from "@asgardeo/auth-react";
import { useTranslation } from "react-i18next";

const StepOne: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  const { t, i18n } = useTranslation("donorRegistration");
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);

  const [isNextLoading, setIsNextLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [province, setProvince] = useState<
    {
      province_id: string;
      province_name_si: string;
      province_name_en: string;
    }[]
  >([]);

  const [district, setDistrict] = useState<
    {
      district_id: string;
      district_name_si: string;
      district_name_en: string;
    }[]
  >([]);

  const [city, setCity] = useState<
    { city_id: string; city_name_en: string; city_name_si: string }[]
  >([]);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const [donor, setDonor] = useState<BloodDonor>({
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

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  // Fetch Provinces
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

  // Fetch Districts
  const fetchDistricts = async (provinceNameEn: string) => {
    try {
      const response = await fetch(
        `${backendURL}/api/districts/province-name/${provinceNameEn}`
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

  // Fetch Cities
  const fetchCities = async (districtNameEn: string) => {
    try {
      const response = await fetch(
        `${backendURL}/api/city/district/${districtNameEn}`
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
    const selectedProvinceEn = event.target.value;
    setDonor((prev) => ({
      ...prev,
      province: selectedProvinceEn,
      district: "",
      city: "",
    }));
    setDistrict([]);
    setCity([]);
    if (selectedProvinceEn) {
      fetchDistricts(selectedProvinceEn);
    }
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDistrictEn = event.target.value;
    setDonor((prev) => ({ ...prev, district: selectedDistrictEn, city: "" }));
    setCity([]);
    if (selectedDistrictEn) {
      fetchCities(selectedDistrictEn);
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityEn = event.target.value;
    setDonor((prev) => ({ ...prev, city: selectedCityEn }));
  };

  const handleInputChange = (field: keyof BloodDonor, value: string) => {
    if (donor) {
      setDonor((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  // Core logic: Fetch Donor Data
  useEffect(() => {
    const fetchUserInfoAndDonorData = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          const { data: userInfo } = await axios.post(
            `${backendURL}/api/user-info`,
            { accessToken },
            { headers: { "Content-Type": "application/json" } }
          );

          setUser(userInfo);

          // Fetch donor data using the email
          const { data: donorInfo } = await axios.get(
            `${backendURL}/api/donor/${userInfo.email}`
          );

          if (donorInfo) {
            setDonor(donorInfo);

            // Fetch dependent data for display
            if (donorInfo.province) {
              fetchDistricts(donorInfo.province);
            }
            if (donorInfo.district) {
              fetchCities(donorInfo.district);
            }
          }
        } catch (error) {
          console.error("Error fetching user/donor info:", error);
          // Handle case where donor might not exist if they completed step 0 without filling data
          // but since they are already registered, we expect data to be there or handle gracefully.
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserInfoAndDonorData();
  }, [state?.isAuthenticated, getAccessToken, backendURL]);

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

  const handleNext = async () => {
    setIsNextLoading(true);

    try {
      const age = calculateAge(donor.birthdate);
      const donorWithAge = { ...donor, age };

      // Simply pass the fetched donor data to the next step's form data
      onFormDataChange({
        ...formData,
        donorInfo: donorWithAge,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
      onNextStep();
    } catch (error) {
      console.error("Error preparing donor data for next step:", error);
      alert(t("error_saving_data"));
    } finally {
      setIsNextLoading(false);
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
        <p className="text-lg text-gray-700">{t("login_message")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center items-center bg-gray-100">
        <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <div className="mt-4 space-y-6">
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

                {/* Removed Avatar input and buttons */}
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
                  value={donor?.fullName || ""}
                  // Kept onChange for completeness but fields are disabled
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                  required
                  disabled // <--- DISABLED
                />
                {/* Removed: {errors.fullName && ...} */}
              </div>
              <div className="w-full">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  {t("email_label")}
                </Label>
                <input
                  type="email"
                  value={user.email}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                  disabled // <--- DISABLED
                />
                {/* Removed: {errors.email && ...} */}
              </div>

              <div className="w-full">
                <Label
                  htmlFor="nic"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  {t("nic_label")}
                </Label>
                <input
                  type="text"
                  value={donor?.nic || ""}
                  onChange={(e) => handleInputChange("nic", e.target.value)}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                  disabled // <--- DISABLED
                />
                {/* Removed: {errors.nic && ...} */}
              </div>

              <div className="w-full">
                <Label
                  htmlFor="gender"
                  className="mt-1 block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("gender_label")}
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
                    className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500 cursor-not-allowed"
                    disabled // <--- DISABLED
                  />
                  <Label htmlFor="male" className="mr-4 text-sm text-gray-900">
                    {t("gender_male")}
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
                    className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500 cursor-not-allowed"
                    disabled // <--- DISABLED
                  />
                  <Label htmlFor="female" className="text-sm text-gray-900">
                    {t("gender_female")}
                  </Label>
                  {/* Removed: {errors.gender && ...} */}
                </div>
              </div>
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
                    value={donor.province}
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                    onChange={handleProvinceChange}
                    disabled // <--- DISABLED
                  >
                    <option value="">{t("select_province_placeholder")}</option>
                    {province.map((prov) => (
                      <option
                        key={prov.province_id}
                        value={prov.province_name_en}
                      >
                        {i18n.language === "si"
                          ? prov.province_name_si
                          : prov.province_name_en}
                      </option>
                    ))}
                  </select>
                  {/* Removed: {errors.province && ...} */}
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
                    value={donor.district}
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                    onChange={handleDistrictChange}
                    disabled // <--- DISABLED
                  >
                    <option value="">{t("select_district_placeholder")}</option>
                    {district.length > 0 ? (
                      district.map((districtItem) => (
                        <option
                          key={districtItem.district_id}
                          value={districtItem.district_name_en}
                        >
                          {i18n.language === "si"
                            ? districtItem.district_name_si
                            : districtItem.district_name_en}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {t("select_province_first")}
                      </option>
                    )}
                  </select>
                  {/* Removed: {errors.district && ...} */}
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
                    value={donor.city}
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                    onChange={handleCityChange}
                    disabled // <--- DISABLED
                  >
                    <option value="">{t("select_city_placeholder")}</option>
                    {city.length > 0 ? (
                      city.map((cityItem) => (
                        <option
                          key={cityItem.city_id}
                          value={cityItem.city_name_en}
                        >
                          {i18n.language === "si"
                            ? cityItem.city_name_si
                            : cityItem.city_name_en}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {t("select_district_first")}
                      </option>
                    )}
                  </select>
                  {/* Removed: {errors.city && ...} */}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("address_home_label")}
                </Label>
                <input
                  type="text"
                  value={donor?.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                  disabled // <--- DISABLED
                />
                {/* Removed: {errors.address && ...} */}
              </div>

              <div className="w-full">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("contact_mobile_label")}
                </Label>
                <input
                  type="text"
                  value={donor?.contactNumber || ""}
                  // Using handleInputChange instead of handlePhoneNumberFieldChange
                  onChange={(e) =>
                    handleInputChange("contactNumber", e.target.value)
                  }
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                  disabled // <--- DISABLED
                />
                {/* Removed: {errors.contactNumber && ...} */}
              </div>

              <div>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("blood_group_label")}
                </Label>
                <select
                  value={donor?.bloodGroup || ""}
                  onChange={(e) =>
                    handleInputChange("bloodGroup", e.target.value)
                  }
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                  disabled // <--- DISABLED
                >
                  <option value="">
                    {t("select_blood_group_placeholder")}
                  </option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {/* Removed: {errors.bloodGroup && ...} */}
              </div>

              <div>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("birthdate_label")}
                </Label>
                <Datepicker
                  value={
                    donor?.birthdate ? new Date(donor.birthdate) : undefined
                  }
                  onChange={(date: Date | null) => {
                    if (date) {
                      const offsetDate = new Date(date);
                      offsetDate.setMinutes(offsetDate.getMinutes() + 330);

                      const formattedDate =
                        offsetDate.toLocaleDateString("en-CA");
                      handleInputChange("birthdate", formattedDate);
                    } else {
                      handleInputChange("birthdate", "");
                    }
                  }}
                  maxDate={new Date()}
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                  disabled // <--- DISABLED
                />
                {/* Removed: {errors.birthdate && ...} */}
              </div>

              {donor?.birthdate && (
                <div>
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    {t("age_label")}
                  </Label>
                  <input
                    type="text"
                    value={calculateAge(donor.birthdate)}
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 cursor-not-allowed"
                    disabled // <--- DISABLED
                  />
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
                >
                  {t("back_button")}
                </button>
                {/* Removed: {showErrorMessage && ...} */}

                <button
                  onClick={handleNext}
                  disabled={isNextLoading}
                  className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-red-500 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300"
                >
                  {isNextLoading ? (
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
                      {t("loading_button")}
                    </>
                  ) : (
                    t("next_button")
                  )}
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
