// import { useState, useEffect } from "react";
// import apiService from "../config/config";
// import {
//   keepPreviousData,
//   useMutation,
//   useQuery,
//   useSuspenseQuery,
// } from "@tanstack/react-query";
// import { useCountryStore } from "../stores/countries.store";
// import { ToastService } from "../config/config";

// export const useSignUpForm = () => {
//   const initialize = useCountryStore((state) => state.initialize);

//   const [formData, setFormData] = useState({
//     country_id: "NG",
//     first_name: "",
//     last_name: "",
//     email: "",
//     kingschat_username: "",
//     gender: "",
//     phone_number: "",
//     accepts_promotions: false,
//     password: "",
//     password_confirmation: "",
//   });

//   const [step, setStep] = useState(1);
//   const [errors, setErrors] = useState({});
//   const [verificationComplete, setVerificationComplete] = useState(false);

//   const {
//     data: countries,
//     isFetching,
//     isPending,
//     error,
//   } = useSuspenseQuery({
//     queryKey: ["fetch/countries"],
//     queryFn: () => apiService.attributes.getCountries(),
//     placeholderData: keepPreviousData,
//     useErrorBoundary: false,
//     onError: (error) => {
//       // Use ToastService instead of setting to state directly
//       ToastService.showError(
//         "Failed to fetch countries. Please try again later."
//       );
//       setErrors((prev) => ({
//         ...prev,
//         countriesError: "Failed to load countries",
//       }));
//     },
//   });

//   const { mutate: postStepDetails, isPending: postPending } = useMutation({
//     mutationFn: (data) => apiService.auth.register(data),
//     onSuccess: async () => {
//       await apiService.auth.requestVerification(formData.email);
//       setStep(4);
//     },
//     onError: (error) => {
//       // Use ToastService instead of logging and setting to state
//       const errorMessage = getFormattedErrorMessage(error);
//       ToastService.showError(errorMessage);
//       setErrors({
//         general: ["Registration failed. Please check your information."],
//       });
//     },
//   });

//   const { mutate: verifyEmail, isPending: verifying } = useMutation({
//     mutationFn: (data) => apiService.auth.verifyEmail(data),
//     onSuccess: () => {
//       setVerificationComplete(true);
//       ToastService.showSuccess("Email verified successfully!");
//     },
//     onError: (error) => {
//       // Use ToastService for verification errors
//       const errorMessage = getFormattedErrorMessage(error);
//       ToastService.showError(errorMessage);
//       setErrors({ general: ["Verification failed. Please try again."] });
//     },
//   });

//   const { mutate: resendOTP, isPending: resending } = useMutation({
//     mutationFn: (data) => apiService.auth.requestVerification(data),
//     onSuccess: () => {
//       ToastService.showSuccess("Verification code resent successfully!");
//     },
//     onError: (error) => {
//       // Use ToastService for resend errors
//       const errorMessage = getFormattedErrorMessage(error);
//       ToastService.showError(errorMessage);
//       setErrors({ general: ["Failed to resend verification code."] });
//     },
//   });

//   // Helper function to extract user-friendly error messages
//   const getFormattedErrorMessage = (error) => {
//     // If it's already an ApiError object with userFriendlyMessage
//     if (error.userFriendlyMessage) {
//       return error.userFriendlyMessage;
//     }

//     // Check if it's an API response with a message
//     if (error.data?.message) {
//       return error.data.message;
//     }

//     // Default generic message
//     return "Something went wrong. Please try again later.";
//   };

//   useEffect(() => {
//     if (countries && formData.country_id) {
//       initialize(countries, formData.country_id);
//     }
//   }, [countries, formData.country_id, initialize]);

//   const handleStep1 = (data) => {
//     setFormData((prev) => ({ ...prev, ...data }));
//     setStep(2);
//   };

//   const handleStep2 = (data) => {
//     setFormData((prev) => ({ ...prev, ...data }));
//     setStep(3);
//   };

//   const handleStep3 = async (passwordData) => {
//     setErrors({}); // Clear previous errors
//     postStepDetails({
//       ...formData,
//       ...passwordData,
//     });
//   };

//   const handleStep4 = async (code) => {
//     setErrors({}); // Clear previous errors
//     verifyEmail({
//       email: formData.email,
//       code,
//     });
//   };

//   const handleResendOTP = async () => {
//     setErrors({}); // Clear previous errors
//     resendOTP(formData.email);
//   };

//   return {
//     formData,
//     errors,
//     postPending,
//     resending,
//     isFetching,
//     verifying,
//     countries,
//     step,
//     verificationComplete,
//     handleStep1,
//     handleStep2,
//     handleStep3,
//     handleStep4,
//     handleResendOTP,
//   };
// };


import { useState, useEffect } from "react";
import apiService from "../config/config";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useCountryStore } from "../stores/countries.store";
import { ToastService } from "../config/config";

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

  // Change from useSuspenseQuery to useQuery with enabled option
  const {
    data: countries,
    isFetching,
    isPending,
    error,
  } = useQuery({
    queryKey: ["fetch/countries"],
    queryFn: () => apiService.attributes.getCountries(),
    placeholderData: keepPreviousData,
    // Disable initial fetch during SSR/build time
    enabled: typeof window !== "undefined",
    onError: (error) => {
      ToastService.showError(
        "Failed to fetch countries. Please try again later."
      );
      setErrors((prev) => ({
        ...prev,
        countriesError: "Failed to load countries",
      }));
    },
  });

  const { mutate: postStepDetails, isPending: postPending } = useMutation({
    mutationFn: (data) => apiService.auth.register(data),
    onSuccess: async () => {
      await apiService.auth.requestVerification(formData.email);
      setStep(4);
    },
    onError: (error) => {
      const errorMessage = getFormattedErrorMessage(error);
      ToastService.showError(errorMessage);
      setErrors({
        general: ["Registration failed. Please check your information."],
      });
    },
  });

  const { mutate: verifyEmail, isPending: verifying } = useMutation({
    mutationFn: (data) => apiService.auth.verifyEmail(data),
    onSuccess: () => {
      setVerificationComplete(true);
      ToastService.showSuccess("Email verified successfully!");
    },
    onError: (error) => {
      const errorMessage = getFormattedErrorMessage(error);
      ToastService.showError(errorMessage);
      setErrors({ general: ["Verification failed. Please try again."] });
    },
  });

  const { mutate: resendOTP, isPending: resending } = useMutation({
    mutationFn: (data) => apiService.auth.requestVerification(data),
    onSuccess: () => {
      ToastService.showSuccess("Verification code resent successfully!");
    },
    onError: (error) => {
      const errorMessage = getFormattedErrorMessage(error);
      ToastService.showError(errorMessage);
      setErrors({ general: ["Failed to resend verification code."] });
    },
  });

  const getFormattedErrorMessage = (error) => {
    if (error.userFriendlyMessage) {
      return error.userFriendlyMessage;
    }

    if (error.data?.message) {
      return error.data.message;
    }

    return "Something went wrong. Please try again later.";
  };

  useEffect(() => {
    if (countries && formData.country_id) {
      initialize(countries, formData.country_id);
    }
  }, [countries, formData.country_id, initialize]);

  const handleStep1 = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2 = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStep3 = async (passwordData) => {
    setErrors({}); // Clear previous errors
    postStepDetails({
      ...formData,
      ...passwordData,
    });
  };

  const handleStep4 = async (code) => {
    setErrors({}); // Clear previous errors
    verifyEmail({
      email: formData.email,
      code,
    });
  };

  const handleResendOTP = async () => {
    setErrors({}); // Clear previous errors
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