"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Img1 from "../../assets/pic_picked.svg";
import Img2 from "../../assets/coin2.svg";
import Img3 from "../../assets/signup-img2.svg";
import Logo from "../../assets/vector-img.svg";
import './imageSlider.css'

const images = [Img1, Img2, Img3];

const ImageSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const imageRef = useRef(null); // Ref for the image to apply the bounce animation

  useEffect(() => {
    // Reset progress and start incrementing
    if (progressRef.current) {
      progressRef.current.style.width = "0%";
      void progressRef.current.offsetWidth; // Trigger reflow to reset transition
      progressRef.current.style.transition = "width 5s linear";
      progressRef.current.style.width = "100%";
    }

    // Apply bounce animation to the image
    if (imageRef.current) {
      imageRef.current.classList.add("bounce");
      setTimeout(() => {
        imageRef.current.classList.remove("bounce");
      }, 1000); // Remove the animation class after 1 second (animation duration)
    }

    // Timer to change the slide every 5 seconds
    const timer = setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0); // Reset progress when moving to the next slide
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer
  }, [currentImageIndex]);

  return (
    <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-between items-center relative h-screen">
      {/* Progress indicators */}
      <div className="w-full flex justify-center space-x-2 mb-8">
        {images.map((_, index) => (
          <div
            key={index}
            className="w-[8rem] h-1 bg-[#D9D9D9] rounded-full relative overflow-hidden"
          >
            <div
              ref={index === currentImageIndex ? progressRef : null} // Apply ref to the active progress bar
              className="absolute top-0 left-0 h-full bg-blue-500"
              style={{
                width: index === currentImageIndex ? "100%" : "0%", // Animate current progress bar
                transition:
                  index === currentImageIndex ? "width 5s linear" : "none", // Animate only the active progress bar
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Image with bounce animation */}
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="relative w-64 h-64 mb-8">
          <Image
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            layout="fill"
            objectFit="contain"
            className="bounce" // Add bounce class for animation
            ref={imageRef}
          />
        </div>
        <h1 className="text-3xl text-[#14172A] font-bold mb-2">
          Swap Espees quicker!
        </h1>
        <p className="text-center text-[#14172A]">
          One account to keep and <br /> exchange your espees
        </p>
      </div>

      {/* Footer with Logo */}
      <div className="flex items-center mt-auto">
        <Image src={Logo} alt="Logo" width={30} height={30} />
        <span className="ml-2 text-xl font-bold text-[#CFCFD0]">
          kings swap
        </span>
      </div>
    </div>
  );
};

export default ImageSlider;
