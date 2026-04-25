"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { StatCard } from "@/components/features/dashboard/StatCard";
import { QuestCheckList } from "@/components/features/dashboard/QuestCheckList";
import { SpotlightGauge } from "@/components/features/dashboard/SpotlightGauge";
import { StarMessage } from "@/components/features/dashboard/StarMessage";
import { BottomNav } from "@/components/layout/BottomNav";
import { STAT_NAMES } from "@/lib/constants";
import { StatName, StatsResponse } from "@/types";

export default function DashboardPage() {
  const token = useGameStore((s) => s.token);
  const stats = useGameStore((s) => s.stats);
  const setStats = useGameStore((s) => s.setStats);
  const setDailyQuests = useGameStore((s) => s.setDailyQuests);
  const streak = useGameStore((s) => s.streak);
  const setStreak = useGameStore((s) => s.setStreak);
  const { apiFetch } = useApi();
  const { greeting, bgClass, textClass } = useTimeOfDay();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadData() {
      const [statsRes, questsRes, streakRes] = await Promise.all([
        apiFetch<StatsResponse>("/api/stats"),
        apiFetch<{ daily: Array<{ id: string; title: string; emoji: string; completedToday: boolean; statReward: { stat: StatName; delta: number } | null }> }>("/api/quests?type=daily"),
        apiFetch<{ current: number; longest: number; todayCompleted: number; todayTotal: number; lastCompletedAt: string | null }>("/api/streak"),
      ]);

      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (questsRes.success && questsRes.data) {
        setDailyQuests(
          questsRes.data.daily.map((q) => ({
            ...q,
            type: "daily" as const,
            description: "",
            totalSteps: 1,
            isActive: true,
            streak: 0,
          }))
        );
      }
      if (streakRes.success && streakRes.data) setStreak(streakRes.data);
      setLoaded(true);
    }

    loadData();
  }, [token]);

  if (!token) return null;

  return (
    <div className="pb-nav">
      {/* 헤더 (시간대별 배경) */}
      <div className={`${bgClass} px-5 pt-12 pb-6 rounded-b-3xl`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`text-xl font-bold ${textClass}`}>Stage</h1>
            <p className={`text-sm mt-1 ${textClass} opacity-80`}>{greeting}</p>
          </div>
          {streak && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className={`text-xs font-bold ${textClass}`}>
                🔥 {streak.current}일 연��
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-4 -mt-4 space-y-4">
        {/* 별이 한마디 */}
        <StarMessage />

        {/* 스포트라이트 게이지 */}
        <SpotlightGauge />

        {/* 5대 스탯 */}
        {stats && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-700 px-1">스탯</h3>
            {STAT_NAMES.map((name) => (
              <StatCard key={name} name={name} data={stats[name]} />
            ))}
          </div>
        )}

        {/* 데일리 퀘스트 */}
        <QuestCheckList />

        {!loaded && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-sm">무대를 준비하는 중...</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
