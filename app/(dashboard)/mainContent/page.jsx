
import SwapCard from "../swapCard/page";
import ConvertBanner from "../convertBanner/page";
import TransactionsTable from "../recentTransactions/page";

const MainContent = () => (
  <div className="p-6 space-y-6">
    <SwapCard />
    <ConvertBanner />
    <TransactionsTable />
  </div>
);

export default MainContent;
