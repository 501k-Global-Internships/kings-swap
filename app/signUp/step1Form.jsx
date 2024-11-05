'use client'
import React, { useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Step1Form = ({ onNext, apiBaseUrl }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the baseUrl prop or fallback to a default
      const baseUrl = apiBaseUrl || "https://cabinet.kingsswap.com.ng";
      const response = await fetch(`${baseUrl}/api/v1/attributes/countries`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Add credentials if needed
        // credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setCountries(result.data);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError(
        err.message === "Failed to fetch"
          ? "Network error: Please check your connection and try again."
          : "Unable to load countries. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedCountry) {
      onNext(selectedCountry);
    }
  };

  const handleRetry = () => {
    fetchCountries();
  };

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto mt-4">
        <Alert variant="destructive">
          <AlertDescription className="flex flex-col gap-2">
            <span>{error}</span>
            <button
              onClick={handleRetry}
              className="text-sm text-white underline hover:no-underline"
            >
              Try Again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#C8C8C8] rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto">
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
        <div
          className="w-full p-2 border border-[#ABB5FF] rounded flex justify-between items-center cursor-pointer bg-white"
          onClick={() => !isLoading && setIsOpen(!isOpen)}
        >
          {isLoading ? (
            <div className="flex items-center text-gray-400">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading countries...
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {selectedCountry && (
                  <img
                    src={selectedCountry.flag_url}
                    alt={`${selectedCountry.name} flag`}
                    className="w-6 h-4 object-cover"
                  />
                )}
                <span
                  className={selectedCountry ? "text-black" : "text-gray-400"}
                >
                  {selectedCountry ? selectedCountry.name : "Select country"}
                </span>
              </div>
              <ChevronDown
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </div>

        {isOpen && !isLoading && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b mt-[-1px] max-h-48 overflow-y-auto">
            {countries.map((country) => (
              <div
                key={country.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setSelectedCountry(country);
                  setIsOpen(false);
                }}
              >
                <img
                  src={country.flag_url}
                  alt={`${country.name} flag`}
                  className="w-6 h-4 object-cover"
                />
                {country.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedCountry || isLoading}
        className={`w-full p-2 rounded transition-colors ${
          selectedCountry && !isLoading
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-[#EAEAEA] text-[#909CC6] cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default Step1Form;
