import React from "react";

const TableHeader = () => (
  <div className="flex items-center p-3 mb-4 border border-gray-500 rounded-[1rem] text-sm text-gray-500">
    <div className="flex-1">Date</div>
    <div className="flex-1">Amount</div>
    <div className="flex-1">Description</div>
    <div className="flex-1 flex justify-end">
      <span style={{ width: "60px" }}>Status</span>
    </div>
  </div>
);

const TransactionRow = ({ date, amount, description, status }) => (
  <div className="flex items-center py-3 text-sm">
    <div className="flex-1">{date}</div>
    <div
      className={`flex-1 ${
        status.toLowerCase() === "failed" ? "text-red-500" : "text-green-500"
      }`}
    >
      {amount}
    </div>
    <div className="flex-1">{description}</div>
    <div className="flex-1 flex justify-end">
      <span
        className={`${
          status.toLowerCase() === "failed" ? "text-red-500" : "text-green-500"
        }`}
        style={{ width: "70px" }}
      >
        {status}
      </span>
    </div>
  </div>
);

const TransactionsTable = () => {
  const transactions = [
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
      status: "failed",
    },
    {
      date: "03-Apr-24",
      amount: "₦ 7,400",
      description: "Paid through e-wallet",
      status: "failed",
    },
    {
      date: "19-Dec-23",
      amount: "₦ 10,000",
      description: "Paid through bank -t",
      status: "success",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Recent transactions</h2>
      <TableHeader />
      <div className="space-y-1">
        {transactions.map((transaction, index) => (
          <TransactionRow
            key={index}
            date={transaction.date}
            amount={transaction.amount}
            description={transaction.description}
            status={transaction.status}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionsTable;
