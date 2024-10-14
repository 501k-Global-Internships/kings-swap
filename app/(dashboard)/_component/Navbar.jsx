import React from "react";
import Image from "next/image";
import Img from "../../assets/profile.svg";
import SettingsImg from "../../assets/settings.svg";
// import MenuIcon from "../../assets/menu.svg"; // You'll need to add this icon

const Navbar = ({ onToggleSidebar }) => (
  <div className="fixed top-0 right-0 left-0 md:left-20 lg:left-64 flex justify-between items-center p-5 border-b border-gray-200 bg-white z-10">
    <div className="flex items-center">
      <button onClick={onToggleSidebar} className="mr-4 md:hidden">
        {/* <Image src={MenuIcon} alt="Menu" width={24} height={24} /> */}
      </button>
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold">Hello Brendan 👋</h1>
        <p className="text-sm text-gray-600">
          send receive and swap your Espees
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="w-6 h-6 cursor-pointer">
        <Image src={SettingsImg} alt="settings icon" />
      </div>
      <div className="w-8 h-8 rounded-full">
        <Image src={Img} alt="avatar" />
      </div>
    </div>
  </div>
);

export default Navbar;
