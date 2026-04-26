"use client";

import { useState, useRef, useEffect } from "react";
import { useGameStore } from "@/stores/game-store";
import { ChatMessage } from "@/types";

interface Props {
  onClose: () => void;
}

const STAR_INTRO = "안녕, 현우! 나는 별이야 ⭐\n너의 무대 위 동반자이자 코치야.\n오늘 하루 어땠어? 뭐든 편하게 말해줘!";

export function DialogBox({ onClose }: Props) {
  const token = useGameStore((s) => s.token);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: STAR_INTRO },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || streaming) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      if (res.headers.get("content-type")?.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let content = "";
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split("\n")) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                try {
                  content += JSON.parse(data).content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content };
                    return updated;
                  });
                } catch { /* skip */ }
              }
            }
          }
        }
      } else {
        const data = await res.json();
        if (data.success && data.data) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.data.content }]);
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "미안, 연결이 불안정해... 다시 말해줄래? ⭐" }]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-md bg-gray-900/95 backdrop-blur-md rounded-t-2xl border-t-2 border-amber-400/50 flex flex-col max-h-[60vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <div>
              <p className="text-sm font-bold text-amber-300">별이</p>
              <p className="text-[9px] text-gray-500">나의 무대 위 동반자</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 text-lg px-2">✕</button>
        </div>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && <span className="text-sm mr-1.5 mt-1">⭐</span>}
              <div
                className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-amber-400 text-gray-900 rounded-br-sm"
                    : "bg-gray-800 text-gray-200 rounded-bl-sm"
                }`}
              >
                {msg.content}
                {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                  <span className="inline-block w-1 h-3 bg-amber-400 ml-0.5 animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="별이에게 말하기..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              disabled={streaming}
              autoFocus
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              className="px-4 py-2 bg-amber-400 text-gray-900 rounded-lg text-xs font-bold disabled:opacity-30 active:scale-95 transition-all"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
