/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
"use client";

import { Button, Card } from "flowbite-react";

export function Cards() {
  return (
    <div className="flex justify-center space-x-40 mt-20">
      <Card className="max-w-sm">
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

      <Card className="max-w-sm">
        <img
          src="src/assets/camp.png"
          alt="Meaningful alt text for an image that is not purely decorative"
          className="w-40 h-45 object-cover mx-auto"
        />
        <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
          Find a Blood Drive
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

      <Card className="max-w-sm">
        <img
          src="src/assets/journey.png"
          alt="Meaningful alt text for an image that is not purely decorative"
          className="w-40 h-45 object-cover mx-auto"
        />
        <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
          Blood Donation Journey
        </h5>
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
          Learn how your blood saves lives and the steps involved in the
          process.
        </p>
        <Button
          className="bg-red-800 hover:bg-red-700 text-white"
          color="red-800"
        >
          Learn More
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
}
