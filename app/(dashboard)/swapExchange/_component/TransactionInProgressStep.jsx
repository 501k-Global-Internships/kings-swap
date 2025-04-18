import React, { useEffect, useState } from "react";
import Image from "next/image";
import Coin from "@assets/coin2.svg";
import Copy from "@assets/copy.svg";
import Close from "@assets/close-circle.svg";
import { useExchangeContext } from "./ExchangeContext";
import apiService from "@config/config";
import toast from "react-hot-toast"; // Import toast

export function TransactionInProgressStep() {
  const { setStep, transactionData, setTransactionData, resetTransaction } =
    useExchangeContext();

  // Calculate expiration time based on expires_at from the API
  const calculateTimeLeft = () => {
    // Check if we have a stored end time for this transaction
    const storedEndTime = localStorage.getItem(
      `transaction_end_${transactionData.id}`
    );

    if (storedEndTime) {
      const timeRemaining = Math.floor(
        (parseInt(storedEndTime) - Date.now()) / 1000
      );
      return timeRemaining > 0 ? timeRemaining : 0;
    }

    // Always set to 10 minutes (600 seconds) for new transactions
    const endTime = Date.now() + 600 * 1000; // 10 minutes in milliseconds
    if (transactionData.id) {
      localStorage.setItem(
        `transaction_end_${transactionData.id}`,
        endTime.toString()
      );
    }
    return 600; // 10 minutes in seconds
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isCancelling, setIsCancelling] = useState(false);
  const [copied, setCopied] = useState({ reference: false, address: false });

  useEffect(() => {
    // Store the transaction end time when the component first mounts
    if (
      transactionData.id &&
      !localStorage.getItem(`transaction_end_${transactionData.id}`)
    ) {
      const endTime = Date.now() + 600 * 1000; // 10 minutes in milliseconds
      localStorage.setItem(
        `transaction_end_${transactionData.id}`,
        endTime.toString()
      );
    }

    // Use requestAnimationFrame for more accurate timing
    let frameId;
    let lastTime = Date.now();

    const updateTimer = () => {
      const now = Date.now();
      if (transactionData.id) {
        const storedEndTime = localStorage.getItem(
          `transaction_end_${transactionData.id}`
        );
        if (storedEndTime) {
          const timeRemaining = Math.floor(
            (parseInt(storedEndTime) - now) / 1000
          );
          setTimeLeft(timeRemaining > 0 ? timeRemaining : 0);

          if (timeRemaining <= 0) {
            // Check transaction status when time expires
            checkTransactionStatus();
            return;
          }
        }
      }

      frameId = requestAnimationFrame(updateTimer);
    };

    updateTimer();

    // Check transaction status periodically
    const statusChecker = setInterval(() => {
      if (transactionData.id) {
        checkTransactionStatus();
      }
    }, 15000);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(statusChecker);
    };
  }, [transactionData.id]);

  const checkTransactionStatus = async () => {
    try {
      if (transactionData.id) {
        const response = await apiService.transactions.getDetails(
          transactionData.id
        );
        const status = response?.data?.payment_status;

        // Update transaction data with additional fields from response
        setTransactionData((prev) => ({
          ...prev,
          status: status || prev.status,
          reference: response?.data?.reference || prev.reference,
          payment: response?.data?.payment || prev.payment,
          expires_at: response?.data?.expires_at || prev.expires_at,
          fiat_amount: response?.data?.fiat_amount || prev.fiat_amount,
          currency: response?.data?.currency || prev.currency,
          espee_amount: response?.data?.espee_amount || prev.espee_amount,
        }));

        // If payment status is successful or completed, move to next step
        if (status === "successful" || status === "completed") {
          setTimeout(() => setStep(4), 1000);
        }
      }
    } catch (error) {
      // Show toast for error
      toast.error("Failed to check transaction status");
      console.error("Failed to check transaction status:", error);
    }
  };

  const handleCompleteTransaction = () => {
    setStep(4); // Move to the completed step
  };

  const handleCancel = async () => {
    if (!transactionData.id) {
      toast.error("No transaction ID available to cancel");
      return;
    }

    setIsCancelling(true);

    try {
      // Call API to cancel transaction using the new cancel endpoint
      await apiService.transactions.cancel(transactionData.id);

      // Show success toast
      toast.success("Transaction cancelled successfully");

      // Clear the stored end time
      localStorage.removeItem(`transaction_end_${transactionData.id}`);

      // Reset transaction and go back to first step
      resetTransaction();
      setStep(1);
    } catch (error) {
      console.error("Failed to cancel transaction:", error);

      // Show error toast with backend message if available
      const errorMessage =
        error?.data?.message ||
        error?.data?.error?.message ||
        "Failed to cancel transaction. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Copy text to clipboard and show temporary confirmation
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);

    // Add toast notification
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <p className="font-medium mb-1 text-sm">
          YOU WILL RECEIVE {transactionData.fiat_amount?.toLocaleString() || 0}{" "}
          {transactionData.currency || "NGN"}
        </p>
        <p className="mb-2 text-sm">
          TRANSFER {transactionData.espee_amount || 0} ESPEES TO
        </p>

        {/* Display transaction reference with improved styling */}
        <div className="bg-gray-50 p-2 rounded-lg mb-2">
          <p className="text-gray-700 mb-1 font-semibold text-xs">
            Reference (Required):
          </p>
          <div className="flex items-center justify-center">
            <code className="bg-orange-50 text-orange-600 px-2 py-1 rounded-md font-medium text-sm mr-2">
              {transactionData.reference || "Processing..."}
            </code>
            <button
              className="cursor-pointer bg-gray-100 p-1 rounded hover:bg-gray-200 transition-colors"
              onClick={() =>
                transactionData.reference &&
                copyToClipboard(transactionData.reference, "reference")
              }
              disabled={!transactionData.reference}
            >
              <div className="flex items-center">
                <Image src={Copy} width={16} height={16} alt="Copy" />
                {copied.reference && (
                  <span className="text-green-500 text-xs ml-1">Copied!</span>
                )}
              </div>
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Include this reference when making your Espees transfer
          </p>
        </div>

        {/* Display destination address with improved styling */}
        <div className="bg-gray-50 p-2 rounded-lg mb-3">
          <p className="text-gray-700 mb-1 font-semibold text-xs">
            Destination Address:
          </p>
          <div className="flex flex-col items-center">
            <div className="bg-orange-50 p-1 rounded-md w-full mb-1">
              <p className="text-orange-600 font-mono break-all text-xs">
                {transactionData.payment?.destination_address ||
                  "Processing..."}
              </p>
            </div>
            <button
              className="cursor-pointer bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition-colors flex items-center"
              onClick={() =>
                transactionData.payment?.destination_address &&
                copyToClipboard(
                  transactionData.payment.destination_address,
                  "address"
                )
              }
              disabled={!transactionData.payment?.destination_address}
            >
              <Image
                src={Copy}
                width={12}
                height={12}
                alt="Copy"
                className="mr-1"
              />
              <span className="text-xs">
                {copied.address ? "Copied!" : "Copy Address"}
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Send Espees to this wallet address
          </p>
        </div>

        <Image
          src={Coin}
          width={80}
          height={80}
          alt="Espee Coin"
          className="mx-auto my-3"
        />

        <div className="bg-orange-50 p-2 rounded-lg mb-2">
          <p className="text-orange-800 text-xs">
            You have{" "}
            <span className="text-orange-600 font-bold">
              {formatTime(timeLeft)}
            </span>{" "}
            to complete this transaction
          </p>
        </div>

        <div className="text-xs text-gray-500 mb-2">
          Remember to include the reference in your transaction narration
        </div>

        {transactionData.status && (
          <div
            className={`mt-1 p-1 rounded ${
              transactionData.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : transactionData.status === "successful" ||
                  transactionData.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="font-medium text-xs">
              Status: {transactionData.status?.toUpperCase() || "PENDING"}
            </p>
          </div>
        )}
      </div>
      <button
        className="w-full bg-green-600 text-white p-4 rounded-lg mt-2 mb-3 hover:bg-green-700 transition-colors font-medium"
        onClick={handleCompleteTransaction}
      >
        I have made the transaction
      </button>

      <button
        onClick={handleCancel}
        disabled={isCancelling}
        className="w-full bg-red-500 text-white p-4 rounded-lg flex items-center justify-center disabled:bg-red-300 hover:bg-red-600 transition-colors"
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

export default TransactionInProgressStep;
