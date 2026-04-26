"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GameEngine, setTouchDirection, triggerAction } from "@/game/engine";
import { Zone, ZoneActivity, ActiveActivity, InteractionPoint } from "@/game/types";
import { useGameStore } from "@/stores/game-store";
import { useApi } from "@/hooks/useApi";
import { StatsResponse, StatName } from "@/types";
import { MobileControls } from "./MobileControls";
import { GameHUD } from "./GameHUD";
import { ZonePanel } from "./ZonePanel";
import { ActivityOverlay } from "./ActivityOverlay";
import { DialogBox } from "./DialogBox";
import { PauseMenu } from "./PauseMenu";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const setStats = useGameStore((s) => s.setStats);
  const setStreak = useGameStore((s) => s.setStreak);
  const { apiFetch } = useApi();

  // UI state
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [activity, setActivity] = useState<ActiveActivity | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [nearInteraction, setNearInteraction] = useState<InteractionPoint | null>(null);

  // Load initial game data
  useEffect(() => {
    Promise.all([
      apiFetch<StatsResponse>("/api/stats"),
      apiFetch<{ current: number; longest: number; todayCompleted: number; todayTotal: number; lastCompletedAt: string | null }>("/api/streak"),
    ]).then(([statsRes, streakRes]) => {
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (streakRes.success && streakRes.data) setStreak(streakRes.data);
    });
  }, []);

  // Initialize game engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, {
      onZoneInteract: (zone) => setActiveZone(zone),
      onNPCInteract: () => setShowDialog(true),
      onNearInteraction: (point) => setNearInteraction(point),
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  // Handle direction from mobile controls
  const handleDirection = useCallback((dir: number | null) => {
    setTouchDirection(dir as never);
  }, []);

  // Handle action button
  const handleAction = useCallback(() => {
    triggerAction();
  }, []);

  // Start activity
  const handleStartActivity = useCallback((act: ZoneActivity) => {
    if (!activeZone) return;
    const newActivity: ActiveActivity = {
      zoneId: activeZone.id,
      activityId: act.id,
      activityName: act.name,
      emoji: act.emoji,
      stat: act.statReward?.stat || null,
      startTime: Date.now(),
    };
    setActivity(newActivity);
    setActiveZone(null);
    // Tell engine to show activity animation
    engineRef.current?.setActivityAnimation(act.emoji);
  }, [activeZone]);

  // End activity
  const handleEndActivity = useCallback(async () => {
    if (!activity) return;

    // Calculate duration
    const durationMin = Math.floor((Date.now() - activity.startTime) / 60000);

    // Find the zone and activity to get reward
    const zone = (await import("@/game/world")).ZONES.find((z) => z.id === activity.zoneId);
    const act = zone?.activities.find((a) => a.id === activity.activityId);

    // Award stats if applicable
    if (act?.statReward && durationMin >= 1) {
      const multiplier = Math.min(3, Math.max(1, Math.floor(durationMin / 15)));
      await apiFetch("/api/stats", {
        method: "PUT",
        body: JSON.stringify({
          changes: [{
            stat: act.statReward.stat,
            delta: act.statReward.delta * multiplier,
            reason: `activity:${activity.activityId}`,
          }],
        }),
      });

      // Refresh stats
      const statsRes = await apiFetch<StatsResponse>("/api/stats");
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
    }

    setActivity(null);
    engineRef.current?.setActivityAnimation(null);
  }, [activity, apiFetch, setStats]);

  // Keyboard shortcut for menu
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (activeZone) setActiveZone(null);
        else if (showDialog) setShowDialog(false);
        else if (showMenu) setShowMenu(false);
        else setShowMenu(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeZone, showDialog, showMenu]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />

      {/* HUD */}
      <GameHUD />

      {/* Menu button */}
      <button
        onClick={() => setShowMenu(true)}
        className="fixed top-2 right-2 z-40 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center text-white/70 text-sm active:scale-95"
      >
        ☰
      </button>

      {/* Interaction hint (mobile - show near interaction label) */}
      {nearInteraction && !activeZone && !showDialog && !activity && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-amber-400/30">
          <p className="text-xs text-amber-300 font-bold text-center">
            🅰 {nearInteraction.label}
          </p>
        </div>
      )}

      {/* Mobile Controls */}
      {!activeZone && !showDialog && !showMenu && (
        <MobileControls
          onDirectionChange={handleDirection}
          onAction={handleAction}
        />
      )}

      {/* Activity Timer */}
      {activity && (
        <ActivityOverlay activity={activity} onEnd={handleEndActivity} />
      )}

      {/* Zone Panel */}
      {activeZone && (
        <ZonePanel
          zone={activeZone}
          onClose={() => setActiveZone(null)}
          onStartActivity={handleStartActivity}
        />
      )}

      {/* NPC Dialog */}
      {showDialog && (
        <DialogBox onClose={() => setShowDialog(false)} />
      )}

      {/* Pause Menu */}
      {showMenu && (
        <PauseMenu onClose={() => setShowMenu(false)} />
      )}
    </div>
  );
}
