import React from "react";
import bgImg from "../assets/forget-bgImg.svg";
import Link from "next/link";
import Image from "next/image";
import Img2 from "../assets/vector-img.svg";

const ResetPassword = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left section with background image */}
      <div
        className="relative w-full md:w-1/2 overflow-hidden"
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 " />
        <div className="relative z-10 flex flex-col justify-end h-full p-12 text-white">
          <h2 className="text-4xl font-bold mb-2">Swap Espees quickier!</h2>
          <p className="text-sm opacity-90">
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

      {/* Right section with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-8 text-gray-800">
            Reset your password
          </h1>
          <form>
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                Email address
              </label>
              <div className="relative border border-gray-200 rounded-lg">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none text-gray-700"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 4.375L10 11.875L2.5 4.375"
                      stroke="#1D5EFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.5 4.375H17.5V15C17.5 15.1658 17.4342 15.3247 17.3169 15.4419C17.1997 15.5592 17.0408 15.625 16.875 15.625H3.125C2.95924 15.625 2.80027 15.5592 2.68306 15.4419C2.56585 15.3247 2.5 15.1658 2.5 15V4.375Z"
                      stroke="#1D5EFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <Link
              href="/resetConfirmation"
              className="w-full bg-[#1D5EFF] text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center inline-block"
            >
              Send password reset link
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
