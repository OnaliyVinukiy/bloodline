/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Button, Label, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { StepperProps } from "../../../types/stepper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { useTranslation } from "react-i18next";

const StepEight: React.FC<StepperProps> = ({
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  const { t } = useTranslation("donorDeclarationFinal");
  
  const [formSevenData, setFormSevenData] = useState({
    donatingMonth: null,
    donorName: "",
    dateSigned: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (formData?.seventhForm) {
      setFormSevenData(formData.seventhForm);
    }
  }, [formData]);

  const { getAccessToken } = useAuthContext();
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormSevenData((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

  const handleInputChange = (field: string, value: string) => {
    setFormSevenData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const submitForm = async () => {
    try {
      setLoading(true);
      const newErrors: { [key: string]: string } = {};

      if (!formSevenData.donatingMonth)
        newErrors.month = t("error_month_required");
      if (!formSevenData.donorName) newErrors.name = t("error_name_required");

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setShowErrorMessage(true);
        setLoading(false);
        return;
      }

      setErrors({});
      setShowErrorMessage(false);
      onFormDataChange({
        ...formData,
        seventhForm: formSevenData,
      });

      const token = await getAccessToken();

      const response = await axios.post(
        `${backendURL}/api/appointments/save-appointment`,
        { ...formData, seventhForm: formSevenData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(t("error_failed_to_create"));
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/appointments");
  };

  return (
    <div>
      <div className="flex justify-center items-center bg-gray-100">
        <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <p className="text-yellow-800 font-semibold font-opensans">
                {t("declaration_title")}
              </p>
            </div>
            <div className="mt-4 space-y-6">
              <div className="w-full"></div>
              <div className="w-full">
                <ul className="list-disc pl-5 text-gray-800 text-md space-y-2 font-medium">
                  <li>
                    {t("declaration_list_1")}
                  </li>
                  <li>
                    {t("declaration_list_2")}
                  </li>
                  <li>
                    {t("declaration_list_3")}
                  </li>
                  <li>
                    {t("declaration_list_4")}
                  </li>
                  <li>
                    {t("declaration_list_5")}
                  </li>
                </ul>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatingMonth"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {t("regular_donor_question")}
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="donatingMonth"
                        value="four"
                        checked={formSevenData.donatingMonth === "four"}
                        onChange={handleRadioChange("donatingMonth")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("donating_month_4")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="donatingMonth"
                        value="six"
                        checked={formSevenData.donatingMonth === "six"}
                        onChange={handleRadioChange("donatingMonth")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("donating_month_6")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="donatingMonth"
                        value="twelve"
                        checked={formSevenData.donatingMonth === "twelve"}
                        onChange={handleRadioChange("donatingMonth")}
                        className="form-radio mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      {t("donating_month_12")}
                    </label>
                  </div>
                  {errors.month && (
                    <div className="text-red-500 text-sm">{errors.month}</div>
                  )}
                </div>
              </div>

              <div className="w-full">
                <Label
                  htmlFor="donatedBefore"
                  className="mb-4 block text-md font-medium text-indigo-900"
                >
                  {t("signature_title")}
                </Label>
                <Label
                  htmlFor="donorName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("donor_name_label")}
                </Label>
                <input
                  type="text"
                  value={formSevenData.donorName}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  onChange={(e) =>
                    handleInputChange("donorName", e.target.value)
                  }
                />
                {errors.name && (
                  <div className="text-red-500 text-sm">{errors.name}</div>
                )}
                <Label
                  htmlFor="date"
                  className="mt-4 block mb-2 text-sm font-medium text-indigo-900"
                >
                  {t("date_label")}
                </Label>
                <input
                  type="date"
                  value={formSevenData.dateSigned}
                  onChange={(e) => handleInputChange("dateSigned", e.target.value)}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
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
                onClick={submitForm}
                disabled={loading}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-red-500 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300"
              >
                {loading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 mr-2 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5c0 27.6-22.4 50-50 50S0 78.1 0 50.5 22.4.5 50 .5s50 22.4 50 50z"
                        fill="currentColor"
                        opacity=".2"
                      />
                      <path
                        d="M93.3 50.5c0-23.9-19.4-43.3-43.3-43.3-6.3 0-12.3 1.3-17.8 3.7-1.6.7-2.2 2.6-1.5 4.2.7 1.6 2.6 2.2 4.2 1.5 4.9-2.1 10.2-3.2 15.6-3.2 21.6 0 39.3 17.7 39.3 39.3s-17.7 39.3-39.3 39.3c-21.6 0-39.3-17.7-39.3-39.3 0-6.8 1.7-13.3 5-19.1.9-1.5.4-3.4-1-4.3s-3.4-.4-4.3 1c-3.8 6.4-5.8 13.7-5.8 21.3 0 23.9 19.4 43.3 43.3 43.3s43.3-19.4 43.3-43.3z"
                        fill="currentColor"
                      />
                    </svg>
                    {t("submitting_button")}
                  </>
                ) : (
                  t("submit_button")
                )}
              </button>
            </div>
          </div>
        </main>
        <Modal show={showModal} onClose={() => handleModalClose()}>
          <Modal.Header className="flex items-center gap-2 ">
            <p className="flex items-center gap-2 text-xl text-green-600">
              <svg
                className="w-6 h-6 text-green-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
                />
              </svg>
              {t("modal_title_success")}
            </p>
          </Modal.Header>
          <Modal.Body>
            <p className="text-lg text-gray-700">
              {t("modal_message_success")}
            </p>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button color="failure" onClick={handleModalClose}>
              {t("modal_button_ok")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default StepEight;