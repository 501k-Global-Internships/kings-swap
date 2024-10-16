import React from "react";
import bgImage from "../assets/password-bg.svg";
import Link from "next/link";
import Img2 from "../assets/vector-img.svg";
import Image from "next/image";

const ResetConfirmation = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Left section with background image */}
      <div
        className="relative w-full md:w-[55%] bg-cover bg-center overflow-hidden"
        style={{
          clipPath: "polygon(0 0, 100% 0, 93% 100%, 0% 100%)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="relative z-10 flex flex-col justify-end h-full p-12 text-white">
          <h2 className="text-4xl font-bold mb-2">Swap Espees faster!</h2>
          <p className="text-sm mb-12">One account to keep and  exchange your espees</p>
          <div className="flex items-center mb-8">
            <Image
              src={Img2}
              alt="Kings Swap"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="ml-3 text-sm font-medium tracking-wider uppercase">
              Kings Swap
            </span>
          </div>
        </div>
      </div>

      {/* Right section with confirmation message */}
      <div className="w-full md:w-[45%] flex items-center justify-center p-8">
        <div className="w-full max-w-md px-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">
            Reset your password
          </h1>

          <div className="mb-6 bg-green-500 text-white py-4 px-4 rounded-lg text-center">
            Password changed successfully!
          </div>

          <Link
            href="/loginPage"
            className="block w-full border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmation;
