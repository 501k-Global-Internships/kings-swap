'use client'

import Image from "next/image";
import Logo from "../assets/Logo.svg";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/" },
    { name: "Contact", href: "/" },
  ];

  return (
    <header className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
      <div className="flex items-center">
        <Image src={Logo} alt="Kings Swap" width={120} height={40} />
      </div>
      <nav className="hidden md:flex space-x-8">
        {navLinks.map((link) => (
          <div key={link.name} className="relative">
            <Link
              href={link.href}
              className="text-white hover:opacity-80"
              onClick={() => setActiveLink(link.name)}
            >
              {link.name}
            </Link>
            {activeLink === link.name && (
              <div className="absolute w-2 h-2 bg-white rounded-full left-1/2 transform -translate-x-1/2 mt-1" />
            )}
          </div>
        ))}
      </nav>
      <Link
        href="/signUp"
        className="bg-[#2467E3] text-[#FFFFFF] px-6 py-2 rounded font-normal hover:bg-opacity-90"
      >
        Get started
      </Link>
    </header>
  );
};

export default Navbar;
