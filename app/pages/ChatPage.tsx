import React from "react";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import ChatNotificationPanel from "../components/ChatNotificationPanel";

const ChatPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="h-7/8 flex bg-customGray">
        <Chat />
        <ChatNotificationPanel />
      </div>
    </div>
  );
};

export default ChatPage;
