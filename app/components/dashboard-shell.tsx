import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <main className="dashboard-shell">
      <TopNav />
      <div className="dashboard-body">
        <Sidebar />
        <section className="dashboard-stage" aria-label="Dashboard content">
          {children}
        </section>
      </div>
    </main>
  );
}
