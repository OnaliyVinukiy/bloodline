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

const StepSeven: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  //Structure for form data
  const [formSixData, setFormSixData] = useState({
    isInformed: null,
    isHarmfulCategory: null,
    hadPersistentFever: null,
  });

  //Function to handle radio button change
  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormSixData((prevState) => ({
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
      !formSixData.isInformed ||
      !formSixData.isHarmfulCategory ||
      !formSixData.hadPersistentFever
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
      sixthForm: formSixData,
    });

    onNextStep();
  };

  // Populate the form data from the parent form data
  useEffect(() => {
    if (formData?.sixthForm) {
      setFormSixData(formData.sixthForm);
    }
  }, [formData]);

  return (
    <div>
      <div className="flex justify-center items-center bg-gray-100">
        <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-6 p-4 bg-red-200 rounded-lg">
              <p className="text-red-700 font-semibold font-opensans">
                Important!
              </p>
            </div>
            <div className="mt-4 space-y-6">
              <div className="w-full">
                <Label
                  htmlFor="donatedBefore"
                  className="block mb-2 text-md font-medium text-indigo-900"
                >
                  1.) Do you know that people of following categories should not
                  give blood?
                </Label>
              </div>
              <div className="w-full">
                <ul className="list-disc pl-5 text-gray-800">
                  <li>
                    If you were found to be positive for HIV, Hepatitis B, C or
                    Syphilis infections at any time
                  </li>
                  <li>If you have had multiple sexual partners</li>
                  <li>
                    If you have ever engaged in male to male sexual activity
                  </li>
                  <li>
                    If you have ever injected any drug (esp.Narcotics) not
                    prescribed by a qualified medical practitioner
                  </li>
                  <li>If you have ever worked as a commercial sex worker</li>
                  <li>
                    If you have had sex with a commercial sex worker or an
                    unknown partner during last 1 year
                  </li>
                  <li>
                    If you suspect that you or your partner may have got HIV or
                    any other sexually transmitted infection
                  </li>
                </ul>
                <div className="mt-4 flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isInformed"
                      value="yes"
                      checked={formSixData.isInformed === "yes"}
                      onChange={handleRadioChange("isInformed")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isInformed"
                      value="no"
                      checked={formSixData.isInformed === "no"}
                      onChange={handleRadioChange("isInformed")}
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
                    2.) Do you or your sexual partner belong to one of the above
                    categories?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isHarmfulCategory"
                        value="yes"
                        checked={formSixData.isHarmfulCategory === "yes"}
                        onChange={handleRadioChange("isHarmfulCategory")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isHarmfulCategory"
                        value="no"
                        checked={formSixData.isHarmfulCategory === "no"}
                        onChange={handleRadioChange("isHarmfulCategory")}
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
                    3.) Are you having persistent fever, diarrhoea, multiple
                    swollen lymph nodes or unintentional weight loss?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadPersistentFever"
                        value="yes"
                        checked={formSixData.hadPersistentFever === "yes"}
                        onChange={handleRadioChange("hadPersistentFever")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadPersistentFever"
                        value="no"
                        checked={formSixData.hadPersistentFever === "no"}
                        onChange={handleRadioChange("hadPersistentFever")}
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

export default StepSeven;
