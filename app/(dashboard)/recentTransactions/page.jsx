'use client'

import { useExchange } from "@config/config";
import React, { useState, useEffect } from "react";


const TableHeader = () => (
  <div className="flex items-center p-3 mb-4 border border-gray-500 rounded-lg text-sm text-gray-500">
    <div className="flex-1">Date</div>
    <div className="flex-1">Amount</div>
    <div className="flex-1">Description</div>
    <div className="flex-1 text-right">Status</div>
  </div>
);

const TransactionRow = ({ transaction }) => {
  if (!transaction) return null;

  const date = new Date(transaction.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  const amount = transaction.fiat_amount
    ? `₦ ${transaction.fiat_amount.toLocaleString()}`
    : "N/A";

  const status =
    transaction.payment_status || transaction.processing_status || "Unknown";

  const statusColor =
    status.toLowerCase() === "failed" ? "text-red-500" : "text-green-500";

  return (
    <div className="flex items-center py-3 text-sm border-b">
      <div className="flex-1">{date}</div>
      <div className={`flex-1 ${statusColor}`}>{amount}</div>
      <div className="flex-1">
        {transaction.currency ? `${transaction.currency} Swap` : "Transaction"}
      </div>
      <div className={`flex-1 text-right ${statusColor} uppercase`}>
        {status}
      </div>
    </div>
  );
};

const TransactionsTable = () => {
  const { loading, error: hookError, transactions } = useExchange();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hookError) {
      const errorMessage =
        hookError?.message ||
        hookError?.body ||
        (typeof hookError === "string"
          ? hookError
          : "An error occurred while loading transactions");
      setError(errorMessage);
    }
  }, [hookError]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span>Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="text-red-500 text-center">
          <p>Failed to load transactions</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const validTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
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
          <p className="text-center text-gray-500 py-4">
            No transactions found
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;