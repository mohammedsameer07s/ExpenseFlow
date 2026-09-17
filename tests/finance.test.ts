import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";
import { summarizeTransactions } from "@/lib/finance";
import { financeDataSchema, loginSchema } from "@/lib/validation";

describe("passwords", () => {
  it("hashes and verifies without storing the raw password", async () => {
    const hash = await hashPassword("strong-password");
    expect(hash).not.toBe("strong-password");
    expect(await verifyPassword("strong-password", hash)).toBe(true);
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });
});

describe("request validation", () => {
  it("rejects weak login input", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "" }).success).toBe(false);
  });

  it("rejects negative or unknown finance values", () => {
    const result = financeDataSchema.safeParse({ transactions: [{ id: "t1", type: "expense", amount: -10, category: "Food", method: "Cash", date: "2026-09-17" }], budgets: [], goals: [], recurring: [] });
    expect(result.success).toBe(false);
  });
});

describe("transaction totals", () => {
  it("counts income and expenses while excluding transfers", () => {
    const result = summarizeTransactions([
      { id: "1", type: "income", amount: 5000, category: "Salary", note: "", date: "2026-09-01", method: "Bank" },
      { id: "2", type: "expense", amount: 1200, category: "Food", note: "", date: "2026-09-02", method: "Cash" },
      { id: "3", type: "transfer", amount: 500, category: "Savings", note: "", date: "2026-09-03", method: "Bank" },
    ]);
    expect(result).toEqual({ income: 5000, expenses: 1200, balance: 3800, savingsRate: 76 });
  });
});
