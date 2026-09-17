import { Budget, Goal, Recurring, Transaction } from "./types";

export type FinanceData = {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurring: Recurring[];
};

export async function load(): Promise<FinanceData> {
  const response = await fetch("/api/data", { credentials: "include" });
  if (!response.ok) throw new Error("Unable to load finance data.");
  return response.json() as Promise<FinanceData>;
}

export async function save(data: FinanceData) {
  const response = await fetch("/api/data", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Unable to save finance data.");
}

export async function reset() {
  const response = await fetch("/api/data", {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Unable to clear finance data.");
  window.location.reload();
}
