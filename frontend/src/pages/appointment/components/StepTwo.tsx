/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Datepicker, Label, Modal } from "flowbite-react";
import { StepperProps } from "../../../types/stepper";

const StepTwo: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  const { t, i18n } = useTranslation("donorDeclaration");
  
  // State structure for form data
  const [formOneData, setFormOneData] = useState({
    isDonatedBefore: null as 'Yes' | 'No' | null,
    timesOfDonation: "",
    lastDonationDate: "",
    isAnyDifficulty: null as 'Yes' | 'No' | null,
    difficulty: "",
    isMedicallyAdvised: null as 'Yes' | 'No' | null,
    isLeafletRead: null as 'Yes' | 'No' | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  useEffect(() => {
    if (formData?.firstForm) {
      setFormOneData(formData.firstForm);
    }
  }, [formData]);

  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormOneData((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
      // Clear associated input fields and errors on major changes
      if (field === "isDonatedBefore" && event.target.value === "No") {
        setFormOneData((prevState) => ({
          ...prevState,
          timesOfDonation: "",
          lastDonationDate: "",
          isAnyDifficulty: null,
          difficulty: "",
        }));
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.timesOfDonation;
          delete newErrors.lastDonationDate;
          delete newErrors.isAnyDifficulty;
          delete newErrors.difficulty;
          return newErrors;
        });
      }
      if (field === "isAnyDifficulty" && event.target.value === "No") {
         setFormOneData((prevState) => ({
          ...prevState,
          difficulty: "",
        }));
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.difficulty;
          return newErrors;
        });
      }
    };

  const handleInputChange = (field: string, value: string) => {
    setFormOneData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const performValidation = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formOneData.isDonatedBefore)
      newErrors.isDonatedBefore = t("q1_error");

    if (formOneData.isDonatedBefore === "Yes") {
      if (!formOneData.timesOfDonation || isNaN(Number(formOneData.timesOfDonation)) || Number(formOneData.timesOfDonation) <= 0)
        newErrors.timesOfDonation = t("q1_1_error");
      
      if (!formOneData.lastDonationDate)
        newErrors.lastDonationDate = t("q1_2_error");

      if (!formOneData.isAnyDifficulty)
        newErrors.isAnyDifficulty = t("q1_3_error");

      if (formOneData.isAnyDifficulty === "Yes" && !formOneData.difficulty)
        newErrors.difficulty = t("q1_4_error");
    }

    if (!formOneData.isMedicallyAdvised)
      newErrors.isMedicallyAdvised = t("q2_error");
      
    if (!formOneData.isLeafletRead)
      newErrors.isLeafletRead = t("q3_error");

    return newErrors;
  }

  // Effect to re-translate errors when the language changes
  useEffect(() => {
    if (showErrorMessage || Object.keys(errors).length > 0) {
        const recheckedErrors = performValidation();
        // Since we are validating using t(), the resulting errors object contains the translated text
        // and setting it re-renders the component with the new language.
        setErrors(recheckedErrors);
    }
  }, [i18n.language, formOneData, showErrorMessage]);


  const handleNext = () => {
    const newErrors = performValidation();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShowErrorMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (formOneData.isDonatedBefore === "Yes" && formOneData.lastDonationDate) {
      const lastDonation = new Date(formOneData.lastDonationDate);
      const today = new Date();
      
      // Calculate 6 months ago (180 days approximate check)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setDate(today.getDate() - 180); 

      // If last donation date is more recent than 6 months ago, show modal
      if (lastDonation > sixMonthsAgo) {
        setShowModal(true);
        return;
      }
    }

    setErrors({});
    setShowErrorMessage(false);

    onFormDataChange({
      ...formData,
      firstForm: formOneData,
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
                  htmlFor="donatedBefore"
                  className="block mb-2 text-md font-medium text-indigo-900"
                >
                  {t("q1_label")}
                </Label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="donatedBefore"
                      value="Yes"
                      checked={formOneData.isDonatedBefore === "Yes"}
                      onChange={handleRadioChange("isDonatedBefore")}
                      className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    {t("q1_yes")}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="donatedBefore"
                      value="No"
                      checked={formOneData.isDonatedBefore === "No"}
                      onChange={handleRadioChange("isDonatedBefore")}
                      className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    {t("q1_no")}
                  </label>
                  {errors.isDonatedBefore && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.isDonatedBefore}
                    </div>
                  )}
                </div>
              </div>

              {formOneData.isDonatedBefore === "Yes" && (
                <>
                  <div className="mt-4 w-full">
                    <Label
                      htmlFor="timesOfDonation"
                      className="block mb-2 text-sm font-medium text-indigo-900"
                    >
                      {t("q1_1_label")}
                    </Label>
                    <input
                      type="number"
                      min="1"
                      pattern="[0-9]*"
                      value={formOneData.timesOfDonation}
                      onChange={(e) =>
                        handleInputChange("timesOfDonation", e.target.value)
                      }
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    />
                    {errors.timesOfDonation && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.timesOfDonation}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 w-full">
                    <Label
                      htmlFor="lastDonationDate"
                      className="block mb-2 text-sm font-medium text-indigo-900"
                    >
                      {t("q1_2_label")}
                    </Label>
                    <Datepicker
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      value={
                        formOneData.lastDonationDate
                          ? new Date(formOneData.lastDonationDate)
                          : undefined
                      }
                      onChange={(date: Date | null) => {
                        if (date) {
                            // Ensure date is stored as YYYY-MM-DD
                            const formattedDate = date.toISOString().split("T")[0];
                            handleInputChange("lastDonationDate", formattedDate);
                        } else {
                            handleInputChange("lastDonationDate", "");
                        }
                      }}
                      maxDate={new Date()} // Cannot donate in the future
                    />
                    {errors.lastDonationDate && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.lastDonationDate}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 w-full">
                    <Label
                      htmlFor="difficulty"
                      className="block mb-2 text-sm font-medium text-indigo-900"
                    >
                      {t("q1_3_label")}
                    </Label>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value="Yes"
                          checked={formOneData.isAnyDifficulty === "Yes"}
                          onChange={handleRadioChange("isAnyDifficulty")}
                          className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                        />
                        {t("q1_yes")}
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value="No"
                          checked={formOneData.isAnyDifficulty === "No"}
                          onChange={handleRadioChange("isAnyDifficulty")}
                          className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                        />
                        {t("q1_no")}
                      </label>
                      {errors.isAnyDifficulty && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.isAnyDifficulty}
                        </div>
                      )}
                    </div>
                    {formOneData.isAnyDifficulty === "Yes" && (
                      <div className="mt-4 w-full">
                        <Label
                          htmlFor="difficulty"
                          className="block mb-2 text-sm font-medium text-indigo-900"
                        >
                          {t("q1_4_label")}
                        </Label>
                        <input
                          type="text"
                          value={formOneData.difficulty}
                          onChange={(e) =>
                            handleInputChange("difficulty", e.target.value)
                          }
                          className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        />
                        {errors.difficulty && (
                          <div className="text-red-500 text-sm">
                            {errors.difficulty}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="medicallyAdvised"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {t("q2_label")}
                  </Label>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="medicallyAdvised"
                        value="Yes"
                        checked={formOneData.isMedicallyAdvised === "Yes"}
                        onChange={handleRadioChange("isMedicallyAdvised")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q2_yes")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="medicallyAdvised"
                        value="No"
                        checked={formOneData.isMedicallyAdvised === "No"}
                        onChange={handleRadioChange("isMedicallyAdvised")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q2_no")}
                    </label>
                    {errors.isMedicallyAdvised && (
                      <div className="text-red-500 text-sm">
                        {errors.isMedicallyAdvised}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="leafletRead"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {t("q3_label")}
                  </Label>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="leafletRead"
                        value="Yes"
                        checked={formOneData.isLeafletRead === "Yes"}
                        onChange={handleRadioChange("isLeafletRead")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q3_yes")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="leafletRead"
                        value="No"
                        checked={formOneData.isLeafletRead === "No"}
                        onChange={handleRadioChange("isLeafletRead")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("q3_no")}
                    </label>
                    {errors.isLeafletRead && (
                      <div className="text-red-500 text-sm">
                        {errors.isLeafletRead}
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
                  {t("error_message")}
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
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>{t("modal_title")}</Modal.Header>
          <Modal.Body>
            <p className="text-lg text-gray-700">
              {t("modal_message")}
            </p>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button color="failure" onClick={() => setShowModal(false)}>
              {t("modal_button_ok")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default StepTwo;
