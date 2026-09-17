import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-session";
import { financeDataSchema } from "@/lib/validation";

async function authenticated() {
  const user = await getCurrentUser();
  return user ? { user, db: getDb() } : null;
}

export async function GET() {
  try {
    const context = await authenticated();
    if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { user, db } = context;
    const [transactions, budgets, goals, recurring] = await Promise.all([
      db.transaction.findMany({ where: { userId: user.id }, orderBy: { date: "desc" } }),
      db.budget.findMany({ where: { userId: user.id }, orderBy: { month: "desc" } }),
      db.savingsGoal.findMany({ where: { userId: user.id }, orderBy: { id: "desc" } }),
      db.recurringExpense.findMany({ where: { userId: user.id }, orderBy: { nextDate: "asc" } }),
    ]);
    return NextResponse.json({
      transactions: transactions.map((item) => ({ ...item, amount: Number(item.amount), date: item.date.toISOString().slice(0, 10) })),
      budgets: budgets.map((item) => ({ ...item, amount: Number(item.amount) })),
      goals: goals.map((item) => ({ ...item, target: Number(item.target), current: Number(item.current), deadline: item.deadline?.toISOString().slice(0, 10) || "" })),
      recurring: recurring.map((item) => ({ ...item, amount: Number(item.amount), nextDate: item.nextDate.toISOString().slice(0, 10) })),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load finance data." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const context = await authenticated();
    if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { user, db } = context;
    const parsed = financeDataSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Finance data contains invalid fields." }, { status: 400 });
    const data = parsed.data;
    await db.$transaction(async (transaction) => {
      await transaction.transaction.deleteMany({ where: { userId: user.id } });
      await transaction.budget.deleteMany({ where: { userId: user.id } });
      await transaction.savingsGoal.deleteMany({ where: { userId: user.id } });
      await transaction.recurringExpense.deleteMany({ where: { userId: user.id } });
      if (data.transactions?.length) await transaction.transaction.createMany({ data: data.transactions.map((item: any) => ({ id: item.id, userId: user.id, type: item.type, amount: item.amount, category: item.category, note: item.note || null, method: item.method, date: new Date(item.date) })) });
      if (data.budgets?.length) await transaction.budget.createMany({ data: data.budgets.map((item: any) => ({ id: item.id, userId: user.id, category: item.category, amount: item.amount, month: item.month })) });
      if (data.goals?.length) await transaction.savingsGoal.createMany({ data: data.goals.map((item: any) => ({ id: item.id, userId: user.id, name: item.name, target: item.target, current: item.current || 0, deadline: item.deadline ? new Date(item.deadline) : null })) });
      if (data.recurring?.length) await transaction.recurringExpense.createMany({ data: data.recurring.map((item: any) => ({ id: item.id, userId: user.id, name: item.name, amount: item.amount, category: item.category, frequency: item.frequency, nextDate: new Date(item.nextDate), active: item.active !== false })) });
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save finance data." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const context = await authenticated();
    if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await context.db.$transaction([
      context.db.transaction.deleteMany({ where: { userId: context.user.id } }),
      context.db.budget.deleteMany({ where: { userId: context.user.id } }),
      context.db.savingsGoal.deleteMany({ where: { userId: context.user.id } }),
      context.db.recurringExpense.deleteMany({ where: { userId: context.user.id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to clear finance data." }, { status: 500 });
  }
}
