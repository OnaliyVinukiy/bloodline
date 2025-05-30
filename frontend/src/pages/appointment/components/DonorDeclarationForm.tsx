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
import ScheduleForm from "./ScheduleForm";

const DonorDeclarationForm = ({
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

  //Structure for the declaration form data
  const [formData, setFormData] = useState({
    selectedDate: null,
    selectedSlot: null,
    status: "Pending",
    donorInfo: {
      nic: null,
      fullName: null,
      email: user?.email || "",
      contactNumber: null,
      address: null,
      birthdate: null,
      age: 0,
      bloodGroup: null,
      avatar: null,
      gender: null,
    },
    firstForm: {
      isDonatedBefore: null,
      timesOfDonation: "",
      lastDonationDate: "",
      isAnyDifficulty: null,
      difficulty: "",
      isMedicallyAdvised: null,
      isLeafletRead: null,
    },
    secondForm: {
      isFeelingWell: null,
      isTakingTreatment: null,
      isSurgeryDone: null,
      isPregnant: null,
      isEngageHeavyWork: null,
      diseases: [] as string[],
    },
    thirdForm: {
      hadHepatitis: null,
      hadTyphoid: null,
    },
    fourthForm: {
      hadVaccination: null,
      hadAcupuncture: null,
      hadImprisoned: null,
      hadTravelledAbroad: null,
      hadReceivedBlood: null,
      hadMaleria: null,
    },
    fifthForm: {
      hadDengue: null,
      hadOtherFever: null,
      hadDentalExtraction: null,
      hadAntibiotic: null,
    },
    sixthForm: {
      isInformed: null,
      isHarmfulCategory: null,
      hadPersistentFever: null,
    },
    seventhForm: {
      donatingMonth: null,
      donorName: "",
      dateSigned: "",
    },
  });

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

  //Handle form data change
  const handleFormDataChange = (newData: any) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  // Stepper labels
  const steps = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eigth",
    "Nineth",
  ];

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
            <div className="flex flex-wrap justify-center gap-4 md:justify-between">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="text-center flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                      index + 1 <= step
                        ? "bg-gradient-to-r from-red-800 to-red-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {step === 1 && (
        <ScheduleForm
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
      )}
      {step === 2 && (
        <StepOne
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
      )}
      {step === 3 && (
        <StepTwo
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
      )}
      {step === 4 && (
        <StepThree
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
      )}
      {step === 5 && (
        <StepFour
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
      )}
      {step === 6 && (
        <StepFive
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
      )}
      {step === 7 && (
        <StepSix
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
      )}
      {step === 8 && (
        <StepSeven
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
      )}
      {step === 9 && (
        <StepEight
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />
      )}
    </div>
  );
};

export default DonorDeclarationForm;
