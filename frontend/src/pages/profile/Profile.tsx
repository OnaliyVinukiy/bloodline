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
import { User, Donor, BloodDonor } from "../../types/users";
import { validateNIC, validatePhoneNumber } from "../../utils/ValidationsUtils";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { ValidationModal } from "../../components/ValidationModal";

export default function Profile() {
  const { t } = useTranslation(["profile", "profilePage", "common"]);
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showAvatarUpdateModel, setShowAvatarUpdateModel] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [otp, setOtp] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof BloodDonor]?: string }>(
    {}
  );
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

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
    isSubscribed: false,
    maskedNumber: "",
  });

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showProfileIncompleteModal, setShowProfileIncompleteModal] =
    useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showValidationModal, setShowValidationModal] = useState(false);

  const handlePhoneNumberChange = (value: string) => {
    // Also update errors for immediate feedback
    const isValid = validatePhoneNumber(value);
    setErrors((prev) => ({
      ...prev,
      contactNumber: isValid ? "" : t("error_invalid_mobile_number"),
    }));
    handleInputChange("contactNumber", value);
  };

  // New handler for NIC input
  const handleNICChange = (value: string) => {
    handleInputChange("nic", value);
    // Clear NIC error immediately on change for responsiveness
    setErrors((prev) => ({ ...prev, nic: "" }));
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

  const transformPhoneNumber = (phone: string): string => {
    if (phone.startsWith("0")) {
      return "94" + phone.substring(1);
    }
    return phone;
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

          setDonor((prev) => ({
            ...prev,
            email: userInfo.email || "",
          }));

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

  // Effect to re-translate and re-evaluate errors when language/donor data changes
  useEffect(() => {
    // Only run this if there are existing errors
    if (
      Object.keys(errors).length > 0 &&
      !Object.values(errors).every((e) => e === "")
    ) {
      const recheckErrors: { [key in keyof BloodDonor]?: string } = {};

      // Recalculate required field errors
      if (!donor.fullName)
        recheckErrors.fullName = t("error_full_name_required");
      // Email is from user, assumed present, but check for safety
      if (!donor.email) recheckErrors.email = t("error_email_required");
      if (!donor.contactNumber)
        recheckErrors.contactNumber = t("error_contact_number_required");
      if (!donor.province)
        recheckErrors.province = t("error_province_required");
      if (!donor.district)
        recheckErrors.district = t("error_district_required");
      if (!donor.city) recheckErrors.city = t("error_city_required");
      if (!donor.address) recheckErrors.address = t("error_address_required");
      if (!donor.birthdate)
        recheckErrors.birthdate = t("error_birthdate_required");
      if (!donor.bloodGroup)
        recheckErrors.bloodGroup = t("error_blood_group_required");
      if (!donor.gender) recheckErrors.gender = t("error_gender_required");

      // Re-validate and re-translate NIC error
      if (donor.nic) {
        const nicValidationResult = validateNIC(
          donor.nic,
          donor.birthdate,
          donor.gender
        );
        if (nicValidationResult !== true) {
          recheckErrors.nic = t(nicValidationResult as string);
        }
      } else if (errors.nic) {
        recheckErrors.nic = t("error_nic_required");
      }

      // Re-validate and re-translate Phone Number Validations
      if (donor.contactNumber && !validatePhoneNumber(donor.contactNumber)) {
        recheckErrors.contactNumber = t("error_invalid_mobile_number");
      }
      // Note: No need for an else if here, as the required check is above.

      setErrors(recheckErrors);
    }
  }, [
    i18n.language,
    donor.nic,
    donor.birthdate,
    donor.gender,
    donor.contactNumber,
    t,
  ]);

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
    setDonor((prev) => ({
      ...prev,
      province: selectedProvince,
      district: "",
      city: "",
    }));
    setDistrict([]);
    setCity([]);
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    }
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDistrict = event.target.value;
    setDonor((prev) => ({ ...prev, district: selectedDistrict, city: "" }));
    setCity([]);
    if (selectedDistrict) {
      fetchCities(selectedDistrict);
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = event.target.value;
    setDonor((prev) => ({ ...prev, city: selectedCity }));
  };

  const handleRequestOtp = async () => {
    if (!donor.contactNumber) {
      showValidationMessage(
        t("validation_missing_phone", { ns: "profilePage" }),
        t("validation_missing_phone_content", { ns: "profilePage" })
      );
      return;
    }

    if (!validatePhoneNumber(donor.contactNumber)) {
      showValidationMessage(
        t("validation_invalid_phone", { ns: "profilePage" }),
        t("validation_invalid_phone_content", { ns: "profilePage" })
      );
      return;
    }

    setIsRequestingOtp(true);
    try {
      const transformedPhone = transformPhoneNumber(donor.contactNumber);

      const response = await axios.post(
        `${backendURL}/subscription/request-otp`,
        {
          phone: transformedPhone,
        }
      );

      if (response.data.success) {
        setSubscriptionId(response.data.subscriptionId);
        setSubscriptionStatus("otp_sent");
      } else {
        setSubscriptionStatus("error");
        console.error("Failed to send OTP:", response.data.error);
      }
    } catch (error) {
      setSubscriptionStatus("error");
      console.error("Error requesting OTP:", error);
    } finally {
      setIsRequestingOtp(false);
    }
  };
  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      const transformedPhone = transformPhoneNumber(donor.contactNumber);
      const response = await axios.post(
        `${backendURL}/subscription/verify-otp`,
        {
          phone: transformedPhone,
          otp: otp,
          subscriptionId: subscriptionId,
          email: donor.email, // Add email to the request
        }
      );

      if (response.data.success) {
        setSubscriptionStatus("success");

        const updatedDonor = {
          ...donor,
          isSubscribed: true,
          maskedNumber: response.data.maskedNumber, // Use the masked number from response
        };

        setDonor(updatedDonor);

        await axios.post(`${backendURL}/api/update-donor`, updatedDonor);
      } else {
        setSubscriptionStatus("error");
      }
    } catch (error) {
      setSubscriptionStatus("error");
      console.error("Error verifying OTP:", error);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsUnsubscribing(true);
    try {
      const response = await axios.post(
        `${backendURL}/subscription/unsubscribe`,
        {
          email: donor.email,
        }
      );

      if (response.data.success) {
        const updatedDonor = {
          ...donor,
          isSubscribed: false,
          maskedNumber: "",
        };
        setDonor(updatedDonor);

        setShowUnsubscribeModal(false);
        showValidationMessage(
          t("unsub_success_title", { ns: "profilePage" }),
          t("unsub_success_content", { ns: "profilePage" })
        );
      } else {
        showValidationMessage(
          t("unsub_fail_title", { ns: "profilePage" }),
          response.data.error
        );
      }
    } catch (error) {
      console.error("Error during unsubscription:", error);
      showValidationMessage(
        t("unsub_fail_title", { ns: "profilePage" }),
        t("unsub_fail_content_generic", { ns: "profilePage" })
      );
    } finally {
      setIsUnsubscribing(false);
    }
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

  // Handle file selection for avatar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

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

      setDonor((prev) => ({ ...prev, avatar: data.avatarUrl }));

      setShowAvatarUpdateModel(true);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert(t("error_updating_profile_alert", { ns: "profile" }));
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

    const age = calculateAge(donor.birthdate);
    const newErrors: { [key in keyof BloodDonor]?: string } = {};

    // --- Validation Logic (Copied and adapted from StepOne) ---
    if (!donor.fullName) newErrors.fullName = t("error_full_name_required");
    if (!donor.email) newErrors.email = t("error_email_required");
    if (!donor.contactNumber)
      newErrors.contactNumber = t("error_contact_number_required");
    if (!donor.province) newErrors.province = t("error_province_required");
    if (!donor.district) newErrors.district = t("error_district_required");
    if (!donor.city) newErrors.city = t("error_city_required");
    if (!donor.address) newErrors.address = t("error_address_required");
    if (!donor.birthdate) newErrors.birthdate = t("error_birthdate_required");
    if (!donor.bloodGroup)
      newErrors.bloodGroup = t("error_blood_group_required");
    if (!donor.gender) newErrors.gender = t("error_gender_required");

    if (!donor.nic) {
      newErrors.nic = t("error_nic_required");
    } else {
      const nicValidationResult = validateNIC(
        donor.nic,
        donor.birthdate,
        donor.gender
      );
      if (nicValidationResult !== true) {
        newErrors.nic = t(nicValidationResult as string);
      }
    }

    if (donor.contactNumber && !validatePhoneNumber(donor.contactNumber)) {
      newErrors.contactNumber = t("error_invalid_mobile_number");
    }

    setErrors(newErrors);

    // Check if there are ANY validation errors in the `newErrors` object
    const hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) {
      setShowErrorMessage(true); // <--- THIS LINE WAS MISSING OR INEFFECTIVE
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Clear generic error message if validation passed
    setShowErrorMessage(false);
    // --- End Validation Logic ---

    if (age < 18) {
      showValidationMessage(
        t("age_restriction_title", { ns: "profile" }),
        t("age_restriction_content", { ns: "profile" })
      );
      return;
    }

    // The explicit phone check here is redundant if validation logic above is correct,
    // but kept for flow consistency if the user somehow bypassed the input handler logic.
    /*
    if (!validatePhoneNumber(donor.contactNumber)) {
      showValidationMessage(
        t("contact_number_invalid_title", { ns: "profile" }),
        t("contact_number_invalid_content", { ns: "profile" })
      );
      return;
    }
    */

    try {
      setLoading(true);

      // NIC uniqueness check (adapted from StepOne)
      try {
        const { data: existingDonor } = await axios.get(
          `${backendURL}/api/donor/nic/${donor.nic}`
        );

        // Check if an existing donor with the NIC is found, and it's not the current user
        if (existingDonor && existingDonor.email !== user.email) {
          showValidationMessage(
            t("already_registered_title", { ns: "profile" }),
            t("already_registered_content", { ns: "profile" })
          );
          setLoading(false);
          return;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status !== 404) {
            throw error; // Re-throw if it's not a 404 (Donor not found is expected)
          }
        } else {
          throw error;
        }
      }

      const { _id, ...donorData } = donor;

      const payload = {
        ...donorData,
        age, // Add calculated age to payload
        // The original code was transforming the contact number here, which might be incorrect
        // as the number should likely be stored in the format given by the user (e.g., 0xxxxxxxxx)
        // unless the backend explicitly requires the international format (94xxxxxxxxx).
        // Sticking to the format from StepOne (transforming mobile number on send) for consistency.
        // For the profile update, let's stick to the current value unless we explicitly want to transform it here.
        // The original code transformed it, so keeping that as the intention.
        contactNumber: transformPhoneNumber(donorData.contactNumber),
      };

      await axios.post(`${backendURL}/api/update-donor`, payload);
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
          {t("login_message", { ns: "profile" })}
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
                {t("complete_profile_modal_content", { ns: "profile" })}
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <p className="text-yellow-700">
                {t("registered_message", { ns: "profile" })}
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
                  {t("change_avatar", { ns: "profile" })}
                </button>
                {selectedFile && (
                  <button
                    onClick={handleAvatarUpdate}
                    className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    disabled={isUploading}
                  >
                    {isUploading
                      ? t("uploading", { ns: "profile" })
                      : t("upload", { ns: "profile" })}
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
                  {t("first_name_label", { ns: "profile" })}
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
                  {t("last_name_label", { ns: "profile" })}
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
                  {t("email_label", { ns: "profile" })}
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
                {t("full_name_label", { ns: "profile" })}
              </Label>
              <input
                type="text"
                value={donor?.fullName || ""}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.fullName, { ns: "profile" })}
                </p>
              )}
            </div>
            <div className="flex space-x-6 mb-6">
              <div className="w-3/4">
                <Label
                  htmlFor="nic"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  {t("nic_label", { ns: "profile" })}
                </Label>
                <input
                  type="text"
                  value={donor?.nic || ""}
                  onChange={(e) => handleNICChange(e.target.value)}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
                {/* NIC Error Message */}
                {errors.nic && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(errors.nic, { ns: "profile" })}
                  </p>
                )}
              </div>

              <div className="w-3/4">
                <Label
                  htmlFor="gender"
                  className="mt-1 block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("gender_label", { ns: "profile" })}
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
                    {t("gender_male", { ns: "profile" })}
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
                    {t("gender_female", { ns: "profile" })}
                  </Label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(errors.gender, { ns: "profile" })}
                  </p>
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
                  {t("province_label", { ns: "profile" })}
                </Label>
                <select
                  id="province"
                  value={donor.province}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  onChange={handleProvinceChange}
                >
                  <option value="">
                    {t("select_province", { ns: "profile" })}
                  </option>
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
                    {t(errors.province, { ns: "profile" })}
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/3">
                <Label
                  htmlFor="district"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("district_label", { ns: "profile" })}
                </Label>
                <select
                  id="district"
                  value={donor.district}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  onChange={handleDistrictChange}
                  disabled={!donor.province}
                >
                  <option value="">
                    {t("select_district", { ns: "profile" })}
                  </option>
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
                    <option value="" disabled>
                      {t("select_province_first", { ns: "profile" })}
                    </option>
                  )}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(errors.district, { ns: "profile" })}
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/3">
                <Label
                  htmlFor="city"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("city_label", { ns: "profile" })}
                </Label>
                <select
                  id="city"
                  value={donor.city}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  onChange={handleCityChange}
                  disabled={!donor.district}
                >
                  <option value="">
                    {t("select_city", { ns: "profile" })}
                  </option>
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
                    <option value="" disabled>
                      {t("select_district_first", { ns: "profile" })}
                    </option>
                  )}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(errors.city, { ns: "profile" })}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                {t("address_label", { ns: "profile" })}
              </Label>
              <input
                type="text"
                value={donor?.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.address, { ns: "profile" })}
                </p>
              )}
            </div>

            <div className="mb-2 sm:mb-6">
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                {" "}
                {t("contact_number_label", { ns: "profile" })}
              </Label>
              <input
                type="text"
                value={donor?.contactNumber || ""}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                className={`bg-indigo-50 border ${
                  errors.contactNumber ? "border-red-500" : "border-indigo-300"
                } text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
              />
              {/* Phone Number Error Message */}
              {errors.contactNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.contactNumber, { ns: "profile" })}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                {t("blood_group_label", { ns: "profile" })}
              </Label>
              <select
                value={donor?.bloodGroup || ""}
                onChange={(e) =>
                  handleInputChange("bloodGroup", e.target.value)
                }
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              >
                <option value="">
                  {t("select_blood_group", { ns: "profile" })}
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
              {errors.bloodGroup && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.bloodGroup, { ns: "profile" })}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                {t("date_of_birth_label", { ns: "profile" })}
              </Label>
              <Datepicker
                value={donor?.birthdate ? new Date(donor.birthdate) : undefined}
                onChange={(date) => {
                  if (date) {
                    const offsetDate = new Date(date);
                    // Adjust for local time zone offset to get a clean 'YYYY-MM-DD' on the backend
                    // Assuming the original '330' offset logic is correct for GMT+5:30 (Sri Lanka)
                    offsetDate.setMinutes(offsetDate.getMinutes() + 330);

                    const formattedDate =
                      offsetDate.toLocaleDateString("en-CA"); // 'en-CA' gives YYYY-MM-DD
                    handleInputChange("birthdate", formattedDate);
                  } else {
                    handleInputChange("birthdate", "");
                  }
                }}
                maxDate={new Date()}
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              />
              {errors.birthdate && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.birthdate, { ns: "profile" })}
                </p>
              )}
            </div>

            {donor?.birthdate && (
              <div>
                <Label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("age_label", { ns: "profile" })}
                </Label>
                <input
                  type="text"
                  value={calculateAge(donor.birthdate)}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  disabled
                />
              </div>
            )}
            {/* Subscription Section */}
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="text-lg font-medium text-indigo-900 mb-4">
                {t("sms_notifications_title", { ns: "profilePage" })}
              </h3>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="sms-subscription"
                  checked={donor.isSubscribed}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setShowSubscriptionModal(true);
                    } else {
                      setShowUnsubscribeModal(true);
                    }
                  }}
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <Label
                  htmlFor="sms-subscription"
                  className="text-sm text-indigo-900"
                >
                  {t("subscription_checkbox_label", { ns: "profilePage" })}
                </Label>
              </div>

              {donor.isSubscribed && donor.maskedNumber && (
                <p className="text-sm text-green-600">
                  {t("subscribed_message", { ns: "profilePage" })}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              {/* General Validation Error Message at the bottom */}
              {showErrorMessage && (
                <p className="text-red-500 text-sm mt-2">
                  {t("validation_error_fields", { ns: "profile" })}
                </p>
              )}
              <div className="flex justify-end w-full">
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
                      {t("updating_status", { ns: "profile" })}
                    </>
                  ) : isProfileComplete ? (
                    t("update_profile", { ns: "profile" })
                  ) : (
                    t("complete_profile", { ns: "profile" })
                  )}
                </button>
              </div>
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
            {t("registered_successfully_title", { ns: "profile" })}
          </p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            {t("registered_successfully_content", { ns: "profile" })}
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            color="failure"
            onClick={() => setShowRegistrationModal(false)}
          >
            {t("ok_button", { ns: "profile" })}
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
            {t("details_updated_successfully_title", { ns: "profile" })}
          </p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            {t("details_updated_successfully_content", { ns: "profile" })}
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={() => setShowUpdateModal(false)}>
            {t("ok_button", { ns: "profile" })}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showErrorModal} onClose={() => setErrorModal(false)}>
        <Modal.Header>{t("error_modal_title", { ns: "profile" })}</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            {t("error_modal_content", { ns: "profile" })}
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={() => setErrorModal(false)}>
            {t("ok_button", { ns: "profile" })}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Profile Completion Modal */}
      <Modal
        show={showProfileIncompleteModal}
        onClose={() => setShowProfileIncompleteModal(false)}
      >
        <Modal.Header>
          {t("complete_profile_modal_title", { ns: "profile" })}
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            {t("complete_profile_modal_content", { ns: "profile" })}
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            color="failure"
            onClick={() => setShowProfileIncompleteModal(false)}
          >
            {t("ok_button", { ns: "profile" })}
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
            {t("uploaded_successfully_title", { ns: "profile" })}
          </p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            {t("uploaded_successfully_content", { ns: "profile" })}
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            color="failure"
            onClick={() => setShowAvatarUpdateModel(false)}
          >
            {t("ok_button", { ns: "profile" })}
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

      {/* Subscription Modal */}
      <Modal
        show={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      >
        <Modal.Header>
          {t("subscribe_modal_title", { ns: "profilePage" })}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {subscriptionStatus === "" && (
              <>
                <p className="text-gray-700">
                  {t("subscribe_modal_phone_prefix", { ns: "profilePage" })}{" "}
                  {donor.contactNumber}
                </p>
                <Button
                  onClick={handleRequestOtp}
                  disabled={isRequestingOtp}
                  className="w-full"
                >
                  {isRequestingOtp
                    ? t("sending_otp", { ns: "profilePage" })
                    : t("request_otp_button", { ns: "profilePage" })}
                </Button>
              </>
            )}

            {subscriptionStatus === "otp_sent" && (
              <>
                <p className="text-gray-700">
                  {t("otp_sent_message", { ns: "profilePage" })}
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={t("otp_placeholder", { ns: "profilePage" })}
                  className="w-full p-2 border rounded"
                />
                <Button
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || otp.length < 4}
                  className="w-full"
                >
                  {isVerifyingOtp
                    ? t("verifying_otp", { ns: "profilePage" })
                    : t("verify_otp_button", { ns: "profilePage" })}
                </Button>
              </>
            )}

            {subscriptionStatus === "success" && (
              <div className="text-green-600 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p>
                  {t("subscription_success_message", { ns: "profilePage" })}
                </p>
              </div>
            )}

            {subscriptionStatus === "error" && (
              <div className="text-red-600 text-center">
                <p>{t("subscription_fail_message", { ns: "profilePage" })}</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {subscriptionStatus === "success" && (
            <Button onClick={() => setShowSubscriptionModal(false)}>
              {t("close_button", { ns: "profilePage" })}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {/* Unsubscribe Confirmation Modal */}
      <Modal
        show={showUnsubscribeModal}
        onClose={() => setShowUnsubscribeModal(false)}
      >
        <Modal.Header>
          {t("unsubscribe_modal_title", { ns: "profilePage" })}
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            {t("unsubscribe_confirm_message", { ns: "profilePage" })}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t("unsubscribe_warning_message", { ns: "profilePage" })}
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end space-x-4">
          <Button color="gray" onClick={() => setShowUnsubscribeModal(false)}>
            {t("cancel_button", { ns: "profilePage" })}
          </Button>
          <Button
            color="failure"
            onClick={handleUnsubscribe}
            disabled={isUnsubscribing}
          >
            {isUnsubscribing
              ? t("unsubscribing", { ns: "profilePage" })
              : t("unsubscribe_button", { ns: "profilePage" })}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
