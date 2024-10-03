import React from "react";
import Image from "next/image";
import Insta from "../assets/instagram.svg";
import Youtube from "../assets/youtube.svg";
import X from "../assets/x.svg";

const Footer = () => {
  return (
    <footer className="bg-[#1B5ED0] text-white  py-[4rem] px-4 md:px-8">
      <div className="max-w-[67rem] mx-auto container grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
        <div>
          <h2 className="text-lg font-bold mb-3">CONTACT US</h2>
          <div className="flex space-x-3">
            <Image src={Insta} alt="instagram" width={24} height={24} />
            <Image src={Youtube} alt="youtube" width={24} height={24} />
            <Image src={X} alt="twitter" width={24} height={24} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-3">COMPANY</h2>
          <ul className="space-y-1">
            <li>About Us</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Press</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-3">LEGAL</h2>
          <ul className="space-y-1">
            <li>Privacy policy</li>
            <li>Terms of service</li>
            <li>Acceptable use policy</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-3">SUPPORT</h2>
          <ul className="space-y-1">
            <li>Help Center</li>
            <li>Video Tutorials</li>
            <li>FAQ</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
