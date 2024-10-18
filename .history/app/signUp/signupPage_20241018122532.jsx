"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const handleVerify = () => {
    setVerificationComplete(true);
  };

  const handleResendCode = () => {
    console.log("Resending code...");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <ImageSlider />
      <div
        className="w-full md:w-1/2 bg-cover bg-center bg-gray-100 flex flex-col justify-start items-center relative"
        style={{ backgroundImage: 'url("/vector-img.svg")' }}
      >
        {/* Step Indicator at the top */}
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
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {/* Form Steps Centered in the middle */}
        <div className="flex flex-col justify-center items-center w-full h-full p-8">
          {step === 1 && (
            <>
              <Step1Form onNext={() => setStep(2)} />
              <p className="text-sm text-[#7F7F7F] mt-4">
                Have an account?{" "}
                <Link href="/loginPage" className="text-[#434343] underline">
                  Sign in
                </Link>
              </p>
              <div className="mt-6 text-center w-full max-w-md">
                <p className="text-sm text-[#434343] mb-2">Or signup with</p>
                <button className="w-full py-2 flex items-center justify-center  transition-colors">
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
          {step === 2 && <Step2Form onNext={() => setStep(3)} />}
          {step === 3 && <Step3Form onNext={() => setStep(4)} />}
          {step === 4 && !verificationComplete && (
            <Step4Form
              onVerify={handleVerify}
              onResendCode={handleResendCode}
            />
          )}
          {step === 4 && verificationComplete && <SuccessMessage />}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
