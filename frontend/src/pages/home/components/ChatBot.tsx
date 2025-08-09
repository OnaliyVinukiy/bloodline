/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useState, useRef, useEffect } from "react";
import { FaCommentAlt, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const Chatbot = () => {
  const { t } = useTranslation("chatbot");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: t("hello_message"),
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Add loading indicator
    const loadingMessage: Message = {
      id: "loading-" + Date.now().toString(),
      text: t("loading_message"),
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await fetch(`${backendURL}/api/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id));

      //Add bot response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: data.reply,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);

      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id));

      //Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: t("error_message"),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot button */}
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all duration-300"
          aria-label="Open chatbot"
        >
          <FaCommentAlt className="text-xl" />
        </button>
      )}

      {/* Chatbot window */}
      {isOpen && (
        <div className="w-80 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg">{t("title")}</h3>
            <button
              onClick={toggleChatbot}
              className="text-white hover:text-gray-200"
              aria-label="Close chatbot"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-red-500 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-center">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("placeholder")}
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ""}
                className="bg-red-600 text-white p-3 rounded-r-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-300"
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
