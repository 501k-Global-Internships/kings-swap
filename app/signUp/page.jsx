"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Img from "../assets/centered-vector.svg";
import Img1 from "../assets/signup-img.svg";
import Img2 from "../assets/coin2.svg";
import Img3 from "../assets/signup-img2.svg";
import Logo from "../assets/vector-img.svg";

const images = [Img1, Img2, Img3];
const texts = ["Swap Espees quicker!", "Secure Transactions", "Easy to Use"];

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "Brazil",
  "India",
  "China",
  "Nigeria",
  "South Africa",
  "Mexico",
  "Argentina",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Russia",
  "Ukraine",
  "Poland",
  "Turkey",
  "Egypt",
  "Saudi Arabia",
  "UAE",
  "Israel",
  "South Korea",
  "Indonesia",
  "Malaysia",
  "Singapore",
  "Thailand",
  "Vietnam",
  "Philippines",
  "New Zealand",
];

const ImageSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col justify-center items-center relative">
      <div className="absolute inset-0 flex justify-center items-center">
        <Image
          src={Img}
          alt="Centered vector"
          width={200}
          height={200}
        />
      </div>
      <div className="relative z-10 text-center mb-8">
        <div className="overflow-hidden w-64 h-64 mx-auto mb-4">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Slide ${index + 1}`}
                width={256}
                height={256}
                className="flex-shrink-0"
              />
            ))}
          </div>
        </div>
        <h1 className="text-3xl font-bold mt-4">{texts[currentImageIndex]}</h1>
        <p className="mt-2">One account to keep and exchange your espees</p>
      </div>
      <div className="flex items-center mt-auto">
        <Image src={Logo} alt="Logo" width={50} height={50} />
        <span className="ml-2 text-lg font-semibold">kings swap</span>
      </div>
    </div>
  );
};

const Step1Form = ({ onNext }) => {
  const [country, setCountry] = useState("");

  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">
        What country do you live in?
      </h2>
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select country</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        onClick={onNext}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        Continue
      </button>
    </div>
  );
};

const Step2Form = ({ onNext }) => {
  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Setup your account</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            type="text"
            placeholder="Enter your real name"
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Other name
          </label>
          <input
            type="text"
            placeholder="Enter your middle name"
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Last name (surname)
        </label>
        <input
          type="text"
          placeholder="Enter your real name"
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select className="mt-1 block w-full border rounded-md shadow-sm p-2">
            <option>Select your gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of birth
          </label>
          <input
            type="date"
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          placeholder="Enter your email address"
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Phone number
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-gray-50 text-gray-500 text-sm">
            +1234
          </span>
          <input
            type="tel"
            placeholder="Enter your Phone number"
            className="flex-1 block w-full rounded-none rounded-r-md border p-2"
          />
        </div>
      </div>
      <button
        onClick={onNext}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors mt-6"
      >
        Continue
      </button>
    </div>
  );
};

const Step3Form = ({ onNext }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add password validation logic here
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-8 w-full max-w-md"
    >
      <h2 className="text-2xl font-semibold mb-4">Create password</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border rounded-md shadow-sm p-2 pr-10"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            👁️
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          must include : Lower case, upper case , number , at least 8 characters
        </p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Confirm password
        </label>
        <div className="mt-1 relative">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border rounded-md shadow-sm p-2 pr-10"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            👁️
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={acceptNewsletter}
            onChange={(e) => setAcceptNewsletter(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">
            I accept to receive newsletters and product updates and offers via
            email
          </span>
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">
            I accept the{" "}
            <Link href="/" className="text-blue-500">
              terms of use
            </Link>{" "}
            and{" "}
            <Link href="/" className="text-blue-500">
              condition of use
            </Link>
          </span>
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        Continue
      </button>
    </form>
  );
};

const Step4Form = ({ onVerify, onResendCode }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Verify your address</h2>
      <p className="mb-4">
        Please enter the OTP sent to the email address you provided
      </p>
      <div className="flex justify-between mb-4">
        {otp.map((data, index) => {
          return (
            <input
              className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl border-gray-400 focus:border-blue-500 focus:ring-blue-500"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          );
        })}
      </div>
      <p className="text-center mb-4">
        <span className="text-gray-600">Didn't receive OTP?</span>{" "}
        <button
          onClick={onResendCode}
          className="text-blue-500 hover:underline"
        >
          Resend code
        </button>
      </p>
      <button
        onClick={onVerify}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        Verify your account
      </button>
    </div>
  );
};

const SuccessMessage = ({ onGoToLogin }) => {
  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
      <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
        Password changed successfully!
      </div>
      <Link
        // onClick={onGoToLogin}
        href='/loginPage'
        className="w-full bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors"
      >
        Go to Login
      </Link>
    </div>
  );
};

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const handleVerify = () => {
    // Add verification logic here
    setVerificationComplete(true);
  };

  const handleResendCode = () => {
    // Add resend code logic here
    console.log("Resending code...");
  };

  const handleGoToLogin = () => {
    // Add navigation to login page logic here
    console.log("Navigating to login page...");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <ImageSlider />
      <div
        className="w-full md:w-1/2 bg-cover bg-center flex flex-col justify-center items-center p-8"
        style={{ backgroundImage: 'url("/vector-img.svg")' }}
      >
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((num) => (
              <React.Fragment key={num}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    step >= num ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`h-1 w-16 mx-2 ${
                      step > num ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {step === 1 && <Step1Form onNext={() => setStep(2)} />}
        {step === 2 && <Step2Form onNext={() => setStep(3)} />}
        {step === 3 && <Step3Form onNext={() => setStep(4)} />}
        {step === 4 && !verificationComplete && (
          <Step4Form onVerify={handleVerify} onResendCode={handleResendCode} />
        )}
        {step === 4 && verificationComplete && (
          <SuccessMessage onGoToLogin={handleGoToLogin} />
        )}
        {step < 4 && (
          <p className="mt-4 text-sm">
            Have an account?{" "}
            <Link href="/loginPage" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
