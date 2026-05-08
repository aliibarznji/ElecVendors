import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardShell } from "../../components/dashboard-shell";
import { OrderDetailContent } from "../../content/order-detail-content";

type Props = { params: Promise<{ orderNumber: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(
    `${process.env.BACKEND_URL ?? "http://localhost:4000"}/api/orders/${orderNumber}`,
    {
      headers: { Cookie: token ? `token=${token}` : "" },
      cache: "no-store",
    },
  );

  if (res.status === 404) notFound();
  if (!res.ok) notFound();

  const order = await res.json();

  return (
    <DashboardShell>
      <OrderDetailContent order={order} />
    </DashboardShell>
  );
}
