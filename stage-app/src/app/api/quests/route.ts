import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { todayKST } from "@/lib/game-logic";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const typeFilter = searchParams.get("type");
  const today = todayKST();

  const quests = await prisma.quest.findMany({
    where: {
      isActive: true,
      ...(typeFilter ? { type: typeFilter } : {}),
    },
    include: {
      completions: {
        where: { completedDate: today },
      },
    },
  });

  const daily = quests
    .filter((q) => q.type === "daily")
    .map((q) => ({
      id: q.questId,
      title: q.title,
      emoji: q.emoji,
      completedToday: q.completions.length > 0,
      statReward: q.statReward,
    }));

  const active = quests
    .filter((q) => q.type !== "daily")
    .map((q) => ({
      id: q.questId,
      title: q.title,
      type: q.type,
      emoji: q.emoji,
      description: q.description,
      totalSteps: q.totalSteps,
      statReward: q.statReward,
      unlockCondition: q.unlockCondition,
    }));

  return NextResponse.json({ success: true, data: { daily, active } });
}
