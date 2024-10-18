"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Copy from "../../assets/copy.svg";
import Coin from "../../assets/coin2.svg";
import Close from "../../assets/close-circle.svg";
import Info from "../../assets/info-circle.svg";
import SwapBg from "../../assets/swapbg.svg";
import Logo from "../../assets/logo2.svg";

export default function CurrencyExchange() {
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currency, setCurrency] = useState("Naira");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const currencies = ["Naira", "Pounds", "Dollar"];

  useEffect(() => {
    let timer;
    if (step === 3 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStep(4);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleContinue = () => {
    setStep((prev) => prev + 1);
  };

  const handleCancel = () => {
    setStep(1);
    setTimeLeft(20);
  };

  const handleNewTransaction = () => {
    setStep(1);
    setTimeLeft(10);
  };

  const handleBack = () => {
    if (step === 1) {
      router.push("/dashboard");
    } else if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
            <h2 className="text-[1.4rem] mb-4 text-[#434343] font-bold">
              Enter amount of ESPEE to exchange
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Enter amount</p>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="10.05"
                    className="w-full p-3 pr-16 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    Espee
                  </div>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  defaultValue="16500.0"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-full px-4 flex items-center bg-gray-700 text-white rounded-r"
                  >
                    {currency} <ChevronDown className="ml-2" />
                  </button>
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-1 w-32 bg-gray-700 text-[#FFFFFF] border rounded shadow-lg z-10">
                    {currencies.map((curr) => (
                      <div
                        key={curr}
                        onClick={() => {
                          setCurrency(curr);
                          setShowDropdown(false);
                        }}
                        className="p-2 hover:bg-[#636161] cursor-pointer"
                      >
                        {curr}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600">
                Trading fee (<span style={{ color: "#F63D3D" }}>0.05%</span>)
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-[#2467E3] text-[#FFFFFF] p-3 rounded mt-6"
            >
              continue
            </button>
          </div>
        );
      case 2:
        return (
          <div className="bg-white rounded-lg border py-2 px-3 shadow-sm max-w-md mx-auto">
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-[#434343] whitespace-nowrap">
                Total amount payable in Espees:{" "}
                <span className="font-semibold">10.5 Espee(s)</span>
              </p>
              <p className="text-sm text-[#434343] mt-2 whitespace-nowrap">
                Amount to receive in Naira:{" "}
                <span className="font-semibold">₦16500.0</span>
              </p>
            </div>

            <h2 className="text-xl font-semibold mb-4">
              Enter your Receiving account
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Account name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name as Displayed on your account"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ABB5FF] focus:border-transparent text-[#909CC6] placeholder-[#909CC6]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Account number
                </label>
                <input
                  type="text"
                  placeholder="Enter your account number"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ABB5FF] focus:border-transparent text-[#909CC6] placeholder-[#909CC6]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Bank</label>
                <div className="relative">
                  <select className="w-full p-3 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#ABB5FF] focus:border-transparent text-[#909CC6]">
                    <option>select Bank</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </form>

            <button
              onClick={handleContinue}
              className="w-full bg-[#C8C8C8] text-[#909CC6] p-3 rounded mt-6 focus:outline-none focus:ring-2 focus:ring-[#EAEAEA]"
            >
              continue
            </button>
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center max-w-md mx-auto">
            <p className="font-medium mb-2">YOU WILL RECEIVE ₦50,000</p>
            <p className="mb-4">TRANSFER 50.00 ESPEES TO</p>
            <div className="flex items-center justify-center mb-4">
              <p className="text-orange-500 mr-2 break-all">
                0xd3349300fafe5e9aee8e80c2f8f69823744ba6ed
              </p>
              <Image
                src={Copy}
                width={20}
                height={20}
                alt="Copy"
                className="cursor-pointer"
              />
            </div>
            <Image
              src={Coin}
              width={120}
              height={120}
              alt="Espee Coin"
              className="mx-auto mb-4"
            />
            <p>
              You have <span className="text-orange-500">{timeLeft}sec</span> to
              complete transaction
            </p>
            <button
              onClick={handleCancel}
              className="w-full bg-red-500 text-white p-3 rounded mt-6 flex items-center justify-center"
            >
              Cancel transaction{" "}
              <Image
                src={Close}
                width={20}
                height={20}
                alt="Cancel"
                className="ml-2"
              />
            </button>
          </div>
        );
      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center max-w-md mx-auto">
            <h2 className="font-medium mb-4">
              Espees successfully received and converted
            </h2>
            <Image
              src={Coin}
              width={120}
              height={120}
              alt="Espee Coin"
              className="mx-auto mb-4"
            />
            <p className="mb-6">You have been credited ₦50,000</p>
            <button
              className="w-full bg-gray-800 text-white p-3 rounded mb-3"
              onClick={goToDashboard}
            >
              go to Dashboard
            </button>
            <button
              onClick={handleNewTransaction}
              className="w-full border border-gray-300 p-3 rounded"
            >
              make another transaction
            </button>
            <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
              <Image
                src={Info}
                width={16}
                height={16}
                alt="Info"
                className="mr-2"
              />
              <p>
                on cases of transaction issues please contact us via our email
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="relative w-full md:w-1/2">
        <Image
          src={SwapBg}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
      </div>

      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-md mb-12">
          <Image
            src={Logo}
            alt="Kings Swap Logo"
            width={120}
            height={40}
            className="mb-4  ml-[6rem]"
          />
          <div
            className="flex items-center cursor-pointer pt-[3rem]"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2" />
            <span>{step === 1 ? "Home" : "Back"}</span>
          </div>
        </div>

        <div className="w-full">{renderStepContent()}</div>
      </div>
    </div>
  );
}
