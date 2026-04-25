"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { BottomNav } from "@/components/layout/BottomNav";
import { District } from "@/types";

const DISTRICT_COLORS: Record<string, string> = {
  dawn_street: "from-purple-400 to-orange-300",
  forge_woods: "from-green-400 to-green-600",
  memory_harbor: "from-blue-300 to-blue-500",
  code_workshop: "from-purple-500 to-purple-700",
  spotlight_theatre: "from-red-400 to-red-600",
  starlight_garden: "from-pink-300 to-indigo-400",
  noise_underground: "from-gray-600 to-gray-800",
};

export default function DistrictsPage() {
  const token = useGameStore((s) => s.token);
  const districts = useGameStore((s) => s.districts);
  const setDistricts = useGameStore((s) => s.setDistricts);
  const { apiFetch } = useApi();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push("/login"); return; }

    apiFetch<District[]>("/api/districts").then((res) => {
      if (res.success && res.data) setDistricts(res.data);
    });
  }, [token]);

  if (!token) return null;

  return (
    <div className="pb-nav">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-gray-800">구역 맵</h1>
        <p className="text-sm text-gray-500 mt-1">스테이지 시티를 탐험하세요</p>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        {districts.map((d) => (
          <button
            key={d.districtId}
            disabled={!d.unlocked}
            className={`relative overflow-hidden rounded-2xl p-4 h-32 flex flex-col justify-end text-left transition-transform active:scale-[0.97] ${
              d.unlocked ? "" : "opacity-50 grayscale"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${DISTRICT_COLORS[d.districtId] || "from-gray-300 to-gray-500"}`} />
            <div className="relative z-10">
              <span className="text-2xl">{d.emoji}</span>
              <p className="text-white font-bold text-sm mt-1">{d.name}</p>
              {!d.unlocked && (
                <p className="text-white/60 text-xs">🔒 잠김</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
