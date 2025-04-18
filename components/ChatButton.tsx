// components/ChatButton.tsx
"use client";
import { useState } from "react";
import AssistantBox from "./AssistantBox";
import { MessageCircle } from "lucide-react";

export default function ChatButton({ userId }: { userId: string }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShow(!show)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageCircle />
        </button>
      </div>

      {show && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-xl rounded-lg p-4 z-50">
          <AssistantBox userId={userId} closeBox={() => setShow(false)} />
        </div>
      )}
    </>
  );
}
