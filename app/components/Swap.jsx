"use client";
import { useEffect, useState } from "react";

const Swap = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 8000);

    const timer = setTimeout(() => setShowButton(true), 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-white text-blue-600 p-4 md:p-8">
      {/* Animation section with responsive spacing */}
      <div className="flex justify-center items-center py-10 mb-8 relative overflow-hidden">
        <div className="relative w-full max-w-md flex justify-center items-center">
          <div
            className={`flex items-center transition-all duration-1000 ease-in-out absolute left-0
              ${
                isAnimating
                  ? "opacity-0 -translate-x-full scale-x-150"
                  : "opacity-100 translate-x-0 scale-x-100"
              }`}
          >
            <span className="text-sm sm:text-lg md:text-xl font-bold whitespace-nowrap">
              Receive
            </span>
            <span
              className="text-blue-600 text-4xl sm:text-5xl md:text-6xl leading-none mr-6 sm:mr-[7rem] md:mr-24 lg:mr-48 ml-2 sm:ml-[2rem] md:ml-8 lg:ml-14"
              style={{ marginTop: "-5px" }}
            >
              •
            </span>
          </div>
          <span className="text-sm sm:text-lg md:text-xl font-bold z-10">
            Swap
          </span>
          <div
            className={`flex items-center transition-all duration-1000 ease-in-out absolute right-0
              ${
                isAnimating
                  ? "opacity-0 translate-x-full scale-x-150"
                  : "opacity-100 translate-x-0 scale-x-100"
              }`}
          >
            <span
              className="text-blue-600 text-4xl sm:text-5xl md:text-6xl leading-none ml-6 sm:ml-12 md:ml-24 lg:ml-48 mr-2 sm:mr-4 md:mr-8 lg:mr-14"
              style={{ marginTop: "-5px" }}
            >
              •
            </span>
            <span className="text-sm sm:text-lg md:text-xl font-bold whitespace-nowrap">
              Repeat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
