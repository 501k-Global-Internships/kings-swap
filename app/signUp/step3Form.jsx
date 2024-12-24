"use client";
import React, { useState } from "react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Step3Form = ({
  onNext,
  formData = {},
  errors: serverErrors = {},
  isLoading: parentIsLoading = false,
}) => {
  const [localData, setLocalData] = useState({
    password: formData.password || "",
    password_confirmation: formData.password_confirmation || "",
    accepts_promotions: formData.accepts_promotions || "",
    accept_terms: formData.accept_terms || "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    console.log(name, value, checked, type);
    setLocalData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const validateForm = () => {
  //   const errors = {};

  //   if (!formData.password) {
  //     errors.password = "Password is required";
  //   } else if (formData.password.length < 8) {
  //     errors.password = "Password must be at least 8 characters long";
  //   }

  //   if (formData.password !== formData.password_confirmation) {
  //     errors.password_confirmation = "Passwords do not match";
  //   }

  //   if (!formData.acceptTerms) {
  //     errors.acceptTerms = "You must accept the terms and conditions";
  //   }

  //   setErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) {
    //   return;
    // }

    // setIsLoading(true);
    // setApiError(null);

    // try {
    //   const response = await apiService.auth.register({
    //     password: formData.password,
    //     password_confirmation: formData.confirmPassword,
    //     accepts_promotions: formData.acceptsPromotions,
    //     accept_terms: formData.acceptTerms,
    //     country_id: formData.country_id,
    //     first_name: formData.first_name,
    //     last_name: formData.last_name,
    //     email: formData.email,
    //     kingschat_username: formData.kingschat_username,
    //     gender: formData.gender,
    //     phone_number: formData.phone_number,
    //   });
    //   console.log("Registration successful:", response);
    //   onNext(formData);
    // } catch (error) {
    //   console.error("Registration failed:", error);
    //   setApiError(error.response?.data?.error?.fields || "Registration failed");
    // } finally {
    //   setIsLoading(false);
    // }
    onNext(localData)
  };

  const passwordChecks = {
    length: {
      met: localData.password.length >= 8,
      text: "At least 8 characters",
    },
    uppercase: {
      met: /[A-Z]/.test(localData.password),
      text: "At least one uppercase letter",
    },
    lowercase: {
      met: /[a-z]/.test(localData.password),
      text: "At least one lowercase letter",
    },
    number: {
      met: /[0-9]/.test(localData.password),
      text: "At least one number",
    },
    special: {
      met: /[!@#$%^&*]/.test(localData.password),
      text: "At least one special character",
    },
  };

  const isPasswordValid = Object.values(passwordChecks).every(
    (check) => check.met
  );

  return (
    <div className="w-full max-w-md">
      {apiError && typeof apiError === "object" && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {Object.entries(apiError).map(([field, messages]) => (
              <div key={field}>
                {messages.map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>
            ))}
          </AlertDescription>
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
                autoComplete="new-password"
                value={localData.password}
                onChange={handleInputChange}
                className={`w-full border rounded p-2 pr-10 text-sm ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
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
              {Object.entries(passwordChecks).map(([key, { met, text }]) => (
                <div
                  key={key}
                  className={`text-sm ${
                    met ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {text}
                </div>
              ))}
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs mt-1">{errors.password}</div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="password_confirmation"
                autoComplete="new-password"
                value={localData.password_confirmation}
                onChange={handleInputChange}
                className={`w-full border rounded p-2 pr-10 text-sm ${
                  errors.password_confirmation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Confirm your password"
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
            {errors.password_confirmation && (
              <div className="text-red-500 text-xs mt-1">
                {errors.password_confirmation}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="accepts_promotions"
                checked={localData.accepts_promotions}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4"
              />
              <span className="text-[.7rem] text-gray-600">
                I accept to receive newsletters and product updates and offers
                via email
              </span>
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="accept_terms"
                checked={localData.accept_terms}
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
            {errors.accept_terms && (
              <div className="text-red-500 text-xs mt-1">
                {errors.accept_terms}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={parentIsLoading || isLoading}
            className={`w-full p-2 rounded transition-colors text-sm flex items-center justify-center
              ${
                isPasswordValid && localData.accept_terms
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
