"use client";

import { useTimeOfDay } from "@/hooks/useTimeOfDay";

// Stardew Valley 스타일 픽셀아트 캐릭터 (SVG)
function PixelCharacter({ mood }: { mood: string }) {
  // 표정별 눈/입 변화
  const eyesMap: Record<string, React.ReactNode> = {
    happy: (
      <>
        <rect x="9" y="10" width="2" height="1" fill="#2C3E50" />
        <rect x="10" y="9" width="1" height="1" fill="#2C3E50" />
        <rect x="13" y="10" width="2" height="1" fill="#2C3E50" />
        <rect x="13" y="9" width="1" height="1" fill="#2C3E50" />
      </>
    ),
    sleepy: (
      <>
        <rect x="9" y="10" width="2" height="1" fill="#2C3E50" />
        <rect x="13" y="10" width="2" height="1" fill="#2C3E50" />
      </>
    ),
    determined: (
      <>
        <rect x="9" y="9" width="2" height="2" fill="#2C3E50" />
        <rect x="10" y="9" width="1" height="1" fill="#FFFFFF" />
        <rect x="13" y="9" width="2" height="2" fill="#2C3E50" />
        <rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
      </>
    ),
    relaxed: (
      <>
        <rect x="9" y="10" width="2" height="1" fill="#2C3E50" />
        <rect x="13" y="10" width="2" height="1" fill="#2C3E50" />
        <rect x="10" y="9" width="1" height="1" fill="#2C3E50" />
        <rect x="14" y="9" width="1" height="1" fill="#2C3E50" />
      </>
    ),
    sleeping: (
      <>
        <rect x="9" y="10" width="2" height="1" fill="#2C3E50" />
        <rect x="13" y="10" width="2" height="1" fill="#2C3E50" />
      </>
    ),
  };

  const mouthMap: Record<string, React.ReactNode> = {
    happy: <rect x="11" y="12" width="2" height="1" fill="#E74C3C" />,
    sleepy: <rect x="11" y="12" width="2" height="1" fill="#BDC3C7" />,
    determined: <rect x="10" y="12" width="4" height="1" fill="#E74C3C" />,
    relaxed: <rect x="11" y="12" width="2" height="1" fill="#E8A0A0" />,
    sleeping: <rect x="11" y="12" width="1" height="1" fill="#BDC3C7" />,
  };

  const eyes = eyesMap[mood] || eyesMap.happy;
  const mouth = mouthMap[mood] || mouthMap.happy;

  return (
    <svg
      viewBox="0 0 24 32"
      width="120"
      height="160"
      style={{ imageRendering: "pixelated" }}
      className="drop-shadow-lg"
    >
      {/* === 머리카락 (검정) === */}
      <rect x="8" y="2" width="8" height="2" fill="#1a1a2e" />
      <rect x="7" y="3" width="10" height="2" fill="#1a1a2e" />
      <rect x="7" y="4" width="10" height="1" fill="#16213e" />
      <rect x="7" y="5" width="2" height="2" fill="#1a1a2e" />
      <rect x="15" y="5" width="2" height="2" fill="#1a1a2e" />
      {/* 앞머리 */}
      <rect x="8" y="5" width="3" height="1" fill="#1a1a2e" />
      <rect x="14" y="5" width="1" height="1" fill="#16213e" />

      {/* === 얼굴 (피부) === */}
      <rect x="8" y="5" width="8" height="9" fill="#FDEBD0" />
      <rect x="7" y="6" width="1" height="6" fill="#FDEBD0" />
      <rect x="16" y="6" width="1" height="6" fill="#FDEBD0" />
      {/* 볼 터치 (핑크) */}
      <rect x="8" y="11" width="2" height="1" fill="#F5CBA7" opacity="0.6" />
      <rect x="14" y="11" width="2" height="1" fill="#F5CBA7" opacity="0.6" />

      {/* === 눈 === */}
      {eyes}

      {/* === 입 === */}
      {mouth}

      {/* === 목 === */}
      <rect x="10" y="14" width="4" height="1" fill="#FDEBD0" />

      {/* === 후드 (하늘색) === */}
      <rect x="6" y="15" width="12" height="8" fill="#5DADE2" />
      <rect x="7" y="15" width="10" height="1" fill="#85C1E9" />
      {/* 후드 지퍼 */}
      <rect x="11" y="16" width="2" height="6" fill="#3498DB" />
      <rect x="11" y="16" width="1" height="1" fill="#F4D03F" />
      <rect x="11" y="18" width="1" height="1" fill="#F4D03F" />
      {/* 주머니 */}
      <rect x="7" y="20" width="3" height="2" fill="#3498DB" />
      <rect x="14" y="20" width="3" height="2" fill="#3498DB" />
      {/* 소매 */}
      <rect x="5" y="16" width="2" height="5" fill="#5DADE2" />
      <rect x="17" y="16" width="2" height="5" fill="#5DADE2" />
      {/* 손 */}
      <rect x="4" y="20" width="2" height="2" fill="#FDEBD0" />
      <rect x="18" y="20" width="2" height="2" fill="#FDEBD0" />

      {/* === 바지 (진청) === */}
      <rect x="7" y="23" width="10" height="4" fill="#2E4053" />
      <rect x="11" y="23" width="2" height="4" fill="#273746" />

      {/* === 신발 (갈색) === */}
      <rect x="7" y="27" width="4" height="2" fill="#8B4513" />
      <rect x="13" y="27" width="4" height="2" fill="#8B4513" />
      <rect x="6" y="28" width="5" height="1" fill="#A0522D" />
      <rect x="13" y="28" width="5" height="1" fill="#A0522D" />

      {/* 자는 중 Zzz */}
      {mood === "sleeping" && (
        <>
          <text x="18" y="6" fontSize="3" fill="#9B59B6" fontFamily="monospace" opacity="0.7">z</text>
          <text x="20" y="4" fontSize="2.5" fill="#9B59B6" fontFamily="monospace" opacity="0.5">z</text>
          <text x="21" y="2" fontSize="2" fill="#9B59B6" fontFamily="monospace" opacity="0.3">z</text>
        </>
      )}
    </svg>
  );
}

// 별이 companion (SVG 픽셀아트)
function StarCompanion() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="48"
      height="48"
      style={{ imageRendering: "pixelated" }}
      className="animate-float drop-shadow-md"
    >
      {/* 별 몸체 */}
      <rect x="6" y="1" width="4" height="2" fill="#F4D03F" />
      <rect x="5" y="3" width="6" height="2" fill="#F4D03F" />
      <rect x="1" y="5" width="14" height="3" fill="#F4D03F" />
      <rect x="3" y="8" width="10" height="2" fill="#F4D03F" />
      <rect x="4" y="10" width="3" height="2" fill="#F4D03F" />
      <rect x="9" y="10" width="3" height="2" fill="#F4D03F" />
      <rect x="5" y="12" width="2" height="1" fill="#F4D03F" />
      <rect x="9" y="12" width="2" height="1" fill="#F4D03F" />
      {/* 하이라이트 */}
      <rect x="6" y="2" width="2" height="1" fill="#F9E154" />
      <rect x="3" y="5" width="2" height="1" fill="#F9E154" />
      {/* 눈 */}
      <rect x="6" y="6" width="1" height="1" fill="#2C3E50" />
      <rect x="9" y="6" width="1" height="1" fill="#2C3E50" />
      {/* 입 (미소) */}
      <rect x="7" y="7" width="2" height="1" fill="#E67E22" />
    </svg>
  );
}

export function Character() {
  const { timeOfDay } = useTimeOfDay();

  const moodMap = {
    dawn: { mood: "sleepy", action: "기지개를 켜는 중..." },
    morning: { mood: "happy", action: "오늘도 힘내자!" },
    afternoon: { mood: "determined", action: "열심히 달리는 중!" },
    evening: { mood: "relaxed", action: "수고했어, 오늘도." },
    night: { mood: "sleeping", action: "좋은 꿈 꿔..." },
  };

  const { mood, action } = moodMap[timeOfDay] || moodMap.morning;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* 캐릭터 */}
        <div className="animate-idle">
          <PixelCharacter mood={mood} />
        </div>

        {/* 별이 companion */}
        <div className="absolute -right-10 top-0">
          <StarCompanion />
          <p className="text-[8px] text-center text-amber-600 font-bold mt-0.5">별이</p>
        </div>
      </div>

      {/* 이름 + 상태 */}
      <p className="text-xs text-gray-600 mt-1 font-bold">현우</p>
      <p className="text-[10px] text-gray-400 italic">{action}</p>
    </div>
  );
}
