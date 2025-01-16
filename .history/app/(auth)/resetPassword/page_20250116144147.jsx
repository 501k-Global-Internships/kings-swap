'use client'
import React, { useState } from "react";
import bgImg from "@assets/forget-bgImg.svg";
import Link from "next/link";
import Image from "next/image";
// import Img2 from "../assets/vector-img.svg";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    try {
      // Step 1: Request password reset code
      const requestResetResponse = await fetch(
        "https://cabinet.kingsswap.com.ng/api/v1/auth/password-reset/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const requestResetData = await requestResetResponse.json();
      if (requestResetResponse.ok) {
        console.log(requestResetData.message);
        // Redirect the user to the reset confirmation page
        window.location.href = "/resetConfirmation";
      } else {
        console.error(requestResetData.message);
        // Display an error message to the user
        alert(requestResetData.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      // Display a generic error message to the user
      alert(
        "An error occurred while resetting your password. Please try again later."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left section with background image */}
      <div
        className="relative w-full md:w-1/2 overflow-hidden"
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* ... rest of the left section ... */}
      </div>

      {/* Right section with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-8 text-gray-800">
            Reset your password,
          </h1>
          <form>
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                Email address
              </label>
              <div className="relative border border-gray-200 rounded-lg">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {/* ... rest of the email input ... */}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="w-full bg-[#1D5EFF] text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={handlePasswordReset}
            >
              Send password reset link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;