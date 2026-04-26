"use client";

import { useGameStore } from "@/stores/game-store";
import { STAT_LABELS } from "@/lib/constants";
import { StatName } from "@/types";

const STAT_ORDER: StatName[] = ["body", "mind", "art", "knowledge", "bond"];

export function GameHUD() {
  const stats = useGameStore((s) => s.stats);
  const streak = useGameStore((s) => s.streak);

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="flex justify-between items-start p-2 gap-2">
        {/* Stats bar */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1.5 flex gap-2 pointer-events-auto">
          {stats && STAT_ORDER.map((name) => {
            const label = STAT_LABELS[name];
            const data = stats[name];
            return (
              <div key={name} className="flex items-center gap-1">
                <span className="text-[10px]">{label.emoji}</span>
                <div className="w-12">
                  <div className="flex justify-between">
                    <span className="text-[8px] text-white/80 font-bold">{label.hanja}</span>
                    <span className="text-[8px] text-white/60">Lv.{data.level}</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (data.value / data.nextLevelAt) * 100)}%`,
                        backgroundColor: label.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Streak + Spotlight */}
        <div className="flex flex-col gap-1 items-end">
          {streak && streak.current > 0 && (
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 pointer-events-auto">
              <span className="text-[10px] text-amber-300 font-bold">🔥 {streak.current}일</span>
            </div>
          )}
          {stats && (
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 pointer-events-auto">
              <span className="text-[10px] text-amber-400 font-bold">🔦 {stats.spotlight}</span>
            </div>
          )}
        </div>
      </div>

      {/* Zone name (shown when near a zone) */}
      <div className="flex justify-center mt-1" id="zone-indicator" />
    </div>
  );
}
