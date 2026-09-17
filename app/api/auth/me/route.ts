import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return user ? NextResponse.json({ user }) : NextResponse.json({ user: null }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load session." }, { status: 500 });
  }
}
