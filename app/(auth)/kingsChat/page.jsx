"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Img from "@/assets/kings-call.svg";
import Img2 from "@/assets/kings-chats.svg";

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const KingsChat = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("phone");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://cabinet.kingsswap.com.ng/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: loginMethod === "email" ? formData.email : formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store the API token
        localStorage.setItem("kings_chat_token", data.api_token);

        // Redirect to dashboard or home page
        window.location.href = "/dashboard";
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-4">
          <Image src={Img2} alt="KingsChat Logo" width={150} height={40} />
        </div>
        <div className="bg-[#FFFFFF] shadow-md overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <Image
              src={Img}
              alt="Features"
              layout="responsive"
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl text-[#2F92E5] font-semibold mb-6">
              Login
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                {error}
              </div>
            )}

            <div className="mb-4">
              <div className="flex border-b">
                <button
                  className={`pb-2 px-4 ${
                    loginMethod === "phone" ? "border-b-2 border-[#2F92E5]" : ""
                  }`}
                  onClick={() => setLoginMethod("phone")}
                >
                  Phone
                </button>
                <button
                  className={`pb-2 px-4 ${
                    loginMethod === "email" ? "border-b-2 border-[#2F92E5]" : ""
                  }`}
                  onClick={() => setLoginMethod("email")}
                >
                  Username or email
                </button>
              </div>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                {loginMethod === "phone" ? (
                  <div className="flex items-center border border-[#ABB5FF] rounded-md">
                    <div className="flex items-center px-3 border-r">
                      <Image
                        src="/flags/ng.svg"
                        alt="Nigeria Flag"
                        width={20}
                        height={15}
                      />
                      <span className="ml-2">+234</span>
                      <ChevronDownIcon />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Number"
                      className="flex-grow p-2 outline-none"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    name="email"
                    placeholder="Username or email"
                    className="w-full p-2 border border-[#ABB5FF] rounded-md"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                )}
              </div>
              <div className="mb-6 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 border border-[#ABB5FF] rounded-md pr-10"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-[#2F92E5] text-white p-2 rounded-md hover:bg-blue-300 transition-colors disabled:bg-blue-200"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="text-right mt-4">
              <Link
                href="/forgot-password"
                className="text-[#2F92E5] hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="mt-6">
              <p className="text-left text-[#2F92E5]">First-time User?</p>
              <Link
                href="/signUp"
                className="block w-full mt-2 border text-center text-white bg-[#2F92E5] p-2 rounded-md hover:bg-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          By using this service, you agree to our{" "}
          <Link href="/" className="text-[#2F92E5] underline">
            terms and conditions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KingsChat;