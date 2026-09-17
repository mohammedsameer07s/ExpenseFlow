"use client";
import AppShell from "@/components/AppShell";
import Modal from "@/components/Modal";
import { load, save } from "@/lib/store";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
const money = (n: number) => "₹" + n.toLocaleString("en-IN");
export default function Page() {
  const [d, setD] = useState<any>();
  const [o, setO] = useState(false);
  useEffect(() => { load().then(setD).catch(() => setD({ transactions: [], budgets: [], goals: [], recurring: [] })); }, []);
  if (!d) return null;
  function add(e: any) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = {
      id: crypto.randomUUID(),
      name: String(f.get("name")),
      target: Number(f.get("target")),
      current: Number(f.get("current") || 0),
      deadline: String(f.get("deadline")),
    };
    const nd = { ...d, goals: [g, ...d.goals] };
    save(nd);
    setD(nd);
    setO(false);
  }
  return (
    <AppShell>
      <div className="topbar">
        <div>
          <div className="muted">Build your future</div>
          <h1>Savings Goals</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setO(true)}>
          <Plus size={17} /> New Goal
        </button>
      </div>
      {d.goals.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">↗</div>
          <h2>Create your first savings goal</h2>
          <p className="muted">
            Give a future purchase or milestone a clear target and deadline.
          </p>
          <button className="btn btn-primary" onClick={() => setO(true)}>
            <Plus size={17} /> Create a savings goal
          </button>
        </div>
      ) : (
        <div className="resource-grid">
          {d.goals.map((g: any) => {
            const p = Math.min(100, (g.current / g.target) * 100);
            return (
              <div className="card section-card" key={g.id}>
                <h2>{g.name}</h2>
                <div className="goal-amount">
                  {money(g.current)}{" "}
                  <span className="muted">/ {money(g.target)}</span>
                </div>
                <div className="progress goal-progress">
                  <div style={{ width: p + "%" }} />
                </div>
                <div className="summary-line">
                  <span>{Math.round(p)}% complete</span>
                  <span className="muted">{g.deadline || "No deadline"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {o && (
        <Modal title="Create Savings Goal" onClose={() => setO(false)}>
          <form onSubmit={add} className="form-grid">
            <div className="field full">
              <label>Goal name</label>
              <input className="input" name="name" required />
            </div>
            <div className="field">
              <label>Target</label>
              <input
                className="input"
                name="target"
                type="number"
                min="1"
                required
              />
            </div>
            <div className="field">
              <label>Already saved</label>
              <input
                className="input"
                name="current"
                type="number"
                min="0"
                defaultValue="0"
              />
            </div>
            <div className="field full">
              <label>Deadline</label>
              <input className="input" name="deadline" type="date" />
            </div>
            <div className="field full">
              <button className="btn btn-primary">Create Goal</button>
            </div>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
