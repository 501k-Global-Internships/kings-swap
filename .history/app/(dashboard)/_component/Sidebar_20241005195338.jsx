// components/Sidebar.jsx
import React from "react";
import Image from "next/image";
import { Home, FileText, Receipt, LogOut } from "lucide-react";
import Logo from '../../assets/logo2.svg'

const SidebarItem = ({ icon, text, active }) => (
  <div
    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
      active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span>{text}</span>
  </div>
);

const Sidebar = () => (
  <div className="fixed h-full w-64 bg-white p-4">
    <div className="mb-8 h-[3.3rem]">
      <Image
        src={Logo}
        alt="Kings Swap"
        width={120}
        height={200}
        priority
      />
    </div>

    <nav className="space-y-2">
      <SidebarItem icon={<Home className="w-5 h-5" />} text="Home" active />
      <SidebarItem
        icon={<FileText className="w-5 h-5" />}
        text="Transactions"
      />
      <SidebarItem icon={<Receipt className="w-5 h-5" />} text="Receipts" />
    </nav>
    <div className="absolute bottom-4">
      <SidebarItem icon={<LogOut className="w-5 h-5" />} text="Logout" />
    </div>
  </div>
);

export default Sidebar;
