import type { OrderStatus } from "./vendor-dashboard-data";

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New Order",
  ready: "Ready to Ship",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  new: "is-pending",
  ready: "is-active",
  shipped: "is-info",
  delivered: "is-completed",
  cancelled: "is-rejected",
};

export function StatusPill({
  status,
  shortLabel = false,
}: {
  status: OrderStatus;
  shortLabel?: boolean;
}) {
  const label = shortLabel
    ? STATUS_LABEL[status].replace(" Order", "")
    : STATUS_LABEL[status];
  return (
    <span className={`approved-status-badge ${STATUS_CLASS[status]}`}>
      {label}
    </span>
  );
}

export { STATUS_LABEL as orderStatusLabel, STATUS_CLASS as orderStatusClass };
