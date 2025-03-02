import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { useExchangeContext } from "./ExchangeContext";
import apiService from "@config/config";

export function BankDetailsStep() {
  const {
    banks,
    setStep,
    createTransaction,
    transactionData,
    setTransactionData,
  } = useExchangeContext();

  const {
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const [isResolvingAccount, setIsResolvingAccount] = useState(false);
  const [accountError, setAccountError] = useState("");

  const handleAccountNumberBlur = async (accountNumber, bankId) => {
    if (bankId && accountNumber?.length === 10) {
      setIsResolvingAccount(true);
      setAccountError("");

      try {
        const accountData = await apiService.attributes.resolveAccount(
          bankId,
          accountNumber
        );

        if (accountData.account_name) {
          setValue("accountName", accountData.account_name);
          setAccountError("");
        } else {
          setValue("accountName", "");
          setAccountError("Could not resolve account name");
        }
      } catch (err) {
        setValue("accountName", "");
        setAccountError("Failed to verify account. Please check your details.");
      } finally {
        setIsResolvingAccount(false);
      }
    }
  };

  const handleContinue = async () => {
    console.log({
      espee_amount: transactionData.amount,
      currency: transactionData.selectedCurrency,
      bank_account: {
        account_number: control._formValues.accountNumber,
        bank_id: control._formValues.bankId,
      },
    });

    try {
      const createTransaction = await apiService.transactions.createTransaction(
        {
          espee_amount: transactionData.e,
          currency: transactionData.selectedCurrency,
          bank_account: {
            account_number: control._formValues.accountNumber,
            bank_id: control._formValues.bankId,
          },
        }
      );
      console.log(createTransaction);

      if (createTransaction) {
        setTransactionData(createTransaction);
        setStep(3); // Directly move to step 3 (TransactionInProgressStep)
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error message
    }
  };

  return (
    <div>
      <div className="py-5 text-[1rem] mb-7 pl-14 bg-white rounded-lg border">
        <p className="mb-4 text-gray-700">
          Total amount payable in Espees:{" "}
          <strong>{transactionData.espeeAmount || 0} Espee(s)</strong>
        </p>
        <p className="text-gray-700">
          Amount to receive in {transactionData.selectedCurrency || "Naira"}:{" "}
          <strong>{transactionData.localAmount || "₦0.00"}</strong>
        </p>
      </div>

      <div className="py-3 px-6 bg-white rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">
          Enter your Receiving account
        </h2>

        <div className="space-y-4">
          <Controller
            name="bankId"
            control={control}
            defaultValue=""
            rules={{ required: "Bank selection is required" }}
            render={({ field }) => (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Bank</label>
                <div className="relative">
                  <select
                    {...field}
                    className="w-full p-3 border border-gray-300 rounded appearance-none"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
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
            name="accountNumber"
            control={control}
            defaultValue=""
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
                  maxLength={10}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="Enter your account number"
                  onBlur={() => {
                    field.onBlur();
                    handleAccountNumberBlur(
                      field.value,
                      control._formValues.bankId
                    );
                  }}
                  disabled={isSubmitting || isResolvingAccount}
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
            name="accountName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Account name
                </label>
                <input
                  {...field}
                  type="text"
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded bg-gray-50"
                  placeholder={
                    isResolvingAccount
                      ? "Verifying account..."
                      : "Account name will appear here"
                  }
                />
                {accountError && (
                  <p className="text-red-500 text-sm mt-1">{accountError}</p>
                )}
              </div>
            )}
          />

          <button
            type="button"
            onClick={handleContinue}
            disabled={isResolvingAccount}
            className={`w-full p-3 rounded mt-6 transition-colors ${
              isResolvingAccount
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#2467E3] text-white hover:bg-[#1e51b3]"
            }`}
          >
            {isResolvingAccount ? "Processing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
