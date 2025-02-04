import React, { useState } from "react";

const ChatNotificationPanel: React.FC = () => {
  const [isChatHistory, setIsChatHistory] = useState(true);

  return (
    <div className="w-1/4 relative m-6 flex flex-col h-[calc(100vh-120px)] overflow-hidden rounded-extra-rounded shadow-2xl">
      <div className="absolute inset-0 bg-blue-700"></div>
      <div className="relative flex justify-center bg-white/30 backdrop-blur-xl p-4 rounded-t-extra-rounded z-10 shadow-lg">
        <button onClick={() => setIsChatHistory(true)} className="text-white font-medium px-6 py-2 bg-black rounded-full">Chat History</button>
        <button onClick={() => setIsChatHistory(false)} className="text-white font-medium px-6 py-2 ml-2 bg-black rounded-full">Notifications</button>
      </div>
    </div>
  );
};

export default ChatNotificationPanel;
