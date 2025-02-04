import React, { useState } from "react";
import axios from "axios";
import Message from "./Message";
import ChatInput from "./ChatInput";

interface Message {
  sender: "User" | "Bot";
  text: string;
}

const Chat: React.FC = () => {
  const check_pool_balances_in_response = (response: string): boolean => {
    // Regular expressions to match the required format
    return response.includes("The pool balances for the address");
  };

  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { sender: "User", text: message }]);

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", { message });

      //Decode the Message for pool balances
      var text = res.data.response;
      if (check_pool_balances_in_response(res.data.response)) {
        text = res.data.tool_response;
      }
      setMessages((prev) => [...prev, { sender: "Bot", text: text }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "Something went wrong!" },
      ]);
    }
  };

  return (
    <div className="w-3/4 flex flex-col bg-white rounded-extra-rounded ml-20 m-4 p-4 relative shadow-2xl border-2 border-green-200">
      <h1 className="text-3xl font-semibold text-gray-900 pl-7 pt-2">Chimera-X</h1>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-7 custom-scrollbar">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
