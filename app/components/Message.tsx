import React, { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";

// ✅ Define Message Props
interface MessageProps {
  sender: "User" | "Bot";
  text: string;
}

// ✅ Define Liquidity Balance Data Structure
interface LiquidityBalanceData {
  [poolName: string]: number;
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
      if (
        "4Pool" in data ||
        "USDC/USDM" in data ||
        "USDC/MONEY Curve LP" in data
      ) {
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
  <div className="bg-white/70 backdrop-blur-lg p-4 rounded-lg shadow-inner relative">
    {/* Curve Finance Logo */}
    <div className="flex justify-center mb-2">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwhSJnujc9BvUhq1rk17b5pUzGelz8OKx2Mw&s"
        alt="Curve Finance Logo"
        className="h-12"
      />
    </div>

    {Object.keys(data).map((pool) => (
      <div
        key={pool}
        className="mb-3 border border-gray-300 rounded-md p-3 shadow-md"
      >
        <h3 className="text-lg font-semibold text-gray-900 capitalize bg-gray-200 px-4 py-2 rounded-md">
          {pool}
        </h3>
        <p className="text-blue-600 text-lg font-medium mt-2">
          Balance: {data[pool].toFixed(6)}
        </p>
      </div>
    ))}
  </div>
);

// ✅ Component to render Optimized Yield Data
const OptimizedYieldMessage: React.FC<{ data: OptimizedYieldData }> = ({ data }) => {
  const { approveSpender, addLiquidity4Pool, withdraw4Pool } = useWeb3();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const handleAuthorize = async () => {
    try {
      await approveSpender();
      setIsAuthorized(true);
    } catch (error) {
      setIsAuthorized(false);
      console.error("Authorization failed:", error);
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-md border border-blue-300">
      <h3 className="text-xl font-semibold text-blue-900">🔄 Optimized Yield Overview</h3>

      <div className="mt-4">
        <table className="min-w-full border-collapse border border-blue-500 text-left">
          <thead>
            <tr className="bg-blue-200">
              <th className="border p-3">Category</th>
              <th className="border p-3">Before</th>
              <th className="border p-3">After</th>
              <th className="border p-3">Change</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data.before).map((key) => (
              <tr key={key} className="border">
                <td className="p-3 border font-semibold">{key}</td>
                <td className="p-3 border">{data.before[key].toFixed(6)}</td>
                <td className="p-3 border">{data.after[key].toFixed(6)}</td>
                <td className={`p-3 border font-semibold ${data.change[key] < 0 ? "text-red-600" : "text-green-600"}`}>
                  {data.change[key] > 0 ? "+" : ""}
                  {data.change[key].toFixed(6)}
                </td>
                <td className="p-3 border">
                  {data.change[key] < 0 ? (
                    <button
                      onClick={withdraw4Pool}
                      className="bg-red-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition w-full"
                    >
                      Withdraw
                    </button>
                  ) : data.change[key] > 0 ? (
                    <div className="flex flex-col items-center space-y-2 w-full">
                      <button
                        onClick={handleAuthorize}
                        className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition w-full"
                      >
                        Authorize
                      </button>
                      <span className="text-lg">⬇️</span>
                      <button
                        onClick={addLiquidity4Pool}
                        disabled={!isAuthorized}
                        className={`px-4 py-2 rounded shadow transition w-full ${isAuthorized ? "bg-green-500 text-white hover:scale-105" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
                      >
                        Add Liquidity
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">No Action Needed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ✅ Main Message Component
const Message: React.FC<MessageProps> = ({ sender, text }) => {
  const {
    walletAddress,
    addLiquidity,
    approveSpender,
    addLiquidity4Pool,
    withdraw4Pool,
  } = useWeb3();

  const hardcodedAmounts = [BigInt("10000000"), BigInt("0")]; // 0.00000001 ETH in wei
  const hardcodedMinMintAmount = BigInt("10000000"); // Min mint amount (same small value)
  const hardcodedUseEth = true;

  const handleAddLiquidity = () => {
    addLiquidity(hardcodedAmounts, hardcodedMinMintAmount, hardcodedUseEth);
  };

  const parsedResponse = parseJSON(text);
  let messageContent;
  console.log(text);
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
