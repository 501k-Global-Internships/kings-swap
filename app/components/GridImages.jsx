import Image from "next/image";
import Img1 from "../assets/img-1.svg";
import Img2 from "../assets/img-2.svg";
import Img3 from "../assets/life-got-better.svg";
import Img4 from "../assets/img-4.svg";
import Img5 from "../assets/img-5.svg";
import mobile1 from "../assets/mobile1.png";
import mobile2 from "../assets/mobile2.png";

const GridImages = () => {
  return (
    <div className="container mx-auto p-4 md:p-14 lg:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-[2rem] lg:gap-[3.5rem] py-4 md:py-[4rem] lg:py-[3rem]">
        <div className="md:col-span-2 relative rounded-[1.5rem] md:rounded-[4rem] lg:rounded-[3rem] overflow-hidden w-full">
          <div className="md:hidden w-full">
            <Image
              src={mobile1}
              alt="Swap & Spend"
              layout="responsive"
              width={200}
              height={120}
              objectFit="cover"
              className="w-full"
            />
          </div>
          <div className="hidden md:block">
            <Image
              src={Img1}
              alt="Swap & Spend"
              layout="responsive"
              width={200}
              height={180} 
              className="md:scale-[60rem] lg:scale-100"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="relative rounded-[1.5rem] md:rounded-[4rem] lg:rounded-[3rem] overflow-hidden h-100 w-full">
          <Image
            src={Img2}
            alt="Happy customer"
            layout="fill"
            objectFit="cover"
            className="scale-125 md:scale-115 lg:scale-100 w-full"
          />
        </div>

        <div className="md:col-span-3 overflow-hidden relative w-full">
          <div className="md:hidden w-full">
            <Image
              src={mobile2}
              alt="Business person"
              layout="responsive"
              width={300}
              height={180}
              objectFit="cover"
              className="w-full"
            />
          </div>
          <div className="hidden md:block">
            <Image
              src={Img3}
              alt="Business person"
              layout="responsive"
              width={300}
              height={320} 
              className="md:scale-110 lg:scale-100"
              objectFit="cover"
            />
          </div>
          <div className="absolute inset-[15rem] hidden md:flex flex-col justify-center p-6">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full w-max">
              Get started
            </button>
          </div>
        </div>

        <div className="relative rounded-[1.5rem] md:rounded-[4rem] lg:rounded-[3rem] overflow-hidden h-100 w-full">
          <Image
            src={Img4}
            alt="Kings Swap app"
            layout="fill"
            objectFit="cover"
            className="scale-125 md:scale-115 lg:scale-100 w-full"
          />
        </div>
        <div className="md:col-span-2 rounded-[1.5rem] md:rounded-xl overflow-hidden relative w-full">
          <div className="md:hidden w-full">
            <Image
              src={Img5}
              alt="Coins"
              layout="responsive"
              width={700}
              height={240}
              objectFit="cover"
              className="w-full"
            />
          </div>
          <div className="hidden md:block">
            <Image
              src={Img5}
              alt="Coins"
              layout="responsive"
              width={700}
              height={320}
              className="md:scale-110 lg:scale-100"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridImages;
