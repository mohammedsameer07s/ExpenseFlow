"use client";

import AppShell from "@/components/AppShell";
import { load } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const chartColors = ["#176044", "#62a95d", "#c9e968", "#d59e3b", "#c44d4d"];

export default function Page() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    load().then(setData).catch(() => setData({ transactions: [], budgets: [], goals: [], recurring: [] }));
  }, []);

  const spending = useMemo(() => {
    if (!data) return [];
    const totals: Record<string, number> = {};
    data.transactions
      .filter((item: any) => item.type === "expense")
      .forEach((item: any) => {
        totals[item.category] = (totals[item.category] || 0) + item.amount;
      });
    return Object.entries(totals).map(([category, amount]) => ({ category, amount }));
  }, [data]);

  if (!data) return null;

  return (
    <AppShell>
      <div className="topbar">
        <div>
          <div className="muted">Understand your habits</div>
          <h1>Reports & Analytics</h1>
        </div>
      </div>

      {spending.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">◔</div>
          <h2>Add transactions to see reports</h2>
          <p className="muted">Your spending patterns and category insights will appear here.</p>
        </div>
      ) : (
        <>
          <div className="layout2">
            <section className="card section-card chart-card">
              <h2>Spending by category</h2>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spending}>
                    <XAxis dataKey="category" stroke="#6d7b72" />
                    <YAxis stroke="#6d7b72" />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#176044" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="card section-card chart-card">
              <h2>Category mix</h2>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={spending} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={82} label>
                      {spending.map((entry, index) => <Cell key={entry.category} fill={chartColors[index % chartColors.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <div className="card section-card report-insights">
            <h2>Useful next steps</h2>
            <div className="chips">
              <span className="chip">Review high-spend categories</span>
              <span className="chip">Set a monthly savings target</span>
              <span className="chip">Keep emergency savings growing</span>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
