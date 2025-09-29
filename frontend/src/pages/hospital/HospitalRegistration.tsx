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
import {
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { User, Hospital } from "../../types/users";
import { ValidationModal } from "../../components/ValidationModal";
import { validatePhoneNumber } from "../../utils/ValidationsUtils";

const HospitalRegistrationRequest = () => {
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [isHosPhoneNumberValid, setIsHosPhoneNumberValid] = useState(true);

  const [hospital, setHospital] = useState<Hospital>({
    _id: "",
    hospitalName: "",
    hospitalEmail: "",
    repFullName: "",
    repEmail: user?.email || "",
    repNIC: "",
    repGender: "",
    hosContactNumber: "",
    repContactNumber: "",
    avatar: "",
    status: "pending",
    isSubscribed: false,
    maskedNumber: "",
  });

  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [showProfileIncompleteModal, setShowProfileIncompleteModal] =
    useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // Subscription states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [otp, setOtp] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  const handleRepContactNumber = (value: string) => {
    setIsPhoneNumberValid(validatePhoneNumber(value));
    handleInputChange("repContactNumber", value);
  };

  const handleHosContactNumber = (value: string) => {
    setIsHosPhoneNumberValid(validatePhoneNumber(value));
    handleInputChange("hosContactNumber", value);
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

  // Transform phone number for subscription
  const transformPhoneNumber = (phone: string): string => {
    if (phone.startsWith("0")) {
      return "94" + phone.substring(1);
    }
    return phone;
  };

  // Fetch user info and hospital request status
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
          setHospital((prev) => ({
            ...prev,
            repEmail: userInfo.email || "",
          }));

          // Fetch hospital request info
          const { data: hospitalInfo } = await axios.get(
            `${backendURL}/api/hospitals/hospital/${userInfo.email}`
          );

          if (hospitalInfo) {
            setHospital(hospitalInfo);
            setIsRequestSubmitted(true);
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
    if (!isLoading && !isRequestSubmitted) {
      setShowProfileIncompleteModal(true);
    }
  }, [isLoading, isRequestSubmitted]);

  // Subscription handlers
  const handleRequestOtp = async () => {
    if (!hospital.repContactNumber) {
      showValidationMessage(
        "Missing Phone Number",
        "Please provide a contact number before subscribing to notifications."
      );
      return;
    }

    if (!validatePhoneNumber(hospital.repContactNumber)) {
      showValidationMessage(
        "Invalid Phone Number",
        "Please enter a valid 10-digit phone number starting from 0."
      );
      return;
    }

    setIsRequestingOtp(true);
    try {
      const transformedPhone = transformPhoneNumber(hospital.repContactNumber);

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
      const transformedPhone = transformPhoneNumber(hospital.repContactNumber);
      const response = await axios.post(
        `${backendURL}/subscription/verify-otp`,
        {
          phone: transformedPhone,
          otp: otp,
          subscriptionId: subscriptionId,
          email: hospital.repEmail,
          isHospital: true,
        }
      );

      if (response.data.success) {
        setSubscriptionStatus("success");

        const updatedHospital = {
          ...hospital,
          isSubscribed: true,
          maskedNumber: response.data.maskedNumber,
        };

        setHospital(updatedHospital);

        // Update hospital record with subscription status
        await axios.post(
          `${backendURL}/api/hospitals/update-hospital`,
          updatedHospital
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
          email: hospital.repEmail,
          isHospital: true,
        }
      );

      if (response.data.success) {
        const updatedHospital = {
          ...hospital,
          isSubscribed: false,
          maskedNumber: "",
        };
        setHospital(updatedHospital);

        // Update hospital record
        await axios.post(
          `${backendURL}/api/hospitals/update-hospital`,
          updatedHospital
        );

        setShowUnsubscribeModal(false);
        showValidationMessage(
          "Unsubscribed Successfully",
          "You have been unsubscribed from SMS notifications."
        );
      } else {
        showValidationMessage(
          "Unsubscribe Failed",
          response.data.error || "Failed to unsubscribe. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during unsubscription:", error);
      showValidationMessage(
        "Unsubscribe Failed",
        "An error occurred while unsubscribing. Please try again."
      );
    } finally {
      setIsUnsubscribing(false);
    }
  };

  // Handle file selection for avatar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create an object URL for image preview
      const imageUrl = URL.createObjectURL(file);
      setHospital((prev) => ({ ...prev, avatar: imageUrl }));
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
        `${backendURL}/api/hospitals/uploadHospitalLogo`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update the hospital record with new avatar URL
      setHospital((prev) => ({ ...prev, avatar: data.avatarUrl }));

      alert("Logo updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error updating avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle hospital registration request
  const handleRequest = async () => {
    if (!user || !hospital) return;

    // Check if the phone number is valid
    if (!validatePhoneNumber(hospital.repContactNumber)) {
      showValidationMessage(
        "Invalid Contact Number",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!validatePhoneNumber(hospital.hosContactNumber)) {
      showValidationMessage(
        "Invalid Contact Number",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    // Validate required fields
    if (
      !hospital.hospitalName ||
      !hospital.hospitalEmail ||
      !hospital.repFullName ||
      !hospital.repNIC ||
      !hospital.repGender ||
      !hospital.hosContactNumber
    ) {
      showValidationMessage(
        "Incomplete Form",
        "Please fill all required fields before submitting the request."
      );
      return;
    }

    try {
      setLoading(true);
      const { _id, ...hospitalData } = hospital;

      await axios.post(`${backendURL}/api/hospitals/submit-request`, {
        ...hospitalData,
        status: "pending",
        submittedAt: new Date(),
      });
      setIsRequestSubmitted(true);
      setLoading(false);
      setShowRequestModal(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      setLoading(false);
      setErrorModal(true);
    }
  };

  // Handle input changes for hospital fields
  const handleInputChange = (field: keyof Hospital, value: string) => {
    if (hospital) {
      setHospital((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  // Render status badge
  const renderStatusBadge = () => {
    switch (hospital.status) {
      case "approved":
        return (
          <div className="flex items-center gap-2 p-3 bg-green-100 text-green-800 rounded-lg">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-semibold">Approved</span>
            <p className="text-sm">Your hospital has been approved by NBTS.</p>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2 p-3 bg-red-100 text-red-800 rounded-lg">
            <XCircleIcon className="w-5 h-5" />
            <span className="font-semibold">Rejected</span>
            <p className="text-sm">
              {hospital.rejectionReason ||
                "Your request has been rejected by NBTS."}
            </p>
          </div>
        );
      case "pending":
      default:
        return (
          <div className="flex items-center gap-2 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
            <ClockIcon className="w-5 h-5" />
            <span className="font-semibold">Pending Review</span>
            <p className="text-sm">Your request is under review by NBTS.</p>
          </div>
        );
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
      <main className="mt-12 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          {/* Status Display */}
          {isRequestSubmitted && (
            <div className="mb-6">{renderStatusBadge()}</div>
          )}

          {/* Request Information */}
          {!isRequestSubmitted ? (
            <div className="mb-6 p-4 bg-blue-100 rounded-lg">
              <p className="text-blue-700">
                Please complete the form to request NBTS to register your
                hospital. You will be able to request blood once your hospital
                is approved.
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">
                {hospital.status === "approved"
                  ? "Your hospital is registered and you can now request blood."
                  : hospital.status === "rejected"
                  ? "Please contact NBTS for more information about the rejection."
                  : "Your request is being processed. You will be notified once reviewed."}
              </p>
            </div>
          )}

          {/* Profile Form - Only show if pending or not submitted, or if admin wants to allow updates */}
          {hospital.status === "pending" ||
          !isRequestSubmitted ||
          hospital.status === "rejected" ? (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="lg:ml-4 flex justify-center items-center flex-col sm:flex-row sm:space-y-0 sm:space-x-6">
                {hospital?.avatar ? (
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-red-300"
                    src={hospital.avatar}
                    alt="Hospital Logo"
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
                  htmlFor="hospitalName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Name of the Hospital *
                </Label>
                <input
                  type="text"
                  value={hospital?.hospitalName || ""}
                  onChange={(e) =>
                    handleInputChange("hospitalName", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  disabled={hospital.status === "approved"}
                />
              </div>

              <div className="w-full">
                <Label
                  htmlFor="hospitalEmail"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Email of the Hospital *
                </Label>
                <input
                  type="email"
                  value={hospital?.hospitalEmail || ""}
                  onChange={(e) =>
                    handleInputChange("hospitalEmail", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  disabled={hospital.status === "approved"}
                />
              </div>

              <div className="w-full">
                <Label
                  htmlFor="repEmail"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Representative's Email
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
                  htmlFor="repFullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Representative's Full Name (As in NIC) *
                </Label>
                <input
                  type="text"
                  value={hospital?.repFullName || ""}
                  onChange={(e) =>
                    handleInputChange("repFullName", e.target.value)
                  }
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  disabled={hospital.status === "approved"}
                />
              </div>

              <div className="flex space-x-6 mb-6">
                <div className="w-3/4">
                  <Label
                    htmlFor="repNIC"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    Representative's NIC *
                  </Label>
                  <input
                    type="text"
                    value={hospital?.repNIC || ""}
                    onChange={(e) =>
                      handleInputChange("repNIC", e.target.value)
                    }
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    disabled={hospital.status === "approved"}
                  />
                </div>

                <div className="w-3/4">
                  <Label
                    htmlFor="repGender"
                    className="mt-1 block mb-2 text-sm font-medium text-indigo-900"
                  >
                    Gender *
                  </Label>
                  <div className="mt-4 flex items-center">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="Male"
                      checked={hospital?.repGender === "Male"}
                      onChange={(e) =>
                        handleInputChange("repGender", e.target.value)
                      }
                      className="mr-2"
                      disabled={hospital.status === "approved"}
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
                      checked={hospital?.repGender === "Female"}
                      onChange={(e) =>
                        handleInputChange("repGender", e.target.value)
                      }
                      className="mr-2"
                      disabled={hospital.status === "approved"}
                    />
                    <Label htmlFor="female" className="text-sm text-indigo-900">
                      Female
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="hosContactNumber"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Contact Number of the Hospital *
                </Label>
                <input
                  type="text"
                  value={hospital?.hosContactNumber || ""}
                  onChange={(e) => handleHosContactNumber(e.target.value)}
                  className={`bg-indigo-50 border ${
                    isHosPhoneNumberValid
                      ? "border-indigo-300"
                      : "border-red-500"
                  } text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
                  disabled={hospital.status === "approved"}
                />
                {!isHosPhoneNumberValid && (
                  <p className="text-sm text-red-500 mt-1">
                    Please enter a valid 10-digit phone number starting from 0.
                  </p>
                )}
              </div>

              <div className="mb-2 sm:mb-6">
                <Label
                  htmlFor="repContactNumber"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Contact Number of the Representative *
                </Label>
                <input
                  type="text"
                  value={hospital?.repContactNumber || ""}
                  onChange={(e) => handleRepContactNumber(e.target.value)}
                  className={`bg-indigo-50 border ${
                    isPhoneNumberValid ? "border-indigo-300" : "border-red-500"
                  } text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
                  disabled={hospital.status === "approved"}
                />
                {!isPhoneNumberValid && (
                  <p className="text-sm text-red-500 mt-1">
                    Please enter a valid 10-digit phone number starting from 0.
                  </p>
                )}
              </div>

              {/* Submit/Update Button */}
              {hospital.status !== "approved" && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleRequest}
                    disabled={loading || hospital.status !== "pending"}
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
                        {isRequestSubmitted ? "Updating..." : "Submitting..."}
                      </>
                    ) : isRequestSubmitted ? (
                      "Update Request"
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Hospital Registration Approved
              </h3>
              <p className="text-gray-600">
                Your hospital has been successfully registered with NBTS. You
                can now request blood when needed.
              </p>

              {hospital.status === "approved" && (
                <div className="mt-8 p-6 border rounded-lg bg-gray-50 max-w-2xl mx-auto">
                  <h3 className="text-lg font-medium text-indigo-900 mb-4">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Subscribe to receive SMS notifications about blood requests.
                  </p>

                  <div className="flex items-center justify-center mb-4">
                    <input
                      type="checkbox"
                      id="hospital-sms-subscription"
                      checked={hospital.isSubscribed}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setShowSubscriptionModal(true);
                        } else {
                          setShowUnsubscribeModal(true);
                        }
                      }}
                      className="mr-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <Label
                      htmlFor="hospital-sms-subscription"
                      className="text-sm font-medium text-indigo-900"
                    >
                      Subscribe to SMS Notifications
                    </Label>
                  </div>

                  {hospital.isSubscribed && hospital.maskedNumber && (
                    <p className="text-sm text-green-600">
                      Subscribed to notifications ({hospital.maskedNumber})
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Request Confirmation Modal */}
      <Modal show={showRequestModal} onClose={() => setShowRequestModal(false)}>
        <Modal.Header className="flex items-center gap-2 ">
          <p className="flex items-center gap-2 text-xl text-green-600">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            Request Submitted Successfully!
          </p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Your hospital registration request has been submitted to NBTS for
            review. You will be notified once your request is processed.
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={() => setShowRequestModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onClose={() => setErrorModal(false)}>
        <Modal.Header>Oops an Error!</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Error submitting the request. Please try again shortly.
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
        <Modal.Header>Hospital Registration Request</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Please complete the form to submit a request to NBTS for hospital
            registration. You will be able to request blood once your hospital
            is approved.
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
        <Modal.Header>Subscribe to SMS Notifications</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {subscriptionStatus === "" && (
              <>
                <p className="text-gray-700">
                  We will send an OTP to your phone number:{" "}
                  {hospital.repContactNumber}
                </p>
                <Button
                  onClick={handleRequestOtp}
                  disabled={isRequestingOtp}
                  className="w-full"
                >
                  {isRequestingOtp ? "Sending OTP..." : "Request OTP"}
                </Button>
              </>
            )}

            {subscriptionStatus === "otp_sent" && (
              <>
                <p className="text-gray-700">
                  OTP has been sent to your phone number. Please enter it below:
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-2 border rounded"
                />
                <Button
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || otp.length < 4}
                  className="w-full"
                >
                  {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP"}
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
                <p>Successfully subscribed to SMS notifications!</p>
              </div>
            )}

            {subscriptionStatus === "error" && (
              <div className="text-red-600 text-center">
                <p>Failed to subscribe. Please try again.</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {subscriptionStatus === "success" && (
            <Button onClick={() => setShowSubscriptionModal(false)}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Unsubscribe Confirmation Modal */}
      <Modal
        show={showUnsubscribeModal}
        onClose={() => setShowUnsubscribeModal(false)}
      >
        <Modal.Header>Unsubscribe from SMS Notifications</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Are you sure you want to unsubscribe from SMS notifications?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            You will no longer receive important updates about blood requests
            and urgent needs.
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end space-x-4">
          <Button color="gray" onClick={() => setShowUnsubscribeModal(false)}>
            Cancel
          </Button>
          <Button
            color="failure"
            onClick={handleUnsubscribe}
            disabled={isUnsubscribing}
          >
            {isUnsubscribing ? "Unsubscribing..." : "Unsubscribe"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HospitalRegistrationRequest;
