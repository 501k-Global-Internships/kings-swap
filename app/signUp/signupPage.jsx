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

  const handleStep1Complete = (countryData) => {
    setUserData((prev) => ({
      ...prev,
      country_id: countryData.id.toLowerCase(),
    }));
    setStep(2);
  };

  const handleStep2Complete = (personalInfo) => {
    setUserData((prev) => ({
      ...prev,
      first_name: personalInfo.firstName,
      last_name: personalInfo.lastName,
      email: personalInfo.email,
      kingschat_username: personalInfo.username,
      gender: personalInfo.gender,
    }));
    setStep(3);
  };

  const handleStep3Complete = (contactInfo) => {
    setUserData((prev) => ({
      ...prev,
      phone_number: contactInfo.phoneNumber,
      accepts_promotions: contactInfo.acceptsPromotions,
      password: contactInfo.password,
      password_confirmation: contactInfo.password,
    }));
    handleRegistration(contactInfo);
  };

  const handleRegistration = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://cabinet.kingsswap.com.ng/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.success) {
        setStep(4);
        // Automatically request email verification code
        await requestVerificationCode(userData.email);
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration");
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

        {/* Error Display */}
        {error && (
          <div className="absolute top-20 w-full max-w-md px-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
