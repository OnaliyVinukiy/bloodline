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
import { validatePhoneNumber } from "../../../utils/ValidationsUtils";
import { ValidationModal } from "../../../components/ValidationModal";
import { useTranslation } from "react-i18next";

const StepOne: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  const { t } = useTranslation("donorRegistration");
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<{ [key in keyof BloodDonor]?: string }>(
    {}
  );
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showValidationModal, setShowValidationModal] = useState(false);
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

  //Structure for donor information
  const [donor, setDonor] = useState<BloodDonor>({
    nic: "",
    fullName: "",
    email: user?.email || "",
    contactNumber: "",
    contactNumberHome: "",
    contactNumberOffice: "",
    province: "",
    district: "",
    city: "",
    address: "",
    addressOffice: "",
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

  //Fetch cities list
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

  //Handle input change
  const handleInputChange = (field: keyof BloodDonor, value: string) => {
    if (donor) {
      setDonor((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

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
  const [validationModalContent, setValidationModalContent] = useState({
    title: "",
    content: "",
  });
  const showValidationMessage = (title: string, content: string) => {
    setValidationModalContent({ title, content });
    setShowValidationModal(true);
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

  // Handle phone number validation
  const handlePhoneNumberFieldChange = (
    field: keyof BloodDonor,
    value: string
  ) => {
    const isValid = validatePhoneNumber(value);

    setErrors((prev) => ({
      ...prev,
      [field]: isValid ? "" : t(`error_invalid_${field}`),
    }));

    handleInputChange(field, value);
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

      alert("Avatar updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error updating avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  //Save donor information to the form data
  const handleNext = async () => {
    // Check if necessary fields are filled
    const newErrors: { [key in keyof BloodDonor]?: string } = {};

    if (!donor.nic) newErrors.nic = t("error_nic_required");
    if (!donor.fullName) newErrors.fullName = t("error_full_name_required");
    if (!donor.email) newErrors.email = t("error_email_required");
    if (!donor.contactNumber)
      newErrors.contactNumber = t("error_contact_number_required");
    if (
      donor.contactNumberHome &&
      !validatePhoneNumber(donor.contactNumberHome)
    ) {
      newErrors.contactNumberHome = t("error_invalid_home_number");
    }

    if (
      donor.contactNumberOffice &&
      !validatePhoneNumber(donor.contactNumberOffice)
    ) {
      newErrors.contactNumberOffice = t("error_invalid_office_number");
    }
    if (!validatePhoneNumber(donor.contactNumber)) {
      newErrors.contactNumber = t("error_invalid_mobile_number");
    }
    if (!donor.address) newErrors.address = t("error_address_required");
    if (!donor.birthdate) newErrors.birthdate = t("error_birthdate_required");
    if (!donor.bloodGroup) newErrors.bloodGroup = t("error_blood_group_required");
    if (!donor.gender) newErrors.gender = t("error_gender_required");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrorMessage(true);
      return;
    }

    setErrors({});
    setShowErrorMessage(false);
    setIsNextLoading(true);

    try {
      // Check if donor exists by NIC
      try {
        const { data: existingDonor } = await axios.get(
          `${backendURL}/api/donor/nic/${donor.nic}`
        );

        if (existingDonor && existingDonor.status === "Deferred") {
          showValidationMessage(
            t("validation_title_deferral"),
            t("validation_content_deferral")
          );
          return;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status !== 404) {
            throw error;
          }
        } else {
          throw error;
        }
      }

      // Calculate age if not already set
      const age = calculateAge(donor.birthdate);
      const donorWithAge = { ...donor, age };
      if (age < 18) {
        showValidationMessage(
          t("validation_title_age"),
          t("validation_content_age")
        );
        return;
      }

      try {
        // Check if donor exists by email
        await axios.get(`${backendURL}/api/donor/${user?.email}`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            await axios.post(`${backendURL}/api/update-donor`, donorWithAge);
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }

      // Update form data and proceed to next step
      onFormDataChange({
        ...formData,
        donorInfo: donorWithAge,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      onNextStep();
    } catch (error) {
      console.error("Error handling donor data:", error);
      alert(t("error_saving_data"));
    } finally {
      setIsNextLoading(false);
    }
  };

  //Loading animation
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
                    {t("change_avatar")}
                  </button>
                  {selectedFile && (
                    <button
                      onClick={handleAvatarUpdate}
                      className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      disabled={isUploading}
                    >
                      {isUploading ? t("uploading_avatar") : t("upload_avatar")}
                    </button>
                  )}
                </div>
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
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  required
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
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
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  disabled
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
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
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
                {errors.nic && (
                  <p className="text-red-500 text-xs mt-1">{errors.nic}</p>
                )}
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
                    className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <Label
                    htmlFor="male"
                    className="mr-4 text-sm text-indigo-900"
                  >
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
                    className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <Label htmlFor="female" className="text-sm text-indigo-900">
                    {t("gender_female")}
                  </Label>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>
              {/* Provinces, District and Cities Section */}
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
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    onChange={handleProvinceChange}
                  >
                    <option value="">{t("select_province_placeholder")}</option>
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
                    {t("district_label")}
                  </Label>
                  <select
                    id="district"
                    value={donor.district}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    onChange={handleDistrictChange}
                  >
                    <option value="">{t("select_district_placeholder")}</option>
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
                      <option value="">{t("select_province_first")}</option>
                    )}
                  </select>
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
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    onChange={handleCityChange}
                  >
                    <option value="">{t("select_city_placeholder")}</option>
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
                      <option value="">{t("select_district_first")}</option>
                    )}
                  </select>
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
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("address_office_label")}
                </Label>
                <input
                  type="text"
                  value={donor?.addressOffice || ""}
                  onChange={(e) =>
                    handleInputChange("addressOffice", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
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
                  onChange={(e) =>
                    handlePhoneNumberFieldChange(
                      "contactNumber",
                      e.target.value
                    )
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactNumber}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("contact_home_label")}
                </Label>
                <input
                  type="text"
                  value={donor?.contactNumberHome || ""}
                  onChange={(e) =>
                    handlePhoneNumberFieldChange(
                      "contactNumberHome",
                      e.target.value
                    )
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
                {errors.contactNumberHome && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactNumberHome}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("contact_office_label")}
                </Label>
                <input
                  type="text"
                  value={donor?.contactNumberOffice || ""}
                  onChange={(e) =>
                    handlePhoneNumberFieldChange(
                      "contactNumberOffice",
                      e.target.value
                    )
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
                {errors.contactNumberOffice && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactNumberOffice}
                  </p>
                )}
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
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                >
                  <option value="">{t("select_blood_group_placeholder")}</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodGroup && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.bloodGroup}
                  </p>
                )}
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
                {errors.birthdate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.birthdate}
                  </p>
                )}
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
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    disabled
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
                {showErrorMessage && (
                  <p className="text-red-500 text-sm mt-2">
                    {t("validation_error_fields")}
                  </p>
                )}

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
          <ValidationModal
            show={showValidationModal}
            onClose={() => setShowValidationModal(false)}
            title={validationModalContent.title}
            content={validationModalContent.content}
          />
        </main>
      </div>
    </div>
  );
};

export default StepOne;