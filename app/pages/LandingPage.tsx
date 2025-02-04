import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 p-8">
      {/* Left Section (Text & Button) */}
      <div className="w-full md:w-1/2 text-center md:text-left space-y-6 pl-12">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to <span className="text-blue-500">CryptoProject</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-lg">
          Experience the next generation of decentralized finance with seamless transactions, staking, and liquidity solutions.
        </p>
        <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
          Connect Wallet
        </button>
      </div>

      {/* Right Section (Image) */}
      <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
        <img
          src="https://1000logos.net/wp-content/uploads/2023/01/Ethereum-logo.png"
          alt="Crypto Project"
          className="rounded-xl w-4/5"
        />
      </div>
    </div>
  );
};

export default LandingPage;
