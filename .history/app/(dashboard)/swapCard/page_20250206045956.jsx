"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import apiService from "@config/config";
import Img from "@assets/swapIcon.svg";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


const SwapCard = () => {
 

    // try {
    //   setIsSwapping(true);
    //   setApiError(null);

    //   const response = await apiService.transactions.create({
    //     espee_amount: parseFloat(espeeAmount),
    //     currency: selectedCurrency,
    //   });

    //   if (response?.success) {
    //     // Handle successful swap
    //     console.log("Swap successful:", response);
    //   } else {
    //     throw new Error(response?.message || "Swap failed");
    //   }
    // } catch (error) {
    //   console.error("Swap error:", error);
    //   setApiError(
    //     error.message || "Failed to complete swap. Please try again."
    //   );
    // } finally {
    //   setIsSwapping(false);
    // }
    router.push('/swapExchange');
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
            type="number"
            value={espeeAmount}
            onChange={handleAmountChange}
            className="text-5xl font-bold w-full outline-none focus:ring-2 focus:ring-blue-500 rounded"
            placeholder="0.00"
            // disabled={apiLoading || isSwapping}
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
