'use client'

import apiService from "@config/config";
import React, { useState, useEffect } from "react";


const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiService.transactions.list();
        setTransactions(response);
      } catch (error) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusColor = (status) => {
    return status.toLowerCase() === "failed"
      ? "text-red-500"
      : "text-green-500";
  };

  if (loading) {
    return (
      <div className="w-full p-4 text-center">
        <div className="animate-pulse">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-500 bg-red-50 rounded">
        Error: {error}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No transactions found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2 text-left">Amount</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="border p-2">
                {new Date(transaction.created_at).toLocaleDateString()}
              </td>
              <td className="border p-2">
                ₦ {transaction.total_espee_amount?.toLocaleString() || "N/A"}
              </td>
              <td className="border p-2">
                Transaction to {transaction.destination_currency}
              </td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                    transaction.processing_status
                  )}`}
                >
                  {transaction.processing_status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
