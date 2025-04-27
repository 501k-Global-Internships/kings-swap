import Image from "next/image";
import React from "react";
import Img from "../assets/coin.png";
import lineBackground from "../assets/line.png";

export default function CurrencySwapCard() {
  return (
    <div className="font-sans">
      {/* Mobile version (similar to image 2) */}
      <div className="block md:hidden bg-blue-600 rounded-3xl m-3 p-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-lg font-medium mb-4">SWAP TO LOCAL CURRENCY</h2>
          <div className="mb-6">
            <p className="text-5xl font-bold mb-2">100%</p>
            <p className="text-3xl font-bold mb-1">Successful swaps</p>
            <p className="text-3xl font-bold mb-1">Enjoy Convenience</p>
            <p className="text-3xl font-bold mb-6">Swap without Limits.</p>
          </div>
          <p className="text-lg mb-6">
            Espees swap, now swift than ever before
          </p>
          <div className="flex justify-center">
            <button className="bg-transparent border-2 border-white rounded-full py-2 px-8 text-white font-medium flex items-center">
              Swap now
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop version (similar to image 1) */}
      <div className="hidden md:block bg-blue-600 m-9 rounded-[6rem] p-8 text-white relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"></div>

        {/* Line background positioned to the left side */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[28rem]">
            <Image
              src={lineBackground}
              alt="Line Background"
              layout="fill"
              objectFit="cover"
              objectPosition="left center"
              className="opacity-50" // Adjust opacity as needed
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex items-center relative z-10">
          <div className="w-1/3 flex justify-center items-center">
            {/* Coin image - significantly larger */}
            <div className="w-64 h-64 relative">
              <Image
                src={Img}
                alt="Coin"
                layout="fill"
                objectFit="contain"
                priority
                className="z-20"
              />
            </div>
          </div>

          <div className="w-2/3">
            <h2 className="text-lg font-thin mb-6">SWAP TO LOCAL CURRENCY</h2>
            {/* Text block with no gaps */}
            <div className="mb-8 flex flex-col leading-none">
              <span className="text-6xl font-medium">100%</span>
              <span className="text-[4rem] font-medium -mt-2">
                Successful swaps
              </span>
              <span className="text-[4rem] font-medium -mt-2">
                Enjoy Convenience
              </span>
              <span className="text-[4rem] font-medium -mt-2">
                Swap without Limits.
              </span>
            </div>
            <p className="text-xl font-light">
              Espees swap now, swift than ever before
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
