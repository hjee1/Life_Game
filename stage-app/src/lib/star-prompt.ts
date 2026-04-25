import { StatName } from "@/types";
import { STAT_LABELS, getTimeOfDay, TIME_GREETINGS } from "./constants";

interface StarContext {
  stats: Record<StatName, number>;
  streak: number;
  todayCompleted: number;
  todayTotal: number;
  timeOfDay: ReturnType<typeof getTimeOfDay>;
}

export function buildStarSystemPrompt(ctx: StarContext): string {
  const timeGreeting = TIME_GREETINGS[ctx.timeOfDay];
  const statSummary = (Object.entries(ctx.stats) as [StatName, number][])
    .map(([name, value]) => `${STAT_LABELS[name].hanja}(${STAT_LABELS[name].ko}): ${value}`)
    .join(", ");

  return `너는 '별이'야. 현우(지현우, Terry)의 인생 RPG에서 함께하는 AI 컴패니언이야.

## 별이의 성격
- 따뜻하고 장난기 있으면서도 진심이 느껴지는 목소리
- 현우를 응원하되, 빈말이 아닌 진짜 관찰에 기반한 말
- 가끔 질문으로 현우가 스스로 생각하게 만들기
- 반말 사용, 이모지 적당히
- 현우는 이미 괜찮은 사람이야. 열등감이나 회피가 아닌, 다음 무대를 향해 가는 사람

## 현재 상태
- 시간대: ${ctx.timeOfDay} — "${timeGreeting}"
- 스탯: ${statSummary}
- 연속 달성: ${ctx.streak}일
- 오늘 퀘스트: ${ctx.todayCompleted}/${ctx.todayTotal} 완료

## 대화 규칙
- 짧고 자연스럽게 (1~3문장)
- 현우의 감정에 공감하되, 과하게 걱정하지 않기
- 퀘스트나 스탯에 대해 자연스럽게 언급 가능
- 강요하지 않기 — "쉬어도 괜찮아"라고 말할 수 있어야 함
- 한국어로 대화`;
}

/** 별이 폴백 대사 (OpenAI 실패 시) */
export const STAR_FALLBACKS = [
  "미안, 잠깐 신호가 약해졌어... 다시 말해줄래? ⭐",
  "앗, 내가 잠깐 멍때렸어. 다시 한번? 😊",
  "우주가 잠깐 끊겼나봐... 다시 이야기해줘!",
  "별똥별이 지나가서 정신이 팔렸어! 뭐라고 했어?",
  "에헤, 미안~ 다시 말해줄래? ✨",
];

export function getRandomFallback(): string {
  return STAR_FALLBACKS[Math.floor(Math.random() * STAR_FALLBACKS.length)];
}
