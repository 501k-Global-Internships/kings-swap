import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Step1Form = ({ onNext }) => {
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
      const response = await fetch(
        "http://kings-swap-be.test/api/v1/attributes/countries",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setCountries(result.data);
      }
    } catch (err) {
      setError("Unable to load countries. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedCountry) {
      onNext(selectedCountry);
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto mt-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
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
              <span
                className={selectedCountry ? "text-black" : "text-gray-400"}
              >
                {selectedCountry ? selectedCountry.name : "Select country"}
              </span>
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
