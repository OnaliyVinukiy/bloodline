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
import { useTranslation } from "react-i18next";

const StepFour: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  const { t, i18n } = useTranslation("donorMedicalHistory");

  const [formThreeData, setFormThreeData] = useState({
    hadHepatitis: null as 'Yes' | 'No' | null,
    hadTyphoid: null as 'Yes' | 'No' | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  useEffect(() => {
    if (formData?.thirdForm) {
      setFormThreeData(formData.thirdForm);
    }
  }, [formData]);

  const handleRadioChange =
    (field: keyof typeof formThreeData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormThreeData((prevState) => ({
        ...prevState,
        [field]: event.target.value as 'Yes' | 'No',
      }));
    };

  // --- Centralized Validation Logic ---
  const performValidation = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formThreeData.hadHepatitis) newErrors.hadHepatitis = t("q1_error");
    if (!formThreeData.hadTyphoid) newErrors.hadTyphoid = t("q2_error");

    return newErrors;
  }
  
  // Effect to re-translate errors when the language changes
  useEffect(() => {
    if (showErrorMessage || Object.keys(errors).length > 0) {
        // Re-run validation to get errors in the current language
        const recheckedErrors = performValidation();
        setErrors(recheckedErrors);
        // Also re-translate the general error message if it's showing
        if (showErrorMessage && Object.keys(recheckedErrors).length > 0) {
            setShowErrorMessage(true); 
        } else if (showErrorMessage && Object.keys(recheckedErrors).length === 0) {
            setShowErrorMessage(false);
        }
    }
  }, [i18n.language, formThreeData.hadHepatitis, formThreeData.hadTyphoid]);


  const handleNext = () => {
    const newErrors = performValidation();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShowErrorMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});
    setShowErrorMessage(false);

    onFormDataChange({
      ...formData,
      thirdForm: formThreeData,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    onNextStep();
  };

  return (
    <div>
      <div className="flex justify-center items-center bg-gray-100">
        <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <div className="mt-4 space-y-6">
              <div className="w-full">
                <Label
                  htmlFor="hadHepatitis"
                  className="block mb-2 text-md font-medium text-indigo-900"
                >
                  {t("q1_label")}
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadHepatitis"
                      value="Yes"
                      checked={formThreeData.hadHepatitis === "Yes"}
                      onChange={handleRadioChange("hadHepatitis")}
                      className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    {t("yes")}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadHepatitis"
                      value="No"
                      checked={formThreeData.hadHepatitis === "No"}
                      onChange={handleRadioChange("hadHepatitis")}
                      className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    {t("no")}
                  </label>
                  {errors.hadHepatitis && (
                    <div className="text-red-500 text-sm">{errors.hadHepatitis}</div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="hadTyphoid"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {t("q2_label")}
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadTyphoid"
                        value="Yes"
                        checked={formThreeData.hadTyphoid === "Yes"}
                        onChange={handleRadioChange("hadTyphoid")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("yes")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadTyphoid"
                        value="No"
                        checked={formThreeData.hadTyphoid === "No"}
                        onChange={handleRadioChange("hadTyphoid")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("no")}
                    </label>
                    {errors.hadTyphoid && (
                      <div className="text-red-500 text-sm">
                        {errors.hadTyphoid}
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
                {t("back_button")}
              </button>
              {showErrorMessage && (
                <p className="text-red-500 text-sm mt-2">
                  {t("error_all_fields")}
                </p>
              )}

              <button
                onClick={handleNext}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300"
              >
                {t("next_button")}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StepFour;