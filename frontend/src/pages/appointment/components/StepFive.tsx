/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Label } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { StepperProps } from "../../../types/stepper";

const StepFive: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  //Structure for form data
  const [formFourData, setFormFourData] = useState({
    hadVaccination: null,
    hadAcupuncture: null,
    hadImprisoned: null,
    hadTravelledAbroad: null,
    hadReceivedBlood: null,
    hadMaleria: null,
  });

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  //Function to set form data (radio buttons)
  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormFourData((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  //Function to move to next step
  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    // Check if necessary fields are filled
    if (
      !formFourData.hadAcupuncture ||
      !formFourData.hadImprisoned ||
      !formFourData.hadMaleria ||
      !formFourData.hadReceivedBlood ||
      !formFourData.hadTravelledAbroad ||
      !formFourData.hadVaccination
    )
      newErrors.isEmpty = "Please select an option.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrorMessage(true);
      return;
    }

    setErrors({});
    setShowErrorMessage(false);

    onFormDataChange({
      ...formData,
      fourthForm: formFourData,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    onNextStep();
  };

  // Populate the form data from the parent form data
  useEffect(() => {
    if (formData?.fourthForm) {
      setFormFourData(formData.fourthForm);
    }
  }, [formData]);

  return (
    <div>
      <div className="flex justify-center items-center bg-gray-100">
        <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <div className="mt-4 space-y-6">
              <div className="w-full">
                <Label
                  htmlFor="donatedBefore"
                  className="block mb-2 text-md font-medium text-indigo-900"
                >
                  During past 12 months
                </Label>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="donatedBefore"
                  className="block mb-2 text-md font-medium text-indigo-900"
                >
                  1.) Have you received any vaccination?
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadVaccination"
                      value="Yes"
                      checked={formFourData.hadVaccination === "Yes"}
                      onChange={handleRadioChange("hadVaccination")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadVaccination"
                      value="No"
                      checked={formFourData.hadVaccination === "No"}
                      onChange={handleRadioChange("hadVaccination")}
                      className="mr-2"
                    />
                    No
                  </label>
                  {errors.isEmpty && (
                    <div className="text-red-500 text-sm">{errors.isEmpty}</div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    2.) Have you had tattooing, ear/body piercing or acupuncture
                    treatement?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadAcupuncture"
                        value="Yes"
                        checked={formFourData.hadAcupuncture === "Yes"}
                        onChange={handleRadioChange("hadAcupuncture")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadAcupuncture"
                        value="No"
                        checked={formFourData.hadAcupuncture === "No"}
                        onChange={handleRadioChange("hadAcupuncture")}
                        className="mr-2"
                      />
                      No
                    </label>
                    {errors.isEmpty && (
                      <div className="text-red-500 text-sm">
                        {errors.isEmpty}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    3.) Have you been imprisoned for any reason?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadImprisoned"
                        value="Yes"
                        checked={formFourData.hadImprisoned === "Yes"}
                        onChange={handleRadioChange("hadImprisoned")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadImprisoned"
                        value="No"
                        checked={formFourData.hadImprisoned === "No"}
                        onChange={handleRadioChange("hadImprisoned")}
                        className="mr-2"
                      />
                      No
                    </label>
                    {errors.isEmpty && (
                      <div className="text-red-500 text-sm">
                        {errors.isEmpty}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    4.) Have you or your partner travelled abroad?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadTravelledAbroad"
                        value="Yes"
                        checked={formFourData.hadTravelledAbroad === "Yes"}
                        onChange={handleRadioChange("hadTravelledAbroad")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadTravelledAbroad"
                        value="No"
                        checked={formFourData.hadTravelledAbroad === "No"}
                        onChange={handleRadioChange("hadTravelledAbroad")}
                        className="mr-2"
                      />
                      No
                    </label>
                    {errors.isEmpty && (
                      <div className="text-red-500 text-sm">
                        {errors.isEmpty}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    5.) Have you or your partner received blood or blood
                    products?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadReceivedBlood"
                        value="Yes"
                        checked={formFourData.hadReceivedBlood === "Yes"}
                        onChange={handleRadioChange("hadReceivedBlood")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadReceivedBlood"
                        value="No"
                        checked={formFourData.hadReceivedBlood === "No"}
                        onChange={handleRadioChange("hadReceivedBlood")}
                        className="mr-2"
                      />
                      No
                    </label>
                    {errors.isEmpty && (
                      <div className="text-red-500 text-sm">
                        {errors.isEmpty}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    6.) Have you had Malaria or taken treatment for Malaria?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadMaleria"
                        value="Yes"
                        checked={formFourData.hadMaleria === "Yes"}
                        onChange={handleRadioChange("hadMaleria")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadMaleria"
                        value="No"
                        checked={formFourData.hadMaleria === "No"}
                        onChange={handleRadioChange("hadMaleria")}
                        className="mr-2"
                      />
                      No
                    </label>
                    {errors.isEmpty && (
                      <div className="text-red-500 text-sm">
                        {errors.isEmpty}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevious}
                className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
              >
                Back
              </button>
              {showErrorMessage && (
                <p className="text-red-500 text-sm mt-2">
                  Please fill all required fields.
                </p>
              )}

              <button
                onClick={handleNext}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StepFive;
