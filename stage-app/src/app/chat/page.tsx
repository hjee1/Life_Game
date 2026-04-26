"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChatMessage } from "@/types";

const STAR_INTRO = {
  role: "assistant" as const,
  content: "안녕, 현우! 나는 별이야 ⭐\n\n나는 너의 무대 위 동반자야. 이런 것들을 도와줄 수 있어:\n\n✦ 오늘 하루 어땠는지 이야기 나누기\n✦ 퀘스트나 목표에 대한 조언\n✦ 힘들 때 응원, 잘했을 때 칭찬\n✦ 연기, 운동, 공부 등 고민 상담\n\n편하게 말해줘. 나는 항상 여기 있어! 🌟",
};

const QUICK_PROMPTS = [
  { emoji: "💭", text: "오늘 하루 어땠어" },
  { emoji: "🎯", text: "퀘스트 뭐부터 하면 좋을까?" },
  { emoji: "💪", text: "동기부여 해줘" },
  { emoji: "🎭", text: "연기 연습 팁 알려줘" },
];

export default function ChatPage() {
  const token = useGameStore((s) => s.token);
  const { apiFetch } = useApi();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
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
    if (res.success && res.data && res.data.length > 0) {
      setMessages(res.data);
      setShowIntro(false);
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return;
    const userMsg = text.trim();
    setInput("");
    setShowIntro(false);
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
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b-2 border-amber-200/50 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-300 rounded-lg pixel-border flex items-center justify-center">
          <span className="text-xl animate-twinkle">⭐</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-800">별이</h1>
          <p className="text-[10px] text-amber-600">나의 무대 위 동반자 — AI 코치 & 친구</p>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-nav no-scrollbar bg-gradient-to-b from-amber-50/30 to-white/50">
        {/* 온보딩 (처음이거나 히스토리 없을 때) */}
        {showIntro && messages.length === 0 && (
          <>
            {/* 별이 소개 */}
            <div className="flex justify-start">
              <span className="text-lg mr-2 mt-1 animate-float">⭐</span>
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md bg-white border-2 border-amber-200 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {STAR_INTRO.content}
              </div>
            </div>

            {/* 빠른 시작 버튼 */}
            <div className="flex flex-wrap gap-2 pl-8">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt.text)}
                  className="px-3 py-1.5 bg-white border-2 border-amber-200 rounded-full text-[11px] text-gray-600 hover:bg-amber-50 hover:border-amber-300 transition-all active:scale-95"
                >
                  {prompt.emoji} {prompt.text}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && <span className="text-lg mr-2 mt-1">⭐</span>}
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-amber-400 text-white rounded-br-md pixel-border"
                  : "bg-white border-2 border-amber-100 text-gray-700 rounded-bl-md"
              }`}
              style={msg.role === "user" ? { borderColor: "#c9a520", boxShadow: "2px 2px 0 #c9a520" } : {}}
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
      <div className="border-t-2 border-amber-200/50 bg-white px-4 py-3 mb-16">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="별이에게 말하기..."
            className="flex-1 px-4 py-2.5 bg-amber-50/50 border-2 border-amber-200/50 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition-colors"
            disabled={streaming}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            className="px-4 py-2.5 bg-amber-400 text-gray-900 rounded-lg text-sm font-bold disabled:opacity-30 transition-all hover:bg-amber-500 pixel-border active:translate-y-0.5"
          >
            전송
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
