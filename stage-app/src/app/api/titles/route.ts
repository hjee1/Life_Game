import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const titles = await prisma.title.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({
    success: true,
    data: titles.map((t) => ({
      titleId: t.titleId,
      titleName: t.titleName,
      description: t.description,
      unlocked: t.unlocked,
      unlockedAt: t.unlockedAt?.toISOString() ?? null,
    })),
  });
}
