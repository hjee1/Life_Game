import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { calculateLevel, getNextLevelAt, calculateSpotlight, checkLevelUp, todayKST } from "@/lib/game-logic";
import { StatName } from "@/types";
import { STAT_NAMES } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const stats = await prisma.stats.findFirst({ where: { id: 1 } });
  if (!stats) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "스탯 없음" } }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  for (const name of STAT_NAMES) {
    const value = stats[name];
    const level = calculateLevel(value);
    data[name] = { value, level, nextLevelAt: getNextLevelAt(level) };
  }
  data.spotlight = stats.spotlight;
  data.updatedAt = stats.updatedAt.toISOString();

  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { changes } = await req.json() as { changes: { stat: StatName; delta: number; reason: string }[] };
  const stats = await prisma.stats.findFirst({ where: { id: 1 } });
  if (!stats) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "스탯 없음" } }, { status: 404 });
  }

  const today = todayKST();
  let anyLevelUp = false;
  const resultData: Record<string, unknown> = {};

  for (const change of changes) {
    if (!STAT_NAMES.includes(change.stat)) continue;
    const oldValue = stats[change.stat];
    const newValue = Math.max(0, oldValue + change.delta);
    const { levelUp, newLevel } = checkLevelUp(oldValue, newValue);
    if (levelUp) anyLevelUp = true;

    // DB 업데이트
    await prisma.stats.update({
      where: { id: 1 },
      data: {
        [change.stat]: newValue,
        [`${change.stat}Level`]: newLevel,
      },
    });

    // 히스토리 기록
    await prisma.statHistory.create({
      data: {
        statName: change.stat,
        delta: change.delta,
        reason: change.reason,
        valueAfter: newValue,
        recordedDate: today,
      },
    });

    resultData[change.stat] = {
      value: newValue,
      level: newLevel,
      nextLevelAt: getNextLevelAt(newLevel),
      changed: change.delta,
    };
  }

  // 스포트라이트 재계산
  const updatedStats = await prisma.stats.findFirst({ where: { id: 1 } });
  if (updatedStats) {
    const statValues = { body: updatedStats.body, mind: updatedStats.mind, art: updatedStats.art, knowledge: updatedStats.knowledge, bond: updatedStats.bond };
    const spotlightResult = calculateSpotlight(statValues);
    await prisma.stats.update({ where: { id: 1 }, data: { spotlight: spotlightResult.gauge } });
    resultData.spotlight = spotlightResult.gauge;
  }

  resultData.levelUp = anyLevelUp;
  return NextResponse.json({ success: true, data: resultData });
}
