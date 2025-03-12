/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../../../types/users";
import { useAuthContext } from "@asgardeo/auth-react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import StepSix from "./StepSix";
import StepSeven from "./StepSeven";
import StepEight from "./StepEight";
import StepNine from "./StepNine";

const Stepper = ({
  step,
  onNextStep,
  onPreviousStep,
}: {
  step: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
}) => {
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <p className="text-lg text-gray-700">Please login to fill the form</p>
      </div>
    );
  }

  // Stepper labels
  const steps = [
    "Aim",
    "Date",
    "Time",
    "Venue",
    "Building",
    "Assets",
    "Food",
    "Promotion",
    "Organize",
  ];

  return (
    <div>
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 relative overflow-hidden">
              <div
                className="h-2.5 rounded-full absolute top-0 left-0 transition-all duration-300"
                style={{
                  width: `${((step - 1) / 8) * 100}%`,
                  background:
                    "linear-gradient(90deg,rgb(184, 38, 1),rgb(235, 56, 36))",
                }}
              ></div>
            </div>

            {/* Step Labels */}
            <div className="flex justify-between">
              {steps.map((label, index) => (
                <div
                  key={index}
                  className={`text-center ${
                    index + 1 <= step ? "text-red-800" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center mx-auto rounded-full ${
                      index + 1 <= step
                        ? "bg-gradient-to-r from-red-800 to-red-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    } font-semibold`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm mt-2">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <StepOne onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
      {step === 2 && (
        <StepTwo onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
      {step === 3 && (
        <StepThree onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
      {step === 4 && (
        <StepFour onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
      {step === 5 && (
        <StepFive onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
      {step === 6 && (
        <StepSix onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
      {step === 7 && (
        <StepSeven onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
      {step === 8 && (
        <StepEight onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
      {step === 9 && (
        <StepNine onNextStep={onNextStep} onPreviousStep={onPreviousStep} />
      )}
    </div>
  );
};

export default Stepper;
