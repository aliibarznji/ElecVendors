import { AddProductContent } from "../../add-product-content";
import { DashboardShell } from "../../dashboard-shell";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function AddProductPage({ searchParams }: Props) {
  const { id } = await searchParams;
  return (
    <DashboardShell>
      <AddProductContent editId={id} />
    </DashboardShell>
  );
}
