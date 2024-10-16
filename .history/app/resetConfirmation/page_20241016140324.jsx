import React from "react";
import bgImage from "../assets/password-bg.svg";
import Link from "next/link";
import UI
import Image from "next/image";

const ResetConfirmation = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left section with background image */}
      <div
        className="relative w-full md:w-1/2 bg-cover bg-center overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="absolute inset-0" />
        <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
          <h2 className="text-4xl font-bold mb-2">Swap Espees quickier!</h2>
          <p className="text-sm mb-8">
            One account to keep and exchange your espees
          </p>
          <div className="flex items-center mt-4">
            <Image
              src={Img2}
              alt="Kings Swap"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="ml-2 text-sm font-medium tracking-wide">
              KINGS SWAP
            </span>
          </div>
        </div>
      </div>

      {/* Right section with confirmation message */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6">Reset your password</h1>
          <div className="mb-4 bg-green-500 text-white p-3 rounded-md">
            Password changed successfully!
          </div>
          <Link
            href="/loginPage"
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmation;
