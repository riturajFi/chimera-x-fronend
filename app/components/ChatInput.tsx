import React, { useState } from "react";

interface ChatInputProps {
  sendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ sendMessage }) => {
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex items-center bg-gray-300 p-2 rounded-full mt-4 shadow-inner">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-800"
      />
      <button
        onClick={handleSendMessage}
        className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full ml-3"
      >
        ➤
      </button>
    </div>
  );
};

export default ChatInput;
