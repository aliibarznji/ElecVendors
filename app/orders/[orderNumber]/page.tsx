import { notFound } from "next/navigation";
import { DashboardShell } from "../../dashboard-shell";
import { OrderDetailContent } from "../../order-detail-content";
import { orders } from "../../vendor-dashboard-data";

type Props = { params: Promise<{ orderNumber: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = orders.find((entry) => entry.orderNumber === orderNumber);
  if (!order) notFound();

  return (
    <DashboardShell>
      <OrderDetailContent order={order} />
    </DashboardShell>
  );
}
