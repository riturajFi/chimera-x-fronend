import {
  Address,
  Avatar,
  Badge,
  Identity,
  Name,
  useAddress,
} from "@coinbase/onchainkit/identity";
import { WalletDefault, Wallet } from "@coinbase/onchainkit/wallet";
import React from "react";
import { useAccount } from "wagmi";
import { useWeb3 } from "../context/Web3Context";

const Navbar: React.FC = () => {
  const { address } = useAccount();
  const { walletAddress, connectWallet } = useWeb3();

  return (
    <div className="h-1/8 top-0 left-0 w-full flex items-center justify-between px-6 py-3 bg-customGray z-50">
      <div className="flex items-center rounded-full">
        <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
          ⚡
        </div>
      </div>
      <nav className="flex space-x-4 bg-white px-4 py-2 rounded-full shadow-lg">
        <button className="bg-black text-white px-4 py-2 rounded-full font-semibold shadow-sm">
          Chat
        </button>
        <button className="text-gray-600 px-4 py-2">Settings</button>
        <button className="text-gray-600 px-4 py-2">Notification</button>
        <button className="text-gray-600 px-4 py-2">Templates</button>
        <button className="text-gray-600 px-4 py-2">Tools</button>
      </nav>{" "}
      {/* {walletAddress ? (
        <p className="text-green-600 font-bold">
          ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      ) : (
        <button
          className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )} */}
      <Wallet className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
        Connect Wallet
      </Wallet>
      <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-lg">
        <img
          src="https://img.freepik.com/premium-photo/cool-man-3d-cartoon-avatar-portrait_839035-196561.jpg"
          alt="User"
          className="w-10 h-10 rounded-full"
        />
        <Identity
          address={address}
          schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
          className="bg-white text-gray-800 font-medium"
        >
          <Name className="text-black" address={address}>
            <Badge />
          </Name>
          <Address />
        </Identity>
      </div>
    </div>
  );
};

export default Navbar;
