"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import apiService from "@config/config";
import Img from "@assets/swapIcon.svg";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const SwapCard = () => {
  const router = useRouter();
  // const [apiLoading, setApiLoading] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [espeeAmount, setEspeeAmount] = useState("");
  const [localAmount, setLocalAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");

  const {
    data: rates,
    isFetching,
    isPending,
    error,
  } = useQuery({
    queryKey: ["fetch/rates"],
    queryFn: () => apiService.attributes.getRates(),
    placeholderData: keepPreviousData,
  });
  console.log(error);

  const {
    data: banks,

  } = useQuery({
    queryKey: ["fetch/banks"],
    queryFn: () => apiService.attributes.getBanks("NGN"),
    placeholderData: keepPreviousData,
  });
  const {
    data: currencies,
  } = useQuery({
    queryKey: ["fetch/currencies"],
    queryFn: () => apiService.attributes.getCurrencies(),
    placeholderData: keepPreviousData,
  });
  console.log(banks);
  console.log(currencies);
  console.log(rates);

  const { mutate: loginFunc, isPending: Signing } = useMutation({
    mutationFn: (data) => apiService.transactions.create(data),
    onSuccess: (data) => {},
    onError: (error) => {
      setError({ general: [error.message] });
    },
  });

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setEspeeAmount(value);

    if (
      selectedCurrency &&
      rates &&
      rates.data.exchange_rates[selectedCurrency]
    ) {
      const rate = rates.data.exchange_rates[selectedCurrency];
      const calculatedAmount = (parseFloat(value || 0) * rate).toFixed(2);
      setLocalAmount(calculatedAmount);
      setIsValidAmount(parseFloat(value) > 0);
    }
  };

  const handleSwap = async () => {
    if (!isValidAmount) return;
    router.push("/swapExchange");
  };

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm">
      {error && (
        <div className="inline-block text-red-500 mb-4 text-sm bg-red-50 px-3 py-2 rounded">
          {/* {error} */}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          ENTER AMOUNT OF ESPEES YOU WANT TO SWAP
        </p>

        <div className="relative max-w-[200px]">
          <input
            type="text" // Changed from "number" to "text"
            value={espeeAmount}
            onChange={(e) => {
              // Only allow digits and decimal point
              const value = e.target.value;
              // Regex to match only positive numbers with optional decimal places
              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                setEspeeAmount(value);

                if (
                  selectedCurrency &&
                  rates &&
                  rates.data.exchange_rates[selectedCurrency]
                ) {
                  const rate = rates.data.exchange_rates[selectedCurrency];
                  const calculatedAmount = (
                    parseFloat(value || 0) * rate
                  ).toFixed(2);
                  setLocalAmount(calculatedAmount);
                  setIsValidAmount(parseFloat(value) > 0);
                }
              }
            }}
            className="text-5xl font-bold w-full outline-none focus:ring-2 focus:ring-blue-500 rounded"
            placeholder="0.00"
            // disabled={apiLoading || isSwapping}
            inputMode="decimal" // Better mobile keyboard for numbers
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            YOU WILL RECEIVE{" "}
            <span className="text-green-500 font-medium">
              {isFetching
                ? "Loading..."
                : `${selectedCurrency} ${localAmount || "0.00"}`}
            </span>
          </p>
        </div>

        {rates && rates[selectedCurrency] && (
          <p className="text-xs text-gray-500">
            Exchange Rate: 1 ESPEE = {rates[selectedCurrency]}{" "}
            {selectedCurrency}
          </p>
        )}
      </div>

      <button
        onClick={handleSwap}
        className={`mt-6 w-72 py-3 rounded-lg flex justify-center items-center space-x-2 transition-colors ${
          isFetching
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
        // disabled={apiLoading || !isValidAmount || isSwapping}
      >
        <span>{isSwapping ? "Processing..." : "Swap"}</span>
        {isSwapping ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Image
            src={Img}
            alt="Swap"
            width={20}
            height={20}
            className={isFetching ? "opacity-50" : ""}
          />
        )}
      </button>

      {isFetching && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Fetching latest rates...
        </p>
      )}
    </div>
  );
};

export default SwapCard;
