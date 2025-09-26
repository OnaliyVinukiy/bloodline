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
  const { t } = useTranslation("donorHealth");
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

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormTwoData((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formTwoData.isFeelingWell) newErrors.isFeelingWell = t("error_message");
    if (!formTwoData.isTakingTreatment) newErrors.isTakingTreatment = t("error_message");
    if (!formTwoData.isSurgeryDone) newErrors.isSurgeryDone = t("error_message");
    if (!formTwoData.isEngageHeavyWork) newErrors.isEngageHeavyWork = t("error_message");
    if (!formTwoData.isPregnant) newErrors.isPregnant = t("error_message");

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
    window.scrollTo({ top: 0, behavior: "smooth" });
    onNextStep();
  };

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
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {Object.entries(t("q2_options", { returnObjects: true }) as Record<string, string>).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          name="diseases"
                          value={key}
                          checked={formTwoData.diseases.includes(key)}
                          onChange={(event) => {
                            const newValue = event.target.value;
                            setFormTwoData((prevState) => {
                              const diseases = prevState.diseases || [];
                              if (event.target.checked) {
                                return {
                                  ...prevState,
                                  diseases: [...diseases, newValue],
                                };
                              } else {
                                return {
                                  ...prevState,
                                  diseases: diseases.filter((d) => d !== newValue),
                                };
                              }
                            });
                          }}
                          className="mr-2 text-red-600 focus:ring-red-500"
                        />
                        {value}
                      </label>
                    ))}
                  </div>
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