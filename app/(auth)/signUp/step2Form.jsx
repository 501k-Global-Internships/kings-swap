import React, { useState, useMemo, useCallback, forwardRef } from "react";
import { ChevronDown, Mail } from "lucide-react";
import Link from "next/link";
import { useCountryStore } from "../../../stores/countries.store";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


const schema = z.object({
  first_name: z.string().min(4, "First name must be at least 2 characters"),
  last_name: z.string().min(4, "Last name must be at least 2 characters"),
  kingschat_username: z.string().min(4, "Kingschat username must be at least 4 characters"),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Invalid phone number"),
  country_id: z.string().min(1, "Please select a country"),
})

const PhoneNumberInput = forwardRef(({ value, onChange, error }, ref) => {
  const {
    countries = {},
    selectedCountry: selectedCountryId = "",
    setSelectedCountry,
  } = useCountryStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);

  const selectedCountry = useMemo(() => {
    return countries.find((country) => country.id === selectedCountryId);
  }, [countries, selectedCountryId]);

  const getCountryCode = (countryId) => {
    const codes = {
      NG: "+234",
      GH: "+233",
      US: "+1",
    };
    return codes[countryId] || "+234";
  };

  const stripCountryCode = (input, countryCode) => {
    if (!input) return "";
    const cleanInput = input.replace(/^\+/, "");
    if (cleanInput.startsWith(countryCode.slice(1))) {
      return cleanInput.slice(countryCode.length - 1);
    }
    return cleanInput;
  };

  return (
    <div className="relative w-full">
      <input
      ref={ref}
        type="tel"
        value={stripCountryCode(
          value,
          selectedCountry ? getCountryCode(selectedCountryId) : "+234"
        )}
        onChange={(e) => {
          const inputValue = e.target.value;
          const numbers = inputValue.replace(/[^\d]/g, "");
          const countryCode = selectedCountryId
            ? getCountryCode(selectedCountryId)
            : "+234";
          onChange(countryCode + numbers);
        }}
        placeholder="Enter your Phone number"
        className={`w-full h-12 pl-24 pr-4 text-gray-600 bg-white border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-[.2rem] space-x-0 px-[.25rem] py-1.5 rounded bg-[#E5E5E5] focus:outline-none"
        >
          {selectedCountryId && (
            <>
              <img
                src={selectedCountry.flag_url}
                alt={selectedCountry.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600">
                {getCountryCode(selectedCountry.id)}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </>
          )}
        </button>

        {isOpen && countries.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.id}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 text-left"
                onClick={() => {
                  const newCountryCode = getCountryCode(country.id);
                  const oldCountryCode = selectedCountryId
                    ? getCountryCode(selectedCountryId)
                    : "+234";
                  const phoneWithoutCode = stripCountryCode(
                    value,
                    oldCountryCode
                  );
                  setSelectedCountry(country);
                  setIsOpen(false);
                  onChange(newCountryCode + phoneWithoutCode);
                }}
              >
                <img
                  src={country.flag_url}
                  alt={country.name}
                  className="w-5 h-4 object-cover"
                />
                <span className="text-sm text-gray-600">
                  {getCountryCode(country.id)}
                </span>
                <span className="text-sm text-gray-600">{country.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

PhoneNumberInput.displayName = "PhoneNumberInput";

const Step2Form = ({
  onNext,
  setFormData,
  formData = {},
  errors: serverErrors,
}) => {
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      kingschat_username: formData.kingschat_username || "",
      gender: formData.gender || "",
      email: formData.email || "",
      phone_number: formData.phone_number || "",
      country_id: formData.country_id || "NG",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, touchedFields },
  } = methods;

  const gender = watch('gender');

  const onSubmit = useCallback(async (data) => {
    onNext(data);
  }, []);

  const getInputClassName = (fieldName) => {
    const hasError = errors[fieldName] || serverErrors?.[fieldName];
    return `w-full border ${
      hasError ? "border-red-500" : "border-gray-300"
    } rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`;
  };

  return (
    <FormProvider {...methods}>
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Setup your account</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm text-gray-600 mb-1"
              >
                First name
              </label>
              <input
                name="first_name"
                type="text"
                {...register("first_name")}
                placeholder="Enter your real name"
                className={getInputClassName("first_name")}
                maxLength={255}
              />
              {(errors.first_name || serverErrors?.first_name) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.first_name?.message || serverErrors?.first_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm text-gray-600 mb-1"
              >
                Last name (surname)
              </label>
              <input
                name="last_name"
                type="text"
                {...register("last_name")}
                placeholder="Enter your real name"
                className={getInputClassName("last_name")}
                maxLength={255}
              />
              {(errors.last_name || serverErrors?.last_name) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.last_name?.message || serverErrors?.last_name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="kingschat_username"
                className="block text-sm text-gray-600 mb-1"
              >
                Kings chat username
              </label>
              <input
                name="kingschat_username"
                type="text"
                {...register("kingschat_username")}
                placeholder="Enter your username"
                className={getInputClassName("kingschat_username")}
                // maxLength={32}
                // minLength={4}
                // pattern="[a-zA-Z0-9._]+"
              />
              {(errors.kingschat_username ||
                serverErrors?.kingschat_username) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.kingschat_username?.message ||
                    serverErrors?.kingschat_username}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Don't have an account?{" "}
                <Link
                  href="/kingsChat"
                  className="text-blue-500 hover:underline"
                >
                  create one
                </Link>
              </p>
            </div>

            <div className="relative">
              <label
                htmlFor="gender"
                className="block text-sm text-gray-600 mb-1"
              >
                Gender
              </label>
              <button
                name="gender"
                className={`w-full border ${
                  errors.gender || serverErrors?.gender
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded p-2 text-sm flex justify-between items-center cursor-pointer`}
                onClick={() => setIsGenderOpen(!isGenderOpen)}
              >
                <span
                  className={gender ? "text-black" : "text-gray-400"}
                >
                  {gender || "Select your gender"}
                </span>
                <ChevronDown className="text-gray-400" size={16} />
              </button>
              {isGenderOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b mt-[-1px]">
                  {["Male", "Female"].map((g, index) => (
                    <button
                      key={index}
                      className="w-full p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        methods.setValue("gender", g);
                        setIsGenderOpen(false);
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
              {(errors.gender || serverErrors?.gender) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender?.message || serverErrors?.gender}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
              Email address
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email address"
                className={`${getInputClassName("email")} pr-8`}
                maxLength={150}
              />
              <Mail
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
            {(errors.email || serverErrors?.email) && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email?.message || serverErrors?.email}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="phone_number"
              className="block text-sm text-gray-600 mb-1"
            >
              Phone number
            </label>
            <Controller
              name="phone_number"
              control={methods.control}
              render={({
                field: { onChange, ref, value },
                formState: { errors },
              }) => (
                <PhoneNumberInput
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  error={errors.phone_number?.message || serverErrors?.phone_number}
                />
              )}
            />
            {(errors.phone_number || serverErrors?.phone_number) && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone_number?.message || serverErrors?.phone_number}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded transition-colors text-sm hover:bg-blue-600 disabled:bg-gray-300"
            disabled={!isDirty}
          >
            Continue
          </button>
        </form>
      </div>
    </FormProvider>
  );
};

export default Step2Form;