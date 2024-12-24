import { useState, useEffect } from "react";
import apiService from "./config";

export const useSignUpForm = () => {
  const [formData, setFormData] = useState({
    country_id: "NG",
    first_name: "",
    last_name: "",
    email: "",
    kingschat_username: "",
    gender: "",
    phone_number: "",
    accepts_promotions: false,
    password: "",
    password_confirmation: "",
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await apiService.attributes.getCountries();
      if (response.data) setCountries(response.data);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      setErrors({
        general: [error.message || "Failed to load countries"],
      });
    }
  };

  const handleStep1 = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2 = (data) => {
    const validationErrors = validateStep2(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStep3 = async (passwordData) => {
    setIsLoading(true);
    try {
      const response = await apiService.auth.register({
        ...formData,
        ...passwordData,
        // password_confirmation: passwordData.password,
      });
      console.log("Registration successful:", response);
      if (response.success) {
        const response = await apiService.auth.requestVerification(
          formData.email
        );
        setStep(4);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors(error.response?.data?.error?.fields);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep4 = async (code) => {
    setIsLoading(true);
    try {
      const response = await apiService.auth.verifyEmail({
        email: formData.email,
        code,
      });
      console.log("Verification successful:", response);
      setVerificationComplete(true);
    } catch (error) {
      console.error("Verification failed:", error);
      setErrors({ general: [error.message] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.auth.requestVerification(
        formData.email
      );
      console.log("Verification code resent:", response);
    } catch (error) {
      console.error("Resend code failed:", error);
      setErrors({ general: [error.message] });
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep2 = (data) => {
    const errors = {};

    if (!data.first_name?.trim())
      errors.first_name = ["First name is required"];
    if (!data.last_name?.trim()) errors.last_name = ["Last name is required"];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
      errors.email = ["Email is required"];
    } else if (!emailRegex.test(data.email)) {
      errors.email = ["Please enter a valid email address"];
    }

    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!data.kingschat_username) {
      errors.kingschat_username = ["Username is required"];
    } else if (
      !data.kingschat_username.match(usernameRegex) ||
      data.kingschat_username.length < 4 ||
      data.kingschat_username.length > 32
    ) {
      errors.kingschat_username = [
        "Username must be 4-32 characters and can only contain letters, numbers, dots, and underscores",
      ];
    }

    if (!data.gender) errors.gender = ["Gender is required"];

    const phoneRegex = /^\+[0-9]{10,15}$/;
    if (!data.phone_number) {
      errors.phone_number = ["Phone number is required"];
    } else if (!phoneRegex.test(data.phone_number)) {
      errors.phone_number = ["Please enter a valid phone number"];
    }

    return errors;
  };

  return {
    formData,
    errors,
    isLoading,
    countries,
    step,
    verificationComplete,
    handleStep1,
    handleStep2,
    handleStep3,
    handleStep4,
    handleResendOTP,
  };
};
