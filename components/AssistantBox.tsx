"use client";

import { useState } from "react";
import { UserIcon, BotIcon } from "lucide-react";
import { motion } from "framer-motion";

const questions = [
  "What type of events are supported?",
  "How can I book an event?",
  "Can I cancel my event booking?",
  "How do I check event details?",
  "Can I reschedule my event?",
  "How do I update my booking details?",
  "Can I add guests to my booking?",
  "How do I contact event organizers?",
];

export default function AssistantBox({
  userId,
  closeBox,
}: {
  userId: string;
  closeBox: () => void;
}) {
  const [chat, setChat] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (msg: string) => {
    setLoading(true);
    setChat((prev) => [...prev, `You: ${msg}`]);

    const res = await fetch("/api/assistant", {
      method: "POST",
      body: JSON.stringify({ userId, message: msg }),
    });

    const data = await res.json();

    // Simulate bot "thinking" delay (2 to 3 seconds)
    const delay = Math.random() * 1000 + 2000; // 2000ms to 3000ms

    setTimeout(() => {
      setChat((prev) => [...prev, `Assistant: ${data.reply}`]);
      setLoading(false);
    }, delay);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.4 }}
      className="relative w-80 max-w-full rounded-3xl overflow-hidden bg-white shadow-xl border border-transparent bg-clip-padding"
    >
      {/* Gradient Border Layer */}
      <div className="absolute inset-0 z-[-1] rounded-3xl p-[2px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Content */}
      <div className="flex flex-col h-full bg-white rounded-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 text-center font-semibold text-lg relative rounded-t-3xl">
          QuickPass - AI Buddy
          <button
            onClick={closeBox}
            className="absolute top-2 right-3 text-white hover:text-gray-200 text-xl transition duration-200"
          >
            ✖
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-72 overflow-y-auto px-3 py-4 space-y-3 bg-white scroll-smooth">
          {chat.map((msg, idx) => {
            const isUser = msg.startsWith("You:");
            const displayMsg = msg.replace(/^You:\s?|^Assistant:\s?/, "");

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isUser ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-2 ${
                  isUser ? "justify-end flex-row-reverse" : "justify-start"
                }`}
              >
                <div className="shrink-0 mt-1">
                  {isUser ? (
                    <UserIcon className="w-5 h-5 text-blue-600" />
                  ) : (
                    <BotIcon className="w-5 h-5 text-purple-500" />
                  )}
                </div>
                <div
                  className={`max-w-[70%] px-4 py-2 text-sm rounded-2xl shadow ${
                    isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {displayMsg}
                </div>
              </motion.div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2 justify-start animate-pulse">
              <div className="shrink-0 mt-1">
                <BotIcon className="w-5 h-5 text-gray-400 animate-bounce" />
              </div>
              <div className="px-4 py-2 bg-gray-100 text-gray-500 text-sm rounded-2xl shadow">
                Assistant: Typing...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Buttons */}
        <div className="p-3 border-t border-gray-100 flex flex-wrap gap-2 bg-white">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="text-xs bg-gray-100 hover:bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 hover:text-blue-700 rounded-full px-4 py-1 transition transform hover:scale-105"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
