"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Target, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppShell from "./AppShell";
import Modal from "./Modal";
import { load, save } from "@/lib/store";
import { Transaction, TxType } from "@/lib/types";
import { transactionOptions } from "@/lib/transaction-options";
import { summarizeTransactions } from "@/lib/finance";

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TxType>("expense");

  useEffect(() => {
    load()
      .then(setData)
      .catch(() =>
        setData({ transactions: [], budgets: [], goals: [], recurring: [] }),
      );
  }, []);

  const tx = (data?.transactions || []) as Transaction[];

  const { income, expenses, balance, savingsRate } = summarizeTransactions(tx);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    tx.filter((item) => item.type === "expense").forEach((item) => {
      map[item.category] = (map[item.category] || 0) + item.amount;
    });

    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [tx]);

  const trendData = useMemo(() => {
    const map = new Map<
      string,
      { month: string; income: number; expense: number }
    >();

    tx.forEach((item) => {
      const month = item.date.slice(0, 7);
      const current = map.get(month) || { month, income: 0, expense: 0 };

      if (item.type === "income") current.income += item.amount;
      if (item.type === "expense") current.expense += item.amount;

      map.set(month, current);
    });

    return Array.from(map.values()).slice(-6);
  }, [tx]);

  const budgetSummary = (data?.budgets || []).map((budget: any) => {
    const spent = tx
      .filter(
        (item) => item.type === "expense" && item.category === budget.category,
      )
      .reduce((sum, item) => sum + item.amount, 0);
    const percent = Math.min((spent / budget.amount) * 100, 100);

    return {
      ...budget,
      spent,
      remaining: Math.max(0, budget.amount - spent),
      percent,
      warning: spent >= budget.amount,
    };
  });

  const recentTransactions = tx.slice(0, 5);
  const selectedOptions = transactionOptions[transactionType];

  if (!data) return null;

  function addTransaction(event: any) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = {
      id: crypto.randomUUID(),
      type: String(form.get("type")),
      amount: Number(form.get("amount")),
      category: String(form.get("category")),
      note: String(form.get("note") || "General"),
      date: String(form.get("date")),
      method: String(form.get("method")),
    };

    const updated = { ...data, transactions: [next, ...tx] };
    save(updated);
    setData(updated);
    setOpen(false);
  }

  return (
    <AppShell>
      <div className="topbar">
        <div>
          <div className="muted">Overview</div>
          <h1>Good day 👋</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setTransactionType("expense");
            setOpen(true);
          }}
        >
          <Plus size={17} /> Add Transaction
        </button>
      </div>

      <div className="dashboard-hero card">
        <div>
          <div className="muted hero-label">Financial snapshot</div>
          <h2>Keep your budget moving in the right direction.</h2>
        </div>
        <div className="hero-metric">
          <span>Net cash flow</span>
          <strong>{money(balance)}</strong>
        </div>
      </div>

      <div className="grid-stats">
        <div className="card stat">
          <div className="stat-label">Total Balance</div>
          <div className="stat-value">{money(balance)}</div>
          <Wallet />
        </div>
        <div className="card stat">
          <div className="stat-label">Income</div>
          <div className="stat-value positive">{money(income)}</div>
          <TrendingUp />
        </div>
        <div className="card stat">
          <div className="stat-label">Expenses</div>
          <div className="stat-value negative">{money(expenses)}</div>
          <TrendingDown />
        </div>
        <div className="card stat">
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value">{savingsRate}%</div>
          <Target />
        </div>
      </div>

      <div className="layout2">
        <section className="card section-card chart-card">
          <h2>Monthly cash flow</h2>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />
                <XAxis dataKey="month" stroke="#9da5b8" />
                <YAxis stroke="#9da5b8" />
                <Tooltip
                  formatter={(value: number) => money(Number(value))}
                  contentStyle={{
                    background: "#101a2d",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <Bar dataKey="income" fill="#42d392" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#6d7cff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card section-card chart-card">
          <h2>Expense mix</h2>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={52}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`${entry.category}-${index}`}
                      fill={
                        ["#6d7cff", "#9c6cff", "#42d392", "#ffc857", "#ff6b81"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => money(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="layout2" style={{ marginTop: 16 }}>
        <section className="card section-card">
          <h2>Budget overview</h2>
          <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
            {budgetSummary.map((budget: any) => (
              <div key={budget.id}>
                <div className="summary-line">
                  <strong>{budget.category}</strong>
                  <span
                    className={
                      budget.warning
                        ? "negative"
                        : budget.percent > 80
                          ? "warning"
                          : "positive"
                    }
                  >
                    {Math.round(budget.percent)}%
                  </span>
                </div>
                <div className="progress" style={{ marginTop: 8 }}>
                  <div
                    style={{
                      width: `${Math.min(budgetPercent(budget.percent), 100)}%`,
                    }}
                  />
                </div>
                <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
                  {money(budget.spent)} of {money(budget.amount)} used
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card section-card">
          <h2>Recent activity</h2>
          {recentTransactions.map((item: Transaction) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <strong>{item.category}</strong>
                <div className="muted" style={{ fontSize: 12 }}>
                  {item.note}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong className={transactionTone(item.type)}>
                  {item.type === "income"
                    ? "+"
                    : item.type === "expense"
                      ? "-"
                      : ""}
                  {money(item.amount)}
                </strong>
                <div className="muted" style={{ fontSize: 12 }}>
                  {item.date}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {open && (
        <Modal title="Add Transaction" onClose={() => setOpen(false)}>
          <form onSubmit={addTransaction} className="form-grid">
            <div className="field">
              <label>Type</label>
              <select
                className="input"
                name="type"
                value={transactionType}
                onChange={(event) =>
                  setTransactionType(event.target.value as TxType)
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div className="field">
              <label>Amount</label>
              <input
                className="input"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div className="field">
              <label>Category</label>
              <select
                key={transactionType}
                className="input"
                name="category"
                defaultValue={selectedOptions.categories[0]}
                required
              >
                {selectedOptions.categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input
                className="input"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                required
              />
            </div>
            <div className="field">
              <label>Payment Method</label>
              <select className="input" name="method">
                <option>UPI</option>
                <option>Cash</option>
                <option>Debit Card</option>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div className="field">
              <label>Description</label>
              <input
                key={transactionType}
                className="input"
                name="note"
                list="dashboard-note-options"
                placeholder="Choose or type a note"
                defaultValue={selectedOptions.notes[0]}
              />
              <datalist id="dashboard-note-options">
                {selectedOptions.notes.map((note) => (
                  <option key={note} value={note} />
                ))}
              </datalist>
            </div>
            <div className="field full">
              <button className="btn btn-primary">Save Transaction</button>
            </div>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}

function budgetPercent(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(value, 100)) : 0;
}

function transactionTone(type: string) {
  if (type === "income") return "positive";
  if (type === "expense") return "negative";
  return "muted";
}
