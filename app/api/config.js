"use client";

import { useState, useCallback, useEffect } from "react";

const API_CONFIG = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL || "https://cabinet.kingsswap.com.ng/",
  endpoints: {
    auth: {
      register: "/auth/register",
      login: "/auth/login",
      verifyEmail: "/auth/email-verification/verify",
      requestVerification: "/auth/email-verification/request",
    },
    attributes: {
      countries: "/api/v1/attributes/countries",
      banks: "/api/v1/attributes/banks",
      rates: "/api/v1/attributes/espee-rates",
      resolveAccount: "/api/v1/attributes/banks/resolve-account",
      currencies: "/api/v1/attributes/currencies",
    },
    transactions: {
      list: "/api/v1/transactions",
      create: "/api/v1/transactions",
    },
  },
  headers: {
    default: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    multipart: {
      Accept: "application/json",
    },
  },
};

class ApiService {
  constructor(config) {
    this.config = config;
    this.token = this.getStoredToken();
  }

  getStoredToken() {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      ...this.config.headers.default,
      ...customHeaders,
    };

    const token = this.token || this.getStoredToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;
      const headers = this.getHeaders(options.headers);

      const config = {
        method: options.method || "GET",
        headers,
        credentials: "omit",
      };

      if (options.data) {
        config.body = JSON.stringify(options.data);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorBody = await response.text();
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
        };

        console.error("API Error Details:", errorDetails);

        throw {
          type: "api",
          ...errorDetails,
          message: `HTTP error! status: ${response.status}`,
        };
      }

      return await response.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      data,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      data,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

// Create API service instance
const apiService = new ApiService(API_CONFIG);

// Authentication module
apiService.auth = {
  register: (data) => apiService.post(API_CONFIG.endpoints.auth.register, data),
  login: (data) => apiService.post(API_CONFIG.endpoints.auth.login, data),
  verifyEmail: (data) =>
    apiService.post(API_CONFIG.endpoints.auth.verifyEmail, data),
  requestVerification: (email) =>
    apiService.post(API_CONFIG.endpoints.auth.requestVerification, { email }),
};

// Attributes module
apiService.attributes = {
  getCountries: () => apiService.get(API_CONFIG.endpoints.attributes.countries),
  getBanks: () => apiService.get(API_CONFIG.endpoints.attributes.banks),
  getRates: () => apiService.get(API_CONFIG.endpoints.attributes.rates),
  getCurrencies: () =>
    apiService.get(API_CONFIG.endpoints.attributes.currencies),
  resolveAccount: (bankId, accountNumber) =>
    apiService.post(API_CONFIG.endpoints.attributes.resolveAccount, {
      bank_id: bankId,
      account_number: accountNumber,
    }),
};

// Transactions module
apiService.transactions = {
  list: () => apiService.get(API_CONFIG.endpoints.transactions.list),
  create: (data) =>
    apiService.post(API_CONFIG.endpoints.transactions.create, data),
};

// Updated useExchange hook with improved error handling
export const useExchange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banks, setBanks] = useState([]);
  const [rates, setRates] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const handleError = (err) => {
    let errorMessage;
    if (typeof err === "string") {
      errorMessage = err;
    } else if (err?.message) {
      errorMessage = err.message;
    } else if (err?.body) {
      try {
        const parsedError = JSON.parse(err.body);
        errorMessage = parsedError.message || "An error occurred";
      } catch {
        errorMessage = err.body;
      }
    } else {
      errorMessage = "An unexpected error occurred";
    }
    setError(errorMessage);
    return errorMessage;
  };

  const fetchBanks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.attributes.getBanks();
      setBanks(response?.data?.banks || []);
      return response?.data?.banks || [];
    } catch (err) {
      handleError(err);
      setBanks([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.attributes.getRates();
      setRates(response?.data || null);
      return response?.data || null;
    } catch (err) {
      handleError(err);
      setRates(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.transactions.list();
      setTransactions(response?.data || []);
      return response?.data || [];
    } catch (err) {
      handleError(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.attributes.getCountries();
      setCountries(response?.data || []);
      return response?.data || [];
    } catch (err) {
      handleError(err);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.attributes.getCurrencies();
      setCurrencies(response?.data || []);
      return response?.data || [];
    } catch (err) {
      handleError(err);
      setCurrencies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveAccount = useCallback(async (bankId, accountNumber) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.attributes.resolveAccount(
        bankId,
        accountNumber
      );
      return response?.data || null;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.transactions.create(transactionData);
      return response?.data || null;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setError(null);
        await Promise.all([
          fetchTransactions(),
          fetchBanks(),
          fetchRates(),
          fetchCountries(),
          fetchCurrencies(),
        ]);
      } catch (err) {
        handleError(err);
      }
    };

    initializeData();
  }, [
    fetchTransactions,
    fetchBanks,
    fetchRates,
    fetchCountries,
    fetchCurrencies,
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
    resolveAccount,
    fetchTransactions,
    fetchCountries,
    fetchCurrencies,
    createTransaction,
  };
};

export default apiService;
export { API_CONFIG };
