import { StatName } from "@/types";

// 스탯별 레벨업 경험치 테이블 (레벨 1→2는 10, 2→3은 20, ...)
export const LEVEL_THRESHOLDS = [0, 10, 20, 35, 55, 80, 110, 150, 200, 260];

export const STAT_NAMES: StatName[] = ["body", "mind", "art", "knowledge", "bond"];

export const STAT_LABELS: Record<StatName, { ko: string; hanja: string; color: string; emoji: string }> = {
  body: { ko: "체력", hanja: "體", color: "#E74C3C", emoji: "💪" },
  mind: { ko: "정신", hanja: "心", color: "#85C1E9", emoji: "🧠" },
  art: { ko: "예술", hanja: "藝", color: "#9B59B6", emoji: "🎭" },
  knowledge: { ko: "지식", hanja: "知", color: "#F4D03F", emoji: "📖" },
  bond: { ko: "인연", hanja: "緣", color: "#F1948A", emoji: "💗" },
};

export const SPOTLIGHT_WEIGHT = 0.2;
export const MAX_BALANCE_BONUS = 10;

// 시간대별 인사
export function getTimeOfDay(): "dawn" | "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour < 6) return "dawn";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

export const TIME_GREETINGS: Record<ReturnType<typeof getTimeOfDay>, string> = {
  dawn: "새벽이야... 오늘도 일찍 일어났구나!",
  morning: "좋은 아침이야! 오늘 하루도 파이팅!",
  afternoon: "점심은 먹었어? 오후도 힘내자!",
  evening: "수고했어, 오늘 하루 어땠어?",
  night: "오늘도 고생했어. 푹 쉬어야 해!",
};
