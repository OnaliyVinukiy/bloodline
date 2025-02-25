/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React, { useState, useEffect } from "react";
import { Button, Datepicker, Label, Modal } from "flowbite-react";
import { StepperProps } from "../../../types/types";

const StepTwo: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  //Structure for form data
  const [formOneData, setFormOneData] = useState({
    isDonatedBefore: null,
    timesOfDonation: "",
    lastDonationDate: "",
    isAnyDifficulty: null,
    difficulty: "",
    isMedicallyAdvised: null,
    isLeafletRead: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Populate the form data from the parent form data
  useEffect(() => {
    if (formData?.firstForm) {
      setFormOneData(formData.firstForm);
    }
  }, [formData]);

  //Function to set form data (radio buttons)
  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormOneData((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

  //Function to set form data (text fields)
  const handleInputChange = (field: string, value: string) => {
    setFormOneData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  //Save form data and move to next step
  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    // Check if necessary fields are filled
    if (!formOneData.isDonatedBefore)
      newErrors.isDonatedBefore = "Please select an option.";
    if (formOneData.isDonatedBefore === "yes" && !formOneData.timesOfDonation)
      newErrors.timesOfDonation = "Times of donation is required.";
    if (formOneData.isDonatedBefore === "yes" && !formOneData.lastDonationDate)
      newErrors.lastDonationDate = "Last donation date is required.";
    if (formOneData.isDonatedBefore === "yes" && !formOneData.isAnyDifficulty)
      newErrors.isAnyDifficulty = "Please select an option.";
    if (formOneData.isAnyDifficulty === "yes" && !formOneData.difficulty)
      newErrors.difficulty = "Please specify the difficulty.";
    if (!formOneData.isMedicallyAdvised)
      newErrors.isMedicallyAdvised = "Please select an option.";
    if (!formOneData.isLeafletRead)
      newErrors.isLeafletRead = "Please select an option.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrorMessage(true);
      return;
    }

    // Check if last donation was within the last 6 months
    if (formOneData.isDonatedBefore === "yes" && formOneData.lastDonationDate) {
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
                  1.) Have you donated blood previously?
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="donatedBefore"
                      value="yes"
                      checked={formOneData.isDonatedBefore === "yes"}
                      onChange={handleRadioChange("isDonatedBefore")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="donatedBefore"
                      value="no"
                      checked={formOneData.isDonatedBefore === "no"}
                      onChange={handleRadioChange("isDonatedBefore")}
                      className="mr-2"
                    />
                    No
                  </label>
                  {errors.isDonatedBefore && (
                    <div className="text-red-500 text-sm">
                      {errors.isDonatedBefore}
                    </div>
                  )}
                </div>
              </div>

              {formOneData.isDonatedBefore === "yes" && (
                <>
                  <div className="mt-4 w-full">
                    <Label
                      htmlFor="timesOfDonation"
                      className="block mb-2 text-sm font-medium text-indigo-900"
                    >
                      1.1.) How many times?
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
                      1.2.) Date of last donation
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
                      1.3.) Did you experience any ailment, difficulty, or
                      discomfort during previous donations?
                    </Label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value="yes"
                          checked={formOneData.isAnyDifficulty === "yes"}
                          onChange={handleRadioChange("isAnyDifficulty")}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value="no"
                          checked={formOneData.isAnyDifficulty === "no"}
                          onChange={handleRadioChange("isAnyDifficulty")}
                          className="mr-2"
                        />
                        No
                      </label>
                      {errors.isAnyDifficulty && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.isAnyDifficulty}
                        </div>
                      )}
                    </div>
                    {formOneData.isAnyDifficulty === "yes" && (
                      <div className="mt-4 w-full">
                        <Label
                          htmlFor="difficulty"
                          className="block mb-2 text-sm font-medium text-indigo-900"
                        >
                          1.4.) What was the difficulty?
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
                    2.) Have you ever been medically advised not to donate
                    blood?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="medicallyAdvised"
                        value="yes"
                        checked={formOneData.isMedicallyAdvised === "yes"}
                        onChange={handleRadioChange("isMedicallyAdvised")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="medicallyAdvised"
                        value="no"
                        checked={formOneData.isMedicallyAdvised === "no"}
                        onChange={handleRadioChange("isMedicallyAdvised")}
                        className="mr-2"
                      />
                      No
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
                    3.) Have you read and understood the "Blood donors
                    information leaflet"?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="leafletRead"
                        value="yes"
                        checked={formOneData.isLeafletRead === "yes"}
                        onChange={handleRadioChange("isLeafletRead")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="leafletRead"
                        value="no"
                        checked={formOneData.isLeafletRead === "no"}
                        onChange={handleRadioChange("isLeafletRead")}
                        className="mr-2"
                      />
                      No
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
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Donation Eligibility</Modal.Header>
          <Modal.Body>
            <p className="text-lg text-gray-700">
              You cannot donate blood as your last donation was less than 6
              months ago. Please wait until you are eligible.
            </p>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button color="failure" onClick={() => setShowModal(false)}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default StepTwo;
