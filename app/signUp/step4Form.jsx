import React, { useState } from "react";

const Step4Form = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Auto-focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setError("");

      const code = otp.join("");

      const response = await fetch(
        "https://cabinet.kingsswap.com.ng/api/v1/auth/email-verification/verify",
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

      const data = await response.json();

      if (data.success) {
        onSuccess?.(data.message);
      } else {
        setError(data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        "https://cabinet.kingsswap.com.ng/api/v1/auth/email-verification/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Clear existing OTP fields
        setOtp(["", "", "", "", "", ""]);
        // Focus first input
        const firstInput = document.querySelector("input");
        if (firstInput) firstInput.focus();
      } else {
        setError(data.message || "Failed to resend code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while resending the code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Verify your address
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Please enter the OTP sent to the email address you provided
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
