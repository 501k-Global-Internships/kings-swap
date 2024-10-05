'use client'
import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../_component/Sidebar";


const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div
        className={`
        lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10
        ${isOpen ? "block" : "hidden"}
      `}
      >
        <div className="w-64 bg-white h-full">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
