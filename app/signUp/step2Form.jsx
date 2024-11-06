'use client'
import React, { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";

const Step2Form = ({ onNext, formData, errors: serverErrors }) => {
  const [firstName, setFirstName] = useState(formData?.first_name || "");
  const [lastName, setLastName] = useState(formData?.last_name || "");
  const [username, setUsername] = useState(formData?.kingschat_username || "");
  const [gender, setGender] = useState(formData?.gender || "");
  const [email, setEmail] = useState(formData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(formData?.phone_number || "");
  const [isGenderOpen, setIsGenderOpen] = useState(false);

  // Handle field changes
  const handleInputChange = (field, value) => {
    switch (field) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({
      firstName,
      lastName,
      username,
      gender,
      email,
      phoneNumber,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      kingschat_username: username.trim(),
      phone_number: phoneNumber.trim(),
    });
  };

  const getInputClassName = (fieldName) => {
    const hasError = serverErrors?.[fieldName];
    return `w-full border ${
      hasError ? "border-red-500" : "border-gray-300"
    } rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`;
  };

  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Setup your account</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              First name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your real name"
              className={getInputClassName("first_name")}
            />
            {serverErrors?.first_name && (
              <p className="text-red-500 text-xs mt-1">
                {serverErrors.first_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Last name (surname)
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your real name"
              className={getInputClassName("last_name")}
            />
            {serverErrors?.last_name && (
              <p className="text-red-500 text-xs mt-1">
                {serverErrors.last_name}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Kings chat username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter your username"
              className={getInputClassName("kingschat_username")}
            />
            {serverErrors?.kingschat_username && (
              <p className="text-red-500 text-xs mt-1">
                {serverErrors.kingschat_username}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Gender</label>
            <div
              className={`w-full border ${
                serverErrors?.gender ? "border-red-500" : "border-gray-300"
              } rounded p-2 text-sm flex justify-between items-center cursor-pointer`}
              onClick={() => setIsGenderOpen(!isGenderOpen)}
            >
              <span className={gender ? "text-black" : "text-gray-400"}>
                {gender || "Select your gender"}
              </span>
              <ChevronDown className="text-gray-400" size={16} />
            </div>
            {isGenderOpen && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b mt-[-1px]">
                {["Male", "Female"].map((g) => (
                  <div
                    key={g}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setGender(g);
                      setIsGenderOpen(false);
                    }}
                  >
                    {g}
                  </div>
                ))}
              </div>
            )}
            {serverErrors?.gender && (
              <p className="text-red-500 text-xs mt-1">{serverErrors.gender}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Email address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
              className={`${getInputClassName("email")} pr-8`}
              maxLength={150}
            />
            <Mail
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          {serverErrors?.email && (
            <p className="text-red-500 text-xs mt-1">{serverErrors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">
            Phone number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="Enter your Phone number (e.g. +2348031234567)"
            className={getInputClassName("phone_number")}
          />
          {serverErrors?.phone_number && (
            <p className="text-red-500 text-xs mt-1">
              {serverErrors.phone_number}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded transition-colors text-sm hover:bg-blue-600 disabled:bg-gray-300"
          disabled={
            !firstName ||
            !lastName ||
            !username ||
            !gender ||
            !email ||
            !phoneNumber
          }
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Step2Form;
