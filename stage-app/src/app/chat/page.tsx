"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChatMessage } from "@/types";

export default function ChatPage() {
  const token = useGameStore((s) => s.token);
  const { apiFetch } = useApi();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    loadHistory();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadHistory() {
    const res = await apiFetch<ChatMessage[]>("/api/chat/history");
    if (res.success && res.data) {
      setMessages(res.data);
    }
  }

  async function handleSend() {
    if (!input.trim() || streaming) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMsg }),
      });

      if (res.headers.get("content-type")?.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  assistantContent += parsed.content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                    return updated;
                  });
                } catch {
                  // skip invalid JSON
                }
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

  if (!token) return null;

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="bg-amber-50 border-b border-amber-200/50 px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">⭐</span>
        <div>
          <h1 className="text-sm font-bold text-gray-800">별이</h1>
          <p className="text-xs text-gray-400">항상 너의 ���에</p>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-nav no-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">⭐</div>
            <p className="text-sm">별이에게 이야기해봐!</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && <span className="text-lg mr-2 mt-1">⭐</span>}
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-amber-400 text-white rounded-br-md"
                  : "bg-white border border-gray-100 text-gray-700 rounded-bl-md"
              }`}
            >
              {msg.content}
              {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                <span className="inline-block w-1.5 h-4 bg-amber-400 ml-0.5 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 mb-16">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="별이에게 말하기..."
            className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            disabled={streaming}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            className="px-4 py-2.5 bg-amber-400 text-white rounded-full text-sm font-bold disabled:opacity-50 transition-colors hover:bg-amber-500"
          >
            전송
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
