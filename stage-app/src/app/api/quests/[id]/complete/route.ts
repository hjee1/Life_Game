import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { todayKST, calculateLevel, calculateSpotlight } from "@/lib/game-logic";
import { StatName } from "@/types";
import { STAT_NAMES } from "@/lib/constants";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const questId = params.id;
  const body = await req.json().catch(() => ({}));
  const choice = body.choice || null;
  const today = todayKST();

  // 퀘스트 존재 확인
  const quest = await prisma.quest.findUnique({ where: { questId } });
  if (!quest) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "퀘스트를 찾을 수 없습니다" } },
      { status: 404 }
    );
  }

  // 데일리 퀘스트 중복 완료 방지
  if (quest.type === "daily") {
    const existing = await prisma.questCompletion.findFirst({
      where: { questId, completedDate: today },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: "ALREADY_COMPLETED", message: "이미 완료한 퀘스트입니다" } },
        { status: 409 }
      );
    }
  }

  // 완료 기록
  const rewardsGiven: Array<{ stat: string; delta: number; newValue: number }> = [];
  await prisma.questCompletion.create({
    data: { questId, completedDate: today, choice, rewardsGiven: JSON.parse("[]") },
  });

  // 스탯 보상 적용
  const reward = quest.statReward as { stat: StatName; delta: number } | null;
  let statResult = null;
  if (reward && STAT_NAMES.includes(reward.stat)) {
    const stats = await prisma.stats.findFirst({ where: { id: 1 } });
    if (stats) {
      const newValue = Math.max(0, stats[reward.stat] + reward.delta);
      const newLevel = calculateLevel(newValue);

      await prisma.stats.update({
        where: { id: 1 },
        data: {
          [reward.stat]: newValue,
          [`${reward.stat}Level`]: newLevel,
        },
      });

      await prisma.statHistory.create({
        data: {
          statName: reward.stat,
          delta: reward.delta,
          reason: questId,
          valueAfter: newValue,
          recordedDate: today,
        },
      });

      rewardsGiven.push({ stat: reward.stat, delta: reward.delta, newValue });
      statResult = { stat: reward.stat, delta: reward.delta, newValue };
    }
  }

  // 완료 기록에 보상 업데이트
  const completion = await prisma.questCompletion.findFirst({
    where: { questId, completedDate: today },
    orderBy: { createdAt: "desc" },
  });
  if (completion) {
    await prisma.questCompletion.update({
      where: { id: completion.id },
      data: { rewardsGiven: JSON.parse(JSON.stringify(rewardsGiven)) },
    });
  }

  // 스트릭 업데이트 (데일리 퀘스트인 경우)
  let streakCount = 0;
  if (quest.type === "daily") {
    const dailyTotal = await prisma.quest.count({ where: { type: "daily", isActive: true } });
    const todayCompletions = await prisma.questCompletion.count({
      where: {
        completedDate: today,
        quest: { type: "daily" },
      },
    });

    if (todayCompletions >= dailyTotal) {
      const streak = await prisma.streak.findFirst({ where: { id: 1 } });
      if (streak) {
        const newStreak = streak.currentStreak + 1;
        const newLongest = Math.max(streak.longestStreak, newStreak);
        await prisma.streak.update({
          where: { id: 1 },
          data: { currentStreak: newStreak, longestStreak: newLongest, lastCompletedDate: today },
        });
        streakCount = newStreak;
      }
    }
  }

  // 스포트라이트 재계산
  const updatedStats = await prisma.stats.findFirst({ where: { id: 1 } });
  let spotlightGauge = 0;
  if (updatedStats) {
    const statValues = { body: updatedStats.body, mind: updatedStats.mind, art: updatedStats.art, knowledge: updatedStats.knowledge, bond: updatedStats.bond };
    const spotlightResult = calculateSpotlight(statValues);
    spotlightGauge = spotlightResult.gauge;
    await prisma.stats.update({ where: { id: 1 }, data: { spotlight: spotlightGauge } });
  }

  return NextResponse.json({
    success: true,
    data: {
      quest: { id: questId, completedAt: new Date().toISOString() },
      rewards: {
        stats: statResult ? [statResult] : [],
        spotlight: spotlightGauge,
        streak: streakCount,
        titleUnlocked: null,
      },
    },
  });
}
