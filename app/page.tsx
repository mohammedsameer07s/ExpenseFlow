import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function Page() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav">
        <div className="brand">Expense<span>Flow</span></div>
        <div className="landing-nav-actions">
          <Link className="nav-login" href="/login">Login</Link>
          <Link className="btn btn-primary" href="/login">Start free <ArrowRight size={16} /></Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <div className="mini-badge"><span className="status-dot" /> Calm money management</div>
          <h1>Make every rupee feel <em>intentional.</em></h1>
          <p>
            ExpenseFlow brings your everyday spending, budgets, and goals into one calm place so you can make better decisions without spreadsheet fatigue.
          </p>
          <div className="landing-actions">
            <Link className="btn btn-primary btn-large" href="/login">Build your money map <ArrowRight size={17} /></Link>
          </div>
          <div className="trust-line"><Check size={15} /> No card required <Check size={15} /> Set up in two minutes</div>
        </div>

        <div className="landing-preview" aria-label="ExpenseFlow dashboard preview">
          <div className="preview-glow" />
          <div className="preview-window">
            <div className="preview-topbar"><span className="window-dots"><i /><i /><i /></span><span>expenseflow / overview</span><span className="preview-avatar">A</span></div>
            <div className="preview-content">
              <div className="preview-heading"><div><span>Tuesday, September 16</span><strong>Your money at a glance</strong></div><span className="preview-add">+ Add</span></div>
              <div className="preview-balance"><span>Total balance</span><strong>₹42,850</strong><small><b>+8.4%</b> from last month</small></div>
              <div className="preview-stats"><div><span>Income</span><strong>₹60,000</strong></div><div><span>Spent</span><strong>₹17,150</strong></div></div>
              <div className="preview-chart"><div className="chart-label"><span>Cash flow</span><span>Last 6 months</span></div><div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-proof">
        <span>One view for your whole financial life</span>
        <div><b>Track</b><small>Every transaction, organized</small></div>
        <div><b>Plan</b><small>Budgets that match real life</small></div>
        <div><b>Grow</b><small>Goals that turn into progress</small></div>
      </section>
    </main>
  );
}