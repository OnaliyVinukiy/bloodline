/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
"use client";
import React from "react";
import { Button, Card } from "flowbite-react";
const Cards: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-8 lg:space-x-40 lg:mt-20 mt-10">
      <Card className="max-w-sm md:w-full sm:w-72">
        <img
          src="src/assets/eligible.png"
          alt="Meaningful alt text for an image that is not purely decorative"
          className="w-40 h-45 object-cover mx-auto"
        />
        <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
          Am I Eligible?
        </h5>
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
          Put yourself into a test and check whether you can donate blood.
        </p>
        <Button
          className="bg-red-800 hover:bg-red-700 text-white"
          color="red-800"
          href="/eligibility"
        >
          Check Eligibility
          <svg
            className="-mr-1 ml-2 mt-1 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </Card>

      <Card className="max-w-sm md:w-full sm:w-72">
        <img
          src="src/assets/journey.png"
          alt="Meaningful alt text for an image that is not purely decorative"
          className="w-40 h-45 object-cover mx-auto"
        />
        <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
          Host a Blood Donation Camp
        </h5>
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
          Register to host a blood donation camp and help save lives in your
          community.
        </p>
        <Button
          className="bg-red-800 hover:bg-red-700 text-white"
          color="red-800"
          href="/campaign-registration"
        >
          Register Now
          <svg
            className="-mr-1 ml-2 mt-1 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </Card>

      <Card className="max-w-sm md:w-full sm:w-72">
        <img
          src="src/assets/camp.png"
          alt="Meaningful alt text for an image that is not purely decorative"
          className="w-40 h-45 object-cover mx-auto"
        />
        <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
          Find a Blood Donation Camp
        </h5>
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
          Search for upcoming blood drives and donation events near you.
        </p>
        <Button
          className="bg-red-800 hover:bg-red-700 text-white"
          color="red-800"
        >
          Find Out
          <svg
            className="-mr-1 ml-2 mt-1 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </Card>
    </div>
  );
};

export default Cards;
