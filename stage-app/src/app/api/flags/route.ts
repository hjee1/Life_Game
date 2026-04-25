import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const flags = await prisma.flag.findMany();
  return NextResponse.json({ success: true, data: flags });
}

export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { flagName, value, reason } = await req.json();

  const existing = await prisma.flag.findUnique({ where: { flagName } });

  if (existing) {
    const oldValue = existing.flagType === "bool" ? String(existing.valueBool) : existing.flagType === "int" ? String(existing.valueInt) : existing.valueString;

    const updateData: Record<string, unknown> = {};
    if (existing.flagType === "bool") updateData.valueBool = Boolean(value);
    else if (existing.flagType === "int") updateData.valueInt = Number(value);
    else updateData.valueString = String(value);

    await prisma.flag.update({ where: { flagName }, data: updateData });

    await prisma.flagHistory.create({
      data: { flagName, oldValue, newValue: String(value), reason },
    });
  } else {
    const flagType = typeof value === "boolean" ? "bool" : typeof value === "number" ? "int" : "string";
    await prisma.flag.create({
      data: {
        flagName,
        flagType,
        valueBool: typeof value === "boolean" ? value : false,
        valueInt: typeof value === "number" ? value : 0,
        valueString: typeof value === "string" ? value : null,
      },
    });

    await prisma.flagHistory.create({
      data: { flagName, oldValue: null, newValue: String(value), reason },
    });
  }

  return NextResponse.json({ success: true, data: { flagName, value } });
}
