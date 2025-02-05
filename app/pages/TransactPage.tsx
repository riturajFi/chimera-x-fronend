import React, { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

const TransactPage: React.FC = () => {
  const { walletAddress, addLiquidity } = useWeb3();
  const [amounts, setAmounts] = useState(["0", "0", "0.0107"]); // Default values
  const [minMintAmount, setMinMintAmount] = useState("0.0015"); // Example min_mint_amount
  const [useEth, setUseEth] = useState(true); // Default to true

  // Handle form submission
  const handleAddLiquidity = () => {
    const parsedAmounts = amounts.map((amount) => parseFloat(amount));
    addLiquidity(parsedAmounts, parseFloat(minMintAmount), useEth);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900">💰 Add Liquidity</h1>

      {walletAddress ? (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-6 w-1/2">
          <label className="block text-gray-700">Amount 1</label>
          <input
            type="text"
            value={amounts[0]}
            onChange={(e) => setAmounts([e.target.value, amounts[1], amounts[2]])}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
          />

          <label className="block text-gray-700">Amount 2</label>
          <input
            type="text"
            value={amounts[1]}
            onChange={(e) => setAmounts([amounts[0], e.target.value, amounts[2]])}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
          />

          <label className="block text-gray-700">ETH Amount</label>
          <input
            type="text"
            value={amounts[2]}
            onChange={(e) => setAmounts([amounts[0], amounts[1], e.target.value])}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
          />

          <label className="block text-gray-700 mt-4">Min Mint Amount</label>
          <input
            type="text"
            value={minMintAmount}
            onChange={(e) => setMinMintAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
          />

          <div className="flex items-center mt-4">
            <input type="checkbox" checked={useEth} onChange={() => setUseEth(!useEth)} />
            <label className="ml-2 text-gray-700">Use ETH</label>
          </div>

          <button
            onClick={handleAddLiquidity}
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Add Liquidity
          </button>
        </div>
      ) : (
        <p className="text-red-500 mt-4">Please connect your wallet first.</p>
      )}
    </div>
  );
};

export default TransactPage;
