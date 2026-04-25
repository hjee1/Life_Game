import { StatName } from "@/types";
import { LEVEL_THRESHOLDS, STAT_NAMES, SPOTLIGHT_WEIGHT, MAX_BALANCE_BONUS } from "./constants";

/** 경험치 → 레벨 계산 */
export function calculateLevel(value: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (value >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

/** 다음 레벨까지 필요한 경험치 */
export function getNextLevelAt(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[level];
}

/** 5대 스탯 밸런스 보너스 (표준편차 기반, 0~10) */
export function calculateBalanceBonus(stats: Record<StatName, number>): number {
  const values = STAT_NAMES.map((s) => stats[s]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const normalizedStd = stdDev / mean;
  // normalizedStd 0 → 보너스 10, normalizedStd 1+ → 보너스 0
  const bonus = Math.max(0, MAX_BALANCE_BONUS * (1 - normalizedStd));
  return Math.round(bonus * 10) / 10;
}

/** 스포트라이트 게이지 계산 */
export function calculateSpotlight(stats: Record<StatName, number>): {
  gauge: number;
  balance: number;
  breakdown: Record<StatName, { contribution: number; weight: number }>;
  balanceBonus: number;
} {
  const breakdown = {} as Record<StatName, { contribution: number; weight: number }>;
  let sum = 0;
  for (const stat of STAT_NAMES) {
    const contribution = Math.round(stats[stat] * SPOTLIGHT_WEIGHT * 10) / 10;
    breakdown[stat] = { contribution, weight: SPOTLIGHT_WEIGHT };
    sum += contribution;
  }
  const balanceBonus = calculateBalanceBonus(stats);
  const gauge = Math.round(sum + balanceBonus);
  const mean = STAT_NAMES.map((s) => stats[s]).reduce((a, b) => a + b, 0) / STAT_NAMES.length;
  const balance = mean > 0 ? Math.round((1 - calculateBalanceBonus(stats) / MAX_BALANCE_BONUS) * 100) / 100 : 0;

  return { gauge, balance: 1 - balance, breakdown, balanceBonus };
}

/** 스탯 변경 후 레벨업 여부 확인 */
export function checkLevelUp(
  oldValue: number,
  newValue: number
): { levelUp: boolean; oldLevel: number; newLevel: number } {
  const oldLevel = calculateLevel(oldValue);
  const newLevel = calculateLevel(newValue);
  return { levelUp: newLevel > oldLevel, oldLevel, newLevel };
}

/** 오늘 날짜 (KST) */
export function todayKST(): Date {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return new Date(kst.toISOString().split("T")[0]);
}
