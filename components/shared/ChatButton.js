"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import ChatBox from "./ChatBox";

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 cursor-pointer right-6 bg-teal-950 text-white p-4 rounded-full shadow-lg"
      >
        <MessageCircle size={24} />
      </button>
      {open && (
        <div ref={chatBoxRef}>
          <ChatBox onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default ChatButton;