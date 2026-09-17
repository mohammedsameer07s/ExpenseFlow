import { Transaction } from "./types";

export function summarizeTransactions(transactions: Transaction[]) {
  const income = transactions.filter((item) => item.type === "income").reduce((total, item) => total + item.amount, 0);
  const expenses = transactions.filter((item) => item.type === "expense").reduce((total, item) => total + item.amount, 0);
  return { income, expenses, balance: income - expenses, savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0 };
}
