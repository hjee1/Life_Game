"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", icon: "🏠", label: "홈" },
  { href: "/quests", icon: "⚔️", label: "퀘스트" },
  { href: "/chat", icon: "⭐", label: "별이" },
  { href: "/districts", icon: "🗺️", label: "구역" },
  { href: "/profile", icon: "👤", label: "프로필" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-gray-900/95 backdrop-blur-sm border-t-2 border-amber-400/30">
        <div className="flex justify-around items-center h-14">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded transition-all ${
                  isActive
                    ? "text-amber-300 scale-110"
                    : "text-gray-500 hover:text-gray-300 active:scale-95"
                }`}
              >
                <span className={`text-lg ${isActive ? "animate-bounce-in" : ""}`}>{item.icon}</span>
                <span className="text-[9px] font-bold">{item.label}</span>
                {isActive && <div className="w-1 h-1 bg-amber-400 rounded-full mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
