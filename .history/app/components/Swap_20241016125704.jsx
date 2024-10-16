"use client";

import Image from "next/image";
import SwapImg from "../assets/swap.svg";
import { useEffect, useState } from "react";

const Swap = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 6000); // Total animation cycle: 6s

    // Show button after a short delay
    const timer = setTimeout(() => setShowButton(true), 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-white text-blue-600 p-4 md:p-8">
      <div className="flex justify-center items-center py-10 mb-8 relative overflow-hidden">
        <div className="relative w-full max-w-md flex justify-center items-center">
          <div
            className={`flex items-center transition-all duration-1000 ease-in-out absolute left-0
              ${
                isAnimating
                  ? "opacity-0 -translate-x-full"
                  : "opacity-100 translate-x-0"
              }`}
          >
            <span className="text-xl font-bold whitespace-nowrap">Recieve</span>
            <span
              className="text-blue-600 text-6xl leading-none ml-8"
              style={{ marginTop: "-8px" }}
            >
              •
            </span>
          </div>

          <span className="text-xl font-bold z-10">Swap</span>

          <div
            className={`flex items-center transition-all duration-1000 ease-in-out absolute right-0
              ${
                isAnimating
                  ? "opacity-0 translate-x-full"
                  : "opacity-100 translate-x-0"
              }`}
          >
            <span
              className="text-blue-600 text-6xl leading-none mr-8"
              style={{ marginTop: "-8px" }}
            >
              •
            </span>
            <span className="text-xl font-bold whitespace-nowrap">Repeat</span>
          </div>
        </div>
      </div>
      <div
        className="w-full h-auto min-h-[180px] sm:min-h-[280px] md:min-h-[380px] relative overflow-hidden
                    px-1 pt-2 pb-1
                    sm:px-2 sm:pt-3 sm:pb-2
                    md:px-4 md:pt-4 md:pb-3
                    lg:px-2 lg:pt-8 lg:pb-4
                    flex items-center justify-center"
      >
        <div className="relative w-full h-full aspect-[3/1]">
          <Image
            src={SwapImg}
            alt="Swap Banner"
            layout="fill"
            objectFit="contain"
            priority
          />
          <div
            className={`absolute inset-[-9] flex items-center justify-center transition-all duration-1000 ${
              showButton
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full border-2 border-white hover:bg-blue-700 transition-colors">
              Swap now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
