import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Coin from "@assets/coin2.svg";
import Info from "@assets/info-circle.svg";
import { useExchangeContext } from "./ExchangeContext";
import apiService from "@config/config";

export function TransactionCompletedStep() {
  const router = useRouter();
  const { setStep, transactionData, resetTransaction } = useExchangeContext();
  const [transactionStatus, setTransactionStatus] = useState(
    transactionData.status || "processing"
  );
  const [isPolling, setIsPolling] = useState(true);
  const [transactionDetails, setTransactionDetails] = useState({
    fiat_amount: transactionData.fiat_amount || "",
    currency: transactionData.currency || "",
    reference: transactionData.reference || "",
    espee_amount: transactionData.espee_amount || "",
    created_at: transactionData.created_at || new Date().toISOString(),
  });

  useEffect(() => {
    let isMounted = true;
    let pollingInterval;

    // Fetch the initial transaction details if not present
    const fetchTransactionDetails = async () => {
      try {
        if (transactionData.id) {
          const response = await apiService.transactions.getDetails(
            transactionData.id
          );
          if (isMounted && response?.data) {
            setTransactionDetails({
              fiat_amount: response.data.fiat_amount,
              currency: response.data.currency,
              reference: response.data.reference,
              espee_amount: response.data.espee_amount,
              created_at: response.data.created_at,
            });
            setTransactionStatus(
              response.data.payment_status || transactionStatus
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch transaction details:", error);
      }
    };

    fetchTransactionDetails();

    // Only poll if the transaction is still in processing state
    if (
      transactionStatus === "processing" ||
      transactionStatus === "pending" ||
      !transactionStatus
    ) {
      pollingInterval = setInterval(async () => {
        try {
          if (transactionData.id) {
            const response = await apiService.transactions.getDetails(
              transactionData.id
            );

            if (isMounted && response?.data) {
              const newStatus =
                response.data.payment_status || transactionStatus;
              setTransactionStatus(newStatus);

              // Update transaction details
              setTransactionDetails({
                fiat_amount: response.data.fiat_amount,
                currency: response.data.currency,
                reference: response.data.reference,
                espee_amount: response.data.espee_amount,
                created_at: response.data.created_at,
              });

              // Stop polling if we reach a final state
              if (["successful", "completed", "failed"].includes(newStatus)) {
                setIsPolling(false);
                clearInterval(pollingInterval);
              }
            }
          }
        } catch (error) {
          console.error("Failed to check transaction status:", error);
          if (isMounted) {
            setIsPolling(false);
            clearInterval(pollingInterval);
          }
        }
      }, 10000); // Poll every 10 seconds
    }

    return () => {
      isMounted = false;
      clearInterval(pollingInterval);
    };
  }, [transactionData.id, transactionStatus]);

  const handleNewTransaction = () => {
    resetTransaction();
    setStep(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        {/* Status dependent title and content */}
        {transactionStatus === "processing" ||
        transactionStatus === "pending" ? (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin mr-2">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-lg font-medium">
                Your espees transaction is processing
              </p>
            </div>
            <p className="text-[1rem] font-medium text-gray-600 mb-4">
              Please wait while we confirm your payment
            </p>
          </>
        ) : transactionStatus === "failed" ? (
          <p className="text-lg font-medium text-red-600 mb-4">
            Your espees transaction has failed
          </p>
        ) : (
          <p className="text-lg font-medium text-green-600 mb-4">
            Your espees transaction is completed
          </p>
        )}

        {/* Display transaction reference */}
        <p className="text-gray-700 font-medium mb-4">
          Reference:{" "}
          <span className="font-medium">{transactionDetails.reference}</span>
        </p>

        <Image
          src={Coin}
          width={80}
          height={80}
          alt="Espee Coin"
          className="mx-auto my-6"
        />

        {/* Transaction details */}
        <div className="p-4 mb-4">
          <div className="grid grid-cols-2 gap-2 text-center mx-auto">
            <p className="text-gray-600">Amount:</p>
            <p className="font-medium">
              {transactionDetails.fiat_amount} {transactionDetails.currency}
            </p>

            <p className="text-gray-600">Espees:</p>
            <p className="font-medium">{transactionDetails.espee_amount}</p>

            <p className="text-gray-600">Date:</p>
            <p className="font-medium">
              {formatDate(transactionDetails.created_at)}
            </p>

            <p className="text-gray-600">Status:</p>
            <p
              className={`font-medium ${
                transactionStatus === "successful" ||
                transactionStatus === "completed"
                  ? "text-green-600"
                  : transactionStatus === "failed"
                  ? "text-red-600"
                  : "text-orange-500"
              }`}
            >
              {transactionStatus === "successful" ||
              transactionStatus === "completed"
                ? "Completed"
                : transactionStatus === "failed"
                ? "Failed"
                : "Processing"}
            </p>
          </div>
        </div>
      </div>
      <button
        className="w-full bg-[#363636] text-white p-4 rounded-lg mt-4 mb-3"
        onClick={() => router.push("/dashboard")}
      >
        Go to Dashboard
      </button>
      <button
        onClick={handleNewTransaction}
        className="w-full border border-[#363636] p-4 rounded-lg"
      >
        Make another transaction
      </button>
      <button className="flex items-center justify-center mt-3 text-sm text-gray-600">
        <Image src={Info} width={16} height={16} alt="Info" className="mr-2" />
        <p>For any transaction issues please contact us via our email</p>
      </button>
    </div>
  );
}
