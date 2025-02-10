import { useState, useEffect } from "react";
import apiService from "../config/config";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCountryStore } from "../stores/countries.store";

export const useSignUpForm = () => {
  const initialize = useCountryStore((state) => state.initialize);

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
  const [verificationComplete, setVerificationComplete] = useState(false);

  const {
    data: countries,
    isFetching,
    isPending,
    error,
  } = useSuspenseQuery({
    queryKey: ["fetch/countries"],
    queryFn: () => apiService.attributes.getCountries(),
    placeholderData: keepPreviousData,
  });

  const { mutate: postStepDetails, isPending: postPending } = useMutation({
    mutationFn: (data) => apiService.auth.register(data),
    onSuccess: async () => {
      await apiService.auth.requestVerification(formData.email);
      setStep(4);
    },
    onError: (error) => {
      console.log(error, "error post");
      setErrors({ general: [error.message] });
    },
  });

  const { mutate: verifyEmail, isPending: verifying } = useMutation({
    mutationFn: (data) => apiService.auth.verifyEmail(data),
    onSuccess: () => {
      setVerificationComplete(true);
    },
    onError: (error) => {
      setErrors({ general: [error.message] });
    },
  });

  const { mutate: resendOTP, isPending: resending } = useMutation({
    mutationFn: (data) => apiService.auth.requestVerification(data),
    onError: (error) => {
      setErrors({ general: [error.message] });
    },
  });

  useEffect(() => {
    if (countries && formData.country_id) {
      initialize(countries, formData.country_id);
    }
  }, [countries, formData.country_id]);

  const handleStep1 = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2 = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStep3 = async (passwordData) => {
    postStepDetails({
      ...formData,
      ...passwordData,
    });
  };

  const handleStep4 = async (code) => {
    verifyEmail({
      email: formData.email,
      code,
    });
  };

  const handleResendOTP = async () => {
    resendOTP(formData.email);
  };

  return {
    formData,
    errors,
    postPending,
    resending,
    isFetching,
    verifying,
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
