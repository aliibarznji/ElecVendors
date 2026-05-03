import { DashboardContent } from "./dashboard-content";
import { DashboardShell } from "./dashboard-shell";

export default function Home() {
  return (
    <DashboardShell>
      <DashboardContent />
    </DashboardShell>
  );
}
