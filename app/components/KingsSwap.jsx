import Image from "next/image";
import Img1 from '../assets/curve-1.svg';
import Img2 from '../assets/curve-2.svg';

const KingsSwap = () => {
  return (
    <div className="relative w-full h-40 md:h-56 bg-blue-600 overflow-hidden">
      {/* First curved background */}
      <div className="absolute inset-0">
        <Image
          src={Img1}
          alt="Background curve 1"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Second curved background */}
      <div className="absolute inset-0">
        <Image
          src={Img2}
          alt="Background curve 2"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Centered text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold z-10">
          KINGS SWAP
        </h1>
      </div>
    </div>
  );
};

export default KingsSwap;
