'use client'
import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiService from "@config/config";
import { number } from "zod";

// interface ExchangeContextType {
//   step;
//   rates;
//   banks;
//   currencies;
//     error;
//   calculateExchangeAmount: (
//     amount,
//     currency
//   ) => { total};
//   createTransaction: (data) => Promise;
// }

const ExchangeContext = createContext(undefined);

export function ExchangeProvider({ children }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [transactionData, setTransactionData] = useState({
    espeeAmount: "",
    localAmount: "",
    selectedCurrency: "",
    bankDetails: null,
    transactionId: null,
    status: null,
  });

  const { data: ratesObject } = useQuery({
    queryKey: ["fetch/rates"],
    queryFn: () => apiService.attributes.getRates(),
  });

  const { data: banks } = useQuery({
    queryKey: ["fetch/banks"],
    queryFn: () => apiService.attributes.getBanks("NGN"),
  });

  const { data: currencies } = useQuery({
    queryKey: ["fetch/currencies"],
    queryFn: () => apiService.attributes.getCurrencies(),
  });

  const { mutate: createTransaction, data: transactionResponse } = useMutation({
    mutationFn: (data) => apiService.transactions.create(data),
    onSuccess: (response) => {
      setTransactionData((prev) => ({
        ...prev,
        transactionId: response.transaction_id,
        status: "pending",
      }));
    },
    onError: (error) => setError(error.message),
  });

  const calculateExchangeAmount = useMemo(() => {
    return (amount, currency) => {
      const rate = ratesObject?.data.exchange_rates?.[currency];
      const percentageCharge = ratesObject?.data.percentage_charge;

      if (!rate || !percentageCharge) return null;

      return {
        total: amount * rate * (1 - percentageCharge / 100),
      };
    };
  }, [ratesObject]);

  const resetTransaction = () => {
    setTransactionData({
      espeeAmount: "",
      localAmount: "",
      selectedCurrency: "",
      bankDetails: null,
      transactionId: null,
      status: null,
    });
  };

  const contextValue = useMemo(
    () => ({
      step,
      setStep,
      rates: ratesObject?.data.exchange_rates || {},
      banks: banks || [],
      currencies: currencies || [],
      error,
      calculateExchangeAmount,
      createTransaction,
      transactionData,
      setTransactionData,
      resetTransaction,
    }),
    [
      step,
      ratesObject,
      banks,
      currencies,
      error,
      calculateExchangeAmount,
      createTransaction,
      transactionData,
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
