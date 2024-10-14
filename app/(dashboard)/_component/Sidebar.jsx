'use client'
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Home from "../../assets/home.svg";
import FileText from "../../assets/transactions.svg";
import Receipt from "../../assets/receipt-item.svg";
import LogOut from "../../assets/logout.svg";
import Logo from "../../assets/logo2.svg";

const SidebarItem = ({ icon: Icon, text, path, isActive, onClick }) => {
  const content = (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Image
        src={Icon}
        alt={text}
        width={20}
        height={20}
        className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-700"}`}
      />
      <span className="hidden md:inline">{text}</span>
    </div>
  );
  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }
  return <Link href={path}>{content}</Link>;
};

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const menuItems = [
    { icon: Home, text: "Home", path: "/dashboard" },
    { icon: FileText, text: "Transactions", path: "/transactionPage" },
    { icon: Receipt, text: "Receipts", path: "/receipts" },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

  return (
    <div
      className={`fixed h-full bg-white p-4 transition-all duration-300 ease-in-out z-20 
                    ${isOpen ? "left-0" : "-left-64"} 
                    md:left-0 md:w-20 lg:w-64`}
    >
      <div className="mb-8 h-[4.4rem] flex justify-center md:justify-start">
        <Image
          src={Logo}
          alt="Kings Swap"
          width={150}
          height={200}
          priority
          className="mt-2"
        />
      </div>
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            text={item.text}
            path={item.path}
            isActive={pathname === item.path}
          />
        ))}
      </nav>
      <div className="absolute bottom-4">
        <SidebarItem icon={LogOut} text="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
