import React, { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";

const countryCodes = [
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  // Add more countries as needed
];

const Step2Form = ({ onNext }) => {
  const [gender, setGender] = useState("");
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Setup your account</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">First name</label>
          <input
            type="text"
            placeholder="Enter your real name"
            className="w-full border rounded p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Last name (surname)
          </label>
          <input
            type="text"
            placeholder="Enter your real name"
            className="w-full border rounded p-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Kings chat username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full border rounded p-2 text-sm"
          />
          <p className="text-xs text-blue-500 mt-1">
            Don't have an account? create one
          </p>
        </div>
        <div className="relative">
          <label className="block text-sm text-gray-600 mb-1">Gender</label>
          <div
            className="w-full border rounded p-2 text-sm flex justify-between items-center cursor-pointer"
            onClick={() => setIsGenderOpen(!isGenderOpen)}
          >
            <span className={gender ? "text-black" : "text-gray-400"}>
              {gender || "Select your gender"}
            </span>
            <ChevronDown className="text-gray-400" size={16} />
          </div>
          {isGenderOpen && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b mt-[-1px] max-h-32 overflow-y-auto">
              {["Male", "Female", "Other"].map((g) => (
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
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Email address
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full border rounded p-2 text-sm pr-8"
          />
          <Mail
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-1">Phone number</label>
        <div className="flex">
          <div className="relative">
            <div
              className="w-24 border rounded-l p-2 bg-gray-50 flex items-center justify-between cursor-pointer"
              onClick={() => setIsCountryOpen(!isCountryOpen)}
            >
              <span className="flex items-center">
                <span className="mr-1">{selectedCountry.flag}</span>
                <span className="text-sm">{selectedCountry.code}</span>
              </span>
              <ChevronDown className="text-gray-400" size={16} />
            </div>
            {isCountryOpen && (
              <div className="absolute z-20 w-40 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                {countryCodes.map((country) => (
                  <div
                    key={country.code}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setSelectedCountry(country);
                      setIsCountryOpen(false);
                    }}
                  >
                    <span className="mr-2">{country.flag}</span>
                    <span className="text-sm">
                      {country.country} ({country.code})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="tel"
            placeholder="Enter your Phone number"
            className="flex-grow border border-l-0 rounded-r p-2 text-sm"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-gray-200 text-gray-500 p-2 rounded transition-colors text-sm"
      >
        continue
      </button>
    </div>
  );
};

export default Step2Form;
