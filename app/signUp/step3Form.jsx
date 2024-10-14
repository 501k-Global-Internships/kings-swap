"use client";
import React, { useState } from "react";
import { EyeOff } from "lucide-react";

const Step3Form = ({ onNext }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add password validation logic here
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-6">Create password</h2>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Password</label>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border rounded p-2 pr-10 text-sm"
          />
          <EyeOff
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          must include : Lower case, upper case , number , at least 8 characters
        </p>
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-1">
          confirm password
        </label>
        <div className="relative">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border rounded p-2 pr-10 text-sm"
          />
          <EyeOff
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={acceptNewsletter}
            onChange={(e) => setAcceptNewsletter(e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          <span className="text-[.7rem] text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
            I accept to receive newsletters and product updates and offers via
            email
          </span>
        </label>
      </div>
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          <span className="text-xs text-gray-600">
            I accept the{" "}
            <a href="/" className="text-blue-500 underline">
              terms of use
            </a>{" "}
            and{" "}
            <a href="/" className="text-blue-500 underline">
              condition of use
            </a>
          </span>
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-gray-200 text-gray-500 p-2 rounded transition-colors text-sm"
      >
        continue
      </button>
    </form>
  );
};

export default Step3Form;
