/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useState } from "react";
import BasicInfo from "./components/DonorDeclarationForm";

const DonorDeclaration = () => {
  const [step, setStep] = useState(1);

  //Handle next button
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  //Handle back button
  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="mt-6 bg-white">
      <div>
        <BasicInfo
          step={step}
          onNextStep={handleNextStep}
          onPreviousStep={handlePreviousStep}
        />
      </div>
    </div>
  );
};

export default DonorDeclaration;
