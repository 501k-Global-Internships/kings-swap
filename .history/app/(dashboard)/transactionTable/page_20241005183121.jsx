// components/TransactionsTable.jsx
import React from "react";

const TransactionRow = ({ date, amount, description, status }) => (
  <tr className="border-t border-gray-100">
    <td className="py-3">{date}</td>
    <td
      className={`py-3 ${
        status === "failed" ? "text-red-500" : "text-green-500"
      }`}
    >
      {amount}
    </td>
    <td className="py-3">{description}</td>
    <td
      className={`py-3 ${
        status === "failed" ? "text-red-500" : "text-green-500"
      }`}
    >
      {status}
    </td>
  </tr>
);

const TransactionsTable = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <h2 className="text-lg font-semibold mb-4">Recent transactions</h2>
    <table className="w-full">
      <thead>
        <tr className="text-gray-500 text-sm">
          <th className="text-left pb-2">Date</th>
          <th className="text-left pb-2">Amount</th>
          <th className="text-left pb-2">Description</th>
          <th className="text-left pb-2">Status</th>
        </tr>
      </thead>
      <tbody>
        <TransactionRow
          date="12-may-24"
          amount="₦ 5,000"
          description="Paid through bank -t"
          status="success"
        />
        <TransactionRow
          date="06-Apr-24"
          amount="₦ 3,400"
          description="Paid through e-wallet"
          status="failed"
        />
        <TransactionRow
          date="03-Apr-24"
          amount="₦ 7,400"
          description="Paid through e-wallet"
          status="failed"
        />
        <TransactionRow
          date="19-Dec-23"
          amount="₦ 10,000"
          description="Paid through bank -t"
          status="success"
        />
      </tbody>
    </table>
  </div>
);

export default TransactionsTable;
