"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SuccessMessage = ({ onLogin, showSuccess, isLoading, error, retryVerification }) => {

  const router = useRouter();


  const handleLogin = () => {
    router.push("/loginPage");
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg p-6 mt-16 shadow-md text-center">
          <div className="animate-pulse">
            <h2 className="text-xl font-semibold mb-4">
              Verifying your email...
            </h2>
            <div className="w-12 h-12 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg p-6 mt-16 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Verification Failed</h2>
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 text-center">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-white border border-red-500 p-2 rounded-md hover:bg-red-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 bg-[#37CA52] text-white py-2 px-4 rounded-md mb-4 text-center">
          Account creation Successful!
        </div>
      )}
      <div className="bg-white rounded-lg p-6 mt-16 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Verify your address</h2>
        <div className="bg-[#37BE1C] text-white p-3 rounded-md mb-4 text-center">
          Account verified successfully!
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-white border border-[#37BE1C] p-2 rounded-md hover:bg-green-50 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;