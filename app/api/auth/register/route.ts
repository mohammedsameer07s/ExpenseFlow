import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/server-session";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please provide a name, valid email, and password of at least 8 characters." }, { status: 400 });
    const { name, email, password } = parsed.data;
    const db = getDb();
    if (await db.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const user = await db.user.create({ data: { name, email, passwordHash: await hashPassword(password) } });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create account." }, { status: 500 });
  }
}
