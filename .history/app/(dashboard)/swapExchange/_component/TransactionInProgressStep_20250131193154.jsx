import React, { useEffect, useState } from "react";
import Image from "next/image";
import Coin from "@assets/coin2.svg";
import Copy from "@assets/copy.svg";
import Close from "@assets/close-circle.svg";
import { useExchangeContext } from "./ExchangeContext";

export function TransactionInProgressStep() {
  const { setStep, transactionData, resetTransaction } = useExchangeContext();
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCancelling, setIsCancelling] = useState(false);
  useEffect(() => { 
    
  }, [setStep]);

  useEffect(() => {
    let isMounted = true;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (isMounted) {
            setTimeout(() => setStep(4), 0); // Safely update state after render
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [setStep]);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      if (transactionData.transactionId) {
        // Call API to cancel transaction
        await apiService.transactions.cancel(transactionData.transactionId);
      }
      resetTransaction();
      setStep(1); // Return to first step
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="font-medium mb-2">
          YOU WILL RECEIVE {transactionData.localAmount}{" "}
          {transactionData.selectedCurrency}
        </p>
        <p className="mb-4">TRANSFER {transactionData.espeeAmount} ESPEES TO</p>
        <div className="flex items-center justify-center mb-4">
          <p className="text-orange-500 mr-2 break-all">
            {transactionData.transactionId}
          </p>
          <Image
            src={Copy}
            width={20}
            height={20}
            alt="Copy"
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(transactionData.transactionId);
            }}
          />
        </div>
        <Image
          src={Coin}
          width={120}
          height={120}
          alt="Espee Coin"
          className="mx-auto mb-4"
        />
        <p>
          You have <span className="text-orange-500">{timeLeft}sec</span> to
          complete transaction
        </p>
      </div>
      <button
        onClick={handleCancel}
        disabled={isCancelling}
        className="w-full bg-red-500 text-white p-3 rounded mt-6 flex items-center justify-center disabled:bg-red-300"
      >
        {isCancelling ? "Cancelling..." : "Cancel transaction"}
        <Image
          src={Close}
          width={20}
          height={20}
          alt="Cancel"
          className="ml-2"
        />
      </button>
    </div>
  );
}
