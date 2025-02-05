// src/pages/TransactPage.tsx
import React, { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

const TransactPage: React.FC = () => {
  // Access the wallet address and sendTransaction function
  const { walletAddress, sendTransaction } = useWeb3();

  // Local state for the form inputs
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSendClick = () => {
    if (!to || !amount) {
      alert("Please enter a valid address and amount.");
      return;
    }
    sendTransaction(to, amount);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900">💰 Send ETH</h1>
      <p className="text-gray-600 mt-2">Easily send ETH on-chain.</p>

      {walletAddress ? (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
          <label className="block text-gray-700">Recipient Address</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
          />

          <label className="block text-gray-700 mt-4">Amount (ETH)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
          />

          <button
            onClick={handleSendClick}
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Send ETH
          </button>
        </div>
      ) : (
        <p className="text-red-500 mt-4">Please connect your wallet first.</p>
      )}
    </div>
  );
};

export default TransactPage;
