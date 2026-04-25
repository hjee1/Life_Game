"use client";

import { useState } from "react";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";

export function QuestCheckList() {
  const dailyQuests = useGameStore((s) => s.dailyQuests);
  const markQuestCompleted = useGameStore((s) => s.markQuestCompleted);
  const setStats = useGameStore((s) => s.setStats);
  const setStarMessage = useGameStore((s) => s.setStarMessage);
  const { apiFetch } = useApi();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleComplete(questId: string) {
    setLoading(questId);
    try {
      const res = await apiFetch<{
        quest: { id: string };
        rewards: { stats: { stat: string; delta: number; newValue: number }[]; spotlight: number; streak: number };
      }>(`/api/quests/${questId}/complete`, { method: "POST" });

      if (res.success) {
        markQuestCompleted(questId);
        // 스탯 새로고침
        const statsRes = await apiFetch<Record<string, unknown>>("/api/stats");
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data as never);
        }
        const reward = res.data?.rewards.stats[0];
        if (reward) {
          setStarMessage(`${reward.stat} +${reward.delta}! 잘했어! ⭐`);
        }
      }
    } finally {
      setLoading(null);
    }
  }

  if (dailyQuests.length === 0) {
    return (
      <div className="p-4 bg-white/80 rounded-xl text-center text-gray-400 text-sm">
        퀘스트를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-gray-700 px-1">오늘의 퀘스트</h3>
      {dailyQuests.map((quest) => (
        <button
          key={quest.id}
          onClick={() => !quest.completedToday && handleComplete(quest.id)}
          disabled={quest.completedToday || loading === quest.id}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
            quest.completedToday
              ? "bg-green-50 border border-green-200"
              : "bg-white/80 border border-gray-100 active:scale-[0.98]"
          }`}
        >
          <span className="text-xl">
            {quest.completedToday ? "✅" : loading === quest.id ? "⏳" : quest.emoji}
          </span>
          <span
            className={`flex-1 text-left text-sm ${
              quest.completedToday ? "text-green-600 line-through" : "text-gray-700"
            }`}
          >
            {quest.title}
          </span>
        </button>
      ))}
    </div>
  );
}
