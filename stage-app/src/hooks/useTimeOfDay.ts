"use client";

import { useState, useEffect } from "react";
import { getTimeOfDay, TIME_GREETINGS } from "@/lib/constants";

export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    timeOfDay,
    greeting: TIME_GREETINGS[timeOfDay],
    bgClass: {
      dawn: "bg-gradient-to-b from-indigo-900 via-purple-800 to-orange-300",
      morning: "bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100",
      afternoon: "bg-gradient-to-b from-sky-400 via-sky-300 to-amber-200",
      evening: "bg-gradient-to-b from-orange-400 via-rose-400 to-purple-600",
      night: "bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-800",
    }[timeOfDay],
    textClass: {
      dawn: "text-amber-100",
      morning: "text-gray-800",
      afternoon: "text-gray-800",
      evening: "text-amber-100",
      night: "text-amber-100",
    }[timeOfDay],
  };
}
