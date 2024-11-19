'use client'
import React, { useState, useEffect } from "react";
import apiService from "../../api/config";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiService.transactions.list();

        if (response && response.data) {
          setTransactions(response.data);
        } else {
          throw new Error("No transactions found");
        }

        setLoading(false);
      } catch (err) {
        console.error("Transaction Fetch Error:", err);
        setError(err.message || "Failed to fetch transactions");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
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
            <td className="border p-2">{transaction.processing_status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;