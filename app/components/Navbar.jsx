"use client";
import Image from "next/image";
import Logo from "../assets/Logo.svg";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/" },
    { name: "Contact", href: "/" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center relative">
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
        className="hidden md:block bg-[#2467E3] text-[#FFFFFF] px-6 py-2 rounded font-normal hover:bg-opacity-90"
      >
        Get started
      </Link>

      <button
        className="md:hidden flex items-center justify-center bg-[#2467E3] text-white w-12 h-12 rounded"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {!isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
      </button>

      {isMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-blue-600 z-50 flex flex-col pt-20 pb-10 px-6">
          <button
            className="absolute top-6 right-6 text-white"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white text-xl font-medium"
                onClick={() => {
                  setActiveLink(link.name);
                  setIsMenuOpen(false);
                }}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/signUp"
              className="bg-white text-blue-600 px-6 py-3 rounded font-medium text-center mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
