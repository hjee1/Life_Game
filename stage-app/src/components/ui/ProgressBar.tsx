"use client";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, color = "#F4D03F", height = "h-2", showLabel = false }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-0.5 text-right">
          {value}/{max}
        </p>
      )}
    </div>
  );
}
