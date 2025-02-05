// src/pages/LandingPage.tsx
import React from "react";
import { useWeb3 } from "../context/Web3Context";

const LandingPage: React.FC = () => {
  // Access wallet data and connect function from context
  const { walletAddress, connectWallet } = useWeb3();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 p-8">
      {/* Left Section (Text & Button) */}
      <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to <span className="text-blue-500">CryptoProject</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-lg">
          Experience decentralized finance with seamless transactions.
        </p>

        {walletAddress ? (
          <p className="text-green-600 font-bold">
            ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        ) : (
          <button
            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Right Section (Image) */}
      <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
        <img
          src="https://source.unsplash.com/600x400/?cryptocurrency,finance"
          alt="Crypto Project"
          className="rounded-xl shadow-xl w-4/5"
        />
      </div>
    </div>
  );
};

export default LandingPage;
