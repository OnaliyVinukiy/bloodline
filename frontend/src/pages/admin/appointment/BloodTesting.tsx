/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import Stepper from "../appointment/components/testing/Stepper";
import axios from "axios";
import { useAuthContext } from "@asgardeo/auth-react";

const BloodTesting = () => {
  const id = location.pathname.split("/").pop();
  const { state, getAccessToken } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const isLoading = isAuthLoading || isDataLoading;

  // Backend URL
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch user info and check admin role
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          const response = await axios.post(
            `${backendURL}/api/user-info`,
            { accessToken },
            { headers: { "Content-Type": "application/json" } }
          );

          if (
            response.data.role &&
            response.data.role.includes("Internal/Admin")
          ) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setIsAuthLoading(false);
        }
      } else {
        setIsAuthLoading(false);
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  //Fetch appointment status
  useEffect(() => {
    const fetchAppointmentStatus = async () => {
      try {
        const token = await getAccessToken();

        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        //Set initial step based on status
        if (response.data.status === "Collected") {
          setCurrentStep(1);
        } else if (response.data.status === "Processed") {
          setCurrentStep(2);
        } else if (response.data.status === "Tested") {
          setCurrentStep(3);
        } else if (response.data.status === "Labelled") {
          setCurrentStep(4);
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setIsDataLoading(false);
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

  // Loading animation
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

  // Loading Animation
  if (!isAdmin && !isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold mt-4 text-gray-800 dark:text-white">
            Access Denied
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            You don't have permission to view this page. Only administrators can
            access this content.
          </p>
        </div>
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

export default BloodTesting;
