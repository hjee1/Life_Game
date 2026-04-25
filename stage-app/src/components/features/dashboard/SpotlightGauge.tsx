"use client";

import { useGameStore } from "@/stores/game-store";

export function SpotlightGauge() {
  const stats = useGameStore((s) => s.stats);
  const spotlight = stats?.spotlight ?? 0;

  return (
    <div className="p-4 bg-white/80 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-700">🔦 스포트라이트</h3>
        <span className="text-lg font-bold text-amber-500">{spotlight}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-700"
          style={{ width: `${Math.min(100, spotlight)}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1 text-center">
        5대 스탯의 균형과 성장이 빛을 만듭니다
      </p>
    </div>
  );
}
