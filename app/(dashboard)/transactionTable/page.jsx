"use client";

import apiService from "@config/config";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React from "react";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Pagination from "../paginationComponent/Pagination";

const TableHeader = () => (
  <div className="flex items-center p-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 bg-gray-50">
    <div className="flex-1">Date</div>
    <div className="flex-1">Amount</div>
    <div className="flex-1">Description</div>
    <div className="flex-1">Status</div>
  </div>
);

const TransactionRow = ({ transaction }) => {
  if (!transaction) return null;

  const date = new Date(transaction.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  const amount = transaction.total_espee_amount
    ? `₦ ${parseFloat(transaction.total_espee_amount).toLocaleString()}`
    : "N/A";

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "success":
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
  const description =
    transaction.description ||
    (transaction.payment_method
      ? `Paid through ${transaction.payment_method}`
      : "Currency Exchange");

  return (
    <div className="flex items-center py-3 px-1 text-sm border-b hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-1">{date}</div>
      <div className="flex-1">{amount}</div>
      <div className="flex-1">{description}</div>
      <div className={`flex-1 ${statusColor}`}>
        {status.toLowerCase() === "completed" ? "success" : status}
      </div>
    </div>
  );
};

// Main component that wraps both table and pagination
const TransactionTable = () => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const {
    data: response,
    isFetching,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fetch/transactions", currentPage],
    queryFn: () => apiService.transactions.list("NGN", currentPage),
    placeholderData: keepPreviousData,
  });

  const transactions = response?.data || [];

  // Extract pagination information from response
  const pagination = response?.pagination || {
    count: 0,
    total: 0,
    perPage: 15,
    currentPage: 1,
    totalPages: 1,
    links: {},
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table when page changes
    window.scrollTo({
      top: document.getElementById("transactions-table-top")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // Show loading state
  if (isFetching && isPending) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-gray-600">Loading transactions...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
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
        </div>
      </div>
    );
  }

  const validTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div>
      {/* Transaction Table Component */}
      <div
        id="transactions-table-top"
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
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
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Component placed outside the table div */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        onPageChange={handlePageChange}
        className="mt-6" 
      />
    </div>
  );
};

export default TransactionTable;
