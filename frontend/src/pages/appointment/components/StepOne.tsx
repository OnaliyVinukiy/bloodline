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

const StepOne: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<{ [key in keyof BloodDonor]?: string }>(
    {}
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showValidationModal, setShowValidationModal] = useState(false);

  //Structure for donor information
  const [donor, setDonor] = useState<BloodDonor>({
    nic: "",
    fullName: "",
    email: user?.email || "",
    contactNumber: "",
    contactNumberHome: "",
    contactNumberOffice: "",
    address: "",
    addressOffice: "",
    birthdate: "",
    age: 0,
    bloodGroup: "",
    avatar: "",
    gender: "",
  });

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
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
      [field]: isValid ? "" : "Invalid phone number format.",
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

    if (!donor.nic) newErrors.nic = "NIC is required.";
    if (!donor.fullName) newErrors.fullName = "Full Name is required.";
    if (!donor.email) newErrors.email = "Email is required.";
    if (!donor.contactNumber)
      newErrors.contactNumber = "Contact number is required.";
    if (
      donor.contactNumberHome &&
      !validatePhoneNumber(donor.contactNumberHome)
    ) {
      newErrors.contactNumberHome = "Invalid home number.";
    }

    if (
      donor.contactNumberOffice &&
      !validatePhoneNumber(donor.contactNumberOffice)
    ) {
      newErrors.contactNumberOffice = "Invalid office number.";
    }
    if (!validatePhoneNumber(donor.contactNumber)) {
      newErrors.contactNumber = "Invalid mobile number.";
    }
    if (!donor.address) newErrors.address = "Address is required.";
    if (!donor.birthdate) newErrors.birthdate = "Birthdate is required.";
    if (!donor.bloodGroup) newErrors.bloodGroup = "Blood Group is required.";
    if (!donor.gender) newErrors.gender = "Gender is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrorMessage(true);
      return;
    }

    setErrors({});
    setShowErrorMessage(false);

    try {
      // Calculate age if not already set
      const age = calculateAge(donor.birthdate);
      const donorWithAge = { ...donor, age };
      if (age < 18) {
        showValidationMessage(
          "Age Restriction",
          "You cannot place an appointment as a donor unless you are aged 18 or above."
        );
        return;
      }
      try {
        // Check if donor exists
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
      alert("Error saving donor information. Please try again.");
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
        <p className="text-lg text-gray-700">Please login to fill the form</p>
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
              <div className="w-full">
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {" "}
                  Full Name (As in NIC)*
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
                  Email*
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
                  NIC*
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
                  Gender*
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
                    className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <Label htmlFor="female" className="text-sm text-indigo-900">
                    Female
                  </Label>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Address (Home)*
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
                  Address (Office)
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
                  {" "}
                  Contact Number (Mobile)*
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
                  {" "}
                  Contact Number (Home)
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
                  {" "}
                  Contact Number (Office)
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
                  Blood Group*
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
                  Date of Birth*
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

              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
                >
                  Back
                </button>
                {showErrorMessage && (
                  <p className="text-red-500 text-sm mt-2">
                    Please fill all required fields before proceeding.
                  </p>
                )}

                <button
                  onClick={handleNext}
                  className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300"
                >
                  Next
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
