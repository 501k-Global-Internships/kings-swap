import Image from "next/image";
import Img1 from '../assets/img-1.svg'
import Img2 from '../assets/img-2.svg'
import Img3 from "../assets/img-3.svg";
import Img4 from "../assets/img-4.svg";
import Img5 from "../assets/img-5.svg";

const GridImages = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First row */}
        <div className="md:col-span-2 relative rounded-xl overflow-hidden">
          <Image
            src={Img1}
            alt="Swap & Spend"
            layout="responsive"
            width={200}
            height={200}
            objectFit="cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-3xl font-bold text-center">
              Swap & Spend effortlessly
            </h2>
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src={Img2}
            alt="Happy customer"
            layout="responsive"
            width={80}
            height={80}
            objectFit="cover"
          />
        </div>

        {/* Second row */}
        <div className="md:col-span-3 bg-blue-600 rounded-xl overflow-hidden relative">
          <Image
            src={Img3}
            alt="Business person"
            layout="responsive"
            width={300}
            height={300}
            objectFit="cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-6">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
              Life got better!
            </h2>
            <p className="text-white mb-4">Get your Espees changed now!</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full w-max">
              Get started
            </button>
          </div>
        </div>

        {/* Third row */}
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src={Img4}
            alt="Kings Swap app"
            layout="responsive"
            width={100}
            height={100}
            objectFit="cover"
          />
        </div>
        <div className="md:col-span-2 rounded-xl overflow-hidden relative">
          <Image
            src={Img5}
            alt="Coins"
            layout="responsive"
            width={700}
            height={300}
            objectFit="cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-6">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
              Convert money at the best rate
            </h2>
            <p className="text-white">
              Effortlessly exchange your naira currency to Espees at the best
              rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridImages;
