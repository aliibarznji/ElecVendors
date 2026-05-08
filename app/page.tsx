import { DashboardContent } from "./content/dashboard-content";
import { DashboardShell } from "./components/dashboard-shell";

export default function Home() {
  return (
    <DashboardShell>
      <DashboardContent />
    </DashboardShell>
  );
}
