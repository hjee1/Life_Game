import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { todayKST } from "@/lib/game-logic";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const today = todayKST();
  const streak = await prisma.streak.findFirst({ where: { id: 1 } });
  const dailyTotal = await prisma.quest.count({ where: { type: "daily", isActive: true } });
  const todayCompletions = await prisma.questCompletion.count({
    where: { completedDate: today, quest: { type: "daily" } },
  });

  return NextResponse.json({
    success: true,
    data: {
      current: streak?.currentStreak ?? 0,
      longest: streak?.longestStreak ?? 0,
      todayCompleted: todayCompletions,
      todayTotal: dailyTotal,
      lastCompletedAt: streak?.lastCompletedDate?.toISOString() ?? null,
    },
  });
}
