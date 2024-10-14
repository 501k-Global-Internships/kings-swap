
import React from "react";
import Image from "next/image";
import Img from '../../assets/convert-money.svg'
const ConvertBanner = () => (
  <div className="relative h-[17rem]">
    <Image
      src={Img}
      alt="Convert money"
      layout="fill"
      objectFit="cover"
      className="rounded-[2rem]"
    />
  </div>
);

export default ConvertBanner;
