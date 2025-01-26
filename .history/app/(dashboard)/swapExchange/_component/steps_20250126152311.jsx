import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";

import { useExchangeContext } from "./ExchangeContext";

//  export function AmountSelectionStep() {
//   const { currencies, calculateExchangeAmount, setStep } = useExchangeContext();
// console.log(currencies);
//   const { control, watch, setValue, trigger } = useFormContext();
//   const [showDropdown, setShowDropdown] = useState(false);

//   const espeeAmount = watch("espeeAmount");
//   const localAmount = watch("localAmount");
//   const selectedCurrency = watch("selectedCurrency");

//   const handleAmountChange = (value) => {
//     const result = calculateExchangeAmount(value, selectedCurrency);
//     console.log(result);
    
//     setValue("localAmount", result?.total);
//     trigger("espeeAmount");
//   };

//   const handleCurrencyChange = (currency) => {
//     setValue("selectedCurrency", currency);
//     setShowDropdown(false);

//     if (espeeAmount) {
//       handleAmountChange(espeeAmount);
//     }
//   };

//   const handleContinue = () => {
//     if (espeeAmount && localAmount) {
//       setStep(2);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
//       <h2 className="text-[1.4rem] mb-4 text-[#434343] font-bold">
//         Enter amount of ESPEE to exchange
//       </h2>

//       <div className="space-y-4">
//         <Controller
//           name="espeeAmount"
//           control={control}
//           rules={{ required: "Amount is required" }}
//           render={({ field, fieldState: { error } }) => (
//             <div>
//               <label
//                 htmlFor="espeeAmount"
//                 className="text-sm text-gray-600 mb-1"
//               >
//                 Enter amount
//               </label>
//               <div className="relative">
//                 <input
//                   {...field}
//                   type="number"
//                   onChange={(e) => {
//                     field.onChange(e);
//                     handleAmountChange(Number(e.target.value));
//                   }}
//                   min="0"
//                   step="0.01"
//                   placeholder="0.00"
//                   className="w-full p-3 pr-16 border border-gray-300 rounded"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
//                   Espee
//                 </div>
//               </div>
//               {error && <p className="text-red-500">{error.message}</p>}
//             </div>
//           )}
//         />

//         <div className="relative">
//           <input
//             type="number"
//             value={localAmount}
//             readOnly
//             className="w-full p-3 border border-gray-300 rounded"
//             placeholder="0.00"
//           />
//           <div className="absolute inset-y-0 right-0 flex items-center">
//             <button
//               onClick={() => setShowDropdown(!showDropdown)}
//               className="h-full px-4 flex items-center bg-gray-700 text-white rounded-r"
//             >
//               {selectedCurrency} <ChevronDown className="ml-2" />
//             </button>
//           </div>

//           {showDropdown && (
//             <CurrencyDropdown
//               currencies={currencies}
//               onSelect={handleCurrencyChange}
//             />
//           )}
//         </div>
//       </div>

//       <button
//         onClick={handleContinue}
//         disabled={!espeeAmount || !localAmount}
//         className={`w-full p-3 rounded mt-6 transition-colors ${
//           !espeeAmount || !localAmount
//             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//             : "bg-[#2467E3] text-white hover:bg-[#1e51b3]"
//         }`}
//       >
//         Continue
//       </button>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";

import { useExchangeContext } from "./ExchangeContext";

export function AmountSelectionStep() {
  const { currencies, calculateExchangeAmount, setStep } = useExchangeContext();

  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize form values if not set
  useEffect(() => {
    setValue("espeeAmount", "");
    setValue("localAmount", "");
    setValue("selectedCurrency", currencies[0]?.code || "");
  }, [currencies, setValue]);

  const espeeAmount = watch("espeeAmount") || "";
  const localAmount = watch("localAmount") || "";
  const selectedCurrency = watch("selectedCurrency") || "";

  const handleAmountChange = (value) => {
    const numericValue = Number(value);

    if (numericValue > 0 && selectedCurrency) {
      const result = calculateExchangeAmount(numericValue, selectedCurrency);
      setValue("localAmount", result?.total?.toString() || "");
    }
  };

  const handleCurrencyChange = (currency) => {
    setValue("selectedCurrency", currency);
    setShowDropdown(false);

    if (espeeAmount) {
      handleAmountChange(espeeAmount);
    }
  };

  const handleContinue = () => {
    if (espeeAmount && localAmount) {
      setStep(2);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
      <h2 className="text-[1.4rem] mb-4 text-[#434343] font-bold">
        Enter amount of ESPEE to exchange
      </h2>

      <div className="space-y-4">
        <Controller
          name="espeeAmount"
          control={control}
          defaultValue=""
          rules={{
            required: "Amount is required",
            min: { value: 0.01, message: "Amount must be greater than 0" },
          }}
          render={({ field }) => (
            <div>
              <label
                htmlFor="espeeAmount"
                className="text-sm text-gray-600 mb-1"
              >
                Enter amount
              </label>
              <div className="relative">
                <input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    field.onChange(e);
                    handleAmountChange(e.target.value);
                  }}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full p-3 pr-16 border border-gray-300 rounded"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  Espee
                </div>
              </div>
              {errors.espeeAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.espeeAmount.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="relative">
          <input
            type="number"
            value={localAmount}
            readOnly
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="0.00"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-full px-4 flex items-center bg-gray-700 text-white rounded-r"
            >
              {selectedCurrency} <ChevronDown className="ml-2" />
            </button>
          </div>

          {showDropdown && currencies?.length > 0 && (
            
            // <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
            //   {currencies.map((curr) => (
            //     <button
            //       key={curr.code}
            //       type="button"
            //       onClick={() => handleCurrencyChange(curr.code)}
            //       className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            //     >
            //       <span>{curr.code}</span>
            //       <span className="text-sm text-gray-500">{curr.name}</span>
            //     </button>
            //   ))}
            // </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!espeeAmount || !localAmount}
        className={`w-full p-3 rounded mt-6 transition-colors ${
          !espeeAmount || !localAmount
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#2467E3] text-white hover:bg-[#1e51b3]"
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function CurrencyDropdown({ currencies, onSelect }) {
  return (
    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
      {currencies.map((curr) => (
        <button
          key={curr.code}
          onClick={() => onSelect(curr.code)}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center justify-between"
        >
          <span>{curr.code}</span>
          <span className="text-sm text-gray-500">{curr.name}</span>
        </button>
      ))}
    </div>
  );
}
