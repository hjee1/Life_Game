"use client";

import { useGameStore } from "@/stores/game-store";

export function StarMessage() {
  const starMessage = useGameStore((s) => s.starMessage);

  return (
    <div className="game-card p-3 bg-amber-50/90 border-amber-200 animate-slide-up">
      <div className="flex items-start gap-2">
        <div className="animate-float">
          <span className="text-3xl animate-twinkle inline-block">⭐</span>
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-amber-600 font-bold mb-0.5">별이</p>
          <p className="text-xs text-gray-700 leading-relaxed">{starMessage}</p>
        </div>
      </div>
    </div>
  );
}
