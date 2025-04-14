"use client";

import React, { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Img from "@/assets/coin2.svg";
import Img2 from "@/assets/vector-img.svg";
import Img3 from "@/assets/kings-chat.svg";
import bgImg from "@/assets/sea-bg.svg";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import apiService, { ToastService } from "@config/config";

// Timeout duration in milliseconds (e.g., 2 hours = 7200000 ms)
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000;

const LoginPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  // Check for session timeout on component mount
  useEffect(() => {
    const checkSessionTimeout = () => {
      const lastActivity = localStorage.getItem("lastActivityTime");
      const currentTime = new Date().getTime();

      if (
        lastActivity &&
        currentTime - parseInt(lastActivity) > INACTIVITY_TIMEOUT
      ) {
        // Session has expired due to inactivity, clear user data and token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastActivityTime");
      }
    };

    checkSessionTimeout();
  }, []);

  // Setup activity tracking for the entire application
  useEffect(() => {
    // Function to update the last activity timestamp
    const updateActivityTimestamp = () => {
      localStorage.setItem("lastActivityTime", new Date().getTime().toString());
    };

    // Set up event listeners for user activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivityTimestamp);
    });

    // Initial update
    updateActivityTimestamp();

    // Cleanup event listeners on component unmount
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivityTimestamp);
      });
    };
  }, []);

  // Enhanced function to get user-friendly error message
  const getUserFriendlyMessage = (error) => {
    // If it's already a user-friendly message
    if (error.userFriendlyMessage) {
      return error.userFriendlyMessage;
    }

    // Check for specific authentication errors
    if (error.status === 401) {
      return "Invalid email or password. Please check your credentials and try again.";
    }

    if (error.status === 422) {
      // Handle validation errors
      if (error.data?.errors?.email) {
        return `Email error: ${error.data.errors.email[0]}`;
      }
      if (error.data?.errors?.password) {
        return `Password error: ${error.data.errors.password[0]}`;
      }
      return "Invalid login credentials. Please check your email and password.";
    }

    // Check if there's a message in the error data
    if (error.data?.message) {
      return error.data.message;
    }

    // Account locked scenario
    if (error.status === 403 && error.data?.errors?.account_locked) {
      return "Your account has been locked due to too many failed login attempts. Please reset your password or contact support.";
    }

    // Default message
    return "Login failed. Please try again.";
  };

  const { mutate: loginFunc, isPending: Signing } = useMutation({
    mutationFn: (data) => apiService.auth.login(data),
    onSuccess: (data) => {
      // Store the token in localStorage or your preferred storage method
      localStorage.setItem("token", data.api_token);
      localStorage.setItem("user", JSON.stringify(data.data));

      // Set the initial activity timestamp
      localStorage.setItem("lastActivityTime", new Date().getTime().toString());

      // Redirect to dashboard or home page
      router.push("/dashboard");
    },
    onError: (error) => {
      // Use enhanced getUserFriendlyMessage to display more specific errors
      const friendlyMessage = getUserFriendlyMessage(error);
      ToastService.showError(friendlyMessage);
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      loginFunc(data);
    },
    [loginFunc]
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left section */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImg.src})` }}
      >
        <div className="flex flex-col items-center justify-center h-full text-white relative z-10 p-8">
          <Image
            src={Img}
            alt="Coin"
            width={200}
            height={200}
            className="mb-8"
          />
          <h2 className="text-3xl font-bold mb-2">Swap Espees quicker!</h2>
          <p className="text-center text-lg mb-12">
            One account to keep and
            <br />
            exchange your espees
          </p>
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
            <Image src={Img2} alt="Kings Swap" width={24} height={24} />
            <span className="ml-2 text-sm">KINGS SWAP</span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8 mb-4">
            <h2 className="text-2xl font-bold mb-6">Login your account</h2>
            {/* Only show form validation errors here, not API errors */}
            {Object.keys(formErrors).length > 0 && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {formErrors.email?.message || formErrors.password?.message}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter your email address"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 5H3C2.44772 5 2 5.44772 2 6V14C2 14.5523 2.44772 15 3 15H17C17.5523 15 18 14.5523 18 14V6C18 5.44772 17.5523 5 17 5Z"
                        stroke="#718096"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 6L10 11L18 6"
                        stroke="#718096"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
              <Link
                href="/resetPassword"
                className="text-blue-500 text-sm mb-4 block"
              >
                Forgot password
              </Link>
              <button
                type="submit"
                disabled={Signing}
                className={`w-full bg-blue-500 text-white py-2 rounded font-semibold ${
                  Signing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {Signing ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>

          <p className="text-center mb-4">
            Don't have an account?{" "}
            <Link href="/signUp" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </p>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-center mb-2 text-sm text-gray-600">
              Or Login with
            </p>
            <Link
              href="/kingsChat"
              className="w-full py-2 flex items-center justify-center"
            >
              <Image src={Img3} alt="KingsChat" width={300} height={200} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
