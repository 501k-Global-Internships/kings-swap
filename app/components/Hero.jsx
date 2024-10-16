import Image from "next/image";
import Img from "../assets/Frame-animi.svg";
import bgImg from "../assets/bgImg.svg";
import Navbar from "./Navbar";

const Hero = () => {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat rounded-b-[5rem] min-h-screen"
      style={{
        backgroundImage: `url(${bgImg.src})`,
      }}
    >
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-white mb-12 md:mb-0">
            <h2 className="text-lg md:text-xl mb-4">
              <span className="font-normal">SWAP YOUR </span>
              <span className="font-medium">ESPEES</span>
              <span className="font-normal"> LIKE THE </span>
              <span className="font-medium">KING</span>
              <span className="font-normal"> YOU ARE</span>
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Enjoy one Free swap weekly. Swap Now.
            </h1>
            <p className="mb-8 text-lg opacity-90">
              Receive, send, exchange, and manage multiple currencies in one
              app.
            </p>
            <button className="text-[#ffff] px-8 py-3 rounded-[1rem] border-[.1rem] border-[#ffff] font-bold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Click To Swap
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <Image
              src={Img}
              alt="Currency symbols"
              width={500}
              height={500}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
