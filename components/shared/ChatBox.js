"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Bot, User } from "lucide-react";
import useChatStore from "@/store/useChatStore";

const ChatBox = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    addMessage({ text: query, sender: "user" });
    setQuery("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/chat/health-chat-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      addMessage({ 
        text: data.response || data.msg, 
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (error) {
      addMessage({ 
        text: "Sorry, I'm having trouble responding. Please try again later.", 
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-[80%] sm:w-96 h-[400px] bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <h2 className="font-semibold text-lg">Health Assistant</h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 cursor-pointer rounded-full hover:bg-teal-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
            <Bot className="h-10 w-10 mb-2 text-teal-600" />
            <p className="font-medium">How can I help with your health today?</p>
            <p className="text-sm">Ask about symptoms, medications, or general health advice</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-3 ${msg.sender === "user" 
                  ? "bg-teal-600 text-white rounded-br-none" 
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender === "user" ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Bot className="h-4 w-4 text-teal-600" />
                  )}
                  <span className="text-xs font-medium">
                    {msg.sender === "user" ? "You" : "Health Assistant"}
                  </span>
                  {msg.timestamp && (
                    <span className="text-xs opacity-70 ml-auto">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none shadow-sm p-3">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-medium">Health Assistant</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="border-t border-gray-200 p-3 bg-white">
        <div className="flex items-center rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-3 rounded-l-xl outline-none text-sm"
            placeholder="Type your health question..."
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`p-3 rounded-r-xl ${isLoading || !query.trim() 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-teal-600 cursor-pointer text-white hover:bg-teal-700"}`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 px-1">
          Health information provided is for general knowledge only
        </p>
      </form>
    </div>
  );
};

export default ChatBox;