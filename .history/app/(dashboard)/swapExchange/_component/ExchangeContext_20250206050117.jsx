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
