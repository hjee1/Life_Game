"use client";

import { StatData, StatName } from "@/types";
import { STAT_LABELS } from "@/lib/constants";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface StatCardProps {
  name: StatName;
  data: StatData;
}

export function StatCard({ name, data }: StatCardProps) {
  const label = STAT_LABELS[name];

  return (
    <div className="flex items-center gap-3 p-3 bg-white/80 rounded-xl">
      <div className="text-2xl w-8 text-center">{label.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-bold" style={{ color: label.color }}>
            {label.hanja} <span className="text-xs font-normal text-gray-500">Lv.{data.level}</span>
          </span>
          <span className="text-xs text-gray-400">{data.value}/{data.nextLevelAt}</span>
        </div>
        <ProgressBar value={data.value} max={data.nextLevelAt} color={label.color} />
      </div>
    </div>
  );
}
