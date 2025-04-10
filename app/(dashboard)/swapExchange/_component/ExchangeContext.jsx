"use client";
import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiService from "@config/config";

const ExchangeContext = createContext(undefined);

export function ExchangeProvider({ children }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [transactionData, setTransactionData] = useState({
    espeeAmount: "",
    localAmount: "",
    selectedCurrency: "",
    bankDetails: null,
    id: null,
    status: null,
    reference: null,
    payment: null,
    fiat_amount: "",
    currency: "",
    espee_amount: "",
    expires_at: null,
    created_at: null,
  });

  // Fetch rates
  const { data: ratesObject } = useQuery({
    queryKey: ["fetch/rates"],
    queryFn: () => apiService.attributes.getRates(),
  });

  // Fetch banks
  const { data: banks } = useQuery({
    queryKey: ["fetch/banks"],
    queryFn: () => apiService.attributes.getBanks("NGN"),
  });

  // Fetch currencies
  const { data: currencies } = useQuery({
    queryKey: ["fetch/currencies"],
    queryFn: () => apiService.attributes.getCurrencies(),
  });

  // Create transaction mutation
  const { mutate: createTransaction, data: transactionResponse } = useMutation({
    mutationFn: (data) => apiService.transactions.create(data),
    onSuccess: (response) => {
      // Make sure to handle both response.data and direct response cases
      const responseData = response?.data || response;

      setTransactionData((prev) => ({
        ...prev,
        id: responseData.id,
        reference: responseData.reference,
        status: responseData.payment_status,
        payment: responseData.payment,
        fiat_amount: responseData.fiat_amount,
        currency: responseData.currency,
        espee_amount: responseData.espee_amount,
        expires_at: responseData.expires_at,
        created_at: responseData.created_at,
      }));
    },
    onError: (error) =>
      setError(error?.message || "Transaction creation failed"),
  });

  // Add cancel transaction mutation
  const { mutate: cancelTransaction } = useMutation({
    mutationFn: (id) => apiService.transactions.cancel(id),
    onSuccess: () => {
      resetTransaction();
      setStep(1); // Return to first step
    },
    onError: (error) =>
      setError(error?.message || "Transaction cancellation failed"),
  });

  // Add getTransactions query
  const {
    data: transactions,
    refetch: refetchTransactions,
    isLoading: isLoadingTransactions,
  } = useQuery({
    queryKey: ["fetch/transactions"],
    queryFn: () =>
      apiService.transactions.list(transactionData.selectedCurrency || "NGN"),
    enabled: false, // Don't fetch automatically on component mount
  });

  // Add getTransactionDetails query with enabled: false flag
  const {
    data: transactionDetails,
    refetch: fetchTransactionDetails,
    isLoading: isLoadingTransactionDetails,
  } = useQuery({
    queryKey: ["fetch/transaction-details", transactionData.id],
    queryFn: () => apiService.transactions.getDetails(transactionData.id),
    enabled: false, // Only run when explicitly called
  });

  // Function to get transaction details
  const getTransactionDetails = (id) => {
    setTransactionData((prev) => ({ ...prev, id }));
    return fetchTransactionDetails();
  };

  // Calculate exchange amount
  const calculateExchangeAmount = useMemo(() => {
    return (amount, currency) => {
      const rate = ratesObject?.data?.exchange_rates?.[currency];
      const percentageCharge = ratesObject?.data?.percentage_charge;
      if (!rate || !percentageCharge) return null;
      return {
        total: amount * rate * (1 - percentageCharge / 100),
      };
    };
  }, [ratesObject]);

  // Reset transaction function
  const resetTransaction = () => {
    setTransactionData({
      espeeAmount: "",
      localAmount: "",
      selectedCurrency: "",
      bankDetails: null,
      id: null,
      status: null,
      reference: null,
      payment: null,
      fiat_amount: "",
      currency: "",
      espee_amount: "",
      expires_at: null,
      created_at: null,
    });
  };

  // Context value
  const contextValue = useMemo(
    () => ({
      step,
      setStep,
      rates: ratesObject?.data?.exchange_rates || {},
      banks: banks || [],
      currencies: currencies || [],
      error,
      setError,
      calculateExchangeAmount,
      createTransaction,
      cancelTransaction, // Add cancel transaction function
      transactionData,
      setTransactionData,
      resetTransaction,
      transactions: transactions?.data || [],
      paginationData: transactions?.pagination || {},
      getTransactions: refetchTransactions,
      isLoadingTransactions,
      getTransactionDetails,
      transactionDetails: transactionDetails?.data,
      isLoadingTransactionDetails,
    }),
    [
      step,
      ratesObject,
      banks,
      currencies,
      error,
      calculateExchangeAmount,
      createTransaction,
      cancelTransaction, // Add dependency
      transactionData,
      transactions,
      refetchTransactions,
      isLoadingTransactions,
      transactionDetails,
      isLoadingTransactionDetails,
    ]
  );

  return (
    <ExchangeContext.Provider value={contextValue}>
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchangeContext() {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error(
      "useExchangeContext must be used within an ExchangeProvider"
    );
  }
  return context;
}
