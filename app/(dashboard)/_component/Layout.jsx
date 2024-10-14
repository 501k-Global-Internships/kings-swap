import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 lg:ml-64">
        <Navbar />
        <main className="p-6 mt-[100px]">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
