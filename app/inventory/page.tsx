import { DashboardShell } from "../components/dashboard-shell";
import { InventoryContent } from "../content/inventory-content";

export default function InventoryPage() {
  return (
    <DashboardShell>
      <InventoryContent />
    </DashboardShell>
  );
}
