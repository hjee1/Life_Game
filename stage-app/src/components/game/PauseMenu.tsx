"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { STAT_LABELS } from "@/lib/constants";
import { StatName } from "@/types";

interface Props {
  onClose: () => void;
}

const STAT_ORDER: StatName[] = ["body", "mind", "art", "knowledge", "bond"];

export function PauseMenu({ onClose }: Props) {
  const stats = useGameStore((s) => s.stats);
  const streak = useGameStore((s) => s.streak);
  const setToken = useGameStore((s) => s.setToken);
  const router = useRouter();

  function handleLogout() {
    setToken(null);
    router.push("/login");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-[90%] max-w-sm bg-gray-900/95 backdrop-blur-md rounded-xl border-2 border-amber-400/50 p-5 animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-amber-300">✦ Stage ✦</h2>
          <p className="text-[10px] text-gray-500">메뉴</p>
        </div>

        {/* Profile */}
        <div className="bg-black/30 rounded-lg p-3 mb-3 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400/20 rounded-lg flex items-center justify-center text-2xl">🎭</div>
            <div>
              <p className="text-sm font-bold text-white">지현우</p>
              <p className="text-[10px] text-gray-400">스테이지 시티 주민</p>
              {streak && (
                <p className="text-[10px] text-amber-400 mt-0.5">
                  🔥 {streak.current}일 연속 | 최장 {streak.longest}일
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="bg-black/30 rounded-lg p-3 mb-3 border border-gray-700">
            <p className="text-[10px] font-bold text-gray-500 mb-2">📊 스탯</p>
            <div className="space-y-1.5">
              {STAT_ORDER.map((name) => {
                const label = STAT_LABELS[name];
                const data = stats[name];
                return (
                  <div key={name} className="flex items-center gap-2">
                    <span className="text-xs w-4 text-center">{label.emoji}</span>
                    <span className="text-[10px] text-white w-10">{label.hanja}</span>
                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (data.value / data.nextLevelAt) * 100)}%`,
                          backgroundColor: label.color,
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 w-14 text-right">
                      Lv.{data.level} ({data.value})
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700 text-center">
              <span className="text-[10px] text-amber-400">🔦 스포트라이트: {stats.spotlight}</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-400/80 text-gray-900 font-bold rounded-lg text-sm active:scale-[0.98] transition-all"
          >
            게임으로 돌아가기
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 border border-red-400/30 text-red-400 text-xs rounded-lg hover:bg-red-400/10 transition-all"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
