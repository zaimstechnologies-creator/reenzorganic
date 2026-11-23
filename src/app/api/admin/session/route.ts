import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  adminSessionCookieOptions,
  createAdminSessionToken,
  hasAdminSession,
  isAdminConfigurationReady,
  isSameOriginRequest,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const maxAttempts = 5;
const attemptWindowMs = 15 * 60 * 1000;

export async function GET() {
  return NextResponse.json({ authenticated: await hasAdminSession() });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  }
  if (!isAdminConfigurationReady()) {
    return NextResponse.json(
      { error: "Admin sign-in is not configured. Set the required server environment variables." },
      { status: 503 },
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const currentAttempt = loginAttempts.get(clientIp);
  if (currentAttempt && currentAttempt.resetAt > now && currentAttempt.count >= maxAttempts) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a valid email address and password." }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    body.email.length > 254 ||
    !("password" in body) ||
    typeof body.password !== "string" ||
    body.password.length > 1024
  ) {
    return NextResponse.json({ error: "Enter a valid email address and password." }, { status: 400 });
  }

  if (!verifyAdminCredentials(body.email, body.password)) {
    const attempt =
      currentAttempt && currentAttempt.resetAt > now
        ? { count: currentAttempt.count + 1, resetAt: currentAttempt.resetAt }
        : { count: 1, resetAt: now + attemptWindowMs };
    loginAttempts.set(clientIp, attempt);
    return NextResponse.json({ error: "The email or password is incorrect." }, { status: 401 });
  }

  loginAttempts.delete(clientIp);
  (await cookies()).set(adminCookieName, createAdminSessionToken(), adminSessionCookieOptions);
  return NextResponse.json({ authenticated: true });
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  }
  (await cookies()).delete(adminCookieName);
  return NextResponse.json({ authenticated: false });
}

