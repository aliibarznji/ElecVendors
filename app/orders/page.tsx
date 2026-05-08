import { DashboardShell } from "../components/dashboard-shell";
import { OrderItemsContent } from "../content/order-items-content";

export default function OrdersPage() {
  return (
    <DashboardShell>
      <OrderItemsContent />
    </DashboardShell>
  );
}
