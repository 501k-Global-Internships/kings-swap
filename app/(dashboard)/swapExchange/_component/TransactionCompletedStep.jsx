import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";

import Coin from "@assets/coin2.svg";
import Info from "@assets/info-circle.svg";

import { useExchangeContext } from "./ExchangeContext";

export function TransactionCompletedStep() {
  const router = useRouter();
  const { setStep } = useExchangeContext();
  const { watch } = useFormContext();

  const localAmount = watch("localAmount");
  const selectedCurrency = watch("selectedCurrency");

  const handleNewTransaction = () => {
    setStep(1);
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="font-medium mb-4">
          Your espees transaction is completed
        </h2>
        <Image
          src={Coin}
          width={120}
          height={120}
          alt="Espee Coin"
          className="mx-auto mb-4"
        />
        <p className="mb-6">
          You have been credited {localAmount} {selectedCurrency}
        </p>
      </div>
      <button
        className="w-full bg-gray-800 text-white p-3 rounded-2xl mt-6 mb-3"
        onClick={() => router.push("/dashboard")}
      >
        Go to Dashboard
      </button>
      <button
        onClick={handleNewTransaction}
        className="w-full border border-gray-300 p-3 rounded-2xl"
      >
        Make another transaction
      </button>
      <div className="flex items-center justify-center mt-6 text-sm text-gray-600">
        <Image src={Info} width={16} height={16} alt="Info" className="mr-2" />
        <p>For any transaction issues please contact us via our email</p>
      </div>
    </div>
  );
}
