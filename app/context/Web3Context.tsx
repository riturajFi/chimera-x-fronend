import React, { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";
import { CURVE_CONTRACT_ABI } from "../constants/curveAbi";

// Curve Smart Contract Information
const CURVE_CONTRACT_ADDRESS = "0x11C1fBd4b3De66bC0565779b35171a6CF3E71f59";
const CHAIN_ID = 8453; // Base Mainnet

interface Web3ContextType {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  addLiquidity: (
    amounts: bigint[],
    minMintAmount: bigint,
    useEth: boolean
  ) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // 1️⃣ Connect MetaMask Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install it.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);

      // Ensure the user is on the correct network (Base Mainnet)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== ethers.toBigInt(CHAIN_ID)) {
        alert("Please switch to Base Mainnet (Chain ID: 8453) in MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // 2️⃣ Add Liquidity (Uses MetaMask)
  const addLiquidity = async (
    amounts: bigint[],
    minMintAmount: bigint,
    useEth: boolean
  ) => {
    if (!window.ethereum || !walletAddress) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CURVE_CONTRACT_ADDRESS,
        CURVE_CONTRACT_ABI,
        signer
      );

      // Ensure the value for ETH transfer is set correctly
      const value = useEth ? amounts[0] : BigInt(0);

      // Explicitly call the correct function signature
      const tx = await contract["add_liquidity(uint256[2],uint256,bool)"](
        amounts,
        minMintAmount,
        useEth,
        {
          value,
          gasLimit: 3000000,
        }
      );

      alert(`Transaction Sent! Tx Hash: ${tx.hash}`);
      await tx.wait();
      alert("Transaction Confirmed!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <Web3Context.Provider
      value={{ walletAddress, connectWallet, addLiquidity }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
