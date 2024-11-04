"use client";
import React, { useState } from "react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Step3Form = ({ onNext }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    acceptsPromotions: false,
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("accept") ? checked : value,
    }));

    // Clear related errors when input changes
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isPasswordValid) {
      newErrors.password = "Password does not meet requirements";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms of use";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Pass the validated data to parent component
      onNext({
        password: formData.password,
        password_confirmation: formData.password,
        accepts_promotions: formData.acceptsPromotions,
      });
    } catch (error) {
      setApiError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative"
    >
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <h2 className="text-xl font-semibold mb-6">Create password</h2>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword.password ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className={`w-full border rounded p-2 pr-10 text-sm ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, password: !prev.password }))
            }
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword.password ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <div className="mt-2 space-y-1">
          {Object.entries(passwordRequirements).map(([requirement, isMet]) => (
            <div
              key={requirement}
              className={`text-xs flex items-center ${
                isMet ? "text-green-600" : "text-gray-500"
              }`}
            >
              <div
                className={`w-1 h-1 rounded-full mr-2 ${
                  isMet ? "bg-green-600" : "bg-gray-500"
                }`}
              />
              {requirement === "minLength" && "At least 8 characters"}
              {requirement === "hasUpperCase" && "One uppercase letter"}
              {requirement === "hasLowerCase" && "One lowercase letter"}
              {requirement === "hasNumber" && "One number"}
              {requirement === "hasSpecial" && "One special character"}
            </div>
          ))}
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-1">
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className={`w-full border rounded p-2 pr-10 text-sm ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="acceptsPromotions"
            checked={formData.acceptsPromotions}
            onChange={handleInputChange}
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
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className={`mr-2 h-4 w-4 ${
              errors.acceptTerms ? "border-red-500" : ""
            }`}
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
        {errors.acceptTerms && (
          <p className="text-xs text-red-500 mt-1">{errors.acceptTerms}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full p-2 rounded transition-colors text-sm flex items-center justify-center
          ${
            isPasswordValid && formData.acceptTerms
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={16} />
            Processing...
          </>
        ) : (
          "Continue"
        )}
      </button>
    </form>
  );
};

export default Step3Form;
