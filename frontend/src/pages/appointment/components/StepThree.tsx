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

const StepThree: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  //Structure for the blood donor data
  const [formTwoData, setFormTwoData] = useState({
    isFeelingWell: null,
    isTakingTreatment: null,
    isSurgeryDone: null,
    isPregnant: null,
    isEngageHeavyWork: null,
    diseases: [] as string[],
  });

  //Function to set form data (radiobuttons)
  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormTwoData((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

  //Function to move to next step
  const handleNext = () => {
    onFormDataChange({
      ...formData,
      secondForm: formTwoData,
    });
    onNextStep();
  };

  // Populate the form data from the parent form data
  useEffect(() => {
    if (formData?.secondForm) {
      setFormTwoData(formData.secondForm);
    }
  }, [formData]);

  const [isLoading, setIsLoading] = useState(false);

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
                  1.) Are you feeling well today?
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isFeelingWell"
                      value="yes"
                      checked={formTwoData.isFeelingWell === "yes"}
                      onChange={handleRadioChange("isFeelingWell")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isFeelingWell"
                      value="no"
                      checked={formTwoData.isFeelingWell === "no"}
                      onChange={handleRadioChange("isFeelingWell")}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="diseases"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    2.) Have you ever had or taken treatment for any of the
                    following disease conditions?
                  </Label>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {[
                      "Heart Disease",
                      "Diabetes",
                      "Fits",
                      "Strokes",
                      "Asthma / Lung Disease",
                      "Liver Diseases",
                      "Kidney Diseases",
                      "Blood Disorders",
                      "Cancer",
                    ].map((disease) => (
                      <label key={disease} className="flex items-center">
                        <input
                          type="checkbox"
                          name="diseases"
                          value={disease}
                          checked={formTwoData.diseases.includes(disease)}
                          onChange={(event) => {
                            const value = event.target.value;
                            setFormTwoData((prevState) => {
                              const diseases = prevState.diseases || [];
                              if (event.target.checked) {
                                return {
                                  ...prevState,
                                  diseases: [...diseases, value],
                                };
                              } else {
                                return {
                                  ...prevState,
                                  diseases: diseases.filter((d) => d !== value),
                                };
                              }
                            });
                          }}
                          className="mr-2"
                        />
                        {disease}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    3.) Are you taking any medication/treatment presently?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isTakingTreatment"
                        value="yes"
                        checked={formTwoData.isTakingTreatment === "yes"}
                        onChange={handleRadioChange("isTakingTreatment")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isTakingTreatment"
                        value="no"
                        checked={formTwoData.isTakingTreatment === "no"}
                        onChange={handleRadioChange("isTakingTreatment")}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    4.) Have you undergone any surgery?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isSurgeryDone"
                        value="yes"
                        checked={formTwoData.isSurgeryDone === "yes"}
                        onChange={handleRadioChange("isSurgeryDone")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isSurgeryDone"
                        value="no"
                        checked={formTwoData.isSurgeryDone === "no"}
                        onChange={handleRadioChange("isSurgeryDone")}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    5.) After donating blood, do you have to engage in any heavy
                    work, driving passenger, or heavy vehicles or work at
                    heights today?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isEngageHeavyWork"
                        value="yes"
                        checked={formTwoData.isEngageHeavyWork === "yes"}
                        onChange={handleRadioChange("isEngageHeavyWork")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isEngageHeavyWork"
                        value="no"
                        checked={formTwoData.isEngageHeavyWork === "no"}
                        onChange={handleRadioChange("isEngageHeavyWork")}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    6.) (For Females) Are you pregnant or breast feeding at
                    presen? Or have you had a child birth or an abortion during
                    last 12 months?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isPregnant"
                        value="yes"
                        checked={formTwoData.isPregnant === "yes"}
                        onChange={handleRadioChange("isPregnant")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isPregnant"
                        value="no"
                        checked={formTwoData.isPregnant === "no"}
                        onChange={handleRadioChange("isPregnant")}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={onPreviousStep}
                className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 text-white bg-red-800 rounded-lg hover:bg-red-700"
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

export default StepThree;
