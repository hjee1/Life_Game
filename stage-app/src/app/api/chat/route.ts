import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { buildStarSystemPrompt, getRandomFallback } from "@/lib/star-prompt";
import { getTimeOfDay } from "@/lib/constants";
import { todayKST } from "@/lib/game-logic";
import { StatName } from "@/types";

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { message } = await req.json();
  if (!message || typeof message !== "string") {
    return new Response(
      JSON.stringify({ success: false, error: { code: "BAD_REQUEST", message: "메시지가 필요합니다" } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const today = todayKST();

  // 세션 가져오기/생성
  let session = await prisma.chatSession.findUnique({ where: { sessionDate: today } });
  if (!session) {
    session = await prisma.chatSession.create({ data: { sessionDate: today } });
  }

  // 유저 메시지 저장
  await prisma.chatMessage.create({
    data: { sessionId: session.id, role: "user", content: message },
  });

  // 컨텍스트 구성
  const stats = await prisma.stats.findFirst({ where: { id: 1 } });
  const streak = await prisma.streak.findFirst({ where: { id: 1 } });
  const dailyTotal = await prisma.quest.count({ where: { type: "daily", isActive: true } });
  const todayCompletions = await prisma.questCompletion.count({
    where: { completedDate: today, quest: { type: "daily" } },
  });

  const statValues: Record<StatName, number> = {
    body: stats?.body ?? 0,
    mind: stats?.mind ?? 0,
    art: stats?.art ?? 0,
    knowledge: stats?.knowledge ?? 0,
    bond: stats?.bond ?? 0,
  };

  const systemPrompt = buildStarSystemPrompt({
    stats: statValues,
    streak: streak?.currentStreak ?? 0,
    todayCompleted: todayCompletions,
    todayTotal: dailyTotal,
    timeOfDay: getTimeOfDay(),
  });

  // 최근 대화 가져오기 (컨텍스트)
  const recentMessages = await prisma.chatMessage.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const chatHistory = recentMessages
    .reverse()
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
      ],
      stream: true,
      max_tokens: 300,
      temperature: 0.8,
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));

          // 어시스턴트 응답 저장
          await prisma.chatMessage.create({
            data: { sessionId: session!.id, role: "assistant", content: fullResponse },
          });
        } catch {
          const fallback = getRandomFallback();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: fallback })}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));

          await prisma.chatMessage.create({
            data: { sessionId: session!.id, role: "assistant", content: fallback },
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    const fallback = getRandomFallback();
    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "assistant", content: fallback },
    });

    return new Response(
      JSON.stringify({ success: true, data: { content: fallback } }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
