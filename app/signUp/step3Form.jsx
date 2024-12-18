"use client";
import React, { useState, useEffect } from "react";
import { EyeOff, Eye, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Step3Form = ({
  formData: parentFormData,
  onNext,
  errors: serverErrors = {},
  isLoading: parentIsLoading = false,
}) => {
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

  useEffect(() => {
    if (Object.keys(serverErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...serverErrors,
        password: serverErrors.password?.[0],
        confirmPassword: serverErrors.password_confirmation?.[0],
      }));
    }
  }, [serverErrors]);

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

    // Clear errors when input changes
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      password: name === "password" ? undefined : prev.password,
      confirmPassword:
        name === "confirmPassword" ? undefined : prev.confirmPassword,
    }));

    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isPasswordValid) {
      newErrors.password = "Password does not meet the required criteria";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms of use";
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Format the data according to the API specification
      const formPayload = {
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        accepts_promotions: formData.acceptsPromotions,
      };

      // Call the parent's onNext function with the formatted payload
      await onNext(formPayload);
    } catch (error) {
      console.error("Form submission error:", error);
      setApiError(
        error.message ||
          "Registration failed. Please check your information and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const ErrorMessage = ({ message }) => (
    <div className="flex items-start gap-2 mt-2 text-red-500">
      <AlertCircle className="h-4 w-4 mt-0.5" />
      <span className="text-sm">{message}</span>
    </div>
  );
  
  return (
    <div className="w-full max-w-md">
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-6">Create password</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                autocomplete="new-password"
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
                  setShowPassword((prev) => ({
                    ...prev,
                    password: !prev.password,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.password ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            </div>

            <div className="mt-2 space-y-1">
              {Object.entries(passwordRequirements).map(
                ([requirement, isMet]) => (
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
                )
              )}
            </div>
            {errors.password && <ErrorMessage message={errors.password} />}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                autocomplete="new-password"
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
                  setShowPassword((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <ErrorMessage message={errors.confirmPassword} />
            )}
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="acceptsPromotions"
                checked={formData.acceptsPromotions}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4"
              />
              <span className="text-[.7rem] text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                I accept to receive newsletters and product updates and offers
                via email
              </span>
            </label>
          </div>

          <div>
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
              <ErrorMessage message={errors.acceptTerms} />
            )}
          </div>

          <button
            type="submit"
            disabled={parentIsLoading || isLoading}
            className={`w-full p-2 rounded transition-colors text-sm flex items-center justify-center
              ${
                isPasswordValid && formData.acceptTerms
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            {parentIsLoading || isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3Form;
