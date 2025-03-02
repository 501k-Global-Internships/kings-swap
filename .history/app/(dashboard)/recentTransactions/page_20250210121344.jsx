"use client";
import apiService from "@config/config";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { useExchange } from "@hooks/useExchange";
import React from "react";

const TableHeader = () => (
  <div className="flex items-center p-3 mb-4 border border-gray-500 rounded-lg text-sm text-gray-500">
    <div className="flex-1">Date</div>
    <div className="flex-1">Amount</div>
    <div className="flex-1">Description</div>
    <div className="flex-1">Currency</div>
    <div className="flex-1 text-right">Status</div>
  </div>
);

const TransactionRow = ({ transaction }) => {
  if (!transaction) return null;

  const date = new Date(transaction.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const amount = transaction.total_espee_amount
    ? `₦ ${transaction.total_espee_amount.toLocaleString()}`
    : "N/A";

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "completed":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      case "processing":
        return "text-yellow-500";
      case "pending":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const status = transaction.processing_status || "Unknown";
  const statusColor = getStatusColor(status);

  return (
    <div className="flex items-center py-3 text-sm border-b hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-1">{date}</div>
      <div className="flex-1">{amount}</div>
      <div className="flex-1">
        {transaction.transaction_type || "Currency Exchange"}
      </div>
      <div className="flex-1">{transaction.destination_currency || "N/A"}</div>
      <div className={`flex-1 text-right ${statusColor}`}>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-opacity-10 bg-current">
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

const TransactionsTable = () => {
  // const { loading, error, transactions, fetchTransactions } = useExchange();

  // React.useEffect(() => {
  //   fetchTransactions();
  // }, [fetchTransactions]);

  const {
    data: transaction,
    isFetching: loading,
    isPending,
    error,
  } = useQuery({
    queryKey: ["fetch/transaction"],
    queryFn: () => apiService.transactions.list("NGN"),
    placeholderData: keepPreviousData,
  });
  console.log(error);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-gray-600">Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="text-red-500 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>Failed to load transactions</p>
          </div>
          {/* <p className="text-sm mt-1">{error}</p> */}
        </div>
      </div>
    );
  }

  const validTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <button
          onClick={() => fetchTransactions()}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center space-x-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      <TableHeader />

      <div>
        {validTransactions.length > 0 ? (
          validTransactions.map((transaction, index) => (
            <TransactionRow
              key={transaction.id || index}
              transaction={transaction}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
