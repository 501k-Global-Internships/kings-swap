"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Logo from "@assets/logo2.svg";
import SwapBg from "@assets/swapbg.svg";
import { TransactionSchema } from "./schemas";
import { useExchangeContext } from "./ExchangeContext";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  AmountSelectionStep,
  BankDetailsStep,
  TransactionInProgressStep,
  TransactionCompletedStep,
} from "./steps";

export function SwapExchangeLayout() {
  const router = useRouter();
  const { step, setStep, error } = useExchangeContext();

  const methods = useForm({
    resolver: zodResolver(TransactionSchema),
    mode: "onChange",
  });

  const handleBack = () => {
    step === 1 ? router.push("/dashboard") : setStep((prev) => prev - 1);
  };

  // Move renderStepContent inside the component and pass step as a parameter
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <AmountSelectionStep />;
      case 2:
        return <BankDetailsStep />;
      case 3:
        return <TransactionInProgressStep />;
      case 4:
        return <TransactionCompletedStep />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <BackgroundSection />
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-md mb-12">
          <Image
            src={Logo}
            alt="Kings Swap Logo"
            width={120}
            height={40}
            className="mb-4 ml-24"
          />
          <button
            className="flex items-center cursor-pointer pt-6"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2" />
            <span>{step === 1 ? "Home" : "Back"}</span>
          </button>
        </div>

        <FormProvider {...methods}>
          <ErrorBoundary>
            {error && <ErrorDisplay error={error} />}
            {renderStepContent()}
          </ErrorBoundary>
        </FormProvider>
      </div>
    </div>
  );
}

function BackgroundSection() {
  return (
    <div className="relative w-full md:w-1/2">
      <Image
        src={SwapBg}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
    </div>
  );
}

function ErrorDisplay({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-4">
      {error}
    </div>
  );
}
