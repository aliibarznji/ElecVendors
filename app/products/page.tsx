import { DashboardShell } from "../components/dashboard-shell";
import { ProductListContent } from "../content/product-list-content";

export default function ProductListPage() {
  return (
    <DashboardShell>
      <ProductListContent />
    </DashboardShell>
  );
}
