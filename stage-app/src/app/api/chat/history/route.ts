import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { todayKST } from "@/lib/game-logic";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const date = dateStr ? new Date(dateStr) : todayKST();

  const session = await prisma.chatSession.findUnique({
    where: { sessionDate: date },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  return NextResponse.json({
    success: true,
    data: session?.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })) ?? [],
  });
}
