
import React from "react";
import Image from "next/image";
import Img from '../../assets/img-5.svg'
const ConvertBanner = () => (
  <div className="relative h-[20rem]">
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
