/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Fetch appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/appointments/fetch-appointment/${id}`
        );
        setAppointment(response.data);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setError("Failed to fetch appointment details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

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
                Accept
              </button>
              <button
                type="button"
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
    </div>
  );
};

export default AppointmentDetails;
