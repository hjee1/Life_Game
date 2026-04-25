"use client";

import { useGameStore } from "@/stores/game-store";
import { ApiResponse } from "@/types";

export function useApi() {
  const token = useGameStore((s) => s.token);

  async function apiFetch<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
    return res.json();
  }

  return { apiFetch };
}
