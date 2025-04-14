"use client";

import axios from "axios";
import { z } from "zod";
import toast from "react-hot-toast";

const RATE_LIMIT_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

// Validation schemas
const CountrySchema = z.object({
  id: z.string(),
  name: z.string(),
  flag_url: z.string().url(),
});


const CountriesResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  data: z.array(CountrySchema),
}); 


const ApiConfigSchema = z.object({
  baseURL: z.string().url(),
  timeout: z.number().positive(),
  endpoints: z.object({
    auth: z.object({
      register: z.string(),
      login: z.string(),
      verifyEmail: z.string(),
      requestVerification: z.string(),
      passwordResetRequest: z.string(),
      passwordResetVerify: z.string(),
    }),
    attributes: z.object({
      countries: z.string(),
      banks: z.string(),
      rates: z.string(),
      resolveAccount: z.string(),
      currencies: z.string(),
    }),
    transactions: z.object({
      create: z.string(),
      list: z.string(),
      details: z.string(),
    }),
    preflight: z.string(),
  }),
});

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  endpoints: {
    auth: {
      register: "/api/v1/auth/register",
      login: "/api/v1/auth/login",
      verifyEmail: "/api/v1/auth/email-verification/verify",
      requestVerification: "/api/v1/auth/email-verification/request",
      passwordResetRequest: "/api/v1/auth/password-reset/request",
      passwordResetVerify: "/api/v1/auth/password-reset/verify",
    },
    attributes: {
      countries: "/api/v1/attributes/countries",
      banks: "/api/v1/attributes/banks",
      rates: "/api/v1/attributes/espee-rates",
      resolveAccount: "/api/v1/attributes/banks/resolve-account",
      currencies: "/api/v1/attributes/currencies",
    },
    transactions: {
      create: "/api/v1/transactions",
      list: "/api/v1/transactions",
      details: "/api/v1/transactions/:id",
      cancel: "/api/v1/transactions/:id/cancel",
    },
    preflight: "/ping",
  },
};


// Create a Toast service for displaying errors
const ToastService = {
  showError: (message) => {
    if (typeof window !== "undefined") {
      toast.error(message || "An unexpected error occurred");
    }
  },

  showSuccess: (message) => {
    if (typeof window !== "undefined") {
      toast.success(message);
    }
  },
};

// Error Handler Class
class ApiError extends Error {
  constructor(
    message,
    status,
    data,
    retryable = false,
    errorCode = null,
    originalError = null,
    userFriendlyMessage = null
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.retryable = retryable;
    this.timestamp = new Date().toISOString();
    this.errorCode = errorCode;
    this.originalError = originalError;
    this.userFriendlyMessage =
      userFriendlyMessage || this.getUserFriendlyMessage(status, errorCode);
  }

  getUserFriendlyMessage(status, errorCode) {
    if (!navigator.onLine) {
      return "Please check your internet connection and try again.";
    }

    // Common error types with friendly messages
    const errorMessages = {
      NO_INTERNET: "Please check your internet connection and try again.",
      REQUEST_TIMEOUT:
        "The server is taking too long to respond. Please try again later.",
      NO_RESPONSE:
        "We couldn't connect to our servers. Please check your connection or try again later.",
      SERVER_401: "Your session has expired. Please log in again.",
      SERVER_403: "You don't have permission to access this resource.",
      SERVER_404: "The requested information could not be found.",
      SERVER_429: "Too many requests. Please try again later.",
      SERVER_500: "Something went wrong on our end. We're working to fix it.",
      SERVER_502:
        "Our service is temporarily unavailable. Please try again later.",
      SERVER_503:
        "Our service is temporarily unavailable. Please try again later.",
      SERVER_504: "The server timed out. Please try again later.",
      VALIDATION_ERROR: "We received unexpected data. Please try again later.",
    };

    return (
      errorMessages[errorCode] ||
      (status >= 500
        ? "Something went wrong on our end. We're working to fix it."
        : status >= 400
        ? "We couldn't complete your request. Please try again."
        : "An unexpected error occurred. Please try again later.")
    );
  }

  static isRetryable(status) {
    return [408, 429, 500, 502, 503, 504].includes(status);
  }

  static getErrorDetails(error) {
    if (error.response) {
      // Server responded with error
      return {
        message:
          error.response.data?.message ||
          `HTTP Error: ${error.response.status}`,
        status: error.response.status,
        data: error.response.data,
        errorCode: `SERVER_${error.response.status}`,
        retryable: this.isRetryable(error.response.status),
        userFriendlyMessage: error.response.data?.message || null,
      };
    }

    if (error.request) {
      // Request made but no response received
      if (error.code === "ECONNABORTED") {
        return {
          message: `Request timeout after ${error.config?.timeout}ms`,
          status: 408,
          data: null,
          errorCode: "REQUEST_TIMEOUT",
          retryable: true,
          userFriendlyMessage:
            "The server is taking too long to respond. Please try again later.",
        };
      }

      if (!navigator.onLine) {
        return {
          message: "No internet connection",
          status: -1,
          data: null,
          errorCode: "NO_INTERNET",
          retryable: true,
          userFriendlyMessage:
            "Please check your internet connection and try again.",
        };
      }

      return {
        message: "No response from server",
        status: -1,
        data: null,
        errorCode: "NO_RESPONSE",
        retryable: true,
        userFriendlyMessage:
          "We couldn't connect to our servers. Please check your connection or try again later.",
      };
    }

    // Something happened in setting up the request
    return {
      message: error.message || "Request configuration error",
      status: -2,
      data: null,
      errorCode: "REQUEST_SETUP_ERROR",
      retryable: false,
      userFriendlyMessage:
        "There was a problem with your request. Please try again.",
    };
  }
}

class ApiService {
  constructor(config) {
    try {
      // Validate config at runtime
      ApiConfigSchema.parse(config);
      this.config = config;
      this.axios = this.createAxiosInstance();
      this.token = this.getStoredToken();
      this.setupInterceptors();
      this.retryQueue = new Map();
      this.networkListenerInitialized = false;
      this.networkStatus = {
        online: typeof navigator !== "undefined" ? navigator.onLine : true,
        lastCheck: Date.now(),
      };

      // Initialize network status listeners
      this.initNetworkListeners();
    } catch (error) {
      console.error("Invalid API configuration:", error);
      throw new Error("Invalid API configuration");
    }
  }

  initNetworkListeners() {
    if (typeof window !== "undefined" && !this.networkListenerInitialized) {
      window.addEventListener("online", () => {
        this.networkStatus.online = true;
        this.networkStatus.lastCheck = Date.now();
        this.processRetryQueue();
      });

      window.addEventListener("offline", () => {
        this.networkStatus.online = false;
        this.networkStatus.lastCheck = Date.now();
        // Show a toast when the network goes offline
        ToastService.showError(
          "You are currently offline. Please check your internet connection."
        );
      });

      this.networkListenerInitialized = true;
    }
  }

  processRetryQueue() {
    // Process any pending requests when coming back online
    if (this.retryQueue.size > 0 && this.networkStatus.online) {
      // Implementation of retry queue processing
      // This is a placeholder for a more robust implementation
    }
  }

  createAxiosInstance() {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });
  }

  // Enhanced token management with encryption
  getStoredToken() {
    if (typeof window === "undefined") return null;
    try {
      const encryptedToken = localStorage.getItem("token");
      return encryptedToken ? this.decryptToken(encryptedToken) : null;
    } catch (error) {
      console.warn("Token retrieval failed:", error);
      return null;
    }
  }

  setToken(token) {
    try {
      if (token) {
        const encryptedToken = this.encryptToken(token);
        localStorage.setItem("token", encryptedToken);
        this.token = token;
        this.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        localStorage.removeItem("token");
        delete this.axios.defaults.headers.common["Authorization"];
        this.token = null;
      }
    } catch (error) {
      console.warn("Token storage failed:", error);
      this.handleAuthError();
    }
  }

  // Token encryption/decryption (implement proper encryption in production)
  encryptToken(token) {
    // Implement proper encryption
    return token;
  }

  decryptToken(encryptedToken) {
    // Implement proper decryption
    return encryptedToken;
  }

  // Enhanced interceptors with retry logic
  setupInterceptors() {
    this.axios.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    );

    this.axios.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    );
  }

  async handleResponseError(error) {
    const originalRequest = error.config;

    if (!originalRequest) {
      const formattedError = this.formatError(error);
      // Display toast with user-friendly error message
      ToastService.showError(formattedError.userFriendlyMessage);
      return Promise.reject(formattedError);
    }

    // Enhanced error logging - only log in development
    if (process.env.NODE_ENV !== "production") {
      console.log("API Error:", {
        url: originalRequest.url,
        method: originalRequest.method,
        status: error.response?.status,
        errorCode: error.response?.data?.code,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      return this.handleTokenExpiration(originalRequest);
    }

    const formattedError = this.formatError(error);

    // Display toast with user-friendly error message for non-retryable errors
    // or if we've exhausted retry attempts
    if (
      !formattedError.retryable ||
      (originalRequest._retryCount &&
        originalRequest._retryCount >= RATE_LIMIT_CONFIG.maxRetries)
    ) {
      ToastService.showError(formattedError.userFriendlyMessage);
    }

    // Handle retryable errors
    if (
      formattedError.retryable &&
      (!originalRequest._retryCount ||
        originalRequest._retryCount < RATE_LIMIT_CONFIG.maxRetries)
    ) {
      return this.handleRetry(originalRequest, formattedError);
    }

    return Promise.reject(formattedError);
  }

  // Add new method for error monitoring/reporting
  logError(error) {
    // Only log details in development environment
    if (process.env.NODE_ENV !== "production") {
      console.log("API Error:", {
        errorCode: error.errorCode,
        status: error.status,
        message: error.message,
        timestamp: error.timestamp,
        retryable: error.retryable,
      });
    }

    // In production, you might want to send this to your error monitoring service
    // but without exposing technical details to end users
    if (
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined"
    ) {
      // Example: send to error monitoring service
      // errorMonitoringService.captureError(error);
    }
  }

  async handleRequest(config) {
    // Check network status before sending request
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      // Instead of throwing an error, return a rejected promise with an ApiError
      return Promise.reject(
        new ApiError(
          "No internet connection",
          -1,
          null,
          true,
          "NO_INTERNET",
          null,
          "Please check your internet connection and try again."
        )
      );
    }

    const token = this.token || this.getStoredToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }

  handleRequestError(error) {
    // Don't expose internal errors to console in production
    if (process.env.NODE_ENV !== "production") {
      console.warn("Request Interceptor Error:", error);
    }

    const apiError = new ApiError(
      error.message,
      0,
      null,
      false,
      "REQUEST_SETUP_ERROR",
      error,
      "There was a problem with your request. Please try again."
    );

    // Display toast for request setup errors
    ToastService.showError(apiError.userFriendlyMessage);

    return Promise.reject(apiError);
  }

  handleResponse(response) {
    return response;
  }

  async handleTokenExpiration(originalRequest) {
    originalRequest._retry = true;
    try {
      const newToken = await this.refreshToken();
      this.setToken(newToken);
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return this.axios(originalRequest);
    } catch (refreshError) {
      this.handleAuthError();

      const authError = new ApiError(
        "Authentication failed",
        401,
        null,
        false,
        "AUTH_ERROR",
        refreshError,
        "Your session has expired. Please log in again."
      );

      // Display toast for auth errors
      ToastService.showError(authError.userFriendlyMessage);

      return Promise.reject(authError);
    }
  }

  async handleRetry(originalRequest, error) {
    originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
    const delay = Math.min(
      RATE_LIMIT_CONFIG.baseDelay *
        Math.pow(2, originalRequest._retryCount - 1),
      RATE_LIMIT_CONFIG.maxDelay
    );

    // If it's the first retry, show a toast that we're retrying
    if (originalRequest._retryCount === 1) {
      ToastService.showError(
        `Connection issue. Retrying... (Attempt 1/${RATE_LIMIT_CONFIG.maxRetries})`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    return this.axios(originalRequest);
  }

  formatError(error) {
    const errorDetails = ApiError.getErrorDetails(error);

    // Enhanced error message extraction from the response
    const userFriendlyMessage =
      errorDetails.data?.message ||
      errorDetails.data?.error?.message ||
      errorDetails.userFriendlyMessage ||
      "An unexpected error occurred";

    return new ApiError(
      errorDetails.message,
      errorDetails.status,
      errorDetails.data,
      errorDetails.retryable,
      errorDetails.errorCode,
      error,
      userFriendlyMessage
    );
  }

  handleAuthError() {
    this.setToken(null);
    if (typeof window !== "undefined") {
      // Show toast before redirecting
      ToastService.showError("Your session has expired. Please log in again.");

      // Use a more robust navigation solution in production
      setTimeout(() => {
        window.location.href = "/loginPage";
      }, 1500); // Give time for the toast to be seen
    }
  }

  async makeRequest(requestConfig) {
    try {
      // Check network status before making request
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        // Instead of throwing directly, we'll create an error and show a toast
        const offlineError = new ApiError(
          "No internet connection",
          -1,
          null,
          true,
          "NO_INTERNET",
          null,
          "Please check your internet connection and try again."
        );

        // Show toast for offline error
        ToastService.showError(offlineError.userFriendlyMessage);

        // Return a rejected promise instead of throwing
        return Promise.reject(offlineError);
      }

      const response = await this.axios(requestConfig);
      return response.data;
    } catch (error) {
      // Format the error with user-friendly message
      const formattedError =
        error instanceof ApiError ? error : this.formatError(error);

      // Log the error (but not in production to user console)
      this.logError(formattedError);

      // Make sure we show a toast for any errors that reach this point
      // that weren't handled by interceptors
      if (!error.config || !error.config._retry) {
        ToastService.showError(formattedError.userFriendlyMessage);
      }

      throw formattedError;
    }
  }

  // Example of updated method using makeRequest
  async checkHealth() {
    return this.makeRequest({
      method: "HEAD",
      url: this.config.endpoints.preflight,
      timeout: 5000,
    });
  }

  // Authentication Methods
  auth = {
    register: async (data) => {
      try {
        const response = await this.makeRequest({
          method: "POST",
          url: this.config.endpoints.auth.register,
          data,
        });
        ToastService.showSuccess("Registration successful!");
        return response;
      } catch (error) {
        // Error is already handled in makeRequest
        throw error;
      }
    },

    login: async (credentials) => {
      try {
        const response = await this.makeRequest({
          method: "POST",
          url: this.config.endpoints.auth.login,
          data: credentials,
        });

        if (response?.api_token) {
          this.setToken(response.api_token);
          ToastService.showSuccess("Login successful!");
        }
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    verifyEmail: async (data) => {
      try {
        const response = await this.makeRequest({
          method: "POST",
          url: this.config.endpoints.auth.verifyEmail,
          data,
        });
        ToastService.showSuccess("Email verified successfully!");
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    requestVerification: async (email) => {
      try {
        const response = await this.makeRequest({
          method: "POST",
          url: this.config.endpoints.auth.requestVerification,
          data: { email },
        });
        ToastService.showSuccess("Verification email sent!");
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    passwordResetRequest: async (email) => {
      try {
        const response = await this.makeRequest({
          method: "POST",
          url: this.config.endpoints.auth.passwordResetRequest,
          data: { email },
        });
        ToastService.showSuccess(
          "Password reset instructions sent to your email!"
        );
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    passwordResetVerify: async (data) => {
      try {
        const response = await this.makeRequest({
          method: "POST",
          url: this.config.endpoints.auth.passwordResetVerify,
          data,
        });
        ToastService.showSuccess("Password reset successful!");
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },
  };

  // Attributes Methods
  attributes = {
    // getCountries: async () => {
    //   try {
    //     const response = await this.makeRequest({
    //       method: "GET",
    //       url: this.config.endpoints.attributes.countries,
    //     });

    //     // Validate the response against our schema
    //     try {
    //       const validatedResponse = CountriesResponseSchema.parse(response);
    //       return validatedResponse.data;
    //     } catch (validationError) {
    //       // Handle validation errors
    //       if (process.env.NODE_ENV !== "production") {
    //         console.error(
    //           "Invalid countries response format:",
    //           validationError.errors
    //         );
    //       }

    //       const validationApiError = new ApiError(
    //         "Invalid response format",
    //         500,
    //         validationError.errors,
    //         false,
    //         "VALIDATION_ERROR",
    //         validationError,
    //         "We received unexpected data from the server. Please try again later."
    //       );

    //       ToastService.showError(validationApiError.userFriendlyMessage);
    //       throw validationApiError;
    //     }
    //   } catch (error) {
    //     throw error; // Already handled in makeRequest
    //   }
    // },


    getCountries: async () => {
  try {
    const response = await this.makeRequest({
      method: "GET",
      url: this.config.endpoints.attributes.countries,
    });
    
    // Just return the data array directly
    return response.data;
  } catch (error) {
    throw error; // Already handled in makeRequest
  }
} ,

    
    getBanks: async (currency) => {
      try {
        const response = await this.makeRequest({
          method: "GET",
          url: this.config.endpoints.attributes.banks,
          params: { currency },
        });
        return response?.data.banks || [];
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    getRates: async () => {
      try {
        const response = await this.makeRequest({
          method: "GET",
          url: this.config.endpoints.attributes.rates,
        });
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    getCurrencies: async () => {
      try {
        const response = await this.makeRequest({
          method: "GET",
          url: this.config.endpoints.attributes.currencies,
        });
        return response.data;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    resolveAccount: async (bankId, accountNumber) => {
      try {
        const response = await this.makeRequest({
          method: "POST",
          url: this.config.endpoints.attributes.resolveAccount,
          data: { bank_id: bankId, account_number: accountNumber },
        });
        return response.data;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },
  };

  // Transaction Methods
  transactions = {
    create: async (data) => {
      try {
        const response = await this.makeRequest({
          method: "POST",
          url: this.config.endpoints.transactions.create,
          data: {
            espee_amount: data.espee_amount,
            destination_currency: data.destination_currency,
            bank_account: {
              bank_id: data.bank_account.bank_id,
              account_number: data.bank_account.account_number,
            },
          },
        });
        ToastService.showSuccess("Transaction created successfully!");
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    list: async (currency) => {
      try {
        const response = await this.makeRequest({
          method: "GET",
          url: this.config.endpoints.transactions.list,
          params: { currency },
        });
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    getDetails: async (id) => {
      try {
        const response = await this.makeRequest({
          method: "GET",
          url: this.config.endpoints.transactions.details.replace(":id", id),
        });
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },

    // Add the cancel method
    cancel: async (id) => {
      try {
        if (!id) {
          const validationError = new ApiError(
            "Transaction ID is required",
            400,
            null,
            false,
            "VALIDATION_ERROR",
            null,
            "Transaction ID is required to cancel a transaction"
          );

          ToastService.showError(validationError.userFriendlyMessage);
          throw validationError;
        }

        const response = await this.makeRequest({
          method: "POST",
          url: this.config.endpoints.transactions.cancel.replace(":id", id),
        });
        ToastService.showSuccess("Transaction cancelled successfully!");
        return response;
      } catch (error) {
        throw error; // Already handled in makeRequest
      }
    },
  };

  // Method to refresh authentication token
  async refreshToken() {
    // Implement your token refresh logic here
    // This is a placeholder
    throw new Error("Token refresh not implemented");
  }
}

// Create API service instance
const apiService = new ApiService(API_CONFIG);

export default apiService;
export {
  API_CONFIG,
  ApiError,
  CountrySchema,
  CountriesResponseSchema,
  ToastService,
};
