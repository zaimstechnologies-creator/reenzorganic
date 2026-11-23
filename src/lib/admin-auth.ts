import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminCookieName = "reenz_admin_session";
const sessionDurationSeconds = 60 * 60 * 8;

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function isAdminConfigurationReady(): boolean {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_PASSWORD.length >= 12 &&
      getSecret(),
  );
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const secret = getSecret();
  if (!expectedEmail || !expectedPassword || !secret || expectedPassword.length < 12) {
    return false;
  }

  const suppliedEmail = createHmac("sha256", secret).update(email.trim().toLowerCase()).digest();
  const storedEmail = createHmac("sha256", secret)
    .update(expectedEmail.trim().toLowerCase())
    .digest();
  const suppliedPassword = createHmac("sha256", secret).update(password).digest();
  const storedPassword = createHmac("sha256", secret).update(expectedPassword).digest();

  return (
    timingSafeEqual(suppliedEmail, storedEmail) &&
    timingSafeEqual(suppliedPassword, storedPassword)
  );
}

export function createAdminSessionToken(): string {
  const secret = getSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }

  const expiresAt = Math.floor(Date.now() / 1000) + sessionDurationSeconds;
  const signature = createHmac("sha256", secret).update(String(expiresAt)).digest("hex");
  return `${expiresAt}.${signature}`;
}

export async function hasAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(adminCookieName)?.value;
  const secret = getSecret();
  if (!token || !secret) {
    return false;
  }

  const [expiresAt, signature, ...extra] = token.split(".");
  if (extra.length > 0 || !/^\d+$/.test(expiresAt) || !signature) {
    return false;
  }

  const expires = Number(expiresAt);
  if (!Number.isSafeInteger(expires) || expires <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(expiresAt).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const adminSessionCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: sessionDurationSeconds,
};

export function isSameOriginRequest(request: Request): boolean {
  return request.headers.get("origin") === new URL(request.url).origin;
}

