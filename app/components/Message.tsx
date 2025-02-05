import {
  Transaction,
  TransactionButton,
  TransactionDefault,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import React, { useState } from "react";
import {
  mintABI,
  mintContractAddress,
  BASE_SEPOLIA_CHAIN_ID,
} from "./consants";
import { ContractFunctionParameters } from "viem";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";

// Define the Message interface
interface MessageProps {
  sender: "User" | "Bot";
  text: string;
}

// Define the Liquidity Balance Data structure
interface LiquidityBalanceData {
  [category: string]: {
    chain_name: string;
    balance: string;
    contract_name: string;
    contract_ticker_symbol: string;
    quote_currency: string;
    quote: number;
  }[];
}

// Function to check if the text is JSON and parse it
const parseJSON = (text: string): LiquidityBalanceData | null => {
  try {
    const data = JSON.parse(text);
    if (typeof data === "object" && data !== null) {
      return data as LiquidityBalanceData;
    }
  } catch (error) {
    return null;
  }
  return null;
};

// ✅ Function to render standard text messages
const TextMessage: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-gray-900 text-lg font-medium">{text}</p>
);

// ✅ Function to render Liquidity Data in a structured format
const LiquidityMessage: React.FC<{ data: LiquidityBalanceData }> = ({
  data,
}) => (
  <div className="bg-white/70 backdrop-blur-lg p-3 rounded-lg shadow-inner">
    {Object.keys(data).map((category) => (
      <div key={category} className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 capitalize bg-gray-200 px-4 py-2 rounded-md shadow-md">
          {category}
        </h3>
        <div className="border border-gray-300 rounded-md mt-2 overflow-hidden shadow-lg">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-200 to-gray-100 text-gray-900">
                <th className="p-3 border border-gray-400">🔗 Chain</th>
                <th className="p-3 border border-gray-400">💎 Asset</th>
                <th className="p-3 border border-gray-400">📊 Balance</th>
                <th className="p-3 border border-gray-400">💰 Quote (USD)</th>
              </tr>
            </thead>
            <tbody>
              {data[category].map((item, index) => (
                <tr
                  key={index}
                  className="border-t text-gray-800 hover:bg-gray-100 transition duration-300"
                >
                  <td className="p-3 border border-gray-300">
                    {item.chain_name}
                  </td>
                  <td className="p-3 border border-gray-300 font-semibold">
                    {item.contract_ticker_symbol}
                  </td>
                  <td className="p-3 border border-gray-300 text-blue-600 font-medium">
                    {parseFloat(item.balance).toFixed(2)}
                  </td>
                  <td className="p-3 border border-gray-300 text-green-600 font-semibold">
                    ${item.quote.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>
);

// ✅ Main Message Component (Organized & Extendable)
const Message: React.FC<MessageProps> = ({ sender, text }) => {
  const { walletAddress, addLiquidity } = useWeb3();
  const hardcodedAmounts = ["8122411380", "0"]; // Token amounts
  const hardcodedMinMintAmount = "382080610"; // Min mint amount (for slippage)
  const hardcodedUseEth = true; // Use ETH or not
  const handleAddLiquidity = () => {
    addLiquidity(
      hardcodedAmounts.map(ethers.toBigInt),
      ethers.toBigInt(hardcodedMinMintAmount),
      hardcodedUseEth
    );
  };
  const parsedData = parseJSON(text);
  // const contracts = [
  //   {
  //     address: mintContractAddress,
  //     abi: mintABI,
  //     functionName: "add_liquidity",
  //     args: [[[8122411380, 0].map(amount => ethers.toBigInt(amount)), 0], ethers.toBigInt(382080610), true],
  //   },
  // ] as unknown as ContractFunctionParameters[];

  let messageContent;

  // 🛠️ Check the type of message and render accordingly
  if (parsedData) {
    messageContent = <LiquidityMessage data={parsedData} />;
  } else {
    messageContent = <TextMessage text={text} />;
  }

  return (
    <div
      className={`flex ${
        sender === "Bot" ? "items-start" : "items-center"
      } space-x-3 p-3`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {sender === "Bot" ? (
          <div className="w-10 h-10 bg-gradient-to-br from-green-300 to-green-500 text-black rounded-full flex items-center justify-center font-bold shadow-lg">
            ⚡
          </div>
        ) : (
          <img
            src="https://img.freepik.com/premium-photo/cool-man-3d-cartoon-avatar-portrait_839035-196561.jpg"
            alt="User"
            className="w-10 h-10 rounded-full shadow-lg"
          />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`p-4 rounded-2xl max-w-[75%] ${
          sender === "Bot" ? "bg-green-200 py-6 px-10" : "bg-white"
        }`}
      >
        {messageContent}
        {/* <Transaction
          contracts={contracts}
          className="w-[450px]"
          chainId={8453}
          onError={() => {}}
          onSuccess={() => {}}
        >
          <TransactionButton className="mt-0 mr-auto ml-auto w-[450px] max-w-full text-[white]" />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction> */}
        {sender == "Bot" && (
          <button
            onClick={handleAddLiquidity}
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Add Liquidity
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
