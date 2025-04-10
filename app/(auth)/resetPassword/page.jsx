"use client";
import React, { useState } from "react";
import bgImg from "@assets/forget-bgImg.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Uncomment this since it's referenced in the code
import apiService from "@config/config";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      setErrorMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Direct API call matching the documentation
      const response = await apiService.auth.passwordResetRequest(email);

      // Display success message from API
      toast.success(response.message);

      // Redirect to a confirmation page
      router.push(`/resetConfirmation?email=${encodeURIComponent(email)}`);
    } catch (error) {
    
      const message =
        error.userFriendlyMessage || "Failed to request password reset";
      setErrorMessage(message);
      toast.error(message);

      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
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
        {/* Left section content could go here */}
      </div>

      {/* Right section with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-2 text-gray-800">
            Reset your password
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your email address to receive a password reset link
          </p>

          <form onSubmit={handlePasswordReset}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 mb-2"
              >
                Email address
              </label>
              <div className="relative border border-gray-200 rounded-lg">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  aria-invalid={errorMessage ? "true" : "false"}
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full bg-[#1D5EFF] text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Send password reset link"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/loginPage"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
