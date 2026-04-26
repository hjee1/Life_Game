"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { BottomNav } from "@/components/layout/BottomNav";
import { STAT_LABELS } from "@/lib/constants";
import { StatName } from "@/types";

interface QuestItem {
  id: string;
  title: string;
  type: string;
  emoji: string;
  description: string;
  totalSteps: number;
  statReward: { stat: string; delta: number } | null;
  unlockCondition: Record<string, unknown> | null;
}

// 메인 퀘스트 단계별 가이드
const QUEST_STEPS: Record<string, string[]> = {
  "mq-01": [
    "1주일 연속 데일리 퀘스트 3개 이상 클리어",
    "운동 루틴 정하기 (주 3회 이상)",
    "기상 시간 06:30 이전 5일 달성",
  ],
  "mq-02": [
    "SF 시절 기억 일기 쓰기",
    "심천 시절 기억 일기 쓰기",
    "시카고 시절 기억 일기 쓰기",
    "홍콩 시절 기억 일기 쓰기",
    "한국 귀국 후 기억 일기 쓰기",
  ],
  "mq-03": [
    "연기 수업에서 피드백 3회 받기",
    "단편 대본 1편 분석하기",
    "감정 연기 연습 영상 촬영",
    "오디션 또는 공연 1회 참여",
  ],
  "mq-04": [
    "일과 연기 시간 배분표 만들기",
    "여자친구/가족과 진솔한 대화 나누기",
    "자기 돌봄 루틴 설정 (명상, 산책 등)",
    "1주일 균형 잡힌 생활 실천",
  ],
  "mq-05": [
    "모든 스탯 레벨 5 이상 달성",
    "자기 소개 영상 촬영",
    "포트폴리오 업데이트",
    "오디션 3회 이상 참여",
    "나만의 무대 정의하기",
  ],
};

// 사이드 퀘스트 가이드
const SIDE_GUIDE: Record<string, string> = {
  "sq-01": "프리와 동네를 30분 이상 산책하고, 사진 한 장 남겨보기",
  "sq-02": "새로운 요리를 직접 만들어보기. 레시피를 찾아서 도전!",
  "sq-03": "개인 프로젝트에 의미 있는 커밋 5개 하기",
  "sq-04": "영화나 드라마 대본 1편을 정독하고 주인공의 감정선 분석하기",
  "sq-05": "새벽이나 저녁에 5km 러닝 완주하기",
  "sq-06": "소중한 사람에게 손으로 직접 편지 쓰기",
  "sq-07": "조용한 장소에서 15분간 눈 감고 명상하기",
  "sq-08": "오늘 있었던 일을 영어로 일기 쓰기",
  "sq-09": "감정 카드를 뽑고 즉흥 연기 20분 연습하기",
  "sq-10": "하루 종일 SNS(인스타, 유튜브 등) 안 보기",
};

export default function QuestsPage() {
  const token = useGameStore((s) => s.token);
  const { apiFetch } = useApi();
  const router = useRouter();
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [tab, setTab] = useState<"main" | "side">("main");
  const [selected, setSelected] = useState<QuestItem | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) { router.push("/login"); return; }

    apiFetch<{ daily: unknown[]; active: QuestItem[] }>("/api/quests").then((res) => {
      if (res.success && res.data) setQuests(res.data.active);
    });
  }, [token]);

  async function handleComplete(questId: string) {
    setCompleting(true);
    try {
      const res = await apiFetch<Record<string, unknown>>(`/api/quests/${questId}/complete`, { method: "POST" });
      if (res.success) {
        setCompletedIds((prev) => new Set(prev).add(questId));
        setTimeout(() => setSelected(null), 800);
      }
    } finally {
      setCompleting(false);
    }
  }

  if (!token) return null;

  const filtered = quests.filter((q) => q.type === tab);

  return (
    <div className="pb-nav min-h-screen">
      {/* 헤더 */}
      <div className="bg-gradient-to-b from-indigo-900 to-indigo-800 px-5 pt-10 pb-6">
        <h1 className="text-xl font-bold text-amber-300">⚔️ 퀘스트</h1>
        <p className="text-[11px] text-indigo-300 mt-1">목표를 향해 한 걸음씩 나아가자</p>
      </div>

      {/* 탭 */}
      <div className="px-4 flex gap-2 -mt-3 mb-4">
        {(["main", "side"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelected(null); }}
            className={`px-5 py-2 rounded text-sm font-bold transition-all pixel-border ${
              tab === t
                ? "bg-amber-400 text-gray-900"
                : "bg-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            {t === "main" ? "🏰 메인" : "📜 사이드"}
          </button>
        ))}
      </div>

      {/* 퀘스트 목록 */}
      <div className="px-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="game-card p-8 text-center">
            <div className="text-3xl mb-2 animate-twinkle">🔒</div>
            <p className="text-gray-400 text-sm">아직 해금된 퀘스트가 없어요</p>
          </div>
        ) : (
          filtered.map((q, i) => {
            const isCompleted = completedIds.has(q.id);
            const isSelected = selected?.id === q.id;

            return (
              <div key={q.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                {/* 퀘스트 카드 */}
                <button
                  onClick={() => setSelected(isSelected ? null : q)}
                  className={`w-full game-card p-4 text-left transition-all ${
                    isCompleted
                      ? "bg-green-50/90 border-green-300"
                      : isSelected
                      ? "bg-amber-50/90 border-amber-400 ring-2 ring-amber-300/50"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{isCompleted ? "✅" : q.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-sm ${isCompleted ? "text-green-600 line-through" : "text-gray-800"}`}>
                          {q.title}
                        </h3>
                        {q.statReward && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                            {STAT_LABELS[q.statReward.stat as StatName]?.hanja} +{q.statReward.delta}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{q.description}</p>
                      {q.totalSteps > 1 && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-[9px] text-gray-400">진행도:</span>
                          {Array.from({ length: q.totalSteps }).map((_, si) => (
                            <div key={si} className={`w-2.5 h-2.5 rounded-sm ${
                              isCompleted ? "bg-green-400" : "bg-gray-200"
                            } pixel-border`} style={{ borderWidth: "1px" }} />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`text-gray-300 text-sm transition-transform ${isSelected ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* 상세 패널 (확장) */}
                {isSelected && !isCompleted && (
                  <div className="game-card mt-1 p-4 bg-amber-50/50 border-amber-200 animate-slide-up">
                    {/* 메인 퀘스트: 단계별 가이드 */}
                    {q.type === "main" && QUEST_STEPS[q.id] && (
                      <div className="mb-3">
                        <p className="text-[10px] font-bold text-amber-700 mb-2">📋 달성 조건</p>
                        <div className="space-y-1.5">
                          {QUEST_STEPS[q.id].map((step, si) => (
                            <div key={si} className="flex items-start gap-2">
                              <div className="w-4 h-4 rounded-sm bg-gray-200 pixel-border flex items-center justify-center text-[8px] mt-0.5" style={{ borderWidth: "1px" }}>
                                {si + 1}
                              </div>
                              <p className="text-[11px] text-gray-600 flex-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 사이드 퀘스트: 가이드 */}
                    {q.type === "side" && SIDE_GUIDE[q.id] && (
                      <div className="mb-3">
                        <p className="text-[10px] font-bold text-amber-700 mb-1">💡 이렇게 하면 돼</p>
                        <p className="text-[11px] text-gray-600 leading-relaxed">{SIDE_GUIDE[q.id]}</p>
                      </div>
                    )}

                    {/* 보상 정보 */}
                    {q.statReward && (
                      <div className="flex items-center gap-2 mb-3 p-2 bg-white/80 rounded">
                        <span className="text-[10px] text-gray-500">🎁 보상:</span>
                        <span className="text-xs font-bold text-amber-600">
                          {STAT_LABELS[q.statReward.stat as StatName]?.hanja} +{q.statReward.delta}
                        </span>
                      </div>
                    )}

                    {/* 완료 버튼 */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleComplete(q.id); }}
                      disabled={completing}
                      className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded pixel-border text-sm transition-all disabled:opacity-50 active:translate-y-0.5"
                    >
                      {completing ? (
                        <span className="animate-pulse">처리 중...</span>
                      ) : (
                        "✦ 완료하기"
                      )}
                    </button>
                  </div>
                )}

                {/* 완료 상태 */}
                {isSelected && isCompleted && (
                  <div className="game-card mt-1 p-3 bg-green-50 border-green-300 text-center animate-bounce-in">
                    <p className="text-sm font-bold text-green-600">🎉 퀘스트 완료!</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
