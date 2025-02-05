import React, { useState } from "react";
import Chat from "../components/Chat";
import ChatNotificationPanel from "../components/ChatNotificationPanel";
import { useAccount } from "wagmi";
import { useWeb3 } from "../context/Web3Context";
import { Address, Badge, Identity, Name } from "@coinbase/onchainkit/identity";

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

      {/* ✅ Wallet Connection Status */}
      {walletAddress ? (
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
      )}

      {/* ✅ User Profile */}
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
