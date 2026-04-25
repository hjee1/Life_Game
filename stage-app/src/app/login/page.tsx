"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setToken = useGameStore((s) => s.setToken);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.data.token);
        router.push("/");
      } else {
        setError("잘못된 주문이야... 다시 시도해봐!");
        setPin("");
      }
    } catch {
      setError("별빛 신호가 약해... 잠시 후 다시 시도해봐!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* 배경 별들 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* 메인 */}
      <div className="relative z-10 text-center mb-8">
        <div className="text-6xl mb-4 animate-float">⭐</div>
        <h1 className="text-3xl font-bold text-amber-300 tracking-wider">
          ✦ Stage ✦
        </h1>
        <p className="text-sm text-amber-100/60 mt-2">오늘도, 나의 무대로.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4 relative z-10">
        <div className="game-card p-4 bg-indigo-800/50 border-amber-400/30">
          <p className="text-[10px] text-amber-300/60 text-center mb-2">— 주문을 입력하세요 —</p>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="✦ ✦ ✦ ✦"
            className="w-full text-center text-2xl tracking-[0.5em] py-3 px-4 bg-indigo-900/80 border-2 border-amber-400/40 rounded text-amber-300 placeholder-amber-400/20 focus:outline-none focus:border-amber-400 transition-colors"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs text-center animate-bounce-in">{error}</p>
        )}

        <button
          type="submit"
          disabled={pin.length === 0 || loading}
          className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded pixel-border transition-all disabled:opacity-30 disabled:cursor-not-allowed active:translate-y-0.5"
        >
          {loading ? (
            <span className="animate-pulse">별빛 연결 중...</span>
          ) : (
            "▶ 무대에 오르기"
          )}
        </button>
      </form>

      {/* 하단 */}
      <p className="absolute bottom-8 text-[9px] text-indigo-400/40 z-10">
        Stage v1.0 — for 지현우 only
      </p>
    </div>
  );
}
