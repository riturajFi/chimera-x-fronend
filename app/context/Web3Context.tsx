import React, { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";

// Define the shape of our context
interface Web3ContextType {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  sendTransaction: (to: string, amount: string) => Promise<void>;
}

// Create context
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // 1) Connect/Log In using MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // 2) Send Transaction using ethers.js
  const sendTransaction = async (to: string, amount: string) => {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return;
    }
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Convert ETH to Wei
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      alert(`Transaction Sent! Tx Hash: ${tx.hash}`);
      await tx.wait(); // Wait for confirmation
      alert("Transaction Confirmed!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <Web3Context.Provider value={{ walletAddress, connectWallet, sendTransaction }}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom Hook for the context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
