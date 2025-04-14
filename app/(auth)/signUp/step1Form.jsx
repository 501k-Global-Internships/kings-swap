"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/alert";

const Step1Form = ({ onNext, countries, isLoading, initialCountry = "NG" }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  // Set the selected country based on the initialCountry prop
  useEffect(() => {
    if (countries?.length && initialCountry) {
      const country = countries.find((c) => c.id === initialCountry);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [countries, initialCountry]);

  const handleContinue = () => {
    if (!selectedCountry) {
      setError("Please select a country");
      return;
    }
    onNext({ country_id: selectedCountry.id });
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        What country do you live in?
      </h2>
      <div className="relative mb-4">
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Country
        </label>
        <button
          type="button"
          className="w-full bg-gray-100 border border-gray-300 rounded p-2 flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedCountry.flag_url}
                alt={`${selectedCountry.name} flag`}
                className="w-6 h-4 object-cover"
              />
              <span>{selectedCountry.name}</span>
            </div>
          ) : (
            "Select a country"
          )}
          <ChevronDown
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && !isLoading && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b mt-[-1px] max-h-48 overflow-y-auto">
            {countries?.map((country) => (
              <div
                key={country?.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setSelectedCountry(country);
                  setIsOpen(false);
                }}
              >
                <img
                  src={country?.flag_url}
                  alt={`${country?.name} flag`}
                  className="w-6 h-4 object-cover"
                />
                {country?.name}
              </div>
            ))}
          </div>
        )}

        {isOpen && isLoading && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b mt-[-1px] max-h-48 overflow-y-auto flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <button
        onClick={handleContinue}
        className="w-full bg-blue-500 text-white p-2 rounded mt-4"
      >
        Continue
      </button>
    </div>
  );
};

export default Step1Form;
