import React from "react";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";

// ✅ Define Message Props
interface MessageProps {
  sender: "User" | "Bot";
  text: string;
}

// ✅ Define Liquidity Balance Data Structure
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

// ✅ Define Optimized Yield Data Structure
interface OptimizedYieldData {
  before: { [key: string]: number };
  after: { [key: string]: number };
  change: { [key: string]: number };
  total_optimized_yield: number;
}

// ✅ Function to classify JSON type
const parseJSON = (
  text: string
): { type: "liquidity" | "yield"; data: any } | null => {
  try {
    const data = JSON.parse(text);
    if (typeof data === "object" && data !== null) {
      if ("curve" in data || "aave" in data || "lido" in data) {
        return { type: "liquidity", data: data as LiquidityBalanceData };
      } else if ("before" in data && "after" in data && "change" in data) {
        return { type: "yield", data: data as OptimizedYieldData };
      }
    }
  } catch (error) {
    return null;
  }
  return null;
};

// ✅ Component to render standard text messages
const TextMessage: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-gray-900 text-lg font-medium">{text}</p>
);

// ✅ Component to render Liquidity Data
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

const OptimizedYieldMessage: React.FC<{ data: OptimizedYieldData }> = ({
  data,
}) => {
  const { approveSpender, addLiquidity4Pool, withdraw4Pool } = useWeb3();

  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-md border border-blue-300">
      <h3 className="text-xl font-semibold text-blue-900">
        🔄 Optimized Yield Overview
      </h3>

      <div className="mt-4">
        <table className="min-w-full border-collapse border border-blue-500 text-left">
          <thead>
            <tr className="bg-blue-200">
              <th className="border p-3">Category</th>
              <th className="border p-3">Before</th>
              <th className="border p-3">After</th>
              <th className="border p-3">Change</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data.before).map((key) => (
              <tr key={key} className="border">
                <td className="p-3 border font-semibold">{key}</td>
                <td className="p-3 border">{data.before[key].toFixed(6)}</td>
                <td className="p-3 border">{data.after[key].toFixed(6)}</td>
                <td
                  className={`p-3 border font-semibold ${
                    data.change[key] < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {data.change[key].toFixed(6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-lg mt-4 font-bold text-blue-900">
        🌟 Total Optimized Yield:{" "}
        <span className="text-green-600">
          {data.total_optimized_yield.toFixed(6)}
        </span>
      </p>

      {/* ✅ Conditional Buttons for Curve */}
      {data.change["curve"] < 0 ? (
        <button
          onClick={withdraw4Pool}
          className="mt-4 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          Withdraw
        </button>
      ) : (
        <div className="flex items-center space-x-4 mt-4">
          <button
            onClick={approveSpender}
            className="bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Authorize
          </button>
          <span className="text-lg font-bold">➡️</span>
          <button
            onClick={addLiquidity4Pool}
            className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Add Liquidity 4 Pool
          </button>
        </div>
      )}
    </div>
  );
};

// ✅ Main Message Component
const Message: React.FC<MessageProps> = ({ sender, text }) => {
  console.log(text);
  const {
    walletAddress,
    addLiquidity,
    approveSpender,
    addLiquidity4Pool,
    withdraw4Pool,
  } = useWeb3();

  // ✅ Hardcoded values for addLiquidity
  const hardcodedAmounts = [BigInt("10000000"), BigInt("0")]; // 0.00000001 ETH in wei
  const hardcodedMinMintAmount = BigInt("10000000"); // Min mint amount (same small value)
  const hardcodedUseEth = true;

  const handleAddLiquidity = () => {
    addLiquidity(hardcodedAmounts, hardcodedMinMintAmount, hardcodedUseEth);
  };

  const parsedResponse = parseJSON(text);
  let messageContent;

  if (parsedResponse) {
    if (parsedResponse.type === "liquidity") {
      messageContent = <LiquidityMessage data={parsedResponse.data} />;
    } else if (parsedResponse.type === "yield") {
      messageContent = <OptimizedYieldMessage data={parsedResponse.data} />;
    }
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

        {sender === "Bot" && (
          // <button
          //   onClick={handleAddLiquidity}
          //   className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          // >
          //   Add Liquidity
          // </button>
          <button
            onClick={withdraw4Pool}
            className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Add Liquidity 4 Pool
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
