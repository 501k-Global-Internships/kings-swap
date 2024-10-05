
import React from "react";
import Image from "next/image";
import Img from '../../assets/swapIcon.svg'

const SwapCard = () => (
  <div className="bg-white rounded-[] p-6 shadow-sm">
    <p className="text-sm text-gray-600 mb-2">
      ENTER AMOUNT OF ESPEES YOU WANT TO SWAP
    </p>
    <div className="text-5xl font-bold mb-2">50.00</div>
    <p className="text-sm text-gray-600 mb-4">
      YOU WILL RECEIVE <span className="text-green-500">₦50,000</span>
    </p>
    <button className="w-full bg-red-500 text-white py-3 rounded-lg flex justify-center items-center space-x-2">
      <span>Swap</span>
      <Image src={Img} alt="Swap" width={20} height={20} />
    </button>
  </div>
);

export default SwapCard;
