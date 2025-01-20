/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { auth, provider } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";

export function Login({
  openModal,
  onCloseModal,
  onLoginSuccess,
}: {
  openModal: boolean;
  onCloseModal: () => void;
  onLoginSuccess: (user: {
    name: string;
    email: string;
    avatar: string;
  }) => void;
}) {
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        name: user.displayName || "Anonymous",
        email: user.email || "No email",
        avatar: user.photoURL || "https://via.placeholder.com/150",
      };
      console.log("User Info:", userData);
      alert(`Welcome ${userData.name}`);
      onLoginSuccess(userData);
      onCloseModal();
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <Modal show={openModal} size="md" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {isSignUp ? "Sign up for our platform" : "Sign in to our platform"}
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput
              id="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput id="password" type="password" required />
          </div>
          {isSignUp && (
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="confirm-password"
                  value="Confirm your password"
                />
              </div>
              <TextInput id="confirm-password" type="password" required />
            </div>
          )}
          <div className="w-full space-y-4">
            <Button
              className="w-full bg-red-800 hover:bg-red-700 text-white"
              color="bg-red-800"
            >
              {isSignUp ? "Sign up" : "Log in"}
            </Button>
            <Button
              outline
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
                className="inline w-6 h-6 mr-2"
              />
              Login with Google
            </Button>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            {isSignUp ? "Already have an account?" : "Not registered?"}&nbsp;
            <a
              href="#"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-red-800 hover:underline dark:text-cyan-500 "
            >
              {isSignUp ? "Sign in" : "Create account"}
            </a>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
