/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React, { useEffect, useState } from "react";
import { StepperPropsCamps } from "../../../../types/stepper";
import { Label, Toast } from "flowbite-react";
import { HiExclamation } from "react-icons/hi";
import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";

declare global {
  interface Window {
    google: any;
  }
}

const StepTwo: React.FC<StepperPropsCamps> = ({
  onPreviousStep,
  onNextStep,
}) => {
  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  const [formData, setFormData] = useState({
    assessment: {
      history: {
        isFeelingWell: "",
        adequateSleep: "",
        mealBefore4Hours: "",
        hadHospitalized: "",
        hasAllergyMedications: "",
        hadRiskBehavior: "",
      },
      examination: {
        isLookingPale: "",
        isIcterus: "",
        havingAlcoholSmell: "",
        hasWounds: "",
        hasVenepuncture: "",
        cvsPulse: "",
        bp: "",
        weight: "",
        remarks: "",
      },
      councelling: {
        cueOptions: "",
        pdCallUp: "",
      },
      outcome: "",
      deferrealRemarks: "",
      medicalOfficerSignature: "",
      assessedAt: "",
    },
  });
  const appointmentId = location.pathname.split("/").pop();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<any | null>(null);
   const [userEmail, setUserEmail] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const { getAccessToken, getBasicUserInfo } = useAuthContext();

  //Fetch appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setIsLoading(true);
        const token = await getAccessToken();
        const userInfo = await getBasicUserInfo();
        setUserEmail(userInfo.email || "");
        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointment/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointment(response.data);

        //Populate appointment data
        if (response.data.assessment) {
          setFormData({
            assessment: {
              history: {
                isFeelingWell: response.data.assessment.history.isFeelingWell,
                adequateSleep: response.data.assessment.history.adequateSleep,
                mealBefore4Hours:
                  response.data.assessment.history.mealBefore4Hours,
                hadHospitalized:
                  response.data.assessment.history.hadHospitalized,
                hasAllergyMedications:
                  response.data.assessment.history.hasAllergyMedications,
                hadRiskBehavior:
                  response.data.assessment.history.hadRiskBehavior,
              },
              examination: {
                isLookingPale:
                  response.data.assessment.examination.isLookingPale,
                isIcterus: response.data.assessment.examination.isIcterus,
                havingAlcoholSmell:
                  response.data.assessment.examination.havingAlcoholSmell,
                hasWounds: response.data.assessment.examination.hasWounds,
                hasVenepuncture:
                  response.data.assessment.examination.hasVenepuncture,
                cvsPulse: response.data.assessment.examination.cvsPulse,
                bp: response.data.assessment.examination.bp,
                weight: response.data.assessment.examination.weight,
                remarks: response.data.assessment.examination.remarks,
              },
              councelling: {
                cueOptions: response.data.assessment.councelling.cueOptions,
                pdCallUp: response.data.assessment.councelling.pdCallUp,
              },
              outcome: response.data.assessment.outcome,
              deferrealRemarks: response.data.assessment.deferrealRemarks,
              medicalOfficerSignature:
                response.data.assessment.medicalOfficerSignature,
              assessedAt: new Date().toISOString(),
            },
          });
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setToastMessage("Failed to load appointment data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, getAccessToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === "radio" ? value : e.target.value;

    setFormData((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        history:
          name in prev.assessment.history
            ? {
                ...prev.assessment.history,
                [name]: inputValue,
              }
            : prev.assessment.history,

        examination:
          name in prev.assessment.examination
            ? {
                ...prev.assessment.examination,
                [name]: inputValue,
              }
            : prev.assessment.examination,

        councelling:
          name in prev.assessment.councelling
            ? {
                ...prev.assessment.councelling,
                [name]: inputValue,
              }
            : prev.assessment.councelling,

        [name]: !(
          name in prev.assessment.history ||
          name in prev.assessment.examination ||
          name in prev.assessment.councelling
        )
          ? inputValue
          : prev.assessment[name as keyof typeof prev.assessment],
      },
    }));
  };

  //Submit form data
  const handleSubmit = async () => {
    if (appointment?.status === "Confirmed") {
      setLoading(true);
      try {
        const token = await getAccessToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const requestData = {
          assessment: {
            history: {
              isFeelingWell: formData.assessment.history.isFeelingWell,
              adequateSleep: formData.assessment.history.adequateSleep,
              mealBefore4Hours: formData.assessment.history.mealBefore4Hours,
              hadHospitalized: formData.assessment.history.hadHospitalized,
              hasAllergyMedications:
                formData.assessment.history.hasAllergyMedications,
              hadRiskBehavior: formData.assessment.history.hadRiskBehavior,
            },
            examination: {
              isLookingPale: formData.assessment.examination.isLookingPale,
              isIcterus: formData.assessment.examination.isIcterus,
              havingAlcoholSmell:
                formData.assessment.examination.havingAlcoholSmell,
              hasWounds: formData.assessment.examination.hasWounds,
              hasVenepuncture: formData.assessment.examination.hasVenepuncture,
              cvsPulse: formData.assessment.examination.cvsPulse,
              bp: formData.assessment.examination.bp,
              weight: formData.assessment.examination.weight,
              remarks: formData.assessment.examination.remarks,
            },
            councelling: {
              cueOptions: formData.assessment.councelling.cueOptions,
              pdCallUp: formData.assessment.councelling.pdCallUp,
            },
            outcome: formData.assessment.outcome,
            deferrealRemarks: formData.assessment.deferrealRemarks,
            medicalOfficerSignature:
              formData.assessment.medicalOfficerSignature,
            assessedAt: new Date().toISOString(),
            recordedBy: userEmail,
          },
          status: "Assessed",
        };

        await axios.patch(
          `${backendURL}/api/appointments/update-appointment/${appointmentId}`,
          requestData,
          config
        );

        onNextStep();
      } catch (error) {
        console.error("Error updating appointment:", error);
        setToastMessage("Failed to update appointment. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      onNextStep();
    }
  };

  //Loading Animation
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
                  Medical Assessment
                </h2>
              </div>
            </div>
            {/* Form */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 space-y-6">
                <Label
                  htmlFor="details"
                  className="block mb-6 text-lg font-roboto font-medium text-gray-800"
                >
                  Details of the Donor
                </Label>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Donor's Name
                  </Label>
                  <input
                    type="text"
                    name="fullName"
                    value={appointment?.donorInfo?.fullName || ""}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Weight
                  </Label>
                  <input
                    type="text"
                    name="weight"
                    placeholder="Enter donor's weight"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <Label
                  htmlFor="details"
                  className="block mb-6 text-lg font-roboto font-medium text-gray-800"
                >
                  History
                </Label>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Is the donor feeling well?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isFeelingWell"
                        value="Yes"
                        checked={
                          formData.assessment.history.isFeelingWell === "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isFeelingWell"
                        value="No"
                        checked={
                          formData.assessment.history.isFeelingWell === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Had the donor had adequate sleep? (At least 6 hours)
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="adequateSleep"
                        value="Yes"
                        checked={
                          formData.assessment.history.adequateSleep === "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="adequateSleep"
                        value="No"
                        checked={
                          formData.assessment.history.adequateSleep === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Had the donor had a meal within the last 4 hours?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="mealBefore4Hours"
                        value="Yes"
                        checked={
                          formData.assessment.history.mealBefore4Hours === "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="mealBefore4Hours"
                        value="No"
                        checked={
                          formData.assessment.history.mealBefore4Hours === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Had the donor ever hospitalized?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hadHospitalized"
                        value="Yes"
                        checked={
                          formData.assessment.history.hadHospitalized === "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hadHospitalized"
                        value="No"
                        checked={
                          formData.assessment.history.hadHospitalized === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Had any allergies, illnesses or medications?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasAllergyMedications"
                        value="Yes"
                        checked={
                          formData.assessment.history.hasAllergyMedications ===
                          "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasAllergyMedications"
                        value="No"
                        checked={
                          formData.assessment.history.hasAllergyMedications ===
                          "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Had any risk behavior in the last 6 months?
                  </Label>
                  <div className="flex items-center space-x-4 mb-10 ">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hadRiskBehavior"
                        value="Yes"
                        checked={
                          formData.assessment.history.hadRiskBehavior === "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hadRiskBehavior"
                        value="No"
                        checked={
                          formData.assessment.history.hadRiskBehavior === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <Label
                  htmlFor="details"
                  className="block mb-6 text-lg font-roboto font-semibold text-gray-800"
                >
                  Examination
                </Label>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Is the donor looking pale?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isLookingPale"
                        value="Yes"
                        checked={
                          formData.assessment.examination.isLookingPale ===
                          "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isLookingPale"
                        value="No"
                        checked={
                          formData.assessment.examination.isLookingPale === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Is the donor icterus?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isIcterus"
                        value="Yes"
                        checked={
                          formData.assessment.examination.isIcterus === "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isIcterus"
                        value="No"
                        checked={
                          formData.assessment.examination.isIcterus === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Is the donor having a alcohol smell?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="havingAlcoholSmell"
                        value="Yes"
                        checked={
                          formData.assessment.examination.havingAlcoholSmell ===
                          "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="havingAlcoholSmell"
                        value="No"
                        checked={
                          formData.assessment.examination.havingAlcoholSmell ===
                          "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Is the donor having infected wounds?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasWounds"
                        value="Yes"
                        checked={
                          formData.assessment.examination.hasWounds === "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasWounds"
                        value="No"
                        checked={
                          formData.assessment.examination.hasWounds === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Is the donor having venepuncture site lesions?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasVenepuncture"
                        value="Yes"
                        checked={
                          formData.assessment.examination.hasVenepuncture ===
                          "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasVenepuncture"
                        value="No"
                        checked={
                          formData.assessment.examination.hasVenepuncture ===
                          "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="NIC"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    CVS status pulse
                  </Label>
                  <input
                    type="text"
                    name="cvsPulse"
                    placeholder="Enter CVS status pulse /min"
                    value={formData.assessment.examination.cvsPulse}
                    onChange={handleInputChange}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="NIC"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    BP
                  </Label>
                  <input
                    type="text"
                    name="bp"
                    placeholder="Enter BP /mmHg"
                    value={formData.assessment.examination.bp}
                    onChange={handleInputChange}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="NIC"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Remarks
                  </Label>
                  <input
                    type="text"
                    name="remarks"
                    placeholder="Enter remarks"
                    value={formData.assessment.examination.remarks}
                    onChange={handleInputChange}
                    className="mb-10 bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <Label
                  htmlFor="details"
                  className="block mb-6 text-lg font-roboto font-semibold text-gray-800"
                >
                  Counselling
                </Label>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Option for CUE (If applicable) ?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="cueOptions"
                        value="Yes"
                        checked={
                          formData.assessment.councelling.cueOptions === "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="cueOptions"
                        value="No"
                        checked={
                          formData.assessment.councelling.cueOptions === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Inform possible PD call-up (If available) ?
                  </Label>
                  <div className="flex items-center space-x-4 mb-10">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pdCallUp"
                        value="Yes"
                        checked={
                          formData.assessment.councelling.pdCallUp === "Yes"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pdCallUp"
                        value="No"
                        checked={
                          formData.assessment.councelling.pdCallUp === "No"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="details"
                    className="block mb-6 text-lg font-roboto font-semibold text-gray-800"
                  >
                    Outcome
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="outcome"
                        value="Accepted"
                        checked={formData.assessment.outcome === "Accepted"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">
                        Donor to be accepted if HB {">"} 12.5g/dl
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="outcome"
                        value="Temporary Deferral"
                        checked={
                          formData.assessment.outcome === "Temporary Deferral"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">
                        Temporary Deferral
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="outcome"
                        value="Permanent Deferral"
                        checked={
                          formData.assessment.outcome === "Permanent Deferral"
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                        required
                      />
                      <span className="ml-2 text-gray-700">
                        Permanent Deferral
                      </span>
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="remarks"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Remarks / Reasons for deferral
                  </Label>
                  <input
                    type="text"
                    name="deferrealRemarks"
                    placeholder="Enter any remarks or deferral reasons"
                    onChange={handleInputChange}
                    value={formData.assessment.deferrealRemarks}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="NIC"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {" "}
                    Medical officer's signature (Enter full name)
                  </Label>
                  <input
                    type="text"
                    name="medicalOfficerSignature"
                    placeholder="Enter full name of medical officer"
                    value={formData.assessment.medicalOfficerSignature}
                    onChange={handleInputChange}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
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
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-red-500 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300"
                disabled={loading}
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
                ) : (
                  "Update"
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

export default StepTwo;
