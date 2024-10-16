import Image from "next/image";
import Img1 from "../assets/img-1.svg";
import Img2 from "../assets/img-2.svg";
import Img3 from "../assets/life-got-better.svg";
import Img4 from "../assets/img-4.svg";
import Img5 from "../assets/img-5.svg";

const GridImages = () => {
  return (
    <div className="container mx-auto p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[3.5rem] py-[3rem]">
        {/* First row */}
        <div className="md:col-span-2 relative rounded-[3rem] overflow-hidden">
          <Image
            src={Img1}
            alt="Swap & Spend"
            layout="responsive"
            width={200}
            height={200}
            objectFit="cover"
          />
        </div>
        <div className="relative rounded-[3rem] overflow-hidden h-100">
          {" "}
          {/* Added fixed height */}
          <Image
            src={Img2}
            alt="Happy customer"
            layout="fill" // Changed to fill
            objectFit="cover"
          />
        </div>

        {/* Second row */}
        <div className="md:col-span-3 overflow-hidden relative">
          <Image
            src={Img3}
            alt="Business person"
            layout="responsive"
            width={300}
            height={300}
            objectFit="cover"
          />
          <div className="absolute inset-[15rem] flex flex-col justify-center p-6">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full w-max">
              Get started
            </button>
          </div>
        </div>

        {/* Third row */}
        <div className="relative rounded-[3rem] overflow-hidden h-100">
          {" "}
          {/* Added fixed height */}
          <Image
            src={Img4}
            alt="Kings Swap app"
            layout="fill" // Changed to fill
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
        </div>
      </div>
    </div>
  );
};

export default GridImages;
