import { DashboardShell } from "../dashboard-shell";
import { OrderItemsContent } from "../order-items-content";

export default function OrdersPage() {
  return (
    <DashboardShell>
      <OrderItemsContent />
    </DashboardShell>
  );
}
