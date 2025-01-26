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

        {/* Error Display */}
        {errors && Object.keys(errors).length > 0 && (
          <div className="w-full max-w-md px-4">
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {Object.entries(errors).map(([field, messages]) => (
                    <li key={field} className="text-sm">
                      {Array.isArray(messages) ? messages[0] : messages}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loading Overlay */}
        {resending && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Form Steps */}
        <div className="flex flex-col justify-center items-center w-full h-full p-8">
          {step === 1 && (
            <>
              <Step1Form
                onNext={handleStep1Complete}
                countries={countries}
                isLoading={isFetching}
              />
              <div className="mt-6 text-center w-full max-w-md">
                <p className="text-sm text-[#7F7F7F] mb-2">
                  <Link href="/loginPage" className="text-[#434343] underline">
                    Have an account? Sign in
                  </Link>
                </p>
                <p className="text-sm text-[#434343] mb-2">Or signup with</p>
                <Link
                  href="/loginPage"
                  className="w-full py-2 flex items-center justify-center transition-colors"
                >
                  <Image
                    src={KingsChat}
                    alt="KingsChat"
                    width={300}
                    height={124}
                    className="mr-2"
                  />
                </Link>
              </div>
            </>
          )}
          {step === 2 && (
            <Step2Form
              onNext={handleStep2Complete}
              initialData={formData}
              errors={errors}
            />
          )}
          {step === 3 && (
            <Step3Form
              onNext={handleStep3Complete}
              formData={formData}
              errors={errors}
              isLoading={postPending}
            />
          )}
          {step === 4 && !verificationComplete && (
            <Step4Form
              onVerify={handleVerify}
              onResendCode={handleResendCode}
              isLoading={resending || verifying}
              error={errors.general?.[0]}
            />
          )}
          {step === 4 && verificationComplete && (
            <SuccessMessage
              gotoLogin={() => push("/loginPage")}
              showSuccess={verificationComplete}
              isLoading={verifying}
              error={errors?.general}
              retryVerification={handleVerify}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
