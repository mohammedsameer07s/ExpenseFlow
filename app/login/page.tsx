"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser, registerUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await registerUser({ name, email, password });
      } else {
        await loginUser({ email, password });
      }
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-panel">
        <section className="auth-hero">
          <div className="brand brand-compact">Expense<span>Flow</span></div>
          <div className="mini-badge">Your money, in focus</div>
          <h1>Take control of your money with clarity.</h1>
          <p>
            Track spending, build budgets, save smarter, and stay on top of every payment in one place.
          </p>

          <div className="hero-points">
            <div>
              <strong>24k+</strong>
              <span>monthly transactions tracked</span>
            </div>
            <div>
              <strong>12%</strong>
              <span>average savings lift</span>
            </div>
          </div>
        </section>

        <section className="auth-card card">
          <div className="muted auth-label">{mode === "login" ? "Welcome back" : "Create your account"}</div>
          <h2>{mode === "login" ? "Login to your dashboard" : "Start your financial reset"}</h2>

          <div className="chips auth-switcher">
            <button type="button" className={mode === "login" ? "chip active-chip" : "chip"} onClick={() => setMode("login")}>Login</button>
            <button type="button" className={mode === "register" ? "chip active-chip" : "chip"} onClick={() => setMode("register")}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "register" && (
              <div className="field">
                <label>Name</label>
                <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Carter" required />
              </div>
            )}

            <div className="field">
              <label>Email</label>
              <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </div>

            <div className="field">
              <label>Password</label>
              <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" required minLength={6} />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="btn btn-primary auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : mode === "login" ? "Login to dashboard" : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            <Link href="/" className="muted link-back">← Back home</Link>
            <button type="button" className="btn btn-ghost" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create account" : "Use login"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
