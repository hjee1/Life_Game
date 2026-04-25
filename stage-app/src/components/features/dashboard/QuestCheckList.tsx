"use client";

import { useState } from "react";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { STAT_LABELS } from "@/lib/constants";
import { StatName } from "@/types";

export function QuestCheckList() {
  const dailyQuests = useGameStore((s) => s.dailyQuests);
  const markQuestCompleted = useGameStore((s) => s.markQuestCompleted);
  const setStats = useGameStore((s) => s.setStats);
  const setStarMessage = useGameStore((s) => s.setStarMessage);
  const { apiFetch } = useApi();
  const [loading, setLoading] = useState<string | null>(null);
  const [completedEffect, setCompletedEffect] = useState<string | null>(null);
  const [rewardPopup, setRewardPopup] = useState<{ stat: string; delta: number } | null>(null);

  async function handleComplete(questId: string) {
    setLoading(questId);
    try {
      const res = await apiFetch<{
        quest: { id: string };
        rewards: { stats: { stat: string; delta: number; newValue: number }[]; spotlight: number; streak: number };
      }>(`/api/quests/${questId}/complete`, { method: "POST" });

      if (res.success) {
        // 완료 이펙트
        setCompletedEffect(questId);
        setTimeout(() => setCompletedEffect(null), 600);

        markQuestCompleted(questId);

        const reward = res.data?.rewards.stats[0];
        if (reward) {
          // 보상 팝업
          setRewardPopup(reward);
          setTimeout(() => setRewardPopup(null), 1500);

          const label = STAT_LABELS[reward.stat as StatName];
          setStarMessage(`${label?.hanja || reward.stat} +${reward.delta}! 잘했어, 현우! ⭐`);
        }

        // 스탯 새로고침
        const statsRes = await apiFetch<Record<string, unknown>>("/api/stats");
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data as never);
        }
      }
    } finally {
      setLoading(null);
    }
  }

  if (dailyQuests.length === 0) {
    return (
      <div className="game-card p-4 text-center text-gray-400 text-sm">
        <div className="text-2xl mb-2 animate-twinkle">⚔️</div>
        퀘스트를 불러오는 중...
      </div>
    );
  }

  const completed = dailyQuests.filter((q) => q.completedToday).length;
  const total = dailyQuests.length;

  return (
    <div className="space-y-2 relative">
      {/* 보상 팝업 */}
      {rewardPopup && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 animate-stat-up">
          <div className="px-4 py-2 bg-amber-400 text-white font-bold rounded-lg pixel-border text-lg">
            {STAT_LABELS[rewardPopup.stat as StatName]?.hanja} +{rewardPopup.delta} ✨
          </div>
        </div>
      )}

      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-gray-700">⚔️ 데일리 퀘스트</h3>
        <span className="text-xs px-2 py-0.5 bg-gray-800 text-amber-300 rounded font-bold">
          {completed}/{total}
        </span>
      </div>

      {dailyQuests.map((quest, i) => (
        <button
          key={quest.id}
          onClick={() => !quest.completedToday && handleComplete(quest.id)}
          disabled={quest.completedToday || loading === quest.id}
          className={`w-full game-card flex items-center gap-3 p-3 transition-all animate-slide-up ${
            quest.completedToday
              ? "bg-green-50/90 border-green-300"
              : "active:translate-y-0.5 active:shadow-none"
          } ${completedEffect === quest.id ? "animate-bounce-in" : ""}`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {/* 체크박스 (게임풍) */}
          <div className={`w-8 h-8 rounded flex items-center justify-center text-lg transition-all ${
            quest.completedToday
              ? "bg-green-400 pixel-border"
              : loading === quest.id
              ? "bg-amber-100 pixel-border animate-pulse"
              : "bg-gray-100 pixel-border"
          }`}>
            {quest.completedToday ? "✓" : loading === quest.id ? "⏳" : quest.emoji}
          </div>

          <div className="flex-1 text-left">
            <span className={`text-sm font-bold ${
              quest.completedToday ? "text-green-600 line-through" : "text-gray-700"
            }`}>
              {quest.title}
            </span>
            {quest.statReward && (
              <span className="text-[10px] ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                {STAT_LABELS[quest.statReward.stat as StatName]?.hanja} +{quest.statReward.delta}
              </span>
            )}
          </div>

          {/* 완료 시 별 이펙트 */}
          {completedEffect === quest.id && (
            <span className="text-xl animate-confetti">⭐</span>
          )}
        </button>
      ))}

      {/* 전체 완료 시 */}
      {completed === total && total > 0 && (
        <div className="game-card p-3 text-center bg-amber-50/90 border-amber-300 animate-bounce-in">
          <p className="text-sm font-bold text-amber-600">
            🎉 오늘의 퀘스트 올클리어! 🎉
          </p>
        </div>
      )}
    </div>
  );
}
