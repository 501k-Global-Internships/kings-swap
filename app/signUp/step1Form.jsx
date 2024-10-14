import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const countries = [
  "Nigeria",
  "Angola",
  "Algeria",
  "Atlanta",
  "Buenos",
  // ... other countries can be added here
];

const Step1Form = ({ onNext }) => {
  const [country, setCountry] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        What country do you live in?
      </h2>
      <div className="relative mb-4">
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          country
        </label>
        <div
          className="w-full p-2 border border-gray-300 rounded flex justify-between items-center cursor-pointer bg-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={country ? "text-black" : "text-gray-400"}>
            {country || "select country"}
          </span>
          <ChevronDown className="text-gray-400" />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b mt-[-1px] max-h-48 overflow-y-auto">
            {countries.map((c) => (
              <div
                key={c}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setCountry(c);
                  setIsOpen(false);
                }}
              >
                {c}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onNext}
        className="w-full bg-gray-200 text-blue-500 p-2 rounded hover:bg-gray-300 transition-colors"
      >
        continue
      </button>
    </div>
  );
};

export default Step1Form;
