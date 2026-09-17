import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/server-session";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    const { email, password } = parsed.data;
    const user = await getDb().user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to log in." }, { status: 500 });
  }
}
