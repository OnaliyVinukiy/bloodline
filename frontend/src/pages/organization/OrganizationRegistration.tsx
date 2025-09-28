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
import { User, Organization } from "../../types/users";
import { ValidationModal } from "../../components/ValidationModal";
import { validatePhoneNumber } from "../../utils/ValidationsUtils";
import { useTranslation } from "react-i18next";

const OrganizationRegistration = () => {
  const { t } = useTranslation(["organization", "profilePage", "common"]);
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [isOrgPhoneNumberValid, setIsOrgPhoneNumberValid] = useState(true);

  // Subscription states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [otp, setOtp] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  const [organization, setOrganization] = useState<Organization>({
    organizationName: "",
    organizationEmail: "",
    repFullName: "",
    repEmail: user?.email || "",
    repNIC: "",
    repGender: "",
    orgContactNumber: "",
    repContactNumber: "",
    avatar: "",
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

  const handleRepContactNumber = (value: string) => {
    setIsPhoneNumberValid(validatePhoneNumber(value));
    handleInputChange("repContactNumber", value);
  };

  const handleOrgContactNumber = (value: string) => {
    setIsOrgPhoneNumberValid(validatePhoneNumber(value));
    handleInputChange("orgContactNumber", value);
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

  // Fetch donor and organization info
  const fetchDonorInfo = async () => {
    if (user) {
      try {
        setIsLoading(true);
        // Fetch donor info using the user's email
        const { data: donorInfo } = await axios.get(
          `${backendURL}/api/donor/${user.email}`
        );

        if (donorInfo) {
          // If donor exists and has a masked number, automatically set subscription
          if (donorInfo.maskedNumber) {
            setOrganization((prev) => ({
              ...prev,
              isSubscribed: true,
              maskedNumber: donorInfo.maskedNumber,
            }));
          }
        }

        const { data: orgInfo } = await axios.get(
          `${backendURL}/api/organizations/organization/${user.email}`
        );

        if (orgInfo) {
          setOrganization(orgInfo);
          setIsProfileComplete(true);
        }
      } catch (error) {
        console.error("Error fetching donor:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Subscription functions
  const handleRequestOtp = async () => {
    if (!organization.orgContactNumber) {
      showValidationMessage(
        t("validation_missing_phone", { ns: "profilePage" }),
        t("validation_missing_phone_content", { ns: "profilePage" })
      );
      return;
    }

    if (!validatePhoneNumber(organization.orgContactNumber)) {
      showValidationMessage(
        t("validation_invalid_phone", { ns: "profilePage" }),
        t("validation_invalid_phone_content", { ns: "profilePage" })
      );
      return;
    }

    setIsRequestingOtp(true);
    try {
      const transformedPhone = transformPhoneNumber(
        organization.orgContactNumber
      );

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
      const transformedPhone = transformPhoneNumber(
        organization.orgContactNumber
      );
      const response = await axios.post(
        `${backendURL}/subscription/verify-otp`,
        {
          phone: transformedPhone,
          otp: otp,
          subscriptionId: subscriptionId,
          email: organization.repEmail, // Add email to the request
        }
      );

      if (response.data.success) {
        setSubscriptionStatus("success");

        const updatedOrganization = {
          ...organization,
          isSubscribed: true,
          maskedNumber: response.data.maskedNumber, // Use the masked number from response
        };

        setOrganization(updatedOrganization);

        await axios.post(
          `${backendURL}/api/organizations/update-organization`,
          updatedOrganization
        );
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
          email: organization.repEmail,
        }
      );

      if (response.data.success) {
        const updatedOrganization = {
          ...organization,
          isSubscribed: false,
          maskedNumber: "",
        };
        setOrganization(updatedOrganization);

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
          setOrganization((prev) => ({
            ...prev,
            repEmail: userInfo.email || "",
          }));

          // Fetch donor and organization info
          await fetchDonorInfo();
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

  // Handle file selection for avatar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create an object URL for image preview
      const imageUrl = URL.createObjectURL(file);
      setOrganization((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  // Handle logo upload
  const handleAvatarUpdate = async () => {
    if (!selectedFile || !user?.email) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", user.email);

    try {
      const { data } = await axios.post(
        `${backendURL}/api/organizations/upload-logo`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update the organization record with new avatar URL
      setOrganization((prev) => ({ ...prev, avatar: data.avatarUrl }));

      alert("Logo updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error updating avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle organization profile update
  const handleUpdate = async () => {
    if (!user || !organization) return;

    // Check if the phone number is valid
    if (!validatePhoneNumber(organization.repContactNumber)) {
      showValidationMessage(
        "Invalid Contact Number",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!validatePhoneNumber(organization.orgContactNumber)) {
      showValidationMessage(
        "Invalid Contact Number",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    try {
      setLoading(true);
      const { _id, ...organizationData } = organization;

      await axios.post(
        `${backendURL}/api/organizations/update-organization`,
        organizationData
      );
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

  // Handle input changes for organization fields
  const handleInputChange = (field: keyof Organization, value: string) => {
    if (organization) {
      setOrganization((prev) => ({
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
        <p className="text-lg text-gray-700">Please login to view data</p>
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
                Please complete the form to register as an organization.
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <p className="text-yellow-700">
                Your organization is registered.
              </p>
            </div>
          )}

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="lg:ml-4 flex justify-center items-center flex-col sm:flex-row sm:space-y-0 sm:space-x-6">
              {organization?.avatar ? (
                <img
                  className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-red-300"
                  src={organization.avatar}
                  alt="Organization Logo"
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
                  Change Logo
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
            <div className="w-full">
              <Label
                htmlFor="fullName"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                {" "}
                Name of the Organization
              </Label>
              <input
                type="text"
                value={organization?.organizationName || ""}
                onChange={(e) =>
                  handleInputChange("organizationName", e.target.value)
                }
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              />
            </div>
            <div className="w-full">
              <Label
                htmlFor="fullName"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                {" "}
                Email of the Organization
              </Label>
              <input
                type="text"
                value={organization?.organizationEmail || ""}
                onChange={(e) =>
                  handleInputChange("organizationEmail", e.target.value)
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
                Representative's Email
              </Label>
              <input
                type="email"
                value={user.email}
                name="repEmail"
                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                disabled
              />
            </div>
            <div className="w-full">
              <Label
                htmlFor="fullName"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                {" "}
                Representative's Full Name (As in NIC)
              </Label>
              <input
                type="text"
                value={organization?.repFullName || ""}
                onChange={(e) =>
                  handleInputChange("repFullName", e.target.value)
                }
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
                  Representative's NIC
                </Label>
                <input
                  type="text"
                  value={organization?.repNIC || ""}
                  onChange={(e) => handleInputChange("repNIC", e.target.value)}
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
                    checked={organization?.repGender === "Male"}
                    onChange={(e) =>
                      handleInputChange("repGender", e.target.value)
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
                    checked={organization?.repGender === "Female"}
                    onChange={(e) =>
                      handleInputChange("repGender", e.target.value)
                    }
                    className="mr-2"
                  />
                  <Label htmlFor="female" className="text-sm text-indigo-900">
                    Female
                  </Label>
                </div>
              </div>
            </div>
            <div>
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                Contact Number of the Organization
              </Label>
              <input
                type="text"
                value={organization?.orgContactNumber || ""}
                onChange={(e) => handleOrgContactNumber(e.target.value)}
                className={`bg-indigo-50 border ${
                  isOrgPhoneNumberValid ? "border-indigo-300" : "border-red-500"
                } text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
              />
              {!isOrgPhoneNumberValid && (
                <p className="text-sm text-red-500 mt-1">
                  Please enter a valid 10-digit phone number starting from 0.
                </p>
              )}
            </div>
            <div className="mb-2 sm:mb-6">
              <Label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-indigo-900"
              >
                {" "}
                Contact Number of the Representative
              </Label>
              <input
                type="text"
                value={organization?.repContactNumber || ""}
                onChange={(e) => handleRepContactNumber(e.target.value)}
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

            {/* Subscription Section */}
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="text-lg font-medium text-indigo-900 mb-4">
                {t("sms_notifications_title", { ns: "profilePage" })}
              </h3>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="sms-subscription"
                  checked={organization.isSubscribed}
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
                  {t("subscription_checkbox_label_org", { ns: "profilePage" })}
                </Label>
              </div>

              {organization.isSubscribed && organization.maskedNumber && (
                <p className="text-sm text-green-600">
                  {t("subscribed_message", { ns: "profilePage" })}
                </p>
              )}
            </div>

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
                  "Update Details"
                ) : (
                  "Complete Form"
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
            You successfully registered your organization.
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
            Your organization details are updated successfully.
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
            Error updating the details. Please try again shortly.
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
        <Modal.Header>Complete the Form</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Please complete the form to register as an organization.
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
                  {organization.orgContactNumber}
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
};
export default OrganizationRegistration;
