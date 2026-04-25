"use client";

import { useGameStore } from "@/stores/game-store";

export function SpotlightGauge() {
  const stats = useGameStore((s) => s.stats);
  const spotlight = stats?.spotlight ?? 0;

  return (
    <div className="game-card p-3 animate-slide-up">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-gray-700">🔦 스포트라이트</h3>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-amber-500 animate-pulse-glow rounded px-1">{spotlight}</span>
          <span className="text-[10px] text-gray-400">/ 100</span>
        </div>
      </div>

      {/* 게이지 바 (RPG 스타일) */}
      <div className="stat-bar h-4">
        <div
          className="stat-bar-fill relative overflow-hidden"
          style={{
            width: `${Math.min(100, spotlight)}%`,
            background: "linear-gradient(90deg, #F4D03F, #E67E22, #E74C3C)",
          }}
        >
          {/* 반짝이는 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mt-1 text-center">
        ✦ 5대 스탯의 균형과 성장이 빛을 만든다 ✦
      </p>
    </div>
  );
}
