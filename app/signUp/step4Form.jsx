import React, { useState } from "react";

const Step4Form = ({ onVerify, onResendCode }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
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
      <div className="grid grid-cols-6 gap-2 mb-6">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="w-full h-[3rem] text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      <div className="text-sm text-center mb-6">
        <p className="text-gray-600 mb-1">Didn't receive OTP?</p>
        <button
          onClick={onResendCode}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          Resend code
        </button>
      </div>
      <button
        onClick={onVerify}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
      >
        Verify your account
      </button>
    </div>
  );
};

export default Step4Form;
