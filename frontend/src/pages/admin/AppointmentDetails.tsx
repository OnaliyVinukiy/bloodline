/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { Button, Modal } from "flowbite-react";
import { useAuthContext } from "@asgardeo/auth-react";

const AppointmentDetails = () => {
  const { id } = useParams();
  const { getAccessToken } = useAuthContext();
  const [appointment, setAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApprovedToastOpen, setIsApprovedToastOpen] = useState(false);
  const [isRejectedToastOpen, setIsRejectedToastOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  //Fetch appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointment(response.data);
        console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setError("Failed to fetch appointment details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  //Handle approve appointment
  const handleApprove = async () => {
    const token = await getAccessToken();

    try {
      setIsApproving(true);
      await axios.put(
        `${backendURL}/api/appointments/approve-appointment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAppointment((prev: any) => ({ ...prev, status: "Approved" }));
      setIsApprovedToastOpen(true);

      setTimeout(() => {
        window.location.href = "http://localhost:5173/admin/appointments";
      }, 1500);
    } catch (error) {
      console.error("Error approving appointment:", error);
      setError("Failed to approve appointment.");
    } finally {
      setIsApproving(false);
      setIsApproveModalOpen(false);
    }
  };
  //Handle reject appointment
  const handleReject = async () => {
    const token = await getAccessToken();

    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      setIsRejecting(true);
      await axios.put(
        `${backendURL}/api/appointments/reject-appointment/${id}`,
        { reason: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAppointment((prev: any) => ({ ...prev, status: "Rejected" }));
      setIsRejectedToastOpen(true);
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      setError("Failed to reject appointment.");
    } finally {
      setIsRejecting(false);
      setIsRejectModalOpen(false);
      setRejectionReason("");
    }
  };

  //Loading animation
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

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold font-roboto text-indigo-900 mb-8">
            Appointment Details
          </h2>

          <div className="space-y-4 font-roboto">
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                1.) Donated blood previously?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.firstForm.isDonatedBefore}
              </span>
            </div>

            {appointment.firstForm.isDonatedBefore === "Yes" && (
              <>
                <div className="flex justify-between items-center border-b pb-2">
                  <p className="text-md font-medium font-roboto text-gray-700">
                    1.1.) Times of Donation?
                  </p>
                  <span className="text-lg font-semibold text-red-700">
                    {appointment.firstForm.timesOfDonation}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <p className="text-md font-medium text-gray-700">
                    1.2.) Date of last donation?
                  </p>
                  <span className="text-lg font-semibold text-red-700">
                    {appointment.firstForm.lastDonationDate}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <p className="text-md font-medium text-gray-700">
                    1.3.) Had any difficulty during previous donations?
                  </p>
                  <span className="text-lg font-semibold text-red-700">
                    {appointment.firstForm.isAnyDifficulty}
                  </span>
                </div>
              </>
            )}

            {appointment.firstForm.isAnyDifficulty === "Yes" && (
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-md font-medium text-gray-700">
                  1.4.) What was the difficulty?
                </p>
                <span className="text-lg font-semibold text-red-700">
                  {appointment.firstForm.difficulty}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                2.) Medically advised not to donate blood?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.firstForm.isMedicallyAdvised}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                3.) Read leaflet?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.firstForm.isLeafletRead}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                4.) Feeling well today?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.secondForm.isFeelingWell}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                5.) Taken treatments for?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.secondForm.diseases?.join(", ")}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                6.) Currently taking any treatments?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.secondForm.isTakingTreatment}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                7.) Undergone any surgery?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.secondForm.isSurgeryDone}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                8.) Has to engage in heavy work?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.secondForm.isEngageHeavyWork}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                9.) Had Jaundice / Hepatitis?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.thirdForm.hadHepatitis}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                10.) Had tuberculosis or typhoid?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.thirdForm.hadTyphoid}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                11.) Had received any vaccination?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fourthForm.hadVaccination}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                12.) Had an acupunture?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fourthForm.hadAcupuncture}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                13.) Had been imprisoned?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fourthForm.hadImprisoned}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                14.) Had the partner travelled abroad?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fourthForm.hadTravelledAbroad}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                15.) Had the partner received blood or blood products?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fourthForm.hadReceivedBlood}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                16.) Had Maleria?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fourthForm.hadMaleria}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                17.) Had dengue fever during last 6 months?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fifthForm.hadDengue}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                18.) Had any long standing fever?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fifthForm.hadOtherFever}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                19.) Had dental extraction?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fifthForm.hadDentalExtraction}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                20.) Had taken Antibiotics or any other medicine?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.fifthForm.hadAntibiotic}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                21.) Aware about the harmful categories?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.sixthForm.isInformed}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                22.) Belongs to harmful categories?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.sixthForm.isHarmfulCategory}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                23.) Having persistent fever or weight loss?
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.sixthForm.isHarmfulCategory}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                23.) Willing to be a regular donor per (months)
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.seventhForm.donatingMonth}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                23.) Signature
              </p>
              <span className="text-lg font-semibold text-red-700">
                {appointment.seventhForm.donorName}
              </span>
            </div>
            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(true)}
                className="mt-8 focus:outline-none text-white inline-flex items-center text-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                <svg
                  className="w-5 h-5 me-1 -ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 11.917 9.724 16.5 19 7.5"
                  />
                </svg>
                Approve
              </button>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                className="ml-2 mt-8 focus:outline-none text-white inline-flex items-center text-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                <svg
                  className="w-5 h-5 me-1 -ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                Reject
              </button>
            </div>
          </div>
        </div>
      </main>

      <Modal
        show={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
      >
        <Modal.Header>Approve Appointment</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Are you sure you want to approve this appointment?
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={handleApprove}>
            {isApproving ? (
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
                Approving...
              </>
            ) : (
              "Yes"
            )}
          </Button>
          <Button
            color="failure"
            outline
            onClick={() => setIsApproveModalOpen(false)}
            className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-300"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {isRejectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800">
              Reject Appointment
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Provide a reason for rejection:
            </p>

            <textarea
              className="w-full mt-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason..."
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-red-800 hover:text-white border border-red-800 hover:bg-red-700 rounded-lg text-sm hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="px-4 py-2 bg-red-700 text-white rounded-lg  text-sm hover:bg-red-800 disabled:bg-red-400 flex items-center justify-center"
              >
                {isRejecting ? (
                  <div className="flex items-center">
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
                    <span>Rejecting</span>
                  </div>
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isRejectedToastOpen && (
        <Toast className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Rejected successfully.</div>
          <Toast.Toggle onClick={() => setIsRejectedToastOpen(false)} />
        </Toast>
      )}

      {isApprovedToastOpen && (
        <Toast className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Approved successfully.</div>
          <Toast.Toggle onClick={() => setIsApprovedToastOpen(false)} />
        </Toast>
      )}
    </div>
  );
};

export default AppointmentDetails;
