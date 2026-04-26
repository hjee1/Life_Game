"use client";

import { useCallback, useRef } from "react";
import { Direction, DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT } from "@/game/types";

interface Props {
  onDirectionChange: (dir: Direction | null) => void;
  onAction: () => void;
}

export function MobileControls({ onDirectionChange, onAction }: Props) {
  const activeDir = useRef<Direction | null>(null);

  const setDir = useCallback((dir: Direction | null) => {
    if (activeDir.current !== dir) {
      activeDir.current = dir;
      onDirectionChange(dir);
    }
  }, [onDirectionChange]);

  const handleTouch = useCallback((dir: Direction) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setDir(dir);
  }, [setDir]);

  const handleRelease = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setDir(null);
  }, [setDir]);

  const btnClass = "w-12 h-12 bg-black/40 backdrop-blur-sm border-2 border-white/20 rounded-lg flex items-center justify-center text-white/80 text-lg font-bold active:bg-white/30 active:scale-95 transition-all select-none touch-none";

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-between items-end px-4 pointer-events-none">
      {/* D-Pad */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1 w-40">
        <div />
        <button
          className={btnClass}
          onTouchStart={handleTouch(DIR_UP)}
          onTouchEnd={handleRelease}
          onMouseDown={handleTouch(DIR_UP)}
          onMouseUp={handleRelease}
        >▲</button>
        <div />

        <button
          className={btnClass}
          onTouchStart={handleTouch(DIR_LEFT)}
          onTouchEnd={handleRelease}
          onMouseDown={handleTouch(DIR_LEFT)}
          onMouseUp={handleRelease}
        >◀</button>
        <div className="w-12 h-12" />
        <button
          className={btnClass}
          onTouchStart={handleTouch(DIR_RIGHT)}
          onTouchEnd={handleRelease}
          onMouseDown={handleTouch(DIR_RIGHT)}
          onMouseUp={handleRelease}
        >▶</button>

        <div />
        <button
          className={btnClass}
          onTouchStart={handleTouch(DIR_DOWN)}
          onTouchEnd={handleRelease}
          onMouseDown={handleTouch(DIR_DOWN)}
          onMouseUp={handleRelease}
        >▼</button>
        <div />
      </div>

      {/* Action Button */}
      <div className="pointer-events-auto">
        <button
          className="w-16 h-16 bg-amber-400/60 backdrop-blur-sm border-2 border-amber-300/60 rounded-full flex items-center justify-center text-white font-bold text-xl active:bg-amber-300/80 active:scale-95 transition-all select-none touch-none"
          onTouchStart={(e) => { e.preventDefault(); onAction(); }}
          onMouseDown={(e) => { e.preventDefault(); onAction(); }}
        >
          A
        </button>
        <p className="text-center text-white/50 text-[9px] mt-1">액션</p>
      </div>
    </div>
  );
}
