

const TableHeader = ({ children }) => (
  <div className="text-sm text-gray-600 font-medium">{children}</div>
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
      date: "20-Nov-23",
      amount: "₦ 1,000",
      description: "Paid through bank -t",
      status: "success",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200">
        <TableHeader>Date</TableHeader>
        <TableHeader>Amount</TableHeader>
        <TableHeader>Description</TableHeader>
        <TableHeader>Status</TableHeader>
      </div>
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="text-gray-900">{transaction.date}</div>
            <div
              className={`${
                transaction.status === "Failed"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {transaction.amount}
            </div>
            <div className="text-gray-700">{transaction.description}</div>
            <div
              className={`${
                transaction.status === "Failed"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {transaction.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;
