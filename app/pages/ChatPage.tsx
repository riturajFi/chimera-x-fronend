import React, { useState } from "react";
import Chat from "../components/Chat";
import ChatNotificationPanel from "../components/ChatNotificationPanel";
import { useAccount } from "wagmi";
import { useWeb3 } from "../context/Web3Context";
import {
  Address,
  Avatar,
  Badge,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  ConnectWalletText,
  Wallet,
  WalletDefault,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";

const Navbar: React.FC<{
  setPage: (page: string) => void;
  currentPage: string;
}> = ({ setPage, currentPage }) => {
  const { address } = useAccount();
  const { walletAddress, connectWallet } = useWeb3();

  return (
    <div className="h-1/8 top-0 left-0 w-full flex items-center justify-between px-6 py-3 bg-customGray z-50">
      <div className="flex items-center rounded-full">
        <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
          ⚡
        </div>
      </div>
      {/* ✅ Navigation Buttons for Page Switching */}
      <nav className="flex space-x-4 bg-white px-4 py-2 rounded-full shadow-lg">
        <button
          className={`px-4 py-2 rounded-full font-semibold shadow-sm ${
            currentPage === "Chat" ? "bg-black text-white" : "text-gray-600"
          }`}
          onClick={() => setPage("Chat")}
        >
          Chat
        </button>
        <button
          className={`px-4 py-2 ${
            currentPage === "Settings" ? "bg-black text-white" : "text-gray-600"
          }`}
          onClick={() => setPage("Settings")}
        >
          Settings
        </button>
        <button
          className={`px-4 py-2 ${
            currentPage === "Notifications"
              ? "bg-black text-white"
              : "text-gray-600"
          }`}
          onClick={() => setPage("Notifications")}
        >
          Notification
        </button>
        <button
          className={`px-4 py-2 ${
            currentPage === "Templates"
              ? "bg-black text-white"
              : "text-gray-600"
          }`}
          onClick={() => setPage("Templates")}
        >
          Templates
        </button>
        <button
          className={`px-4 py-2 ${
            currentPage === "Tools" ? "bg-black text-white" : "text-gray-600"
          }`}
          onClick={() => setPage("Tools")}
        >
          Tools
        </button>
      </nav>
      {/* ✅ User Profile */}
      
      <Wallet className="mr-6">
        <ConnectWallet
          className={`mt-4 px-6 py-3 rounded-full shadow-lg hover:scale-105 transition text-white ${
             "bg-gradient-to-r from-blue-500 to-purple-500"
              
          }`}
        >
          <ConnectWalletText>Connect Wallet</ConnectWalletText>
          <img
            src="https://img.freepik.com/premium-photo/cool-man-3d-cartoon-avatar-portrait_839035-196561.jpg"
            alt="User"
            className="w-12 h-12 rounded-full border-4"
          />
          <div className="flex flex-col items-start ml-2 mr-4 text-white">
            <Name className="text-white" />
            <Address className="text-gray-300"/>
          </div>
        </ConnectWallet>
        <WalletDropdown>
          <Identity
            className="px-4 pt-3 pb-2 hover:bg-blue-200"
            hasCopyAddressOnClick
          >
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownLink
            className="hover:bg-blue-200"
            icon="wallet"
            href="https://keys.coinbase.com"
          >
            Wallet
          </WalletDropdownLink>
          <WalletDropdownDisconnect className="hover:bg-blue-200" />
        </WalletDropdown>
      </Wallet>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("Chat");
  return (
    <div className="h-screen flex flex-col">
      <Navbar setPage={setCurrentPage} currentPage={currentPage} />
      {/* ✅ Page Rendering Based on State */}
      <div className="h-7/8 flex bg-customGray">
        {currentPage === "Chat" && (
          <>
            <Chat />
            <ChatNotificationPanel />
          </>
        )}
        {currentPage === "Settings" && (
          <div className="w-full flex justify-center items-center text-2xl font-semibold text-gray-800">
            ⚙️ Settings Page Coming Soon...
          </div>
        )}
        {currentPage === "Notifications" && (
          <div className="w-full flex justify-center items-center text-2xl font-semibold text-gray-800">
            🔔 Notifications Page Coming Soon...
          </div>
        )}
        {currentPage === "Templates" && (
          <div className="w-full flex justify-center items-center text-2xl font-semibold text-gray-800">
            📄 Templates Page Coming Soon...
          </div>
        )}
        {currentPage === "Tools" && (
          <div className="w-full flex justify-center items-center text-2xl font-semibold text-gray-800">
            🛠 Tools Page Coming Soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
