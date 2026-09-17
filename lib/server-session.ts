import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";

const COOKIE_NAME = "expenseflow_session";
const SESSION_DAYS = 30;
const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  await getDb().session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await getDb().session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}

export async function clearSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token)
    await getDb().session.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
  store.delete(COOKIE_NAME);
}
