'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Receipt, LogOut } from "lucide-react";
import Logo from "../../assets/logo2.svg";

const SidebarItem = ({ icon, text, path, isActive, onClick }) => {
  const content = (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {React.cloneElement(icon, {
        className: `w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-700"}`,
      })}
      <span>{text}</span>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link href={path}>{content}</Link>;
};

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <Home />, text: "Home", path: "/dashboard" },
    { icon: <FileText />, text: "Transactions", path: "/transactionPage" },
    { icon: <Receipt />, text: "Receipts", path: "/receipts" },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

  return (
    <div className="fixed h-full w-64 bg-white p-4">
      <div className="mb-8 h-[4.4rem]">
        <Image src={Logo} alt="Kings Swap" width={150} height={200} priority />
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
        <SidebarItem icon={<LogOut />} text="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
