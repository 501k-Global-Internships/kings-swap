"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Loader2 } from "lucide-react";
import ImageSlider from "./imageSlider/imageSlider";
import Step1Form from "./step1Form";
import Step2Form from "./step2Form";
import Step3Form from "./step3Form";
import Step4Form from "./step4Form";
import SuccessMessage from "./successMessage";
import KingsChat from "@/assets/kings-chat.svg";
import bgImg from "@/assets/signup.svg";
import { useSignUpForm } from "@hooks/useSignUpForm";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const { push } = useRouter();
  const {
    formData,
    errors,
    postPending,
    resending,
    isFetching,
    verifying,
    countries,
    step,
    verificationComplete,
    handleStep1,
    handleStep2,
    handleStep3,
    handleStep4,
    handleResendOTP,
  } = useSignUpForm();

  const handleStep1Complete = (countryData) => {
    handleStep1(countryData);
  };

  const handleStep2Complete = (formData) => {
    handleStep2(formData);
  };

  const handleStep3Complete = async (passwordData) => {
    await handleStep3(passwordData);
  };

  const handleVerify = async (code) => {
    await handleStep4(code);
  };

  const handleResendCode = async () => {
    await handleResendOTP();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <ImageSlider />
      <div
        className="w-full md:w-1/2 bg-cover bg-center bg-gray-200 flex flex-col justify-start items-center relative"
        style={{ backgroundImage: `url(${bgImg.src})` }}
      >
        {/* Step Indicator (hidden on mobile) */}
        <div className="hidden md:flex justify-center items-center w-full p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-bold shadow py-[.5rem] px-[1rem] bg-[#FFFFFF] text-gray-700">
              Step {step}
            </span>
            <div className="flex items-center">
              {[1, 2, 3, 4].map((num) => (
                <React.Fragment key={num}>
                  <div
                    className={`w-[.95rem] h-[.95rem] rounded-full flex items-center justify-center text-white font-bold ${
                      step >= num ? "bg-blue-500" : "bg-[#D9D9D9]"
                    }`}
                  >
                    {""}
                  </div>
                  {num < 4 && (
                    <div
                      className={`h-[.125rem] w-[6rem] mx-2 ${
                        step > num ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      };

  );
};

export default SignUpPage;
