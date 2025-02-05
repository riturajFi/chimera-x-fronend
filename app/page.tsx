"use client";

import React from "react";
import ChatPage from "./pages/ChatPage"; // Import ChatPage from the pages folder
import LandingPage from "./pages/LandingPage";
import { Web3Provider } from "./context/Web3Context";
import TransactPage from "./pages/TransactPage";
const Page: React.FC = () => {
  return (
    <Web3Provider>
      <ChatPage />
    </Web3Provider>
  );
  // return (
  //   <Web3Provider>
  //     {/* Landing Page: Connect wallet */}
  //     <LandingPage />

  //     {/* Transact Page: Send ETH after connecting */}
  //     <TransactPage />
  //   </Web3Provider>
  // );
};

export default Page;
