import Image from "next/image";
import Coin from '../assets/coin.svg'

const Swap = () => {
  return (
    <div className="bg-white text-blue-600 p-4 md:p-8">
      <div className="flex justify-center space-x-8 mb-8">
        <span>Recieve</span>
        <span className="text-blue-600 text-4xl">•</span>
        <span>Swap</span>
        <span className="text-blue-600 text-4xl">•</span>
        <span>Repeat</span>
      </div>

      <div className="bg-blue-600 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <Image
            src={Coin}
            alt="Coin"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>

        <div className="md:w-2/3 text-white">
          <p className="text-sm mb-2">SWAP TO LOCAL CURRENCY</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">100%</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Successful swaps
          </h3>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Enjoy Convenience
          </h3>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Swap without Limits.
          </h3>
          <p className="mb-4">Espees swap now, swift than ever before</p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-full flex items-center">
            Swap now
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
