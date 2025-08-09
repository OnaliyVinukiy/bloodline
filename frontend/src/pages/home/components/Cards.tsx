/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "flowbite-react";
import { useAuthContext } from "@asgardeo/auth-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Cards: React.FC = () => {
  const { t } = useTranslation(["cards", "common"]);
  const { state, signIn } = useAuthContext();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginAction, setLoginAction] = useState<
    "campRegistration" | "orgRegistration" | null
  >(null);

  const handleCampSchedule = () => {
    if (state?.isAuthenticated) {
      navigate("/camp-registration");
    } else {
      localStorage.setItem("postLoginRedirect", "/camp-registration");
      setLoginAction("campRegistration");
      setIsLoginModalOpen(true);
    }
  };

  const handleOrgRegistration = () => {
    if (state?.isAuthenticated) {
      navigate("/organization-registration");
    } else {
      localStorage.setItem("postLoginRedirect", "/organization-registration");
      setLoginAction("orgRegistration");
      setIsLoginModalOpen(true);
    }
  };

  // Store the redirect path in local storage
  useEffect(() => {
    if (state.isAuthenticated) {
      const redirectPath = localStorage.getItem("postLoginRedirect");
      if (redirectPath) {
        navigate(redirectPath);
        localStorage.removeItem("postLoginRedirect");
      }
    }
  }, [state.isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await signIn();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
      setIsLoginModalOpen(false);
      setLoginAction(null);
    }
  };

  // Determine modal message based on loginAction
  const modalMessage =
    loginAction === "orgRegistration"
      ? t("modal_org_registration", { ns: "cards" })
      : t("modal_camp_registration", { ns: "cards" });

  return (
    <div className="flex flex-wrap justify-center gap-8 lg:space-x-40 lg:mt-20 mt-10">
      <Card className="max-w-sm md:w-full sm:w-72">
        <img
          src="/eligible.png"
          alt="Meaningful alt text for an image that is not purely decorative"
          className="w-40 h-45 object-cover mx-auto"
        />
        <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
          {t("eligible_card_title", { ns: "cards" })}
        </h5>
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
          {t("eligible_card_text", { ns: "cards" })}
        </p>
        <Button
          className="bg-red-800 hover:bg-red-700 text-white"
          color="red-800"
          href="/eligibility"
        >
          {t("eligible_card_button", { ns: "cards" })}
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
          src="/journey.png"
          alt="Meaningful alt text for an image that is not purely decorative"
          className="w-40 h-45 object-cover mx-auto"
        />
        <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
          {t("host_camp_card_title", { ns: "cards" })}
        </h5>
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
          {t("host_camp_card_text", { ns: "cards" })}
        </p>
        <Button
          className="bg-red-800 hover:bg-red-700 text-white"
          color="red-800"
          onClick={handleCampSchedule}
        >
          {t("host_camp_card_button", { ns: "cards" })}
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
          src="/camp.png"
          alt="Meaningful alt text for an image that is not purely decorative"
          className="w-40 h-45 object-cover mx-auto"
        />
        <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
          {t("org_register_card_title", { ns: "cards" })}
        </h5>
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
          {t("org_register_card_text", { ns: "cards" })}
        </p>
        <Button
          className="bg-red-800 hover:bg-red-700 text-white"
          color="red-800"
          onClick={handleOrgRegistration}
        >
          {t("org_register_card_button", { ns: "cards" })}
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
      <Modal show={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <Modal.Header className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xl text-red-600">
            <svg
              className="w-6 h-6 text-red-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {t("login_required", { ns: "common" })}
          </p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={handleLogin} disabled={isLoggingIn}>
            {isLoggingIn ? (
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
                {t("login_loading", { ns: "common" })}
              </>
            ) : (
              t("login_button", { ns: "common" })
            )}
          </Button>
          <Button
            color="failure"
            outline
            onClick={() => setIsLoginModalOpen(false)}
            className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-300"
          >
            {t("cancel_button", { ns: "common" })}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cards;
