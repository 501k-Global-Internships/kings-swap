// File: components/TransactionTable.js
import React from "react";

const TableHeader = () => (
  <div className="flex items-center p-3 mb-4 border border-gray-500 rounded-[1rem] text-sm text-gray-500">
    <div className="flex-1">Date</div>
    <div className="flex-1">Amount</div>
    <div className="flex-1">Description</div>
    <div className="flex-1 text-right">Status</div>
  </div>
);

const TransactionRow = ({ transaction }) => (
  <div className="flex items-center py-3 text-sm">
    <div className="flex-1">{transaction.date}</div>
    <div
      className={`flex-1 ${
        transaction.status.toLowerCase() === "failed"
          ? "text-red-500"
          : "text-green-500"
      }`}
    >
      {transaction.amount}
    </div>
    <div className="flex-1">{transaction.description}</div>
    <div
      className={`flex-1 text-right ${
        transaction.status.toLowerCase() === "failed"
          ? "text-red-500"
          : "text-green-500"
      }`}
    >
      {transaction.status}
    </div>
  </div>
);

const TransactionTable = () => {
  const transactions = [
    {
      date: "12-may-24",
      amount: "₦ 5,000",
      description: "Paid through bank -t",
      status: "success",
    },
    {
      date: "12-may-24",
      amount: "₦ 5,000",
      description: "Paid through bank -t",
      status: "success",
    },
    {
      date: "12-may-24",
      amount: "₦ 5,000",
      description: "Paid through bank -t",
      status: "success",
    },
    {
      date: "06-Apr-24",
      amount: "₦ 3,400",
      description: "Paid through e-wallet",
      status: "Failed",
    },
    {
      date: "03-Apr-24",
      amount: "₦ 7,400",
      description: "Paid through e-wallet",
      status: "Failed",
    },
    {
      date: "19-Dec-23",
      amount: "₦ 10,000",
      description: "Paid through bank -t",
      status: "success",
    },
    {
      date: "19-Dec-23",
      amount: "₦ 1,000",
      description: "Paid through bank -t",
      status: "success",
    },
    {
      date: "03-Dec-23",
      amount: "₦ 7,400",
      description: "Paid through e-wallet",
      status: "Failed",
    },
    {
      date: "03-Dec-23",
      amount: "₦ 7,400",
      description: "Paid through e-wallet",
      status: "Failed",
    },
    {
      date: "03-Dec-23",
      amount: "₦ 7,400",
      description: "Paid through e-wallet",
      status: "Failed",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <TableHeader />
      <div className="space-y-1">
        {transactions.map((transaction, index) => (
          <TransactionRow key={index} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;
