/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
"use client";
import { useAuthContext } from "@asgardeo/auth-react";
import { useNavigate } from "react-router-dom";

export function CarouselSlider() {
  const { state, signIn } = useAuthContext();
  const navigate = useNavigate();

  //Direct the user to relevant page based on authentication status
  const handleDonorRegistration = () => {
    if (state?.isAuthenticated) {
      navigate("/profile");
    } else {
      signIn();
    }
  };
  return (
    <section
      className="bg-cover bg-no-repeat bg-center h-[700px] flex items-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('src/assets/heart.jpg')`,
      }}
    >
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center sm:py-12">
        <img
          src="src/assets/bloodlogo.png"
          className="w-20 h-20 mx-auto mb-8 sm:w-24 sm:h-24 sm:mb-12"
          alt="Bloodline Logo"
        />
        <a
          href="#"
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-6 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          role="alert"
        >
          <span className="text-xs bg-red-600 rounded-full text-white px-4 py-1.5 mr-3">
            Who we are
          </span>
          <span className="text-sm font-medium">
            Learn more about Bloodline!
          </span>
          <svg
            className="ml-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </a>

        <h1 className="mb-6 text-3xl font-semibold tracking-tight leading-tight text-white sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl">
          Every Drop Counts, Every Life Matters!
        </h1>
        <p className="text-base font-normal text-white sm:text-lg md:text-xl dark:text-gray-400">
          Join us in creating a world where no life is lost due to the lack of
          blood.
        </p>
        <p className="mb-8 text-base font-normal text-white sm:text-lg md:text-xl dark:text-gray-400">
          Together, we save lives.
        </p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            className="inline-flex justify-center items-center py-2 px-4 text-sm font-medium text-center text-white rounded-lg bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900 sm:py-3 sm:px-5 sm:text-base"
          >
            Place an appointment
            <svg
              className="ml-2 -mr-1 w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
          <button
            onClick={handleDonorRegistration}
            className="inline-flex justify-center items-center py-2 px-4 text-sm font-medium text-center text-white rounded-lg border border-gray-300 hover:bg-black focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-black dark:focus:ring-gray-800 sm:py-3 sm:px-5 sm:text-base"
          >
            <svg
              className="mr-2 -ml-1 w-4 h-4 sm:w-5 sm:h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                clip-rule="evenodd"
              />
            </svg>
            Register as a Donor
          </button>
        </div>
      </div>
    </section>
  );
}
