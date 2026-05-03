import { DashboardShell } from "../dashboard-shell";
import { PurchaseOrdersContent } from "../purchase-orders-content";

export default function PurchaseOrdersPage() {
  return (
    <DashboardShell>
      <PurchaseOrdersContent />
    </DashboardShell>
  );
}
