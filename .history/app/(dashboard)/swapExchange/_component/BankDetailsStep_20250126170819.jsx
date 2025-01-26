import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";

import { useExchangeContext } from "./ExchangeContext";

export function BankDetailsStep() {
  const { banks, setStep, createTransaction } = useExchangeContext();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const accountNumber = watch("accountNumber") || "";
  const bankId = watch("bankId") || "";
  const [accountName, setAccountName] = useState("");

  const handleAccountNumberBlur = async () => {
    if (bankId && accountNumber.length === 10) {
      try {
        const accountData = await apiService. resolveAccount(bankId, accountNumber);
        setAccountName(accountData.account_name);
        setValue("accountName", accountData.account_name);
      } catch (err) {
        setAccountName("");
        setValue("accountName", "");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      await createTransaction({
        espee_amount: data.espeeAmount,
        destination_currency: data.selectedCurrency,
        bank_account: {
          bank_id: data.bankId,
          account_number: data.accountNumber,
        },
      });
      setStep(3);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="py-3 px-3 bg-white rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">
        Enter your Receiving account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="accountNumber"
          control={control}
          rules={{
            required: "Account number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Account number must be 10 digits",
            },
          }}
          render={({ field }) => (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Account number
              </label>
              <input
                {...field}
                type="text"
                onBlur={handleAccountNumberBlur}
                maxLength={10}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter your account number"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="bankId"
          control={control}
          rules={{ required: "Bank selection is required" }}
          render={({ field }) => (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bank</label>
              <div className="relative">
                <select
                  {...field}
                  className="w-full p-3 border border-gray-300 rounded appearance-none"
                >
                  <option value="">Select Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.bankId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bankId.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="accountName"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Account name
              </label>
              <input
                {...field}
                type="text"
                readOnly
                value={accountName}
                className="w-full p-3 border border-gray-300 rounded bg-gray-50"
                placeholder="Account name will appear here"
              />
            </div>
          )}
        />

        <button
          type="submit"
          disabled={!accountNumber || !bankId || !accountName}
          className={`w-full p-3 rounded mt-6 transition-colors ${
            !accountNumber || !bankId || !accountName
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#2467E3] text-white hover:bg-[#1e51b3]"
          }`}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
