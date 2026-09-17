"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
  Target,
  WalletCards,
} from "lucide-react";
import { clearSessionUser, getSessionUser } from "@/lib/auth";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/transactions", "Transactions", ReceiptText],
  ["/budgets", "Budgets", WalletCards],
  ["/goals", "Savings Goals", Target],
  ["/reports", "Reports", BarChart3],
  ["/settings", "Settings", Settings],
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    getSessionUser().then(setUser);
  }, []);

  function handleLogout() {
    clearSessionUser().finally(() => router.push("/login"));
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Expense<span>Flow</span></div>

        <div className="user-pill">
          <div className="avatar">{(user?.name || "U").slice(0, 1).toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.name || "User"}</div>
            <div className="muted small-text">{user?.email || "No email"}</div>
          </div>
        </div>

        <nav className="nav">
          {links.map(([href, label, Icon]: any) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={href}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-card">
          <div className="muted sidebar-title">
            Finance profile
          </div>
          <div className="sidebar-user">{user?.name || "User"}</div>
          <div className="muted small-text">INR · Monthly budget</div>
        </div>

        <button className="btn btn-logout" onClick={handleLogout}>
          <LogOut size={15} /> Logout
        </button>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}
