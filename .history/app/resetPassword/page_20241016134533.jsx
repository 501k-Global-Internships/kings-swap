import React from "react";
import bgImg from "../assets/forget-bgImg.svg"
import Link from "next/link";
import Image from "next/image";
import Img2 from '../assets/vector-img.svg'

const ResetPassword = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left section with background image */}
      <div
        className="relative w-full md:w-1/2"
        style={{ backgroundImage: `url(${bgImg.src})` }}
      >
        <div className="absolute inset-0" />{" "}
        {/* Overlay for better text visibility */}
        <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Swap Espees quickier!</h2>
          <p className="text-sm">
            One account to keep and exchange your espees
          </p>
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
            <Image src={Img2} alt="Kings Swap" width={24} height={24} />
            <span className="ml-2 text-sm">KINGS SWAP</span>
          </div>
        </div>
      </div>

      {/* Right section with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6">Reset your password</h1>
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Link
              href="/resetConfirmation"
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              send password reset link
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;