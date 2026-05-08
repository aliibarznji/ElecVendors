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

const STATUS_TW: Record<OrderStatus, string> = {
  new: "bg-[#fef9c3] text-[#a16207]",
  ready: "bg-[#dcfce7] text-[#15803d]",
  shipped: "bg-[#e0f2fe] text-[#0369a1]",
  delivered: "bg-[#f1f5f9] text-[#475569]",
  cancelled: "bg-[#fee2e2] text-[#b91c1c]",
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
    <span className={`inline-flex items-center px-[10px] py-[3px] rounded-full text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap ${STATUS_TW[status]}`}>
      {labels[status]}
    </span>
  );
}

export { STATUS_CLASS as orderStatusClass };
export type { OrderStatus };
