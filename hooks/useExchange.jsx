// "use client";

// import { useState, useCallback, useEffect, useMemo } from "react";
// import { z } from "zod";
// import apiService from "@config/config";

// // Validation schemas based on API documentation
// const BankAccountSchema = z.object({
//   bank_id: z.number().or(z.string()),
//   account_number: z.string().length(10, "Account number must be 10 characters"),
// });

// const TransactionSchema = z.object({
//   espee_amount: z
//     .number()
//     .min(1, "Amount must be at least 1")
//     .max(10000000, "Amount cannot exceed 10,000,000"),
//   destination_currency: z.string().min(3, "Currency code must be 3 characters"),
//   bank_account: BankAccountSchema,
// });


// export const useExchange = () => {
//   const [state, setState] = useState({
//     loading: false,
//     error: null,
//     banks: [],
//     rates: null,
//     transactions: [],
//     countries: [],
//     currencies: [],
//   });

//   const setPartialState = useCallback((updates) => {
//     setState((prev) => ({ ...prev, ...updates }));
//   }, []);

//   const handleApiError = useCallback((error) => {
//     let userMessage = 'An unexpected error occurred';
    
//     switch (error.errorCode) {
//       case 'NO_INTERNET':
//         userMessage = 'Please check your internet connection';
//         break;
//       case 'REQUEST_TIMEOUT':
//         userMessage = 'The request timed out. Please try again';
//         break;
//       case 'SERVER_429':
//         userMessage = 'Too many requests. Please wait a moment';
//         break;
//       case 'SERVER_503':
//         userMessage = 'Service temporarily unavailable';
//         break;
//       default:
//         if (error.status >= 500) {
//           userMessage = 'Server error. Please try again later';
//         } else if (error.status >= 400) {
//           userMessage = error.message || 'Request failed';
//         }
//     }

//     setPartialState({
//       error: {
//         message: userMessage,
//         technical: error.message,
//         code: error.errorCode
//       }
//     });
//   }, [setPartialState]);


//   const fetchWithErrorHandling = async (fetchFunction, errorCallback) => {
//     try {
//       setPartialState({ loading: true, error: null });
//       const result = await fetchFunction();
//       return result;
//     } catch (err) {
//       handleApiError(err);
//       if (errorCallback) errorCallback();
//       throw err;
//     } finally {
//       setPartialState({ loading: false });
//     }
//   };

//   const fetchFunctions = useMemo(
//     () => ({
//       fetchBanks: async () => {
//         const data = await apiService.attributes.getBanks();
//         setPartialState({ banks: data });
//         return data;
//       },
//       fetchRates: async () => {
//         const data = await apiService.attributes.getRates();
//         setPartialState({ rates: data });
//         return data;
//       },
//       fetchTransactions: async (currency) => {
//         const data = await apiService.transactions.list(currency);
//         setPartialState({ transactions: data });
//         return data;
//       },
//       fetchCountries: async () => {
//         const data = await apiService.attributes.getCountries();
//         setPartialState({ countries: data });
//         return data;
//       },
//       fetchCurrencies: async () => {
//         const data = await apiService.attributes.getCurrencies();
//         setPartialState({ currencies: data });
//         return data;
//       },
//     }),
//     [setPartialState]
//   );

//   const fetchBanks = useCallback((currency) => {
//     return fetchWithErrorHandling(() => { fetchFunctions.fetchBanks(currency) });
//   }, [fetchFunctions]);

//   const fetchRates = useCallback(() => {
//     return fetchWithErrorHandling(fetchFunctions.fetchRates);
//   }, [fetchFunctions]);

//   const fetchTransactions = useCallback(() => {
//     return fetchWithErrorHandling(fetchFunctions.fetchTransactions);
//   }, [fetchFunctions]);

//   const fetchCountries = useCallback(() => {
//     return fetchWithErrorHandling(fetchFunctions.fetchCountries);
//   }, [fetchFunctions]);

//   const fetchCurrencies = useCallback(() => {
//     return fetchWithErrorHandling(fetchFunctions.fetchCurrencies);
//   }, [fetchFunctions]);

//   const resolveAccount = useCallback((bankId, accountNumber) => {
//     return fetchWithErrorHandling(() =>
//       apiService.attributes.resolveAccount(bankId, accountNumber)
//     );
//   }, []);

//   const createTransaction = useCallback((transactionData) => {
//     return fetchWithErrorHandling(() =>
//       apiService.transactions.create(transactionData)
//     );
//   }, []);

//   // Initialize data on mount
//   useEffect(() => {
//     let mounted = true;

//     const initializeData = async () => {
//       try {
//         setPartialState({ error: null });
//         const promises = [
//           fetchFunctions.fetchRates(),
//           fetchFunctions.fetchBanks('NGN'),
//           fetchFunctions.fetchCountries(),
//           fetchFunctions.fetchCurrencies(),
//         ];

//         if (apiService.getStoredToken()) {
//           promises.


//             push(fetchFunctions.fetchTransactions('NGN'));
//         }

//         const results = await Promise.allSettled(promises);

//         if (mounted) {
//           results.forEach((result, index) => {
//             if (result.status === "rejected") {
//               console.error(`
//                 Failed to fetch data for index ${index}`,
//                 result.reason
//               );
//             }
//           });
//         }
//       } catch (err) {
//         if (mounted) {
//           console.error("Initialization failed:", err);
//           setPartialState({ error: err.message });
//         }
//       }
//     };

//     initializeData();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchFunctions]);

//   return {
//     // loading,
//     // error: error ? String(error) : null,
//     // banks,
//     // rates,
//     // transactions,
//     // countries,
//     // currencies,
//     ...state,
//     fetchBanks,
//     fetchRates,
//     fetchTransactions,
//     fetchCountries,
//     fetchCurrencies,
//     resolveAccount,
//     createTransaction,
//   }
// };