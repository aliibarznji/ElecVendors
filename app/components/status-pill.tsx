"use client";

import { useLang } from "../lib/lang-context";

type OrderStatus = "new" | "ready" | "shipped" | "delivered" | "cancelled";

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
  const { t } = useLang();
  const labels: Record<OrderStatus, string> = {
    new: shortLabel ? t("statusNew") : t("newOrders"),
    ready: t("readyToShip"),
    shipped: t("shipped"),
    delivered: t("delivered"),
    cancelled: t("statusCancelled"),
  };
  return (
    <span className={`approved-status-badge ${STATUS_CLASS[status]}`}>
      {labels[status]}
    </span>
  );
}

export { STATUS_CLASS as orderStatusClass };
export type { OrderStatus };
