import { useState, useEffect } from "react";
import apiService from "./config";

export const useSignUpForm = () => {
  const [formData, setFormData] = useState({
    country_id: "",
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
      errors.phone_number = [
        "Please enter a valid phone number with country code (e.g., +1234567890)",
      ];
    }

    return errors;
  };

  const validateStep3 = (data) => {
    const errors = {};

    if (!data.password) {
      errors.password = ["Password is required"];
    } else if (data.password.length < 8) {
      errors.password = ["Password must be at least 8 characters long"];
    }

    if (!data.password_confirmation) {
      errors.password_confirmation = ["Please confirm your password"];
    } else if (data.password !== data.password_confirmation) {
      errors.password = ["Passwords do not match"];
    }

    return errors;
  };

  const handleStep1 = (countryData) => {
    setErrors({});
    if (!countryData?.id) {
      setErrors({ country: ["Please select a country"] });
      return false;
    }
    setFormData((prev) => ({
      ...prev,
      country_id: countryData.id.toLowerCase(),
    }));
    setStep(2);
    return true;
  };

  const handleStep2 = (data) => {
    const validationErrors = validateStep2(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setFormData((prev) => ({
      ...prev,
      first_name: data.first_name?.trim(),
      last_name: data.last_name?.trim(),
      email: data.email?.toLowerCase().trim(),
      kingschat_username: data.kingschat_username?.trim(),
      gender: data.gender,
      phone_number: data.phone_number?.trim(),
    }));

    setStep(3);
    return true;
  };

  const handleStep3 = async (passwordData) => {
    setIsLoading(true);
    setErrors({});

    try {
      const validationErrors = validateStep3(passwordData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }

      const updatedFormData = {
        ...formData,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
        accepts_promotions: passwordData.accepts_promotions,
      };

      const result = await apiService.auth.register(updatedFormData);

      if (result.data.success) {
        await apiService.auth.requestVerification(updatedFormData.email);
        setStep(4);
        return true;
      }
    } catch (error) {
      if (error.details?.type === "validation") {
        setErrors(error.details.errors);
      } else {
        setErrors({
          general: [error.message || "Registration failed"],
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep4 = async (code) => {
    if (!code) {
      setErrors({ code: ["Please enter the verification code"] });
      return false;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await apiService.auth.verifyEmail({
        email: formData.email,
        code: code,
      });

      if (result.data.success) {
        setVerificationComplete(true);
        return true;
      }
    } catch (error) {
      setErrors(
        error.details?.type === "validation"
          ? error.details.errors
          : { general: [error.message || "Verification failed"] }
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await apiService.auth.requestVerification(formData.email);
      return true;
    } catch (error) {
      setErrors({
        general: [error.message || "Failed to resend OTP"],
      });
      return false;
    } finally {
      setIsLoading(false);
    }
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
