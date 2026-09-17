"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilLine, Plus, Search, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import Modal from "@/components/Modal";
import { load, save } from "@/lib/store";
import { Transaction, TxType } from "@/lib/types";
import { transactionOptions } from "@/lib/transaction-options";

const money = (n: number) => "₹" + n.toLocaleString("en-IN");

const emptyDraft = (date = new Date().toISOString().slice(0, 10)) => ({
  type: "expense",
  amount: "",
  category: "Food",
  date,
  method: "UPI",
  note: "",
});

export default function Page() {
  const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>(emptyDraft());
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    method: "all",
    min: "",
    max: "",
  });

  useEffect(() => {
    load().then(setData).catch(() => setData({ transactions: [], budgets: [], goals: [], recurring: [] }));
  }, []);

  const transactions = (data?.transactions || []) as Transaction[];

  const categories = Array.from(
    new Set(transactions.map((item) => String(item.category)))
  ) as string[];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const haystack = [item.category, item.note, item.method, item.type].join(" ").toLowerCase();
      const matchesSearch = haystack.includes(filters.search.toLowerCase());
      const matchesType = filters.type === "all" || item.type === filters.type;
      const matchesCategory = filters.category === "all" || item.category === filters.category;
      const matchesMethod = filters.method === "all" || item.method === filters.method;
      const matchesMin = filters.min === "" || item.amount >= Number(filters.min);
      const matchesMax = filters.max === "" || item.amount <= Number(filters.max);

      return matchesSearch && matchesType && matchesCategory && matchesMethod && matchesMin && matchesMax;
    });
  }, [transactions, filters]);

  if (!data) return null;

  const selectedType = draft.type as TxType;
  const selectedOptions = transactionOptions[selectedType] || transactionOptions.expense;

  function closeModal() {
    setOpen(false);
    setEditingId(null);
    setDraft(emptyDraft());
  }

  function openCreateModal() {
    setEditingId(null);
    setDraft(emptyDraft());
    setOpen(true);
  }

  function openEditModal(item: Transaction) {
    setEditingId(item.id);
    setDraft({
      type: item.type,
      amount: String(item.amount),
      category: item.category,
      date: item.date,
      method: item.method,
      note: item.note || "",
    });
    setOpen(true);
  }

  function saveTransaction(event: any) {
    event.preventDefault();

    const amount = Number(draft.amount);
    if (!draft.category || !draft.date || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    const payload = {
      type: draft.type,
      amount,
      category: draft.category,
      date: draft.date,
      method: draft.method,
      note: draft.note || "General",
    };

    const updated = { ...data };

    if (editingId) {
      updated.transactions = data.transactions.map((item: any) =>
        item.id === editingId ? { ...item, ...payload } : item
      );
    } else {
      updated.transactions = [{ id: crypto.randomUUID(), ...payload }, ...data.transactions];
    }

    save(updated);
    setData(updated);
    closeModal();
  }

  function deleteTransaction(id: string) {
    if (!confirm("Delete this transaction?")) return;

    const updated = {
      ...data,
      transactions: data.transactions.filter((item: any) => item.id !== id),
    };

    save(updated);
    setData(updated);
  }

  function resetFilters() {
    setFilters({
      search: "",
      type: "all",
      category: "all",
      method: "all",
      min: "",
      max: "",
    });
  }

  return (
    <AppShell>
      <div className="topbar">
        <div>
          <div className="muted">Money movement</div>
          <h1>Transactions</h1>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={17} /> Add Transaction
        </button>
      </div>

      <div className="card section-card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Search</label>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: 14, color: "#9da5b8" }} />
              <input
                className="input"
                value={filters.search}
                onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                placeholder="Search category, note or payment"
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          <div className="field">
            <label>Type</label>
            <select
              className="input"
              value={filters.type}
              onChange={(event) => setFilters({ ...filters, type: event.target.value })}
            >
              <option value="all">All</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div className="field">
            <label>Category</label>
            <select
              className="input"
              value={filters.category}
              onChange={(event) => setFilters({ ...filters, category: event.target.value })}
            >
              <option value="all">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Method</label>
            <select
              className="input"
              value={filters.method}
              onChange={(event) => setFilters({ ...filters, method: event.target.value })}
            >
              <option value="all">All</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="field">
            <label>Min</label>
            <input
              className="input"
              type="number"
              value={filters.min}
              onChange={(event) => setFilters({ ...filters, min: event.target.value })}
            />
          </div>

          <div className="field">
            <label>Max</label>
            <input
              className="input"
              type="number"
              value={filters.max}
              onChange={(event) => setFilters({ ...filters, max: event.target.value })}
            />
          </div>

          <div className="field" style={{ display: "flex", alignItems: "end" }}>
            <button className="btn btn-ghost" type="button" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 18 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Note</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="muted" style={{ textAlign: "center", padding: "18px 12px" }}>
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.type}</td>
                    <td>{item.category}</td>
                    <td>{item.note}</td>
                    <td>{item.method}</td>
                    <td className={transactionTone(item.type)}>
                      {item.type === "income" ? "+" : item.type === "expense" ? "-" : ""}
                      {money(item.amount)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-ghost" type="button" onClick={() => openEditModal(item)}>
                          <PencilLine size={15} />
                        </button>
                        <button className="btn btn-danger" type="button" onClick={() => deleteTransaction(item.id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <Modal title={editingId ? "Edit Transaction" : "Add Transaction"} onClose={closeModal}>
          <form onSubmit={saveTransaction} className="form-grid">
            <div className="field">
              <label>Type</label>
              <select
                className="input"
                value={draft.type}
                onChange={(event) => {
                  const type = event.target.value as TxType;
                  const options = transactionOptions[type];
                  setDraft({
                    ...draft,
                    type,
                    category: options.categories[0],
                    note: options.notes[0],
                  });
                }}
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
                type="number"
                min="0.01"
                step="0.01"
                value={draft.amount}
                onChange={(event) => setDraft({ ...draft, amount: event.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select
                className="input"
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                required
              >
                {selectedOptions.categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Date</label>
              <input
                className="input"
                type="date"
                value={draft.date}
                onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Payment method</label>
              <select
                className="input"
                value={draft.method}
                onChange={(event) => setDraft({ ...draft, method: event.target.value })}
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="field">
              <label>Description</label>
              <input
                className="input"
                list="transaction-note-options"
                value={draft.note}
                onChange={(event) => setDraft({ ...draft, note: event.target.value })}
                placeholder="Choose or type a note"
              />
              <datalist id="transaction-note-options">
                {selectedOptions.notes.map((note) => <option key={note} value={note} />)}
              </datalist>
            </div>

            <div className="field full">
              <button className="btn btn-primary" type="submit">
                {editingId ? "Update Transaction" : "Save Transaction"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}

function transactionTone(type: string) {
  if (type === "income") return "positive";
  if (type === "expense") return "negative";
  return "muted";
}
