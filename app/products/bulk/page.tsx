import { DashboardShell } from "../../dashboard-shell";
import { BulkOperationsContent } from "../../bulk-operations-content";

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
