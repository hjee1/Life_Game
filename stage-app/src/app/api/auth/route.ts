import { NextRequest, NextResponse } from "next/server";
import { verifyPin, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { pin } = await req.json();

  if (!verifyPin(pin)) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PIN", message: "잘못된 PIN입니다" } },
      { status: 401 }
    );
  }

  const token = await createToken();
  return NextResponse.json({
    success: true,
    data: { token, expiresIn: 604800 },
  });
}
