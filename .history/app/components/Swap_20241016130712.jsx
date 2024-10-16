"use client";

import Image from "next/image";
import SwapImg from "../assets/swap.svg";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

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
      {/* Existing animation code */}
      <div className="flex justify-center items-center py-10 mb-8 relative overflow-hidden">
        {/* ... (keep the existing animation code here) ... */}
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
            className={`absolute inset-x-0 bottom-0 mb-4 sm:mb-6 md:mb-8 lg:mb-10 flex justify-center transition-all duration-1000 ${
              showButton
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <button className="bg-blue-600 text-white text-sm sm:text-base px-4 py-1 sm:px-5 sm:py-2 rounded-full border-2 border-white hover:bg-blue-700 transition-colors flex items-center">
              Swap now
              <span className="ml-2 bg-white rounded-full p-1">
                <ArrowRight size={16} className="text-blue-600" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
