"use client";

import { useState } from "react";
import axios from "axios";
import { NextResponse } from "next/server";

export const GPTChat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("/api/chat", { message: input });
      const botReply = { role: "assistant", content: response.data.response };

      setMessages((prev) => [...prev, botReply]);
      setInput("");
    } catch (err) {
      console.error("OpenAI Error:", err);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {messages.map((msg, i) => (
          <p
            key={i}
            className={msg.role === "user" ? "text-blue-600" : "text-green-600"}
          >
            <strong>{msg.role}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something like: Find tech events in Delhi"
        />
        <button onClick={sendMessage} className="bg-black text-white px-4 py-2">
          Send
        </button>
      </div>
    </div>
  );
};
