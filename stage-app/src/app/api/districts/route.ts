import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const districts = await prisma.district.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({
    success: true,
    data: districts.map((d) => ({
      districtId: d.districtId,
      name: d.name,
      emoji: d.emoji,
      unlocked: d.unlocked,
      unlockedAt: d.unlockedAt?.toISOString() ?? null,
    })),
  });
}
