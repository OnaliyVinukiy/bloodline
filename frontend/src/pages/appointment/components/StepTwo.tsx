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
  const { t } = useTranslation("donorDeclaration");
  const [formOneData, setFormOneData] = useState({
    isDonatedBefore: null,
    timesOfDonation: "",
    lastDonationDate: "",
    isAnyDifficulty: null,
    difficulty: "",
    isMedicallyAdvised: null,
    isLeafletRead: null,
  });

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    };

  const handleInputChange = (field: string, value: string) => {
    setFormOneData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formOneData.isDonatedBefore)
      newErrors.isDonatedBefore = t("q1_error");
    if (formOneData.isDonatedBefore === "Yes" && !formOneData.timesOfDonation)
      newErrors.timesOfDonation = t("q1_1_error");
    if (formOneData.isDonatedBefore === "Yes" && !formOneData.lastDonationDate)
      newErrors.lastDonationDate = t("q1_2_error");
    if (formOneData.isDonatedBefore === "Yes" && !formOneData.isAnyDifficulty)
      newErrors.isAnyDifficulty = t("q1_3_error");
    if (formOneData.isAnyDifficulty === "Yes" && !formOneData.difficulty)
      newErrors.difficulty = t("q1_4_error");
    if (!formOneData.isMedicallyAdvised)
      newErrors.isMedicallyAdvised = t("q2_error");
    if (!formOneData.isLeafletRead)
      newErrors.isLeafletRead = t("q3_error");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrorMessage(true);
      return;
    }

    if (formOneData.isDonatedBefore === "Yes" && formOneData.lastDonationDate) {
      const lastDonation = new Date(formOneData.lastDonationDate);
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);

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
                <div className="flex items-center space-x-4">
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
                    <div className="text-red-500 text-sm">
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
                      type="text"
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
                      onChange={(date) => {
                        if (date) {
                          handleInputChange(
                            "lastDonationDate",
                            date.toISOString().split("T")[0]
                          );
                        }
                      }}
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
                    <div className="flex items-center space-x-4">
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
                  <div className="flex items-center space-x-4">
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
                  <div className="flex items-center space-x-4">
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