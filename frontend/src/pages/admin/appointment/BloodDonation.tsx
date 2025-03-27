/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import Stepper from "./components/Stepper";
import { useLocation } from "react-router-dom";

const BloodDonation = () => {
  const location = useLocation();
  const { state } = location;
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (state?.status === "Pending") {
      setCurrentStep(1);
    }
  }, [state]);

  //Handle next button
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

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
