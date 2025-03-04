/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../../../types/types";
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

const BasicInfo = ({
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
            "http://localhost:5000/api/user-info",
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

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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

export default BasicInfo;
