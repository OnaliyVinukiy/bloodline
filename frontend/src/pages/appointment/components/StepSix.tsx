/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Label } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { StepperProps } from "../../../types/types";

const StepSix: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  //Structure for form data
  const [formFiveData, setFormFiveData] = useState({
    hadDengue: null,
    hadOtherFever: null,
    hadDentalExtraction: null,
    hadAntibiotic: null,
  });

  //Function to set form data (radio buttons)
  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormFiveData((prevState) => ({
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
      !formFiveData.hadAntibiotic ||
      !formFiveData.hadDengue ||
      !formFiveData.hadDentalExtraction ||
      !formFiveData.hadOtherFever
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
      fifthForm: formFiveData,
    });

    onNextStep();
  };

  // Populate the form data from the parent form data
  useEffect(() => {
    if (formData?.fifthForm) {
      setFormFiveData(formData.fifthForm);
    }
  }, [formData]);

  const [isLoading, setIsLoading] = useState(false);

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
                  1.) During last 6 months, have you had Dengue fever?
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadDengue"
                      value="yes"
                      checked={formFiveData.hadDengue === "yes"}
                      onChange={handleRadioChange("hadDengue")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadDengue"
                      value="no"
                      checked={formFiveData.hadDengue === "no"}
                      onChange={handleRadioChange("hadDengue")}
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
                    2.) During last 1 month, have you had Chicken Pox, Measles,
                    Mumps, Rubella, Diarrhoea or any other long standing(more
                    than one week) fever?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadOtherFever"
                        value="yes"
                        checked={formFiveData.hadOtherFever === "yes"}
                        onChange={handleRadioChange("hadOtherFever")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadOtherFever"
                        value="no"
                        checked={formFiveData.hadOtherFever === "no"}
                        onChange={handleRadioChange("hadOtherFever")}
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
                    3.) During last 1 week, have you had a dental extraction?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadDentalExtraction"
                        value="yes"
                        checked={formFiveData.hadDentalExtraction === "yes"}
                        onChange={handleRadioChange("hadDentalExtraction")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadDentalExtraction"
                        value="no"
                        checked={formFiveData.hadDentalExtraction === "no"}
                        onChange={handleRadioChange("hadDentalExtraction")}
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
                    4.) During last 1 week, have you taken Aspirin, Antibiotics
                    or any other medicine?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadAntibiotic"
                        value="yes"
                        checked={formFiveData.hadAntibiotic === "yes"}
                        onChange={handleRadioChange("hadAntibiotic")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadAntibiotic"
                        value="no"
                        checked={formFiveData.hadAntibiotic === "no"}
                        onChange={handleRadioChange("hadAntibiotic")}
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
                onClick={onPreviousStep}
                className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300"
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

export default StepSix;
