"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { Character } from "@/components/features/dashboard/Character";
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
        apiFetch<{ daily: Array<{ id: string; title: string; emoji: string; description: string; completedToday: boolean; statReward: { stat: StatName; delta: number } | null }> }>("/api/quests?type=daily"),
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

  if (!loaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-gray-900">
        <div className="text-5xl animate-float mb-4">⭐</div>
        <p className="text-amber-300 text-sm animate-pulse">무대를 준비하는 중...</p>
      </div>
    );
  }

  return (
    <div className="pb-nav min-h-screen">
      {/* 시간대별 배경 + 캐릭터 영역 */}
      <div className={`${bgClass} relative overflow-hidden`}>
        {/* 배경 별/파티클 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-8 text-xs opacity-40 animate-twinkle">✦</div>
          <div className="absolute top-12 right-12 text-xs opacity-30 animate-twinkle" style={{ animationDelay: '0.5s' }}>✧</div>
          <div className="absolute top-20 left-20 text-[10px] opacity-20 animate-twinkle" style={{ animationDelay: '1s' }}>✦</div>
          <div className="absolute top-8 right-24 text-[10px] opacity-25 animate-twinkle" style={{ animationDelay: '1.5s' }}>✧</div>
        </div>

        <div className="relative px-5 pt-10 pb-8">
          {/* 상단 바 */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className={`text-lg font-bold ${textClass}`}>
                ✦ Stage ✦
              </h1>
              <p className={`text-[11px] mt-0.5 ${textClass} opacity-70`}>{greeting}</p>
            </div>
            {streak && (
              <div className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded pixel-border-gold">
                <span className="text-xs font-bold text-amber-300">
                  🔥 {streak.current}일 연속
                </span>
              </div>
            )}
          </div>

          {/* 캐릭터 + 별이 */}
          <div className="relative flex justify-center py-4">
            <Character />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-3 -mt-3 space-y-3">
        {/* 별이 한마디 */}
        <StarMessage />

        {/* 스포트라이트 게이지 */}
        <SpotlightGauge />

        {/* 5대 스탯 (2+3 그리드) */}
        {stats && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-gray-700 px-1">📊 스탯</h3>
            {STAT_NAMES.map((name) => (
              <StatCard key={name} name={name} data={stats[name]} />
            ))}
          </div>
        )}

        {/* 데일리 퀘스트 */}
        <QuestCheckList />
      </div>

      <BottomNav />
    </div>
  );
}
