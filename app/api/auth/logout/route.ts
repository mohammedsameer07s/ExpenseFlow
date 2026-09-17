import { NextResponse } from "next/server";
import { clearSession } from "@/lib/server-session";

export async function POST() {
  try { await clearSession(); } catch { /* A missing database should not prevent cookie removal. */ }
  return NextResponse.json({ ok: true });
}
