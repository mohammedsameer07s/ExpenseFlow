import Link from "next/link";

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <section className="card" style={{ maxWidth: 900, padding: "52px 42px" }}>
        <div className="muted">PERSONAL FINANCE · EXPENSEFLOW</div>
        <h1 style={{ fontSize: "clamp(42px,8vw,82px)", lineHeight: 1.02, margin: "12px 0 18px" }}>
          Your money.<br />
          <span style={{ color: "#8d96ff" }}>One clear view.</span>
        </h1>
        <p className="muted" style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 650 }}>
          Track income, expenses, budgets, recurring payments, and savings goals with a premium dashboard built for real-world financial habits.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 25 }}>
          <Link className="btn btn-primary" href="/login">Get Started →</Link>
          <Link className="btn btn-ghost" href="/dashboard">Open Demo</Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 28 }}>
          {[
            ["Income", "₹60,000"],
            ["Expenses", "₹17,150"],
            ["Budget Health", "77%"],
            ["Goals", "3 active"],
          ].map(([label, value]) => (
            <div key={label} className="card" style={{ padding: 18 }}>
              <div className="muted" style={{ fontSize: 12 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{value}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}