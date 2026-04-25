"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { BottomNav } from "@/components/layout/BottomNav";

interface QuestItem {
  id: string;
  title: string;
  type: string;
  emoji: string;
  description: string;
  totalSteps: number;
}

export default function QuestsPage() {
  const token = useGameStore((s) => s.token);
  const { apiFetch } = useApi();
  const router = useRouter();
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [tab, setTab] = useState<"main" | "side">("main");

  useEffect(() => {
    if (!token) { router.push("/login"); return; }

    apiFetch<{ daily: unknown[]; active: QuestItem[] }>("/api/quests").then((res) => {
      if (res.success && res.data) setQuests(res.data.active);
    });
  }, [token]);

  if (!token) return null;

  const filtered = quests.filter((q) => q.type === tab);

  return (
    <div className="pb-nav">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-gray-800">퀘스트</h1>
      </div>

      {/* 탭 */}
      <div className="px-4 flex gap-2 mb-4">
        {(["main", "side"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              tab === t ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            {t === "main" ? "메인" : "사이드"}
          </button>
        ))}
      </div>

      {/* 퀘스트 목록 */}
      <div className="px-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">아직 해금된 퀘스트가 없어요</p>
        ) : (
          filtered.map((q) => (
            <div key={q.id} className="bg-white/80 rounded-xl p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{q.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-gray-800">{q.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{q.description}</p>
                  {q.totalSteps > 1 && (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: q.totalSteps }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-gray-200" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
