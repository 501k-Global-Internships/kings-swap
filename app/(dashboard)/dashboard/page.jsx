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
      <div className="lg:ml-64 flex-1 flex flex-col">
        <Navbar className="pl-16 lg:pl-0" />{" "}
        {/* Added left padding for mobile */}
        <div className="flex-1 overflow-y-auto mt-[87px]">
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
