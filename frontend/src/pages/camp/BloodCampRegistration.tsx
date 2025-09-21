/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import StepperEnglish from "./components/English/Stepper";
import { useAuthContext } from "@asgardeo/auth-react";

const BloodCampRegistration = () => {
  const [step, setStep] = useState(1);
  const { state, signIn } = useAuthContext();

  useEffect(() => {
    if (!state?.isAuthenticated) {
      signIn();
    }
  }, [state]);

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
        <StepperEnglish
          step={step}
          setStep={setStep}
          onNextStep={handleNextStep}
          onPreviousStep={handlePreviousStep}
        />
      </div>
    </div>
  );
};

export default BloodCampRegistration;
