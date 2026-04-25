import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const statName = searchParams.get("stat");
  const days = parseInt(searchParams.get("days") || "30");

  const since = new Date();
  since.setDate(since.getDate() - days);

  const history = await prisma.statHistory.findMany({
    where: {
      ...(statName ? { statName } : {}),
      recordedDate: { gte: since },
    },
    orderBy: { recordedDate: "desc" },
    take: 100,
  });

  return NextResponse.json({ success: true, data: history });
}
