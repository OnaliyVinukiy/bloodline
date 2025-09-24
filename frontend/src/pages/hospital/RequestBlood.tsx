/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";
import { Button, Label, Modal } from "flowbite-react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Hospital } from "../../types/users";
import { ValidationModal } from "../../components/ValidationModal";
import { BloodRequest } from "../../types/stock";

const HospitalBloodRequest = () => {
  const { state, getAccessToken } = useAuthContext();
  const [user, setUser] = useState<any>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [bloodRequest, setBloodRequest] = useState<BloodRequest>({
    id: "",
    hospitalId: "",
    hospitalName: "",
    hospitalEmail: "",
    contactNumber: "",
    bloodType: "",
    quantity: 0,
    urgency: "medium",
    purpose: "",
    status: "pending",
    requestedAt: new Date(),
    neededBy: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const [validationModalContent, setValidationModalContent] = useState({
    title: "",
    content: "",
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const urgencyLevels = [
    { value: "low", label: "Low (Within 3 days)" },
    { value: "medium", label: "Medium (Within 24 hours)" },
    { value: "high", label: "High (Within 6 hours)" },
    { value: "critical", label: "Critical (Immediate)" },
  ];

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch user info and hospital data
  useEffect(() => {
    const fetchUserAndHospitalInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          const { data: userInfo } = await axios.post(
            `${backendURL}/api/user-info`,
            { accessToken },
            { headers: { "Content-Type": "application/json" } }
          );

          setUser(userInfo);

          // Fetch hospital data
          const { data: hospitalInfo } = await axios.get(
            `${backendURL}/api/hospitals/hospital/${userInfo.email}`
          );

          if (hospitalInfo && hospitalInfo.status === "approved") {
            setHospital(hospitalInfo);

            // Auto-fill the form with hospital details
            setBloodRequest((prev) => ({
              ...prev,
              hospitalId: hospitalInfo._id,
              hospitalName: hospitalInfo.hospitalName,
              hospitalEmail: hospitalInfo.hospitalEmail,
              contactNumber: hospitalInfo.hosContactNumber,
            }));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserAndHospitalInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  const showValidationMessage = (title: string, content: string) => {
    setValidationModalContent({ title, content });
    setShowValidationModal(true);
  };

  const handleInputChange = (field: keyof BloodRequest, value: any) => {
    setBloodRequest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitRequest = async () => {
    // Validation
    if (!bloodRequest.bloodType) {
      showValidationMessage(
        "Blood Type Required",
        "Please select a blood type."
      );
      return;
    }

    if (!bloodRequest.quantity || bloodRequest.quantity <= 0) {
      showValidationMessage(
        "Invalid Quantity",
        "Please enter a valid quantity (minimum 1 unit)."
      );
      return;
    }

    if (bloodRequest.quantity > 500) {
      showValidationMessage(
        "Quantity Limit Exceeded",
        "Maximum 500 units can be requested at once."
      );
      return;
    }

    if (!bloodRequest.purpose.trim()) {
      showValidationMessage(
        "Purpose Required",
        "Please describe the purpose of this blood request."
      );
      return;
    }

    if (bloodRequest.neededBy <= new Date()) {
      showValidationMessage(
        "Invalid Date",
        "Please select a future date for when blood is needed."
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${backendURL}/api/hospitals/blood-requests`, {
        hospitalId: hospital?._id,
        bloodType: bloodRequest.bloodType,
        quantity: bloodRequest.quantity,
        urgency: bloodRequest.urgency,
        purpose: bloodRequest.purpose,
        neededBy: bloodRequest.neededBy,
        requestedAt: new Date(),
      });

      setLoading(false);
      setShowSuccessModal(true);

      // Reset form
      setBloodRequest((prev) => ({
        ...prev,
        bloodType: "",
        quantity: 0,
        urgency: "medium",
        purpose: "",
        neededBy: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }));
    } catch (error) {
      console.error("Error submitting blood request:", error);
      setLoading(false);
      setShowErrorModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="loading flex justify-center items-center h-screen">
        <svg width="64px" height="48px">
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="back"
            stroke="#e53e3e"
            strokeWidth="2"
            fill="none"
          ></polyline>
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="front"
            stroke="#f56565"
            strokeWidth="2"
            fill="none"
          ></polyline>
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">
          Please login to access this page
        </p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Hospital Not Registered
          </h2>
          <p className="text-gray-600 mb-4">
            Your hospital needs to be approved by NBTS before you can request
            blood.
          </p>
          <Button
            color="failure"
            onClick={() => (window.location.href = "/hospital-registration")}
          >
            Complete Hospital Registration
          </Button>
        </div>
      </div>
    );
  }

  if (hospital.status !== "approved") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Approval Pending
          </h2>
          <p className="text-gray-600">
            Your hospital registration is {hospital.status}. You'll be able to
            request blood once approved by NBTS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gray-50 min-h-screen py-8">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blood Request Form
          </h1>
          <p className="text-gray-600">
            Submit a request for blood units from NBTS. All fields are required
            unless marked optional.
          </p>
        </div>

        {/* Hospital Information Card */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Hospital Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-blue-700 font-medium">Hospital Name</Label>
              <p className="text-blue-900">{hospital.hospitalName}</p>
            </div>
            <div>
              <Label className="text-blue-700 font-medium">
                Hospital Email
              </Label>
              <p className="text-blue-900">{hospital.hospitalEmail}</p>
            </div>
            <div>
              <Label className="text-blue-700 font-medium">
                Contact Number
              </Label>
              <p className="text-blue-900">{hospital.hosContactNumber}</p>
            </div>
            <div>
              <Label className="text-blue-700 font-medium">
                Representative
              </Label>
              <p className="text-blue-900">{hospital.repFullName}</p>
            </div>
          </div>
        </div>

        {/* Blood Request Form */}
        <div className="space-y-6">
          {/* Blood Type Selection */}
          <div>
            <Label
              htmlFor="bloodType"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Blood Type Required *
            </Label>
            <select
              id="bloodType"
              value={bloodRequest.bloodType}
              onChange={(e) => handleInputChange("bloodType", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="">Select Blood Type</option>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity and Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="quantity"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Quantity (Units) *
              </Label>
              <input
                type="number"
                id="quantity"
                min="1"
                max="500"
                value={bloodRequest.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value))
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter number of units"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum 500 units per request
              </p>
            </div>

            <div>
              <Label
                htmlFor="urgency"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Urgency Level *
              </Label>
              <select
                id="urgency"
                value={bloodRequest.urgency}
                onChange={(e) => handleInputChange("urgency", e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                {urgencyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Needed By Date */}
          <div>
            <Label
              htmlFor="neededBy"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Needed By *
            </Label>
            <input
              type="datetime-local"
              id="neededBy"
              value={bloodRequest.neededBy.toISOString().slice(0, 16)}
              onChange={(e) =>
                handleInputChange("neededBy", new Date(e.target.value))
              }
              min={new Date().toISOString().slice(0, 16)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>

          {/* Purpose */}
          <div>
            <Label
              htmlFor="purpose"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Purpose of Request *
            </Label>
            <textarea
              id="purpose"
              rows={4}
              value={bloodRequest.purpose}
              onChange={(e) => handleInputChange("purpose", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Please describe the purpose of this blood request (e.g., surgery, emergency, routine stock)"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmitRequest}
              disabled={loading}
              className="focus:outline-none text-white font-medium rounded-lg text-sm px-8 py-3 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-red-500 disabled:cursor-not-allowed flex items-center justify-center"
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
                  Submitting Request...
                </>
              ) : (
                "Submit Blood Request"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <Modal.Header className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xl text-green-600">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            Request Submitted Successfully!
          </p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Your blood request has been submitted to NBTS. You will be notified
            once your request is processed.
          </p>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Reference ID:</strong>{" "}
              {bloodRequest.hospitalId?.slice(-8).toUpperCase()}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onClose={() => setShowErrorModal(false)}>
        <Modal.Header>Submission Error</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            There was an error submitting your blood request. Please try again
            shortly.
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={() => setShowErrorModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Validation Modal */}
      <ValidationModal
        show={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title={validationModalContent.title}
        content={validationModalContent.content}
      />
    </div>
  );
};

export default HospitalBloodRequest;
