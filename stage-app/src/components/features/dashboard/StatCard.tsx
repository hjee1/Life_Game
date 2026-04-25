"use client";

import { StatData, StatName } from "@/types";
import { STAT_LABELS } from "@/lib/constants";

interface StatCardProps {
  name: StatName;
  data: StatData;
}

export function StatCard({ name, data }: StatCardProps) {
  const label = STAT_LABELS[name];
  const percent = data.nextLevelAt > 0 ? Math.min(100, (data.value / data.nextLevelAt) * 100) : 0;

  return (
    <div className="game-card p-2.5 flex items-center gap-2.5 animate-slide-up">
      {/* 스탯 아이콘 */}
      <div
        className="w-10 h-10 rounded flex items-center justify-center text-xl pixel-border"
        style={{ backgroundColor: label.color + "20", borderColor: label.color }}
      >
        {label.emoji}
      </div>

      <div className="flex-1 min-w-0">
        {/* 이름 + 레벨 */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold" style={{ color: label.color }}>
            {label.hanja}({label.ko})
            <span className="ml-1 px-1.5 py-0.5 bg-gray-800 text-white text-[9px] rounded">
              Lv.{data.level}
            </span>
          </span>
          <span className="text-[10px] text-gray-500 font-bold">{data.value} / {data.nextLevelAt}</span>
        </div>

        {/* RPG 스타일 HP바 */}
        <div className="stat-bar">
          <div
            className="stat-bar-fill"
            style={{ width: `${percent}%`, backgroundColor: label.color }}
          />
        </div>
      </div>
    </div>
  );
}
