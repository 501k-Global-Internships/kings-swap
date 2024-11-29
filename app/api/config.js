"use client";

import axios from "axios";
import { useState, useCallback, useEffect } from "react";

const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://cabinet.kingsswap.com.ng",
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
    preflight: "/ping",
  },
};

class ApiService {
  constructor(config) {
    this.axios = axios.create({
      baseURL: config.baseURL,
      timeout: 30000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.token = this.getStoredToken();
    this.setupInterceptors();
  }

  getStoredToken() {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
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

  setupInterceptors() {
    // Request interceptor for adding token
    this.axios.interceptors.request.use(
      (config) => {
        const token = this.token || this.getStoredToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with an error status
          return Promise.reject({
            message: error.response.data.message || "An error occurred",
            status: error.response.status,
            details: error.response.data,
          });
        } else if (error.request) {
          // Request made but no response received
          return Promise.reject(new Error("No response received from server"));
        } else {
          // Something happened in setting up the request
          return Promise.reject(error);
        }
      }
    );
  }

  async performPreflightCheck() {
    try {
      await this.axios.head(API_CONFIG.endpoints.preflight, {
        timeout: 5000,
      });
      return true;
    } catch (error) {
      console.error("Preflight Check Failed:", error);
      throw new Error("Server is currently unavailable");
    }
  }

  // Authentication methods
  auth = {
    register: (data) =>
      this.axios.post(API_CONFIG.endpoints.auth.register, data),
    login: (data) => this.axios.post(API_CONFIG.endpoints.auth.login, data),
    verifyEmail: (data) =>
      this.axios.post(API_CONFIG.endpoints.auth.verifyEmail, data),
    requestVerification: (email) =>
      this.axios.post(API_CONFIG.endpoints.auth.requestVerification, { email }),
  };

  // Attributes methods
  attributes = {
    getCountries: () =>
      this.axios.get(API_CONFIG.endpoints.attributes.countries),
    getBanks: () => this.axios.get(API_CONFIG.endpoints.attributes.banks),
    getRates: () => this.axios.get(API_CONFIG.endpoints.attributes.rates),
    getCurrencies: () =>
      this.axios.get(API_CONFIG.endpoints.attributes.currencies),
    resolveAccount: (bankId, accountNumber) =>
      this.axios.post(API_CONFIG.endpoints.attributes.resolveAccount, {
        bank_id: bankId,
        account_number: accountNumber,
      }),
  };

  // Transactions methods
  transactions = {
    list: () => this.axios.get(API_CONFIG.endpoints.transactions.list),
    create: (data) =>
      this.axios.post(API_CONFIG.endpoints.transactions.create, data),
  };
}

// Create API service instance
const apiService = new ApiService(API_CONFIG);

export const useExchange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banks, setBanks] = useState([]);
  const [rates, setRates] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const handleError = (err) => {
    const errorMessage = err.message || "An unexpected error occurred";
    console.error("API Error:", err);
    setError(errorMessage);
    return errorMessage;
  };

  const fetchWithErrorHandling = async (fetchFunction, errorCallback) => {
    try {
      setLoading(true);
      setError(null);
      return await fetchFunction();
    } catch (err) {
      handleError(err);
      if (errorCallback) errorCallback();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const response = await apiService.attributes.getBanks();
        const banks = response?.data?.banks || [];
        setBanks(banks);
        return banks;
      },
      () => setBanks([])
    );
  }, []);

  const fetchRates = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const response = await apiService.attributes.getRates();
        if (!response?.data) {
          throw new Error("Invalid rate data received");
        }
        setRates(response.data);
        return response.data;
      },
      () => setRates(null)
    );
  }, []);

  const fetchTransactions = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const response = await apiService.transactions.list();
        const transactions = response?.data || [];
        setTransactions(transactions);
        return transactions;
      },
      () => setTransactions([])
    );
  }, []);

  const fetchCountries = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const response = await apiService.attributes.getCountries();
        const countries = response?.data || [];
        setCountries(countries);
        return countries;
      },
      () => setCountries([])
    );
  }, []);

  const fetchCurrencies = useCallback(async () => {
    return fetchWithErrorHandling(
      async () => {
        const response = await apiService.attributes.getCurrencies();
        const currencies = response?.data || [];
        setCurrencies(currencies);
        return currencies;
      },
      () => setCurrencies([])
    );
  }, []);

  const resolveAccount = useCallback(async (bankId, accountNumber) => {
    return fetchWithErrorHandling(async () => {
      const response = await apiService.attributes.resolveAccount(
        bankId,
        accountNumber
      );
      return response?.data || null;
    });
  }, []);

  const createTransaction = useCallback(async (transactionData) => {
    return fetchWithErrorHandling(async () => {
      const response = await apiService.transactions.create(transactionData);
      return response?.data || null;
    });
  }, []);

  useEffect(() => {
    let mounted = true;

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
        if (mounted) {
          handleError(err);
        }
      }
    };

    initializeData();

    return () => {
      mounted = false;
    };
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
    fetchTransactions,
    fetchCountries,
    fetchCurrencies,
    resolveAccount,
    createTransaction,
  };
};

export default apiService;
export { API_CONFIG };
