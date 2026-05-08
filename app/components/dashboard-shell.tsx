import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <TopNav />
      <div className="flex min-h-[calc(100vh-68px)]">
        <Sidebar />
        <section className="flex-1 min-w-0 min-h-[calc(100vh-68px)]" aria-label="Dashboard content">
          {children}
        </section>
      </div>
    </main>
  );
}
