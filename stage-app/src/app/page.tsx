"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { GameCanvas } from "@/components/game/GameCanvas";

export default function GamePage() {
  const token = useGameStore((s) => s.token);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setReady(true);
    }
  }, [token, router]);

  if (!token || !ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="text-5xl animate-bounce mb-4">⭐</div>
        <p className="text-amber-300 text-sm animate-pulse">무대를 준비하는 중...</p>
      </div>
    );
  }

  return <GameCanvas />;
}
