"use client";

import axios from "axios";
import { useState, useCallback, useEffect } from "react";

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://cabinet.kingsswap.com.ng",
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
      list: "/api/v1/transactions/list",
      details: "/api/v1/transactions/:id",
    },
    preflight: "/ping",
  },
};

// Error Handler Class
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Main API Service Class
class ApiService {
  constructor(config) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });

    this.token = this.getStoredToken();
    this.setupInterceptors();
  }

  // Token Management
  getStoredToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
      this.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete this.axios.defaults.headers.common["Authorization"];
    }
  }

  // Interceptors Setup
  setupInterceptors() {
    // Request Interceptor
    this.axios.interceptors.request.use(
      (config) => {
        const token = this.token || this.getStoredToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Request Interceptor Error:", error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
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

        return Promise.reject(this.formatError(error));
      }
    );
  }

  // Error Handling
  formatError(error) {
    if (error.response) {
      return new ApiError(
        error.response.data.message || "An error occurred",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      return new ApiError("No response received from server", 0);
    }
    return new ApiError(error.message, 500);
  }

  handleAuthError() {
    this.setToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  // API Health Check
  async checkHealth() {
    try {
      await this.axios.head(this.config.endpoints.preflight, {
        timeout: 5000,
      });
      return true;
    } catch (error) {
      console.error("Health Check Failed:", error);
      throw new ApiError("Server is currently unavailable", 503);
    }
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
        if (response.data?.token) {
          this.setToken(response.data.token);
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
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    getBanks: async () => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.attributes.banks
        );
        return response.data?.banks || [];
      } catch (error) {
        throw this.formatError(error);
      }
    },

    getRates: async () => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.attributes.rates
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    getCurrencies: async () => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.attributes.currencies
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    resolveAccount: async (bankId, accountNumber) => {
      try {
        const response = await this.axios.post(
          this.config.endpoints.attributes.resolveAccount,
          { bank_id: bankId, account_number: accountNumber }
        );
        return response.data;
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
          data
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
      }
    },

    list: async () => {
      try {
        const response = await this.axios.get(
          this.config.endpoints.transactions.list
        );
        return response.data;
      } catch (error) {
        throw this.formatError(error);
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

// Custom Hook for Exchange Operations
export const useExchange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banks, setBanks] = useState([]);
  const [rates, setRates] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const fetchWithErrorHandling = async (fetchFunction, errorCallback) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      return result;
    } catch (err) {
      console.error("Operation failed:", err);
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      if (errorCallback) errorCallback();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const data = await apiService.attributes.getBanks();
        setBanks(data);
        return data;
      },
      () => setBanks([])
    );
  }, []);

  const fetchRates = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const data = await apiService.attributes.getRates();
        setRates(data);
        return data;
      },
      () => setRates(null)
    );
  }, []);

  const fetchTransactions = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const data = await apiService.transactions.list();
        setTransactions(data);
        return data;
      },
      () => setTransactions([])
    );
  }, []);

  const fetchCountries = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const data = await apiService.attributes.getCountries();
        setCountries(data);
        return data;
      },
      () => setCountries([])
    );
  }, []);

  const fetchCurrencies = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const data = await apiService.attributes.getCurrencies();
        setCurrencies(data);
        return data;
      },
      () => setCurrencies([])
    );
  }, []);

  const resolveAccount = useCallback(async (bankId, accountNumber) => {
    return fetchWithErrorHandling(async () => {
      return await apiService.attributes.resolveAccount(bankId, accountNumber);
    });
  }, []);

  const createTransaction = useCallback(async (transactionData) => {
    return fetchWithErrorHandling(async () => {
      return await apiService.transactions.create(transactionData);
    });
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setError(null);
        const promises = [
          fetchRates(),
          fetchBanks(),
          fetchCountries(),
          fetchCurrencies(),
        ];

        if (apiService.getStoredToken()) {
          promises.push(fetchTransactions());
        }

        await Promise.all(promises);
      } catch (err) {
        console.error("Initialization failed:", err);
        setError(err.message);
      }
    };

    initializeData();
  }, [
    fetchRates,
    fetchBanks,
    fetchCountries,
    fetchCurrencies,
    fetchTransactions,
  ]);

  return {
    loading,
    error: error ? String(error) : null,
    banks,
    rates,
    transactions,
    countries,
    currencies,
    fetchBanks,
    fetchRates,
    fetchTransactions,
    fetchCountries,
    fetchCurrencies,
    resolveAccount,
    createTransaction,
  };
};

export default apiService;
export { API_CONFIG, ApiError };
