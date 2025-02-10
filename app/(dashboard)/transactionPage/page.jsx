// File: pages/TransactionPage.js
import React from "react";
import Layout from "../_component/Layout";
import TransactionTable from "../transactionTable/page";

const TransactionPage = () => {
  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Transactions</h1>
        <TransactionTable />
      </div>
    </Layout>
  );
};

export default TransactionPage;
