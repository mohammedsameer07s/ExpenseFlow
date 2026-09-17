import { z } from "zod";

const id = z.string().min(1).max(100);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD dates.");
const amount = z.number().finite().positive().max(1_000_000_000);

export const registerSchema = z.object({ name: z.string().trim().min(1).max(100), email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()), password: z.string().min(8).max(200) });
export const loginSchema = z.object({ email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()), password: z.string().min(1).max(200) });

const transactionSchema = z.object({ id, type: z.enum(["income", "expense", "transfer"]), amount, category: z.string().trim().min(1).max(80), note: z.string().max(240).nullable().optional(), method: z.string().trim().min(1).max(50), date });
const budgetSchema = z.object({ id, category: z.string().trim().min(1).max(80), amount, month: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM months.") });
const goalSchema = z.object({ id, name: z.string().trim().min(1).max(100), target: amount, current: z.number().finite().min(0).max(1_000_000_000), deadline: date.or(z.literal("")) });
const recurringSchema = z.object({ id, name: z.string().trim().min(1).max(100), amount, category: z.string().trim().min(1).max(80), frequency: z.string().trim().min(1).max(30), nextDate: date, active: z.boolean() });

export const financeDataSchema = z.object({ transactions: z.array(transactionSchema).max(10_000), budgets: z.array(budgetSchema).max(1_000), goals: z.array(goalSchema).max(1_000), recurring: z.array(recurringSchema).max(1_000) });
export type FinanceDataInput = z.infer<typeof financeDataSchema>;
