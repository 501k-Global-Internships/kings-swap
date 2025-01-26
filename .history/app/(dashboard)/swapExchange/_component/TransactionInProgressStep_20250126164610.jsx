import React, { useEffect } from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

import Coin from "@assets/coin2.svg";
import Copy from "@assets/copy.svg";
import Close from "@assets/close-circle.svg";

import { useExchangeContext } from "./ExchangeContext";

export function TransactionInProgressStep() {
  const { setStep } = useExchangeContext();
  const { watch } = useFormContext();

  const localAmount = watch("localAmount");
  const selectedCurrency = watch("selectedCurrency");
  const espeeAmount = watch("espeeAmount");

  const [timeLeft, setTimeLeft] = React.useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStep(4);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setStep]);

  const handleCancel = () => {
    setStep(1);
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="font-medium mb-2">
          YOU WILL RECEIVE {localAmount} {selectedCurrency}
        </p>
        <p className="mb-4">TRANSFER {espeeAmount} ESPEES TO</p>
        <div className="flex items-center justify-center mb-4">
          <p className="text-orange-500 mr-2 break-all">
            0xd3349300fafe5e9aee8e80c2f8f69823744ba6ed
          </p>
          <Image
            src={Copy}
            width={20}
            height={20}
            alt="Copy"
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(
                "0xd3349300fafe5e9aee8e80c2f8f69823744ba6ed"
              );
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
        className="w-full bg-red-500 text-white p-3 rounded mt-6 flex items-center justify-center"
      >
        Cancel transaction{" "}
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
