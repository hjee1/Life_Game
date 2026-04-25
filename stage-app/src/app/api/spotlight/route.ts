import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { calculateSpotlight } from "@/lib/game-logic";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const stats = await prisma.stats.findFirst({ where: { id: 1 } });
  if (!stats) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "스탯 없음" } }, { status: 404 });
  }

  const statValues = { body: stats.body, mind: stats.mind, art: stats.art, knowledge: stats.knowledge, bond: stats.bond };
  const result = calculateSpotlight(statValues);

  return NextResponse.json({
    success: true,
    data: {
      ...result,
      status: result.gauge > stats.spotlight ? "rising" : result.gauge < stats.spotlight ? "falling" : "stable",
    },
  });
}
