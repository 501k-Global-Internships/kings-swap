"use client";
import React, { useState } from "react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    password_confirmation: z.string(),
    accept_terms: z.boolean(),
    accepts_promotions: z.boolean(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

const Step3Form = ({
  onNext,
  formData = {},
  errors: serverErrors = {},
  isLoading: parentIsLoading = false,
}) => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      password: formData.password || "",
      password_confirmation: formData.password_confirmation || "",
      accepts_promotions: formData.accepts_promotions || "",
      accept_terms: formData.accept_terms || "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = methods;

  const password = watch("password");

  const passwordChecks = {
    length: {
      met: password?.length >= 8,
      text: "At least 8 characters",
    },
    uppercase: {
      met: /[A-Z]/.test(password || ""),
      text: "At least one uppercase letter",
    },
    lowercase: {
      met: /[a-z]/.test(password || ""),
      text: "At least one lowercase letter",
    },
    number: {
      met: /\d/.test(password || ""),
      text: "At least one number",
    },
    special: {
      met: /[^A-Za-z0-9]/.test(password || ""),
      text: "At least one special character",
    },
  };

  const onSubmit = async (data) => {
    onNext(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-md">
        {/* {serverErrors && typeof serverErrors === "object" && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {Object.entries(serverErrors).map(([field, messages]) => (
                <div key={field}>
                  {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                  ))}
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )} */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg p-8 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-6">Create password</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  {...register("password")}
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
                <div className="text-red-500 text-xs mt-1">
                  {errors.password?.message}
                </div>
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
                  {...register("password_confirmation")}
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
                  {errors.password_confirmation?.message}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="accepts_promotions"
                  {...register("accepts_promotions")}
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
                  {...register("accept_terms")}
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
                  {errors.accept_terms?.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={parentIsLoading}
              className={`w-full p-2 rounded transition-colors text-sm flex items-center justify-center
              ${
                isValid
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {parentIsLoading ? (
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
    </FormProvider>
  );
};

export default Step3Form;
