import React from "react";
import Sidebar from "../_component/Sidebar";
import MobileMenu from "../mobileMenu/page";
import Navbar from "../_component/Navbar";
import MainContent from "../mainContent/page";

const Dashboard = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <MobileMenu />
      <div className="lg:ml-64 flex-1">
        <Navbar />
        <div className="mt-[72px]">
          {" "}

          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
