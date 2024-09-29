import Image from "next/image";
import Img from '../assets/first-group.svg'

const Hero = () => {
  return (
    <main className="flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h2 className="text-xl mb-4">SWAP YOUR ESPEES LIKE THE KING YOU ARE</h2>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Enjoy one Free swap weekly. Swap Now.
        </h1>
        <p className="mb-6">
          Receive, send, exchange, and manage multiple currencies in one app.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold">
          Click To Swap
        </button>
      </div>
      <div className="md:w-1/2 relative">
        <Image
          src={Img}
          alt="Currency symbols"
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>
    </main>
  );
};

export default Hero;
