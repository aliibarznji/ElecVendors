import { DashboardShell } from "../../components/dashboard-shell";
import { BulkOperationsContent } from "../../content/bulk-operations-content";

type Props = { searchParams: Promise<{ mode?: string }> };

export default async function BulkOperationsPage({ searchParams }: Props) {
  const { mode } = await searchParams;
  const initialMode = mode === "stock" ? "stock" : "prices";

  return (
    <DashboardShell>
      <BulkOperationsContent initialMode={initialMode} />
    </DashboardShell>
  );
}
