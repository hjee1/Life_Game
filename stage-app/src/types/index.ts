// --- 스탯 ---
export type StatName = "body" | "mind" | "art" | "knowledge" | "bond";

export interface StatData {
  value: number;
  level: number;
  nextLevelAt: number;
}

export interface StatsResponse {
  body: StatData;
  mind: StatData;
  art: StatData;
  knowledge: StatData;
  bond: StatData;
  spotlight: number;
  updatedAt: string;
}

export interface StatChange {
  stat: StatName;
  delta: number;
  reason: string;
}

// --- 퀘스트 ---
export type QuestType = "daily" | "main" | "side" | "hidden";

export interface Quest {
  id: string;
  title: string;
  type: QuestType;
  emoji: string;
  description: string;
  statReward: { stat: StatName; delta: number } | null;
  totalSteps: number;
  isActive: boolean;
}

export interface DailyQuest extends Quest {
  completedToday: boolean;
  streak: number;
}

export interface ActiveQuest extends Quest {
  progress: number;
  currentStep: string;
}

// --- 스트릭 ---
export interface StreakData {
  current: number;
  longest: number;
  todayCompleted: number;
  todayTotal: number;
  lastCompletedAt: string | null;
}

// --- 스포트라이트 ---
export interface SpotlightBreakdown {
  contribution: number;
  weight: number;
}

export interface SpotlightData {
  gauge: number;
  balance: number;
  breakdown: Record<StatName, SpotlightBreakdown>;
  balanceBonus: number;
  status: "rising" | "stable" | "falling";
}

// --- 채팅 ---
export interface ChatMessage {
  id?: number;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string;
}

// --- 플래그 ---
export interface GameFlag {
  flagName: string;
  flagType: "bool" | "int" | "string";
  valueString: string | null;
  valueInt: number;
  valueBool: boolean;
}

// --- 칭호 ---
export interface GameTitle {
  titleId: string;
  titleName: string;
  description: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

// --- 구역 ---
export interface District {
  districtId: string;
  name: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

// --- API 공통 ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}
