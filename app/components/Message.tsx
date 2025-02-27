import React, { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import {
  Transaction,
  TransactionDefault,
} from "@coinbase/onchainkit/transaction";
import { encodeFunctionData } from "viem";
import { FundButton, FundCard } from "@coinbase/onchainkit/fund";
import {
  _4pool_deposit_contract_proxy_address,
  USDC_contract_proxy_address,
} from "../constants/contract_addresses";
import {
  encodedWithdrawData,
  encodedApproveSpenderData,
  encodedAddLiquidity4PoolData,
  encodedApproveAiToSpendUSDCData,
} from "./encodedFunctionData";

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
): { type: "liquidity" | "yield" | "distribution"; data: any } | null => {
  try {
    const data = JSON.parse(text);
    if (typeof data === "object" && data !== null) {
      if (
        "4Pool" in data ||
        "USDC/USDM" in data ||
        "USDC/MONEY Curve LP" in data
      ) {
        return { type: "liquidity", data: data as LiquidityBalanceData };
      } else if ("allocations" in data) {
        return {
          type: "liquidity",
          data: data.allocations as LiquidityBalanceData,
        };
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
const OptimizedYieldMessage: React.FC<{ data: OptimizedYieldData }> = ({
  data,
}) => {
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
              <th className="border p-3">Action</th>
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
                  {data.change[key] > 0 ? "+" : ""}
                  {data.change[key].toFixed(6)}
                </td>
                <td className="p-3 border">
                  {data.change[key] < 0 ? (
                    <TransactionDefault
                      calls={[
                        {
                          to: _4pool_deposit_contract_proxy_address,
                          data: encodedWithdrawData,
                          value: BigInt(0),
                        },
                      ]}
                      className="bg-red-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition w-full"
                    />
                  ) : data.change[key] > 0 ? (
                    <div className="flex flex-col items-center space-y-2 w-full">
                      <TransactionDefault
                        calls={[
                          {
                            to: USDC_contract_proxy_address,
                            data: encodedApproveSpenderData,
                            value: BigInt(0),
                          },
                        ]}
                        onSuccess={() => {
                          setIsAuthorized(true);
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition w-full"
                      />

                      <span className="text-lg">⬇️</span>
                      <TransactionDefault
                        calls={[
                          {
                            to: _4pool_deposit_contract_proxy_address,
                            data: encodedAddLiquidity4PoolData,
                            value: BigInt(0),
                          },
                        ]}
                        disabled={!isAuthorized}
                        className={`px-4 py-2 rounded shadow transition w-full ${
                          isAuthorized
                            ? "bg-green-500 text-white hover:scale-105"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                      />
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
      <div className="bg-green-300 px-2 py-4 mx-2 my-4 rounded-lg">
        Do you want me to Manage these optimzations on your behalf??
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
    approveSpender1,
  } = useWeb3();

  ///Encoded Approve Data

  const hardcodedAmounts = [BigInt("10000000"), BigInt("0")]; // 0.00000001 ETH in wei
  const hardcodedMinMintAmount = BigInt("10000000"); // Min mint amount (same small value)
  const hardcodedUseEth = true;

  const USDC_CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const SPENDER_ADDRESS = "0xf6C5F01C7F3148891ad0e19DF78743D31E390D1f";
  const MAX_APPROVAL_AMOUNT = BigInt(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );

  // ABI for the approve function
  const approveAbi = [
    {
      stateMutability: "nonpayable",
      type: "function",
      name: "approve",
      inputs: [
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
    },
  ];

  // Encode approve function data
  const encodedApproveData = encodeFunctionData({
    abi: approveAbi,
    functionName: "approve",
    args: [SPENDER_ADDRESS, MAX_APPROVAL_AMOUNT],
  });

  const handleAddLiquidity = () => {
    addLiquidity(hardcodedAmounts, hardcodedMinMintAmount, hardcodedUseEth);
  };

  const parsedResponse = parseJSON(text);
  let messageContent;

  if (text.includes("approve") && text.includes("USDC")) {
  }

  if (parsedResponse) {
    if (parsedResponse.type === "liquidity") {
      messageContent = <LiquidityMessage data={parsedResponse.data} />;
    } else if (parsedResponse.type === "yield") {
      messageContent = <OptimizedYieldMessage data={parsedResponse.data} />;
    }
  } else if (
    text.includes("Please click the following button to fund your wallet")
  ) {
    messageContent = <FundButton />;
  } else {
    messageContent = (
      <TextMessage
        text={
          text.indexOf("My Wallet address is") != -1
            ? text.substring(0, text.indexOf("My Wallet address is")).trim()
            : text
        }
      />
    );
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
        {/* <TransactionDefault
          chainId={8453}
          calls={[
            {
              to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
              data: encodedApproveData,
              value: BigInt(0),
            },
          ]}
        /> */}

        {/* Approve Button (Only shown when 'approve' and 'USDC' are in text) */}
        {text.includes("approve") && text.includes("USDC") && (
          <div className="mt-4 flex justify-start">
            <TransactionDefault
              onStatus={() => {}}
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              calls={[
                {
                  to: USDC_contract_proxy_address,
                  data: encodedApproveAiToSpendUSDCData,
                  value: BigInt(0),
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
