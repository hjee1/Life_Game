"use client";

import { create } from "zustand";
import { StatsResponse, DailyQuest, ActiveQuest, StreakData, SpotlightData, District, GameTitle } from "@/types";

interface GameState {
  // Auth
  token: string | null;
  setToken: (token: string | null) => void;

  // Stats
  stats: StatsResponse | null;
  setStats: (stats: StatsResponse) => void;

  // Quests
  dailyQuests: DailyQuest[];
  activeQuests: ActiveQuest[];
  setDailyQuests: (quests: DailyQuest[]) => void;
  setActiveQuests: (quests: ActiveQuest[]) => void;
  markQuestCompleted: (questId: string) => void;

  // Streak
  streak: StreakData | null;
  setStreak: (streak: StreakData) => void;

  // Spotlight
  spotlight: SpotlightData | null;
  setSpotlight: (spotlight: SpotlightData) => void;

  // Districts
  districts: District[];
  setDistricts: (districts: District[]) => void;

  // Titles
  titles: GameTitle[];
  setTitles: (titles: GameTitle[]) => void;

  // Star message (별이 한마디)
  starMessage: string;
  setStarMessage: (msg: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("stage-token") : null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem("stage-token", token);
    } else {
      localStorage.removeItem("stage-token");
    }
    set({ token });
  },

  stats: null,
  setStats: (stats) => set({ stats }),

  dailyQuests: [],
  activeQuests: [],
  setDailyQuests: (quests) => set({ dailyQuests: quests }),
  setActiveQuests: (quests) => set({ activeQuests: quests }),
  markQuestCompleted: (questId) =>
    set((state) => ({
      dailyQuests: state.dailyQuests.map((q) =>
        q.id === questId ? { ...q, completedToday: true } : q
      ),
    })),

  streak: null,
  setStreak: (streak) => set({ streak }),

  spotlight: null,
  setSpotlight: (spotlight) => set({ spotlight }),

  districts: [],
  setDistricts: (districts) => set({ districts }),

  titles: [],
  setTitles: (titles) => set({ titles }),

  starMessage: "오늘도, 나의 무대로. ⭐",
  setStarMessage: (msg) => set({ starMessage: msg }),
}));
