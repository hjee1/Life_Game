"use client";

import { useState, useEffect } from "react";
import { Zone, ZoneActivity } from "@/game/types";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { STAT_LABELS } from "@/lib/constants";
import { StatName } from "@/types";

interface Props {
  zone: Zone;
  onClose: () => void;
  onStartActivity: (activity: ZoneActivity) => void;
}

interface QuestItem {
  id: string;
  title: string;
  emoji: string;
  description: string;
  completedToday: boolean;
  statReward: { stat: string; delta: number } | null;
}

export function ZonePanel({ zone, onClose, onStartActivity }: Props) {
  const stats = useGameStore((s) => s.stats);
  const { apiFetch } = useApi();
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [completing, setCompleting] = useState<string | null>(null);

  const statLabel = zone.stat && zone.stat !== "gold"
    ? STAT_LABELS[zone.stat as StatName]
    : null;
  const statData = stats && zone.stat && zone.stat !== "gold"
    ? stats[zone.stat as StatName]
    : null;

  // Load zone-relevant quests
  useEffect(() => {
    if (!zone.stat) return;
    apiFetch<{ daily: QuestItem[]; active: Array<QuestItem & { type: string }> }>("/api/quests").then((res) => {
      if (res.success && res.data) {
        // Filter quests by stat
        const relevant = [
          ...res.data.daily.filter((q) => q.statReward?.stat === zone.stat),
          ...res.data.active.filter((q) => q.statReward?.stat === zone.stat),
        ];
        setQuests(relevant);
      }
    });
  }, [zone.stat]);

  async function handleCompleteQuest(questId: string) {
    setCompleting(questId);
    await apiFetch(`/api/quests/${questId}/complete`, { method: "POST" });
    setQuests((prev) => prev.map((q) => q.id === questId ? { ...q, completedToday: true } : q));
    setCompleting(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-md bg-gray-900/95 backdrop-blur-md rounded-t-2xl border-t-2 border-amber-400/50 p-4 pb-8 animate-slide-up max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-amber-300">
              {zone.emoji} {zone.name}
            </h2>
            <p className="text-xs text-gray-400 mt-1 whitespace-pre-line">{zone.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 text-xl px-2">✕</button>
        </div>

        {/* Stat info */}
        {statLabel && statData && (
          <div className="bg-black/30 rounded-lg p-3 mb-4 border border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold" style={{ color: statLabel.color }}>
                {statLabel.emoji} {statLabel.hanja}({statLabel.ko})
              </span>
              <span className="text-xs text-gray-400">
                Lv.{statData.level} — {statData.value}/{statData.nextLevelAt}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (statData.value / statData.nextLevelAt) * 100)}%`,
                  backgroundColor: statLabel.color,
                }}
              />
            </div>
          </div>
        )}

        {/* Activities */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-gray-500 mb-2">🎮 활동</h3>
          <div className="space-y-2">
            {zone.activities.map((act) => (
              <button
                key={act.id}
                onClick={() => onStartActivity(act)}
                className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-left hover:border-amber-400/50 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{act.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{act.name}</p>
                    <p className="text-[10px] text-gray-400">{act.description}</p>
                  </div>
                  {act.statReward && (
                    <span className="text-[10px] px-2 py-1 bg-amber-400/20 text-amber-300 rounded font-bold">
                      +{act.statReward.delta}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Zone quests */}
        {quests.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 mb-2">📜 관련 퀘스트</h3>
            <div className="space-y-2">
              {quests.map((q) => (
                <div
                  key={q.id}
                  className={`bg-black/30 border rounded-lg p-3 ${
                    q.completedToday ? "border-green-700" : "border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{q.completedToday ? "✅" : q.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${q.completedToday ? "text-green-400 line-through" : "text-white"}`}>
                        {q.title}
                      </p>
                      {q.description && (
                        <p className="text-[10px] text-gray-400">{q.description}</p>
                      )}
                    </div>
                    {!q.completedToday && (
                      <button
                        onClick={() => handleCompleteQuest(q.id)}
                        disabled={completing === q.id}
                        className="px-3 py-1 bg-amber-400/80 text-gray-900 text-[10px] font-bold rounded active:scale-95 disabled:opacity-50"
                      >
                        {completing === q.id ? "..." : "완료"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
