"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import ImageSlider from "./imageSlider/imageSlider";
import Step1Form from "./step1Form";
import Step2Form from "./step2Form";
import Step3Form from "./step3Form";
import Step4Form from "./step4Form";
import SuccessMessage from "./successMessage";
import KingsChat from "../assets/kings-chat.svg";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [userData, setUserData] = useState({
    country_id: "",
    first_name: "",
    last_name: "",
    email: "",
    kingschat_username: "",
    gender: "",
    phone_number: "",
    accepts_promotions: false,
    password: "",
    password_confirmation: "",
  });

  const validateForm = (data) => {
    const errors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = ["Please enter a valid email address"];
    }

    // KingsChat username validation
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (
      !data.kingschat_username.match(usernameRegex) ||
      data.kingschat_username.length < 4 ||
      data.kingschat_username.length > 32
    ) {
      errors.kingschat_username = [
        "Username must be 4-32 characters and can only contain letters, numbers, dots, and underscores",
      ];
    }

    // Phone number validation
    const phoneRegex = /^\+[0-9]{10,15}$/;
    if (!data.phone_number && phoneRegex.test(data.phone_number)) {
      errors.phone_number = [
        "Please enter a valid phone number with country code",
      ];
    }

    // Password validation
    if (data.password !== data.password_confirmation) {
      errors.password = ["Passwords do not match"];
    }

    return errors;
  };

  const handleStep1Complete = (countryData) => {
    setValidationErrors({});
    setError(null);
    setUserData((prev) => ({
      ...prev,
      country_id: countryData.id.toLowerCase(),
    }));
    setStep(2);
  };

  const handleStep2Complete = (personalInfo) => {
    setValidationErrors({});
    setError(null);
    setUserData((prev) => ({
      ...prev,
      first_name: personalInfo.firstName?.trim(),
      last_name: personalInfo.lastName?.trim(),
      email: personalInfo.email?.toLowerCase().trim(),
      kingschat_username: personalInfo.username?.trim(),
      gender: personalInfo.gender,
    }));
    setStep(3);
  };

  const handleStep3Complete = (contactInfo) => {
    setValidationErrors({});
    setError(null);
    const updatedUserData = {
      ...userData,
      phone_number: contactInfo.phoneNumber.trim(),
      accepts_promotions: contactInfo.acceptsPromotions,
      password: contactInfo.password,
      password_confirmation: contactInfo.password,
    };

    // Validate before submission
    const errors = validateForm(updatedUserData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setUserData(updatedUserData);
    handleRegistration(updatedUserData);
  };

  const handleRegistration = async (registrationData) => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const response = await fetch(
        "https://cabinet.kingsswap.com.ng/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          setValidationErrors(data.errors);
          throw new Error("Please check the form for errors.");
        }
        throw new Error(data.message || "Registration failed");
      }

      if (data.success) {
        setStep(4);
        // Automatically request email verification code
        await requestVerificationCode(registrationData.email);
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration");
      if (err.message === "Registration failed" && step === 3) {
        // Stay on step 3 if registration failed
        setStep(3);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const requestVerificationCode = async (email) => {
    try {
      const response = await fetch(
        "https://cabinet.kingsswap.com.ng/api/v1/auth/email-verification/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
    }
  };

  const handleVerify = async (code) => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const response = await fetch(
        "https://cabinet.kingsswap.com.ng/api/v1/auth/email-verification/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            code: code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          setValidationErrors(data.errors);
          throw new Error("Invalid verification code.");
        }
        throw new Error(data.message || "Verification failed");
      }

      if (data.success) {
        setVerificationComplete(true);
      }
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    await requestVerificationCode(userData.email);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <ImageSlider />
      <div
        className="w-full md:w-1/2 bg-cover bg-center bg-gray-200 flex flex-col justify-start items-center relative"
        style={{ backgroundImage: 'url("/vector-img.svg")' }}
      >
        {/* Step Indicator */}
        <div className="absolute top-0 w-full flex justify-center items-center p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-bold shadow py-[.5rem] px-[1rem] bg-[#FFFFFF] text-gray-700">
              Step {step}
            </span>
            <div className="flex items-center">
              {[1, 2, 3, 4].map((num) => (
                <React.Fragment key={num}>
                  <div
                    className={`w-[.8rem] md:w-[.95rem] h-[.8rem] md:h-[.95rem] rounded-full flex items-center justify-center text-white font-bold ${
                      step >= num ? "bg-blue-500" : "bg-[#D9D9D9]"
                    }`}
                  >
                    {""}
                  </div>
                  {num < 4 && (
                    <div
                      className={`h-[.125rem] w-[4rem] md:w-[6rem] mx-2 ${
                        step > num ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Error and Validation Displays */}
        {(error || Object.keys(validationErrors).length > 0) && (
          <div className="absolute top-20 w-full max-w-md px-4">
            {error && (
              <Alert variant="destructive" className="mb-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {Object.entries(validationErrors).map(([field, errors]) => (
                      <li key={field} className="text-sm">
                        {errors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Form Steps */}
        <div className="flex flex-col justify-center items-center w-full h-full p-8">
          {step === 1 && (
            <>
              <Step1Form onNext={handleStep1Complete} />
              <p className="text-sm text-[#7F7F7F] mt-4">
                Have an account?{" "}
                <Link href="/loginPage" className="text-[#434343] underline">
                  Sign in
                </Link>
              </p>
              <div className="mt-6 text-center w-full max-w-md">
                <p className="text-sm text-[#434343] mb-2">Or signup with</p>
                <button className="w-full py-2 flex items-center justify-center transition-colors">
                  <Image
                    src={KingsChat}
                    alt="KingsChat"
                    width={300}
                    height={124}
                    className="mr-2"
                  />
                </button>
              </div>
            </>
          )}
          {step === 2 && <Step2Form onNext={handleStep2Complete} />}
          {step === 3 && <Step3Form onNext={handleStep3Complete} />}
          {step === 4 && !verificationComplete && (
            <Step4Form
              onVerify={handleVerify}
              onResendCode={handleResendCode}
              isLoading={isLoading}
            />
          )}
          {step === 4 && verificationComplete && <SuccessMessage />}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
