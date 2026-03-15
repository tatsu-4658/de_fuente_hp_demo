import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD_HASH = crypto.createHash("sha256").update("admin123").digest("hex");
const SESSION_COOKIE = "cafe_admin_session";
const SESSION_SECRET = "komorebi-secret-key-change-in-production";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && hashPassword(password) === ADMIN_PASSWORD_HASH;
}

export function generateSessionToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(token).digest("hex");
  return `${token}.${hmac}`;
}

export function verifySessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [value, signature] = parts;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
  return signature === expected;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session) return false;
  return verifySessionToken(session.value);
}

export { SESSION_COOKIE };
