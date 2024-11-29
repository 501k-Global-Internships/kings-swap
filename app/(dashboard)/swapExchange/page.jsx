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
import { useExchange } from "@/app/api/config";


export default function SwapExchange() {
  const router = useRouter();
  const {
    loading: apiLoading,
    error: apiError,
    banks,
    rates,
    currencies,
    fetchBanks,
    fetchRates,
    fetchCurrencies,
    resolveAccount: resolveAccountApi,
  } = useExchange();

  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});
  const [percentageCharge, setPercentageCharge] = useState(0);
  const [formData, setFormData] = useState({
    espeeAmount: "",
    accountName: "",
    accountNumber: "",
    bankId: "",
    localAmount: "",
  });

  // Initialize page data
  useEffect(() => {
    const initializePage = async () => {
      try {
        await Promise.all([fetchBanks(), fetchRates(), fetchCurrencies()]);
      } catch (err) {
        setError("Failed to initialize page data");
      }
    };

    initializePage();
  }, [fetchBanks, fetchRates, fetchCurrencies]);

  // Set initial exchange rates and currency
  useEffect(() => {
    if (rates?.exchange_rates && Object.keys(rates.exchange_rates).length > 0) {
      setExchangeRates(rates.exchange_rates);
      setPercentageCharge(rates.percentage_charge || 0);
      
      if (!selectedCurrency) {
        const defaultCurrency = Object.keys(rates.exchange_rates)[0];
        setSelectedCurrency(defaultCurrency);
      }
    }
  }, [rates]);

  // Timer effect
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

  const calculateLocalAmount = (espeeAmount, currency) => {
    if (!exchangeRates || !exchangeRates[currency] || !espeeAmount) return "";
    
    const rate = exchangeRates[currency];
    const amount = parseFloat(espeeAmount) * rate;
    const chargeAmount = amount * (percentageCharge / 100);
    const finalAmount = amount - chargeAmount;
    
    return finalAmount.toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "espeeAmount") {
      if (value && (!isFinite(value) || value <= 0)) {
        setError("Please enter a valid positive amount");
        return;
      }

      const localAmount = calculateLocalAmount(value, selectedCurrency);
      setFormData((prev) => ({
        ...prev,
        espeeAmount: value,
        localAmount,
      }));
      setError("");
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setShowDropdown(false);

    const localAmount = calculateLocalAmount(formData.espeeAmount, currency);
    setFormData((prev) => ({
      ...prev,
      localAmount,
    }));
  };

  const handleBack = () => {
    if (step === 1) {
      router.push("/dashboard");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleCancel = () => {
    setFormData({
      espeeAmount: "",
      accountName: "",
      accountNumber: "",
      bankId: "",
      localAmount: "",
    });
    setStep(1);
  };

  const handleNewTransaction = () => {
    setFormData({
      espeeAmount: "",
      accountName: "",
      accountNumber: "",
      bankId: "",
      localAmount: "",
    });
    setTimeLeft(30);
    setStep(1);
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  const handleAccountNumberBlur = async () => {
    if (formData.bankId && formData.accountNumber.length === 10) {
      try {
        const data = await resolveAccountApi(
          formData.bankId,
          formData.accountNumber
        );
        setFormData((prev) => ({
          ...prev,
          accountName: data.account_name,
        }));
        setError("");
      } catch (err) {
        setError("Failed to resolve account");
      }
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.espeeAmount || parseFloat(formData.espeeAmount) <= 0) {
        setError("Please enter a valid ESPEE amount");
        return false;
      }
      if (!formData.localAmount || parseFloat(formData.localAmount) <= 0) {
        setError("Invalid conversion amount");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.accountNumber || formData.accountNumber.length !== 10) {
        setError("Please enter a valid 10-digit account number");
        return false;
      }
      if (!formData.bankId) {
        setError("Please select a bank");
        return false;
      }
      if (!formData.accountName) {
        setError("Account name is required");
        return false;
      }
    }

    return true;
  };

  const handleContinue = () => {
    if (!validateStep()) {
      return;
    }

    setError("");
    setStep((prev) => prev + 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
            <h2 className="text-[1.4rem] mb-4 text-[#434343] font-bold">
              Enter amount of ESPEE to exchange
            </h2>
            {error && (
              <p className="text-red-500 mb-4 text-sm bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Enter amount</p>
                <div className="relative">
                  <input
                    type="number"
                    name="espeeAmount"
                    value={formData.espeeAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full p-3 pr-16 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    Espee
                  </div>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={formData.localAmount}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-full px-4 flex items-center bg-gray-700 text-white rounded-r"
                  >
                    {selectedCurrency} <ChevronDown className="ml-2" />
                  </button>
                </div>

                {showDropdown && currencies && currencies.length > 0 && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr.code)}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                      >
                        <span>{curr.code}</span>
                        <span className="text-sm text-gray-500">
                          {curr.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedCurrency && exchangeRates[selectedCurrency] && (
                <p className="text-sm text-gray-600">
                  Current rate: 1 ESPEE = {exchangeRates[selectedCurrency]}{" "}
                  {selectedCurrency}
                  {percentageCharge > 0 && (
                    <span className="ml-2">
                      (Service charge: {percentageCharge}%)
                    </span>
                  )}
                </p>
              )}
            </div>

            <button
              onClick={handleContinue}
              disabled={
                apiLoading || !formData.espeeAmount || !formData.localAmount
              }
              className={`w-full p-3 rounded mt-6 transition-colors ${
                apiLoading || !formData.espeeAmount || !formData.localAmount
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#2467E3] text-white hover:bg-[#1e51b3]"
              }`}
            >
              {apiLoading ? "Loading..." : "Continue"}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="shadow-sm max-w-md mx-auto">
            <div className="bg-white rounded-lg border mb-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-[#434343] whitespace-nowrap">
                  Total amount payable in Espees:{" "}
                  <span className="font-semibold">
                    {formData.espeeAmount} Espee(s)
                  </span>
                </p>
                <p className="text-sm text-[#434343] mt-2 whitespace-nowrap">
                  Amount to receive in {selectedCurrency}:{" "}
                  <span className="font-semibold">
                    {formData.localAmount} {selectedCurrency}
                  </span>
                </p>
              </div>
            </div>

            <div className="py-3 px-3 bg-white rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">
                Enter your Receiving account
              </h2>
              {error && (
                <p className="text-red-500 mb-4 text-sm bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}

              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Account number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    onBlur={handleAccountNumberBlur}
                    placeholder="Enter your account number"
                    maxLength={10}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ABB5FF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Bank
                  </label>
                  <div className="relative">
                    <select
                      name="bankId"
                      value={formData.bankId}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#ABB5FF] focus:border-transparent"
                    >
                      <option value="">Select Bank</option>
                      {banks &&
                        banks.map((bank) => (
                          <option key={bank.id} value={bank.id}>
                            {bank.name}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Account name
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    readOnly
                    placeholder="Account name will appear here"
                    className="w-full p-3 border border-gray-300 rounded bg-gray-50"
                  />
                </div>
              </form>

              <button
                onClick={handleContinue}
                disabled={
                  apiLoading ||
                  !formData.accountName ||
                  !formData.accountNumber ||
                  !formData.bankId
                }
                className={`w-full p-3 rounded mt-6 transition-colors ${
                  apiLoading ||
                  !formData.accountName ||
                  !formData.accountNumber ||
                  !formData.bankId
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#2467E3] text-white hover:bg-[#1e51b3]"
                }`}
              >
                {apiLoading ? "Validating..." : "Continue"}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="font-medium mb-2">
                YOU WILL RECEIVE {formData.localAmount} {selectedCurrency}
              </p>
              <p className="mb-4">TRANSFER {formData.espeeAmount} ESPEES TO</p>
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
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "0xd3349300fafe5e9aee8e80c2f8f69823744ba6ed"
                    );
                  }}
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
                You have <span className="text-orange-500">{timeLeft}sec</span>{" "}
                to complete transaction
              </p>
            </div>
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
          <div className=" text-center max-w-md mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-medium mb-4">
                Your espeses transaction is processing
              </h2>
              <Image
                src={Coin}
                width={120}
                height={120}
                alt="Espee Coin"
                className="mx-auto mb-4"
              />
              <p className="mb-6">You have been credited ₦50,000</p>
            </div>
            <button
              className="w-full bg-gray-800 text-white p-3 rounded-2xl mt-6 mb-3"
              onClick={goToDashboard}
            >
              go to Dashboard
            </button>
            <button
              onClick={handleNewTransaction}
              className="w-full border border-gray-300 p-3 rounded-2xl"
            >
              make another transaction
            </button>
            <div className="flex items-center justify-center mt-6 text-sm text-gray-600">
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
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
