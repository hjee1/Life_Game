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
        setError("PIN이 올바르지 않습니다");
        setPin("");
      }
    } catch {
      setError("연결 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">⭐</div>
        <h1 className="text-2xl font-bold text-gray-800">Stage</h1>
        <p className="text-sm text-gray-500 mt-1">오늘도, 나의 무대로.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN 입력"
          className="w-full text-center text-2xl tracking-[0.5em] py-3 px-4 border-2 border-amber-200 rounded-xl bg-white/80 focus:outline-none focus:border-amber-400 transition-colors"
          autoFocus
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={pin.length === 0 || loading}
          className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "확인 중..." : "입장하기"}
        </button>
      </form>
    </div>
  );
}
