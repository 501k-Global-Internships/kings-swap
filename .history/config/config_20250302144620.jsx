"use client";

import axios from "axios";
import { z } from "zod";

const RATE_LIMIT_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

// Validation schemas
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
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://cabinet.kingsswap.com.ng",
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
      details: "/api/v1/transactions/:id/",
    },
    preflight: "/ping",
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
    originalError = null
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.retryable = retryable;
    this.timestamp = new Date().toISOString();
    this.errorCode = errorCode;
    this.originalError = originalError;
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
        };
      }

      if (!navigator.onLine) {
        return {
          message: "No internet connection",
          status: -1,
          data: null,
          errorCode: "NO_INTERNET",
          retryable: true,
        };
      }

      return {
        message: "No response from server",
        status: -1,
        data: null,
        errorCode: "NO_RESPONSE",
        retryable: true,
      };
    }

    // Something happened in setting up the request
    return {
      message: error.message || "Request configuration error",
      status: -2,
      data: null,
      errorCode: "REQUEST_SETUP_ERROR",
      retryable: false,
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
    } catch (error) {
      console.error("Invalid API configuration:", error);
      throw new Error("Invalid API configuration");
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
      console.error("Token retrieval failed:", error);
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
      console.error("Token storage failed:", error);
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
      return Promise.reject(this.formatError(error));
    }

    // Enhanced error logging
    console.log("API Error:", {
      url: originalRequest.url,
      method: originalRequest.method,
      status: error.response?.status,
      errorCode: error.response?.data?.code,
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      return this.handleTokenExpiration(originalRequest);
    }

    const formattedError = this.formatError(error);

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
    // In production, you might want to send this to your error monitoring service
    console.log("API Error:", {
      errorCode: error.errorCode,
      status: error.status,
      message: error.message,
      timestamp: error.timestamp,
      retryable: error.retryable,
      originalError: error.originalError
        ? {
            message: error.originalError.message,
            stack: error.originalError.stack,
          }
        : null,
    });
  }

  async handleRequest(config) {
    const token = this.token || this.getStoredToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }

  handleRequestError(error) {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(new ApiError(error.message, 0, null));
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
      return Promise.reject(refreshError);
    }
  }

  async handleRetry(originalRequest, error) {
    originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
    const delay = Math.min(
      RATE_LIMIT_CONFIG.baseDelay *
        Math.pow(2, originalRequest._retryCount - 1),
      RATE_LIMIT_CONFIG.maxDelay
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return this.axios(originalRequest);
  }

  formatError(error) {
    const errorDetails = ApiError.getErrorDetails(error);

    return new ApiError(
      errorDetails.message,
      errorDetails.status,
      errorDetails.data,
      errorDetails.retryable,
      errorDetails.errorCode,
      error
    );
  }

  handleAuthError() {
    this.setToken(null);
    if (typeof window !== "undefined") {
      // Use a more robust navigation solution in production
      window.location.href = "/loginPage";
    }
  }

  async makeRequest(requestConfig) {
    try {
      const response = await this.axios(requestConfig);
      return response.data;
    } catch (error) {
      const formattedError = this.formatError(error);
      this.logError(formattedError);
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
        const response = await this.axios.post(
          this.config.endpoints.auth.register,
          data
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    login: async (credentials) => {
      try {
        const response = await this.axios.post(
          this.config.endpoints.auth.login,
          credentials
        );
        if (response.data?.api_token) {
          this.setToken(response.data.api_token);
        }
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    verifyEmail: async (data) => {
      try {
        const response = await this.axios.post(
          this.config.endpoints.auth.verifyEmail,
          data
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    requestVerification: async (email) => {
      try {
        const response = await this.axios.post(
          this.config.endpoints.auth.requestVerification,
          { email }
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    passwordResetRequest: async (email) => {
      try {
        const response = await this.axios.post(
          this.config.endpoints.auth.passwordResetRequest,
          { email }
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    passwordResetVerify: async (data) => {
      try {
        const response = await this.axios.post(
          this.config.endpoints.auth.passwordResetVerify,
          data
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },
  };

  // Attributes Methods
  attributes = {
    getCountries: async () => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.attributes.countries
        );
        return response.data.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    getBanks: async (currency) => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.attributes.banks,
          {
            params: {
              currency: currency,
            },
          }
        );
        return response.data?.data.banks || [];
      } catch (error) {
        throw new Error(error);
      }
    },

    getRates: async () => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.attributes.rates
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },

    getCurrencies: async () => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.attributes.currencies
        );
        return response.data.data;
      } catch (error) {
        throw new Error(error);
      }
    },

    resolveAccount: async (bankId, accountNumber) => {
      try {
        const response = await this.axios.post(
          this.config.endpoints.attributes.resolveAccount,
          { bank_id: bankId, account_number: accountNumber }
        );
        return response.data.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },
  };

  // Transaction Methods
  transactions = {
    create: async (data) => {
      try {
        const response = await this.axios.post(
          this.config.endpoints.transactions.create,
          {
            espee_amount: data.espee_amount,
            destination_currency: data.destination_currency,
            bank_account: {
              bank_id: data.bank_account.bank_id,
              account_number: data.bank_account.account_number,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    list: async (currency) => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.transactions.list,
          {
            params: {
              currency: currency,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    },

    getDetails: async (id) => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.transactions.details.replace(":id", id)
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },
  };
}
// Create API service instance
const apiService = new ApiService(API_CONFIG);

export default apiService;
export { API_CONFIG, ApiError };
