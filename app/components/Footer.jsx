import React from "react";
import Insta from '../assets/instagram.svg'
import Youtube from '../assets/youtube.svg';
import X from '../assets/x.svg';
import Image from "next/image";


const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white p-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-4">CONTACT US</h2>
          <div className="flex space-x-4">
            <Image src={Insta} alt="instagram" width={24} height={24} />
            <Image src={Youtube} alt="youtube" width={24} height={24} />
            <Image src={X} alt="twitter" width={24} height={24} />
          </div>
        </div>

        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-4">COMPANY</h2>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Press</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-4">LEGAL</h2>
          <ul className="space-y-2">
            <li>Privacy policy</li>
            <li>Terms of service</li>
            <li>Acceptable use policy</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">SUPPORT</h2>
          <ul className="space-y-2">
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
