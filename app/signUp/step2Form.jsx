import React, { useState, useEffect } from "react";
import { ChevronDown, Mail } from "lucide-react";
import Link from "next/link";

const BASE_URL = "https://cabinet.kingsswap.com.ng/api/v1";

const PhoneNumberInput = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/attributes/countries`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.data) {
          setCountries(data.data);
          // Set default country (Nigeria)
          const defaultCountry =
            data.data.find((c) => c.id === "NG") || data.data[0];
          setSelectedCountry(defaultCountry);
        }
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
        setFetchError("Failed to load countries");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getCountryCode = (countryId) => {
    switch (countryId) {
      case "NG":
        return "+234";
      case "GH":
        return "+233";
      case "US":
        return "+1";
      default:
        return "+234";
    }
  };

  // Function to strip any country code from the input value
  const stripCountryCode = (input, countryCode) => {
    if (!input) return "";
    const cleanInput = input.replace(/^\+/, ""); // Remove leading +
    if (cleanInput.startsWith(countryCode.slice(1))) {
      return cleanInput.slice(countryCode.length - 1);
    }
    return cleanInput;
  };

  return (
    <div className="relative w-full">
      <input
        type="tel"
        value={stripCountryCode(
          value,
          selectedCountry ? getCountryCode(selectedCountry.id) : "+234"
        )}
        onChange={(e) => {
          const inputValue = e.target.value;
          // Only allow numbers
          const numbers = inputValue.replace(/[^\d]/g, "");
          const countryCode = selectedCountry
            ? getCountryCode(selectedCountry.id)
            : "+234";
          onChange(countryCode + numbers);
        }}
        placeholder="Enter your Phone number"
        className={`w-full h-12 pl-24 pr-4 text-gray-600 bg-white border ${
          error ? "border-red-500" : "border-[#E2E8F0]"
        } rounded-lg focus:outline-none focus:border-blue-200 focus:ring-1 focus:ring-blue-100`}
      />

      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <div className="animate-pulse w-16 h-6 bg-gray-200 rounded"></div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 px-1 py-0.5 rounded hover:bg-gray-50 focus:outline-none"
          >
            {selectedCountry && (
              <>
                <img
                  src={selectedCountry.flag_url}
                  alt={selectedCountry.name}
                  className="w-5 h-4 object-cover"
                />
                <span className="text-sm text-gray-600">
                  {getCountryCode(selectedCountry.id)}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </>
            )}
          </button>
        )}

        {isOpen && !isLoading && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.id}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 text-left"
                onClick={() => {
                  const newCountryCode = getCountryCode(country.id);
                  const oldCountryCode = selectedCountry
                    ? getCountryCode(selectedCountry.id)
                    : "+234";
                  const phoneWithoutCode = stripCountryCode(
                    value,
                    oldCountryCode
                  );
                  setSelectedCountry(country);
                  setIsOpen(false);
                  onChange(newCountryCode + phoneWithoutCode);
                }}
              >
                <img
                  src={country.flag_url}
                  alt={country.name}
                  className="w-5 h-4 object-cover"
                />
                <span className="text-sm text-gray-600">
                  {getCountryCode(country.id)}
                </span>
                <span className="text-sm text-gray-600">{country.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {fetchError && <p className="text-red-500 text-xs mt-1">{fetchError}</p>}
    </div>
  );
};

const Step2Form = ({
  onNext,
  formData: initialFormData = {},
  errors: serverErrors,
}) => {
  const [formData, setFormData] = useState({
    first_name: initialFormData?.first_name || "",
    last_name: initialFormData?.last_name || "",
    kingschat_username: initialFormData?.kingschat_username || "",
    gender: initialFormData?.gender || "",
    email: initialFormData?.email || "",
    phone_number: initialFormData?.phone_number || "",
  });
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error when field is modified
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({});

    const registrationData = {
      ...formData,
      country_id: "NG",
      accepts_promotions: true,
      password: "Password_12!",
      password_confirmation: "Password_12!",
    };

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (data.success) {
        onNext(data.data);
      } else {
        // Handle validation errors
        if (data.error?.fields) {
          setValidationErrors(data.error.fields);
        }
        console.error("Registration failed:", data);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setValidationErrors({
        general: "An error occurred during registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const hasError = validationErrors[fieldName] || serverErrors?.[fieldName];
    return `w-full border ${
      hasError ? "border-red-500" : "border-gray-300"
    } rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`;
  };

  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Setup your account</h2>

      {validationErrors.general && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {validationErrors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              First name
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              placeholder="Enter your real name"
              className={getInputClassName("first_name")}
              maxLength={255}
            />
            {(validationErrors.first_name || serverErrors?.first_name) && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.first_name || serverErrors?.first_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Last name (surname)
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              placeholder="Enter your real name"
              className={getInputClassName("last_name")}
              maxLength={255}
            />
            {(validationErrors.last_name || serverErrors?.last_name) && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.last_name || serverErrors?.last_name}
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
              value={formData.kingschat_username}
              onChange={(e) =>
                handleInputChange("kingschat_username", e.target.value)
              }
              placeholder="Enter your username"
              className={getInputClassName("kingschat_username")}
              maxLength={32}
              minLength={4}
              pattern="[a-zA-Z0-9._]+"
            />
            {(validationErrors.kingschat_username ||
              serverErrors?.kingschat_username) && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.kingschat_username ||
                  serverErrors?.kingschat_username}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Don't have an account?{" "}
              <Link href="/kingsChat" className="text-blue-500 hover:underline">
                create one
              </Link>
            </p>
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Gender</label>
            <div
              className={`w-full border ${
                validationErrors.gender || serverErrors?.gender
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded p-2 text-sm flex justify-between items-center cursor-pointer`}
              onClick={() => setIsGenderOpen(!isGenderOpen)}
            >
              <span
                className={formData.gender ? "text-black" : "text-gray-400"}
              >
                {formData.gender || "Select your gender"}
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
                      handleInputChange("gender", g);
                      setIsGenderOpen(false);
                    }}
                  >
                    {g}
                  </div>
                ))}
              </div>
            )}
            {(validationErrors.gender || serverErrors?.gender) && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.gender || serverErrors?.gender}
              </p>
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
              value={formData.email}
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
          {(validationErrors.email || serverErrors?.email) && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.email || serverErrors?.email}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">
            Phone number
          </label>
          <PhoneNumberInput
            value={formData.phone_number}
            onChange={(value) => handleInputChange("phone_number", value)}
            error={validationErrors.phone_number || serverErrors?.phone_number}
          />
          {(validationErrors.phone_number || serverErrors?.phone_number) && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.phone_number || serverErrors?.phone_number}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded transition-colors text-sm hover:bg-blue-600 disabled:bg-gray-300"
          disabled={
            isSubmitting ||
            !formData.first_name ||
            !formData.last_name ||
            !formData.kingschat_username ||
            !formData.gender ||
            !formData.email ||
            !formData.phone_number
          }
        >
          {isSubmitting ? "Setting up your account..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default Step2Form;
