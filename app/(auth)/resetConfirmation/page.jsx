"use client";
import { Suspense } from "react";

// Create a wrapper component for the main content
const ResetConfirmationWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetConfirmationContent />
  </Suspense>
);

import React, { useState, useEffect } from "react";
import bgImage from "@assets/password-bg.svg";
import Link from "next/link";
import Img2 from "@assets/vector-img.svg";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

const ResetConfirmationContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const code = searchParams?.get("code");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyPasswordReset = async () => {
      if (!email || !code) {
        setErrorMessage("Missing email or verification code");
        setIsLoading(false);
        return;
      }

      try {
        const verifyResetResponse = await fetch(
          "https://cabinet.kingsswap.com.ng/api/v1/auth/password-reset/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email,
              code,
            }),
          }
        );

        const verifyResetData = await verifyResetResponse.json();

        if (verifyResetResponse.ok) {
          setIsPasswordReset(true);
        } else {
          setErrorMessage(
            verifyResetData.message || "Password reset verification failed"
          );
        }
      } catch (error) {
        console.error("Error verifying password reset:", error);
        setErrorMessage(
          "An error occurred while verifying the password reset. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyPasswordReset();
  }, [email, code]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Left section with background image */}
      <div
        className="relative w-full md:w-[55%] bg-cover bg-center overflow-hidden"
        style={{
          clipPath: "polygon(0 0, 100% 0, 93% 100%, 0% 100%)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="relative z-10 flex flex-col justify-end h-full p-12 text-white">
          <h2 className="text-4xl font-bold mb-2">Swap Espees faster!</h2>
          <p className="text-sm mb-12 pl-12">
            One account to keep and <br /> exchange your espees
          </p>
          <div className="flex pl-12 items-center mb-8">
            <Image
              src={Img2}
              alt="Kings Swap"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="ml-3 text-sm font-medium tracking-wider uppercase">
              Kings Swap
            </span>
          </div>
        </div>
      </div>
      {/* Right section with confirmation message */}
      <div className="w-full md:w-[45%] flex items-center justify-center p-8">
        <div className="w-full max-w-md px-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">
            Reset your password
          </h1>
          {isPasswordReset ? (
            <div className="mb-6 bg-[#37BE1C] text-white py-4 px-4 rounded-lg text-center">
              Password changed successfully!
            </div>
          ) : (
            <div className="mb-6 bg-[#FF0000] text-white py-4 px-4 rounded-lg text-center">
              {errorMessage ||
                "An error occurred while resetting your password."}
            </div>
          )}
          <Link
            href="/loginPage"
            className="block w-full border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmationWrapper;

// Add dynamic config
export const dynamic = "force-dynamic";