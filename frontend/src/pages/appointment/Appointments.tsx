/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "@asgardeo/auth-react";
import { Appointment } from "../../types/appointment";
import { Button, Modal } from "flowbite-react";
import { useTranslation } from "react-i18next";

const DonorAppointments = () => {
  const { t } = useTranslation("donorAppointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const { getAccessToken } = useAuthContext();

  const memoizedGetAccessToken = useCallback(
    () => getAccessToken(),
    [getAccessToken]
  );
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const accessToken = await memoizedGetAccessToken();
        const { data: userInfo } = await axios.post(
          `${backendURL}/api/user-info`,
          { accessToken },
          { headers: { "Content-Type": "application/json" } }
        );

        if (!userInfo.email) {
          console.error("No email found in userInfo");
          setAppointments([]);
          return;
        }

        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointments/${userInfo.email}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Normalize response data to an array
        const appointmentData: Appointment[] = Array.isArray(response.data)
          ? response.data
          : response.data && typeof response.data === "object"
          ? [response.data]
          : [];

        // Sort appointments by date
        const sortedAppointments = appointmentData.sort(
          (a: Appointment, b: Appointment) =>
            new Date(b.selectedDate).getTime() -
            new Date(a.selectedDate).getTime()
        );

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [memoizedGetAccessToken, backendURL]);

  const handleCancelAppointment = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsCancelModalOpen(true);
  };

  // Confirm cancellation
  const confirmCancelAppointment = async () => {
    if (!selectedAppointmentId) return;

    try {
      setIsCancelling(true);
      const token = await memoizedGetAccessToken();
      await axios.put(
        `${backendURL}/api/appointments/cancel-appointment/${selectedAppointmentId}`,
        { status: "Cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the appointments list
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === selectedAppointmentId
            ? { ...appointment, status: "Cancelled" }
            : appointment
        )
      );

      setIsCancelModalOpen(true);
    } catch (error) {
      console.error("Error canceling appointment:", error);
    } finally {
      setIsCancelling(false);
      setIsCancelModalOpen(false);
      setSelectedAppointmentId(null);
    }
  };

  // Loading animation
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
    <div className="flex justify-center mt-8">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-7xl w-full mb-20">
        <div className="text-center mb-10">
          <h1 className="mt-2 text-4xl font-bold text-center mb-6 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent leading-tight pb-2">
            {t("title")}
          </h1>
        </div>
        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-gray-700 uppercase bg-yellow-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t("table_header_date")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("table_header_time")}
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                {t("table_header_status")}
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                {t("table_header_action")}
              </th>
              <th scope="col" className="px-1 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment: Appointment) => (
              <tr
                key={appointment._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.selectedDate}
                </td>
                <td className="px-6 py-4">{appointment.selectedSlot}</td>
                {appointment.status === "Rejected" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="red">{t("status_rejected")}</button>
                    </div>
                  </td>
                ) : appointment.status === "Approved" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="green">{t("status_approved")}</button>
                    </div>
                  </td>
                ) : appointment.status === "Cancelled" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="red">{t("status_cancelled")}</button>
                    </div>
                  </td>
                ) : (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="yellow">{t("status_pending")}</button>
                    </div>
                  </td>
                )}
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => handleCancelAppointment(appointment._id)}
                    className={`text-red-800 border border-red-800 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 transition-all duration-300 ${
                      appointment.status === "Rejected" ||
                      appointment.status === "Cancelled" ||
                      new Date(appointment.selectedDate) < new Date()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:text-white hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                    }`}
                    disabled={
                      appointment.status === "Rejected" ||
                      new Date(appointment.selectedDate) < new Date() ||
                      appointment.status === "Cancelled"
                    }
                  >
                    {t("action_button")}
                  </button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  {t("no_appointments_found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        show={isCancelModalOpen}
        onClose={() => {
          if (!isCancelling) {
            setIsCancelModalOpen(false);
            setSelectedAppointmentId(null);
          }
        }}
      >
        <Modal.Header>{t("modal_title")}</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            {t("modal_message")}
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            color="failure"
            onClick={confirmCancelAppointment}
            disabled={isCancelling}
          >
            {isCancelling ? (
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
                {t("modal_button_cancelling")}
              </>
            ) : (
              t("modal_button_yes")
            )}
          </Button>
          <Button
            color="failure"
            outline
            onClick={() => {
              setIsCancelModalOpen(false);
              setSelectedAppointmentId(null);
            }}
            disabled={isCancelling}
            className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-300"
          >
            {t("modal_button_cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DonorAppointments;