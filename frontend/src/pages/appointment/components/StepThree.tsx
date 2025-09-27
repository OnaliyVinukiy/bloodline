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

const StepThree: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  const { t, i18n } = useTranslation("donorHealth");
  
  const [formTwoData, setFormTwoData] = useState({
    isFeelingWell: null as 'Yes' | 'No' | null,
    isTakingTreatment: null as 'Yes' | 'No' | null,
    isSurgeryDone: null as 'Yes' | 'No' | null,
    isPregnant: null as 'Yes' | 'No' | null, // Assuming this may be set regardless of gender, but only validated for female later
    isEngageHeavyWork: null as 'Yes' | 'No' | null,
    diseases: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  useEffect(() => {
    if (formData?.secondForm) {
      setFormTwoData(formData.secondForm);
    }
  }, [formData]);

  const handleRadioChange =
    (field: keyof typeof formTwoData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormTwoData((prevState) => ({
        ...prevState,
        [field]: event.target.value as 'Yes' | 'No',
      }));
    };

  // --- Centralized Validation Logic ---
  const performValidation = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formTwoData.isFeelingWell) newErrors.isFeelingWell = t("q1_error");
    
    // Note: Assuming q2 is optional, but if "Yes" to any checkbox is a deferral reason, 
    // that logic should be in handleNext. For now, it's not a hard error.

    if (!formTwoData.isTakingTreatment) newErrors.isTakingTreatment = t("q3_error");
    if (!formTwoData.isSurgeryDone) newErrors.isSurgeryDone = t("q4_error");
    if (!formTwoData.isEngageHeavyWork) newErrors.isEngageHeavyWork = t("q5_error");
    
    // Check isPregnant only if gender is Female (assuming donorInfo is available in formData)
    const isFemale = formData.donorInfo?.gender === "Female";
    if (isFemale && !formTwoData.isPregnant) {
        newErrors.isPregnant = t("q6_error");
    } else if (!isFemale) {
        // Clear isPregnant if male, though not strictly necessary if logic handles it
        // and we only validate if female. We keep the field optional for males.
        // For male, we ensure the error is not set.
        if (newErrors.isPregnant) delete newErrors.isPregnant;
    }


    return newErrors;
  }
  
  // Effect to re-translate errors when the language changes
  useEffect(() => {
    if (showErrorMessage || Object.keys(errors).length > 0) {
        // Re-run validation to get errors in the current language
        const recheckedErrors = performValidation();
        setErrors(recheckedErrors);
    }
  }, [i18n.language, formTwoData, showErrorMessage, formData.donorInfo?.gender]);


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
      secondForm: formTwoData,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    onNextStep();
  };
  
  // Handle checkbox change for diseases
  const handleDiseaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setFormTwoData((prevState) => {
        const diseases = prevState.diseases || [];
        if (checked) {
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
  };

  return (
    <div>
      <div className="flex justify-center items-center bg-gray-100">
        <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <div className="mt-4 space-y-6">
              <div className="w-full">
                <Label
                  htmlFor="isFeelingWell"
                  className="block mb-2 text-md font-medium text-indigo-900"
                >
                  {t("q1_label")}
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isFeelingWell"
                      value="Yes"
                      checked={formTwoData.isFeelingWell === "Yes"}
                      onChange={handleRadioChange("isFeelingWell")}
                      className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    {t("q1_yes")}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isFeelingWell"
                      value="No"
                      checked={formTwoData.isFeelingWell === "No"}
                      onChange={handleRadioChange("isFeelingWell")}
                      className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    {t("q1_no")}
                  </label>
                  {errors.isFeelingWell && (
                    <div className="text-red-500 text-sm">{errors.isFeelingWell}</div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="diseases"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {t("q2_label")}
                  </Label>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* The use of { returnObjects: true } is crucial here for dynamic options */}
                    {Object.entries(t("q2_options", { returnObjects: true }) as Record<string, string>).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          name="diseases"
                          value={key}
                          checked={formTwoData.diseases.includes(key)}
                          onChange={handleDiseaseChange}
                          className="mr-2 text-red-600 focus:ring-red-500"
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                  {/* Note: No error for Q2 needed as it's a non-required, info-gathering checklist */}
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="isTakingTreatment"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {t("q3_label")}
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isTakingTreatment"
                        value="Yes"
                        checked={formTwoData.isTakingTreatment === "Yes"}
                        onChange={handleRadioChange("isTakingTreatment")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q3_yes")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isTakingTreatment"
                        value="No"
                        checked={formTwoData.isTakingTreatment === "No"}
                        onChange={handleRadioChange("isTakingTreatment")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q3_no")}
                    </label>
                    {errors.isTakingTreatment && (
                      <div className="text-red-500 text-sm">
                        {errors.isTakingTreatment}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="isSurgeryDone"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {t("q4_label")}
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isSurgeryDone"
                        value="Yes"
                        checked={formTwoData.isSurgeryDone === "Yes"}
                        onChange={handleRadioChange("isSurgeryDone")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q4_yes")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isSurgeryDone"
                        value="No"
                        checked={formTwoData.isSurgeryDone === "No"}
                        onChange={handleRadioChange("isSurgeryDone")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q4_no")}
                    </label>
                    {errors.isSurgeryDone && (
                      <div className="text-red-500 text-sm">
                        {errors.isSurgeryDone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="isEngageHeavyWork"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {t("q5_label")}
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isEngageHeavyWork"
                        value="Yes"
                        checked={formTwoData.isEngageHeavyWork === "Yes"}
                        onChange={handleRadioChange("isEngageHeavyWork")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q5_yes")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isEngageHeavyWork"
                        value="No"
                        checked={formTwoData.isEngageHeavyWork === "No"}
                        onChange={handleRadioChange("isEngageHeavyWork")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q5_no")}
                    </label>
                    {errors.isEngageHeavyWork && (
                      <div className="text-red-500 text-sm">
                        {errors.isEngageHeavyWork}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Q6 - Is Pregnant (Only validated if gender is Female, hidden from Male UI if desired) */}
              {formData.donorInfo?.gender === "Female" && (
                <div className="mt-6 space-y-6">
                  <div className="w-full">
                    <Label
                      htmlFor="isPregnant"
                      className="block mb-2 text-md font-medium text-indigo-900"
                    >
                      {t("q6_label")}
                    </Label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPregnant"
                          value="Yes"
                          checked={formTwoData.isPregnant === "Yes"}
                          onChange={handleRadioChange("isPregnant")}
                          className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                        />
                        {t("q6_yes")}
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPregnant"
                          value="No"
                          checked={formTwoData.isPregnant === "No"}
                          onChange={handleRadioChange("isPregnant")}
                          className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                        />
                        {t("q6_no")}
                      </label>
                      {errors.isPregnant && (
                        <div className="text-red-500 text-sm">
                          {errors.isPregnant}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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

export default StepThree;
