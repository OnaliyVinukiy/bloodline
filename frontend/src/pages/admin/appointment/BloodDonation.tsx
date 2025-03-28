/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import Stepper from "./components/Stepper";
import axios from "axios";
import { useAuthContext } from "@asgardeo/auth-react";

const BloodDonation = () => {
  const id = location.pathname.split("/").pop();
  const { getAccessToken } = useAuthContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentStatus, setAppointmentStatus] = useState("");

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  //Fetch appointment status
  useEffect(() => {
    const fetchAppointmentStatus = async () => {
      try {
        setIsLoading(true);
        const token = await getAccessToken();

        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointmentStatus(response.data.status);

        //Set initial step based on status
        if (response.data.status === "Approved") {
          setCurrentStep(1);
        } else if (response.data.status === "Confirmed") {
          setCurrentStep(2);
        } else if (response.data.status === "Assessed") {
          setCurrentStep(3);
        } else if (response.data.status === "Issued") {
          setCurrentStep(4);
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setIsLoading(false);
        console.log(appointmentStatus);
        console.log(currentStep);
      }
    };

    fetchAppointmentStatus();
  }, [id, getAccessToken]);

  //Handle next button
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  //Handle back button
  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
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

  return (
    <div className="mt-12 bg-white">
      <div>
        <Stepper
          step={currentStep}
          onNextStep={handleNextStep}
          onPreviousStep={handlePreviousStep}
          setStep={setCurrentStep}
        />
      </div>
    </div>
  );
};

export default BloodDonation;
