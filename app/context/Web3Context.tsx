import React, { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";
import { CURVE_CONTRACT_ABI } from "../constants/curve_abi";
import { USDC_BASE_CONTRACT_ABI } from "../constants/USDC_Base_Abi";
import { USDC_contract_proxy_address, _4pool_deposit_contract_proxy_address } from "../constants/contract_addresses";
import {_4POOL_DEPOSIT_ABI} from "../constants/4pool_deposit_abi"

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
  approveSpender: () => Promise<void>;
  addLiquidity4Pool: () => Promise<void>;
  withdraw4Pool: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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

  const approveSpender = async () => {
    if (!window.ethereum || !walletAddress) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        USDC_contract_proxy_address,
        USDC_BASE_CONTRACT_ABI,
        signer
      );

      // Hardcoded values
      const spender = "0xf6C5F01C7F3148891ad0e19DF78743D31E390D1f";
      const value = BigInt(
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );

      // ✅ Call approve function
      const tx = await contract.approve(spender, value);
      alert(`Transaction Sent! Tx Hash: ${tx.hash}`);

      await tx.wait();
      alert("Approval Successful!");
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const addLiquidity4Pool = async () => {
    if (!window.ethereum || !walletAddress) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(_4pool_deposit_contract_proxy_address, _4POOL_DEPOSIT_ABI, signer);

      // ✅ Hardcoded Values
      const _amounts = [BigInt(50000), BigInt(0), BigInt(0), BigInt(0)];
      const _min_mint_amount = BigInt("49242745402084618");

      // ✅ Call `add_liquidity` function
      const tx = await contract.add_liquidity(_amounts, _min_mint_amount);
      alert(`Transaction Sent! Tx Hash: ${tx.hash}`);

      await tx.wait();
      alert("Liquidity Added Successfully!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const withdraw4Pool = async () => {
    if (!window.ethereum || !walletAddress) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(_4pool_deposit_contract_proxy_address, _4POOL_DEPOSIT_ABI, signer);

      // ✅ Hardcoded Values
      const _burn_amount = BigInt("45000000000000000"); // 0.045 ETH in wei
      const i = 0; // Index of the token
      const _min_received = BigInt(45659); // Minimum tokens received

      // ✅ Call `remove_liquidity_one_coin`
      const tx = await contract.remove_liquidity_one_coin(_burn_amount, i, _min_received);
      alert(`Transaction Sent! Tx Hash: ${tx.hash}`);

      await tx.wait();
      alert("Liquidity Removed Successfully!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <Web3Context.Provider
      value={{ walletAddress, connectWallet, addLiquidity, approveSpender, addLiquidity4Pool, withdraw4Pool }}
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
