/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../../../../types/users";
import { useAuthContext } from "@asgardeo/auth-react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { useLocation } from "react-router-dom";

const Stepper = ({
  step: propStep,
  onNextStep,
  onPreviousStep,
  setStep: propSetStep,
}: {
  step: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
  setStep: (step: number) => void;
}) => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(propStep);
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.initialStep) {
      setCurrentStep(location.state.initialStep);
    } else {
      setCurrentStep(propStep);
    }
  }, [location.state, propStep]);

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
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  // Stepper labels
  const steps = [
    "Registration Confirmation",
    "Medical Assessment",
    "Hb Test & Bag Issue",
    "Blood Collection",
  ];

  const handleStepClick = (index: number) => {
    const newStep = index + 1;
    setCurrentStep(newStep);
    propSetStep(newStep);
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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-100">Please login to fill the form</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 relative overflow-hidden">
              <div
                className="h-2.5 rounded-full absolute top-0 left-0 transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  background:
                    "linear-gradient(90deg,rgb(184, 38, 1),rgb(235, 56, 36))",
                }}
              ></div>
            </div>

            {/* Stepper Labels & Numbers */}
            <div className="flex flex-wrap justify-center gap-4 md:justify-between">
              {steps.map((label, index) => (
                <div
                  key={index}
                  className="text-center flex flex-col items-center cursor-pointer"
                  onClick={() => handleStepClick(index)}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                      index + 1 <= currentStep
                        ? "bg-gradient-to-r from-red-800 to-red-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs md:text-sm mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render Step Components */}
      {currentStep === 1 && (
        <StepOne onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
      {currentStep === 2 && (
        <StepTwo onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
    </div>
  );
};

export default Stepper;
