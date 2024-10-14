import React, { useState, useEffect } from "react";

const AccountVerification = () => {
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 bg-[#37CA52] text-white py-2 px-4 rounded-md mb-4 text-center">
          Account creation Successful!
        </div>
      )}
      <div className="bg-white rounded-lg p-6 mt-16 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Verify your address</h2>
        <div className="bg-[#37BE1C] text-white p-3 rounded-md mb-4 text-center">
          Account verified successfully!
        </div>
        <button className="w-full bg-white border border-[#37BE1C] p-2 rounded-md hover:bg-green-50 transition-colors">
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AccountVerification;
