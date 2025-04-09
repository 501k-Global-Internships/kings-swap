"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Img from "@/assets/kings-call.svg";
import Img2 from "@/assets/kings-chats.svg";
import apiService from "@config/config";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Icons
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

// Form validation schema
const loginSchema = z.object({
  loginCredential: z.string().min(1, "This field is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const KingsChat = () => {
  // Router for navigation
  const router = useRouter();

  // Form state using React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginCredential: "",
      password: "",
    },
  });

  // Component state
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesList = await apiService.attributes.getCountries();
        setCountries(countriesList);

        // Set default country (Nigeria)
        const nigeria = countriesList.find((country) => country.code === "NG");
        setSelectedCountry(nigeria || countriesList[0]);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Handle login method change
  const handleLoginMethodChange = (method) => {
    setLoginMethod(method);
    setValue("loginCredential", ""); // Clear the input field
    setError("");
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  // Format phone number (remove leading zero when country code is present)
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";

    // If the number starts with 0, remove it
    if (phoneNumber.startsWith("0")) {
      return phoneNumber.substring(1);
    }
    return phoneNumber;
  };

  // Handle form submission with fixes
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      let payload;

      // Construct the payload based on login method
      if (loginMethod === "phone") {
        const formattedPhone = formatPhoneNumber(data.loginCredential);
        // Make sure the dial code is defined and properly formatted
        const dialCode = selectedCountry?.dial_code || "";
        payload = {
          phone_number: `${dialCode}${formattedPhone}`,
          password: data.password,
        };
      } else {
        // For email/username login
        const isEmail = data.loginCredential.includes("@");
        if (isEmail) {
          payload = {
            email: data.loginCredential,
            password: data.password,
          };
        } else {
          // Using the username login method
          payload = {
            kingschat_username: data.loginCredential,
            password: data.password,
          };
        }
      }

      // Debug logging (development only)
      if (process.env.NODE_ENV !== "production") {
        console.log("Login payload:", payload);
      }

      // For testing purposes - can use this mock response
      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
        // Mock successful response for testing
        const mockResponse = {
          status: 200,
          success: true,
          data: {
            id: 12,
            first_name: "Michale",
            last_name: "Glover",
            email: "francesco.gutmann@example.com",
            phone_number: "+2348174639946",
            gender: "Male",
            kingschat_username: "nayeli.cummings",
            created_at: "2024-11-19T07:20:03.000000Z",
          },
          api_token: "4|RGzT4oV4nWyg82ma5deF2XF1tiiyWUgxDWRKr7Nw02cb6361",
        };

        // Store the mock data
        localStorage.setItem("token", mockResponse.api_token);
        localStorage.setItem("user", JSON.stringify(mockResponse.data));

        // Redirect to dashboard
        router.push("/dashboard");
        return;
      }

      // Call the API service
      const response = await apiService.auth.login(payload);

      // Handle successful login
      if (response && response.api_token) {
        // Store user data
        localStorage.setItem("token", response.api_token);
        localStorage.setItem("user", JSON.stringify(response.data));

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      // Enhanced error handling
      if (process.env.NODE_ENV !== "production") {
        console.error("Login error:", err);
      }

      if (err.status === 422) {
        // Validation error
        const fieldErrors = err.data?.error?.fields || {};
        if (fieldErrors.email) {
          setError(`Email issue: ${fieldErrors.email[0]}`);
        } else if (fieldErrors.phone_number) {
          setError(`Phone number issue: ${fieldErrors.phone_number[0]}`);
        } else if (fieldErrors.kingschat_username) {
          setError(`Username issue: ${fieldErrors.kingschat_username[0]}`);
        } else {
          setError("Please check your login details and try again.");
        }
      } else if (err.status === 401) {
        setError("Invalid credentials. Please check your username/password.");
      } else {
        setError(
          err.userFriendlyMessage ||
            err.message ||
            "An error occurred. Please try again."
        );
      }
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
                  type="button"
                  className={`pb-2 px-4 ${
                    loginMethod === "phone" ? "border-b-2 border-[#2F92E5]" : ""
                  }`}
                  onClick={() => handleLoginMethodChange("phone")}
                >
                  Phone
                </button>
                <button
                  type="button"
                  className={`pb-2 px-4 ${
                    loginMethod === "email" ? "border-b-2 border-[#2F92E5]" : ""
                  }`}
                  onClick={() => handleLoginMethodChange("email")}
                >
                  Username or email
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                {loginMethod === "phone" ? (
                  <div className="flex items-center border border-[#ABB5FF] rounded-md">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowCountryDropdown(!showCountryDropdown)
                        }
                        className="flex items-center px-3 py-2 border-r"
                      >
                        {selectedCountry && (
                          <>
                            {selectedCountry.flag_url && (
                              <img
                                src={selectedCountry.flag_url}
                                alt={selectedCountry.code}
                                className="w-5 h-4 mr-2 object-cover"
                              />
                            )}
                            <span className="mr-1">
                              {selectedCountry.dial_code}
                            </span>
                            <ChevronDownIcon />
                          </>
                        )}
                      </button>

                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 z-10 mt-1 w-64 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {countries.map((country) => (
                            <button
                              key={country.id}
                              type="button"
                              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                              onClick={() => handleCountrySelect(country)}
                            >
                              {country.flag_url && (
                                <img
                                  src={country.flag_url}
                                  alt={country.code}
                                  className="w-5 h-4 mr-2 object-cover"
                                />
                              )}
                              <span className="truncate flex-grow">
                                {country.name}
                              </span>
                              <span className="ml-auto text-gray-500 whitespace-nowrap">
                                {country.dial_code}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      placeholder="Your Number"
                      className="flex-grow p-2 outline-none"
                      disabled={isLoading}
                      {...register("loginCredential")}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Username or email"
                    className="w-full p-2 border border-[#ABB5FF] rounded-md"
                    disabled={isLoading}
                    {...register("loginCredential")}
                  />
                )}
                {errors.loginCredential && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.loginCredential.message}
                  </p>
                )}
              </div>

              <div className="mb-6 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-2 border border-[#ABB5FF] rounded-md pr-10"
                  disabled={isLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
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
