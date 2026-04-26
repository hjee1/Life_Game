"use client";

import { useState, useEffect } from "react";
import { ActiveActivity } from "@/game/types";

interface Props {
  activity: ActiveActivity;
  onEnd: () => void;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hours > 0) return `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function ActivityOverlay({ activity, onEnd }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - activity.startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [activity.startTime]);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-black/80 backdrop-blur-md rounded-xl border-2 border-amber-400/50 px-5 py-3 flex items-center gap-3 min-w-[200px]">
        {/* Activity emoji (pulsing) */}
        <span className="text-3xl animate-bounce">{activity.emoji}</span>

        <div className="flex-1">
          <p className="text-sm font-bold text-amber-300">{activity.activityName}</p>
          <p className="text-xl font-mono text-white mt-0.5">{formatDuration(elapsed)}</p>
        </div>

        <button
          onClick={onEnd}
          className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white text-sm font-bold rounded-lg active:scale-95 transition-all"
        >
          완료
        </button>
      </div>
    </div>
  );
}
