"use client";
import React, { useState } from "react";

const Step4Form = ({ onVerify, onResendCode, isLoading, error, email }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    await onVerify(code);
  };

  const handleResendCode = async () => {
    await onResendCode();
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Verify your address
      </h2>
      <p className="text-sm text-gray-600 mb-2 text-center">
        Please enter the OTP sent to:
      </p>
      <p className="text-sm font-medium text-blue-600 mb-6 text-center">
        {email || "your email address"}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-6 gap-2 mb-6">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="w-full h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
            disabled={isLoading}
          />
        ))}
      </div>

      <div className="text-sm text-center mb-6">
        <p className="text-gray-600 mb-1">Didn't receive OTP?</p>
        <button
          onClick={handleResendCode}
          className="text-blue-500 hover:underline focus:outline-none disabled:text-blue-300"
          disabled={isLoading}
        >
          Resend code
        </button>
      </div>

      <button
        onClick={handleVerify}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 disabled:bg-blue-300"
        disabled={isLoading || otp.some((digit) => !digit)}
      >
        {isLoading ? "Verifying..." : "Verify your account"}
      </button>
    </div>
  );
};

export default Step4Form;
