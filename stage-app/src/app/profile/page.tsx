"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { BottomNav } from "@/components/layout/BottomNav";
import { GameTitle } from "@/types";

export default function ProfilePage() {
  const token = useGameStore((s) => s.token);
  const stats = useGameStore((s) => s.stats);
  const streak = useGameStore((s) => s.streak);
  const titles = useGameStore((s) => s.titles);
  const setTitles = useGameStore((s) => s.setTitles);
  const setToken = useGameStore((s) => s.setToken);
  const { apiFetch } = useApi();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push("/login"); return; }

    apiFetch<GameTitle[]>("/api/titles").then((res) => {
      if (res.success && res.data) setTitles(res.data);
    });
  }, [token]);

  function handleLogout() {
    setToken(null);
    router.push("/login");
  }

  if (!token) return null;

  return (
    <div className="pb-nav">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl">
            🎭
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">지현우</h1>
            <p className="text-xs text-gray-500">스테이지 시티 주민</p>
            {streak && (
              <p className="text-xs text-amber-600 mt-0.5">🔥 {streak.current}일 연속 | 최장 {streak.longest}일</p>
            )}
          </div>
        </div>
      </div>

      {/* 스포트라이트 요약 */}
      <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
        <div className="text-center">
          <p className="text-xs text-amber-600 font-bold">스포트라이트</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{stats?.spotlight ?? 0}</p>
        </div>
      </div>

      {/* 칭호 */}
      <div className="px-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">칭호</h3>
        <div className="space-y-2">
          {titles.map((t) => (
            <div
              key={t.titleId}
              className={`p-3 rounded-xl border ${
                t.unlocked
                  ? "bg-amber-50 border-amber-200"
                  : "bg-gray-50 border-gray-200 opacity-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">
                  {t.unlocked ? "🏆" : "🔒"} {t.titleName}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="px-4 mt-8">
        <button
          onClick={handleLogout}
          className="w-full py-3 text-sm text-red-400 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          로그아웃
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
