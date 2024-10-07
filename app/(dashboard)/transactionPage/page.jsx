
import Layout from "../_component/Layout";
import TransactionTable from "../transactionTable/page";


const TransactionPage = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Transactions</h1>
      <TransactionTable />
    </Layout>
  );
};

export default TransactionPage;
