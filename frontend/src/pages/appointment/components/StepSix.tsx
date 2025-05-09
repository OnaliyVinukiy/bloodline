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

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

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

    window.scrollTo({ top: 0, behavior: "smooth" });
    onNextStep();
  };

  // Populate the form data from the parent form data
  useEffect(() => {
    if (formData?.fifthForm) {
      setFormFiveData(formData.fifthForm);
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
                  1.) During last 6 months, have you had Dengue fever?
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadDengue"
                      value="Yes"
                      checked={formFiveData.hadDengue === "Yes"}
                      onChange={handleRadioChange("hadDengue")}
                      className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadDengue"
                      value="No"
                      checked={formFiveData.hadDengue === "No"}
                      onChange={handleRadioChange("hadDengue")}
                      className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
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
                        value="Yes"
                        checked={formFiveData.hadOtherFever === "Yes"}
                        onChange={handleRadioChange("hadOtherFever")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadOtherFever"
                        value="No"
                        checked={formFiveData.hadOtherFever === "No"}
                        onChange={handleRadioChange("hadOtherFever")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
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
                        value="Yes"
                        checked={formFiveData.hadDentalExtraction === "Yes"}
                        onChange={handleRadioChange("hadDentalExtraction")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadDentalExtraction"
                        value="No"
                        checked={formFiveData.hadDentalExtraction === "No"}
                        onChange={handleRadioChange("hadDentalExtraction")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
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
                        value="Yes"
                        checked={formFiveData.hadAntibiotic === "Yes"}
                        onChange={handleRadioChange("hadAntibiotic")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadAntibiotic"
                        value="No"
                        checked={formFiveData.hadAntibiotic === "No"}
                        onChange={handleRadioChange("hadAntibiotic")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
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

export default StepSix;
