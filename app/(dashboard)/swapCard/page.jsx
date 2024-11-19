"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Img from "../../assets/swapIcon.svg";
import { useExchange } from "@/app/api/config";

const SwapCard = () => {
  const router = useRouter();
  const {
    rates,
    loading: apiLoading,
    error: apiError,
    fetchRates,
  } = useExchange();

  const [espeeAmount, setEspeeAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [error, setError] = useState("");
  const [localAmount, setLocalAmount] = useState("0.00");
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    const initializeRates = async () => {
      try {
        await fetchRates();
        setError("");
      } catch (err) {
        setError("Failed to fetch exchange rates. Please try again.");
      }
    };

    initializeRates();
  }, [fetchRates]);

  useEffect(() => {
    if (rates && espeeAmount !== "") {
      const amount = parseFloat(espeeAmount);
      if (!isNaN(amount) && amount >= 0) {
        const rate = rates[selectedCurrency] || 0;
        const calculated = (amount * rate).toFixed(2);
        setLocalAmount(calculated);
      }
    } else {
      setLocalAmount("0.00");
    }
  }, [espeeAmount, rates, selectedCurrency]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setError("");
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setEspeeAmount(value);
    }
  };

  const handleSwap = async () => {
    if (!espeeAmount || parseFloat(espeeAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsSwapping(true);

    const swapData = {
      espeeAmount,
      localAmount,
      selectedCurrency,
      timestamp: new Date().toISOString(),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      localStorage.setItem("swapData", JSON.stringify(swapData));
      router.push("/swapExchange");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSwapping(false);
    }
  };

  const isValidAmount = espeeAmount !== "" && parseFloat(espeeAmount) > 0;

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm">
      {(error || apiError) && (
        <div className="inline-block text-red-500 mb-4 text-sm bg-red-50 px-3 py-2 rounded">
          {error || apiError}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          ENTER AMOUNT OF ESPEES YOU WANT TO SWAP
        </p>

        <div className="relative max-w-[200px]">
          <input
            type="text"
            value={espeeAmount}
            onChange={handleAmountChange}
            className="text-5xl font-bold w-full outline-none focus:ring-2 focus:ring-blue-500 rounded"
            placeholder="0.00"
            disabled={apiLoading || isSwapping}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            YOU WILL RECEIVE{" "}
            <span className="text-green-500 font-medium">
              {apiLoading ? "Loading..." : `${selectedCurrency} ${localAmount}`}
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
          apiLoading || !isValidAmount || isSwapping
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
        disabled={apiLoading || !isValidAmount || isSwapping}
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
            className={apiLoading ? "opacity-50" : ""}
          />
        )}
      </button>

      {apiLoading && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Fetching latest rates...
        </p>
      )}
    </div>
  );
};

export default SwapCard;
