"use client";

import { useGameStore } from "@/stores/game-store";

export function StarMessage() {
  const starMessage = useGameStore((s) => s.starMessage);

  return (
    <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/50">
      <div className="flex items-start gap-2">
        <span className="text-2xl mt-0.5">⭐</span>
        <div>
          <p className="text-xs text-amber-600 font-bold mb-0.5">별이</p>
          <p className="text-sm text-gray-700 leading-relaxed">{starMessage}</p>
        </div>
      </div>
    </div>
  );
}
