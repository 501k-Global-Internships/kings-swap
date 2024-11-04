// src/api/useSignUpForm.js
import { useState } from "react";
import { API_CONFIG } from "./config";

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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.countries}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.success) setCountries(result.data);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  const apiRequest = async (endpoint, method = "POST", data = null) => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : null,
      });
      const result = await response.json();
      if (!result.success)
        throw new Error(result.message || "API request failed");
      return result;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  };

  const handleStep1 = async (country) => {
    /* unchanged */
  };
  const handleStep2 = async (userData) => {
    /* unchanged */
  };
  const handleStep3 = async (passwordData) => {
    /* unchanged */
  };
  const handleStep4 = async (otp) => {
    /* unchanged */
  };
  const handleResendOTP = async () => {
    /* unchanged */
  };

  return {
    formData,
    errors,
    isLoading,
    countries,
    handleStep1,
    handleStep2,
    handleStep3,
    handleStep4,
    handleResendOTP,
  };
};
