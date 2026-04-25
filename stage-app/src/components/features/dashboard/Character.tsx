"use client";

import { useTimeOfDay } from "@/hooks/useTimeOfDay";

export function Character() {
  const { timeOfDay } = useTimeOfDay();

  // 시간대별 캐릭터 표정/상태
  const mood = {
    dawn: { face: "😪", action: "기지개를 켜는 중..." },
    morning: { face: "😊", action: "오늘도 힘내자!" },
    afternoon: { face: "💪", action: "열심히 달리는 중!" },
    evening: { face: "😌", action: "수고했어, 오늘도." },
    night: { face: "😴", action: "좋은 꿈 꿔..." },
  }[timeOfDay];

  return (
    <div className="flex flex-col items-center">
      {/* 캐릭터 본체 */}
      <div className="relative animate-idle">
        {/* 머리 */}
        <div className="relative">
          <div className="w-16 h-16 bg-amber-100 rounded-lg pixel-border flex items-center justify-center text-3xl">
            {mood.face}
          </div>
          {/* 머리카락 */}
          <div className="absolute -top-2 left-1 right-1 h-4 bg-gray-800 rounded-t-lg" style={{ clipPath: 'polygon(0 40%, 15% 0, 40% 20%, 60% 0, 85% 20%, 100% 40%, 100% 100%, 0 100%)' }} />
        </div>

        {/* 몸 */}
        <div className="w-12 h-14 bg-sky-400 rounded-b-lg mx-auto -mt-1 pixel-border flex items-center justify-center">
          <div className="w-3 h-3 bg-amber-300 rounded-full" /> {/* 후드 지퍼 */}
        </div>

        {/* 다리 */}
        <div className="flex justify-center gap-1 -mt-1">
          <div className="w-5 h-6 bg-blue-700 rounded-b pixel-border" />
          <div className="w-5 h-6 bg-blue-700 rounded-b pixel-border" />
        </div>
      </div>

      {/* 별이 (캐릭터 옆에 떠다님) */}
      <div className="absolute right-4 top-2 animate-float">
        <div className="text-4xl animate-twinkle drop-shadow-lg">⭐</div>
        <div className="text-[8px] text-center text-amber-600 font-bold mt-0.5">별이</div>
      </div>

      {/* 이름 + 상태 */}
      <p className="text-xs text-gray-600 mt-2 font-bold">현우</p>
      <p className="text-[10px] text-gray-400 italic">{mood.action}</p>
    </div>
  );
}
