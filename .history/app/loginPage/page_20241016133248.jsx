import React from "react";
import Image from "next/image";
import Img from "../assets/coin2.svg";
import Img2 from "../assets/vector-img.svg";
import Img3 from "../assets/kings-chat.svg";
import bgImg from "../assets/sea-bg.svg";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left section */}
      <div
        className="w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImg.src})` }}
      >
        <div className="flex flex-col items-center justify-center h-full text-white relative z-10 p-8">
          <Image
            src={Img}
            alt="Coin"
            width={200}
            height={200}
            className="mb-8"
          />
          <h2 className="text-3xl font-bold mb-2">Swap Espees quicker!</h2>
          <p className="text-center text-lg mb-12">
            One account to keep and
            <br />
            exchange your espees
          </p>
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
            <Image src={Img2} alt="Kings Swap" width={24} height={24} />
            <span className="ml-2 text-sm">KINGS SWAP</span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8 mb-4">
            <h2 className="text-2xl font-bold mb-6">Login your account</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter your email address"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 5H3C2.44772 5 2 5.44772 2 6V14C2 14.5523 2.44772 15 3 15H17C17.5523 15 18 14.5523 18 14V6C18 5.44772 17.5523 5 17 5Z"
                        stroke="#718096"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 6L10 11L18 6"
                        stroke="#718096"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm">
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.5 10C2.5 10 5 4.16667 10 4.16667C15 4.16667 17.5 10 17.5 10C17.5 10 15 15.8333 10 15.8333C5 15.8333 2.5 10 2.5 10Z"
                        stroke="#718096"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 12.0833C11.1506 12.0833 12.0833 11.1506 12.0833 10C12.0833 8.84943 11.1506 7.91667 10 7.91667C8.84943 7.91667 7.91667 8.84943 7.91667 10C7.91667 11.1506 8.84943 12.0833 10 12.0833Z"
                        stroke="#718096"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <Link
                href="/forgot-password"
                className="text-blue-500 text-sm mb-4 block"
              >
                Forgot password
              </Link>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded font-semibold"
              >
                Login
              </button>
            </form>
          </div>

          <p className="text-center mb-4">
            Don't an account?{" "}
            <Link href="/signUp" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </p>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-center mb-2 text-sm text-gray-600">
              Or Login with
            </p>
            <Link
              href="/kingsChat"
              className="w-full py-2 flex items-center justify-center "
            >
              <Image src={Img3} alt="KingsChat" width={210} height={200} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
