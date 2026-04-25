import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "stage-default-secret");
const EXPIRES_IN = "7d";

export async function createToken(): Promise<string> {
  return new SignJWT({ sub: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(EXPIRES_IN)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function verifyPin(pin: string): boolean {
  return pin === process.env.USER_PIN;
}

/** API Route에서 인증 확인 헬퍼 */
export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || !(await verifyToken(token))) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "인증이 필요합니다" } },
      { status: 401 }
    );
  }
  return null;
}
