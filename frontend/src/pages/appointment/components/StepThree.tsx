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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  //Function to set form data (radiobuttons)
  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormTwoData((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

  //Save form data and move to next step
  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    // Check if necessary fields are filled
    if (
      !formTwoData.isFeelingWell ||
      !formTwoData.isEngageHeavyWork ||
      !formTwoData.isPregnant ||
      !formTwoData.isSurgeryDone ||
      !formTwoData.isTakingTreatment
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
                      value="Yes"
                      checked={formTwoData.isFeelingWell === "Yes"}
                      onChange={handleRadioChange("isFeelingWell")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isFeelingWell"
                      value="No"
                      checked={formTwoData.isFeelingWell === "No"}
                      onChange={handleRadioChange("isFeelingWell")}
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
                        value="Yes"
                        checked={formTwoData.isTakingTreatment === "Yes"}
                        onChange={handleRadioChange("isTakingTreatment")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isTakingTreatment"
                        value="No"
                        checked={formTwoData.isTakingTreatment === "No"}
                        onChange={handleRadioChange("isTakingTreatment")}
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
                    4.) Have you undergone any surgery?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isSurgeryDone"
                        value="Yes"
                        checked={formTwoData.isSurgeryDone === "Yes"}
                        onChange={handleRadioChange("isSurgeryDone")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isSurgeryDone"
                        value="No"
                        checked={formTwoData.isSurgeryDone === "No"}
                        onChange={handleRadioChange("isSurgeryDone")}
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
                    5.) After donating blood, do you have to engage in any heavy
                    work, driving passenger, or heavy vehicles or work at
                    heights today?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isEngageHeavyWork"
                        value="Yes"
                        checked={formTwoData.isEngageHeavyWork === "Yes"}
                        onChange={handleRadioChange("isEngageHeavyWork")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isEngageHeavyWork"
                        value="No"
                        checked={formTwoData.isEngageHeavyWork === "No"}
                        onChange={handleRadioChange("isEngageHeavyWork")}
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
                    6.) (For Females) Are you pregnant or breast feeding at
                    present? Or have you had a child birth or an abortion during
                    last 12 months?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isPregnant"
                        value="Yes"
                        checked={formTwoData.isPregnant === "Yes"}
                        onChange={handleRadioChange("isPregnant")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isPregnant"
                        value="No"
                        checked={formTwoData.isPregnant === "No"}
                        onChange={handleRadioChange("isPregnant")}
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

export default StepThree;
