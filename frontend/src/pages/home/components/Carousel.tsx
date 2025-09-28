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
import { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useUser } from "../../../contexts/UserContext";

export function CarouselSlider() {
  const { t } = useTranslation(["carousel", "common"]);
  const { state, signIn } = useAuthContext();
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDonorRegModalOpen, setIsDonorRegModalOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginAction, setLoginAction] = useState<
    "appointment" | "registration" | null
  >(null);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Direct the user to relevant page based on authentication status
  const handleDonorRegistration = () => {
    if (state?.isAuthenticated) {
      navigate("/profile");
    } else {
      localStorage.setItem("postLoginRedirect", "/profile");
      setLoginAction("registration");
      setIsLoginModalOpen(true);
    }
  };

  const handleAppointmentSchedule = async () => {
    try {
      if (!state?.isAuthenticated) {
        setIsLoginModalOpen(true);
        return;
      }

      const donorExists = await fetchDonorInfo();
      console.log("Donor exists:", donorExists);

      if (donorExists) {
        navigate("/donorDeclaration");
      } else {
        setIsDonorRegModalOpen(true);
      }
    } catch (error) {
      console.error("Error in appointment scheduling:", error);
    }
  };

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

  const fetchDonorInfo = async () => {
    if (!user?.email) return;
    try {
      const { data: donorInfo } = await axios.get(
        `${backendURL}/api/donor/${user.email}`
      );

      if (donorInfo) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching donor:", error);
      return false;
    }
  };

  // Determine modal message based on loginAction
  const modalMessage =
    loginAction === "appointment"
      ? t("modal_appointment", { ns: "carousel" })
      : t("modal_donor_registration", { ns: "carousel" });

  return (
    <section
      className="bg-cover bg-no-repeat bg-center h-[700px] flex items-start"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/heart.jpg')`,
      }}
    >
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center sm:py-12">
        <img
          src="/heart.png"
          className="w-10 h-10 mx-auto mt-16 mb-8 sm:w-20 sm:h-20 sm:mb-12"
          alt="Bloodline Logo"
        />
        <a
          href="/about"
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-6 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
          role="alert"
        >
          <span className="text-[10px] md:text-xs bg-red-600 rounded-full text-white px-4 py-1.5 mr-3">
            {t("tag_who_we_are", { ns: "carousel" })}
          </span>
          <span className="text-xs md:text-sm font-medium">
            {t("tag_learn_more", { ns: "carousel" })}
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

        <h1 className="mt-2 mb-6 text-3xl font-semibold tracking-tight leading-tight text-white sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl">
          {t("headline", { ns: "carousel" })}
        </h1>
        <p className="mt-2 text-base font-normal text-white sm:text-lg md:text-xl">
          {t("slogan_1", { ns: "carousel" })}
        </p>
        <p className="mb-8 text-base font-normal text-white sm:text-lg md:text-xl">
          {t("slogan_2", { ns: "carousel" })}
        </p>
        <div className="mt-12 flex flex-col mb-4 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleAppointmentSchedule}
            className="inline-flex justify-center items-center py-2 px-4 text-sm font-medium text-center text-white rounded-lg bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 sm:py-3 sm:px-5 sm:text-base"
          >
            {t("appointment_button", { ns: "carousel" })}
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
          </button>
          <button
            onClick={handleDonorRegistration}
            className="inline-flex justify-center items-center py-2 px-4 text-sm font-medium text-center text-white rounded-lg border border-gray-300 hover:bg-black focus:ring-4 focus:ring-gray-100 sm:py-3 sm:px-5 sm:text-base"
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
            {t("donor_registration_button", { ns: "carousel" })}
          </button>
        </div>

        <Modal
          show={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        >
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
            <Button
              color="failure"
              onClick={handleLogin}
              disabled={isLoggingIn}
            >
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

        <Modal
          show={isDonorRegModalOpen}
          onClose={() => setIsDonorRegModalOpen(false)}
        >
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
              {t("registration_required", { ns: "common" })}
            </p>
          </Modal.Header>
          <Modal.Body>
            <p className="text-lg text-gray-700">
              {t("registration_required_message", { ns: "common" })}
            </p>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button
              color="failure"
              onClick={() => navigate("/profile")}
              className="border-red-700 text-white hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-300"
            >
              {t("register_button", { ns: "common" })}
            </Button>
            <Button
              color="failure"
              outline
              onClick={() => setIsDonorRegModalOpen(false)}
              className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-300"
            >
              {t("cancel_button", { ns: "common" })}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
}
