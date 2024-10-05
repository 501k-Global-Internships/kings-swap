import React from "react";
import { Settings } from "lucide-react";
import Img from "../../assets/profile.svg";
import Image from "next/image";

const Navbar = () => (
  <div className="fixed top-0 right-0 left-0 lg:left-64 flex justify-between items-center p-5 border-b border-gray-200 bg-white z-10">
    <div className="">
            <h1 className="text-xl font-semibold ml-3">Hello Brendan 👋</h1>
            <p>send receive and swap your es</p>
    </div>
    <div className="flex items-center space-x-4">
      <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
      <div className="w-8 h-8 rounded-full">
        <Image src={Img} alt="avatar" />
      </div>
    </div>
  </div>
);

export default Navbar;
