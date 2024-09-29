import React from "react";
import Image from "next/image";
import Img from "../assets/coin2.svg";
import Img2 from "../assets/vector-img.svg"
import Img3 from "../assets/kings-chat.svg"
import bgImg from "../assets/sea-bg.svg"
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left section */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImg.src})` }}
      >
        <div className="flex flex-col items-center justify-center h-full text-white relative z-10">
          <Image
            src={Img}
            alt="Coin"
            width={128}
            height={128}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Swap Espees quicker!</h2>
          <p className="text-center">
            One account to keep and exchange your espees
          </p>
          <div className="mt-8 flex items-center">
            <Image src={Img2} alt="Kings Swap" width={32} height={32} />
            <span className="ml-2">Kings Swap</span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div
        className="w-full md:w-1/2 bg-white p-8"
        style={{
          backgroundImage: `url(${bgImg})`,
        }}
      >
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6">Login your account</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your email address"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Image
                    src="/eye-icon.svg"
                    alt="Show password"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link href="/signUp" className="text-blue-500">
              Sign up
            </Link>
          </p>
          <div className="mt-6">
            <p className="text-center mb-2">Or Login with</p>
            <button className="w-full  py-2 flex items-center justify-center">
              <Image
                src={Img3}
                alt="KingsChat"
                width={240}
                height={240}
                className="mr-2"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
