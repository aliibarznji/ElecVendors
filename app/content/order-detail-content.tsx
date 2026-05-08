"use client";

import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Hash,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useLang } from "../lib/lang-context";
import { StatusPill } from "../components/status-pill";
import { api } from "../lib/api";
import { formatIqd, type ApiOrder } from "../lib/utils";

type OrderStatus = ApiOrder["status"];

const ADVANCE_STATUS: Record<OrderStatus, OrderStatus | null> = {
  new: "ready",
  ready: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
};

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-[10px] items-center rtl:flex rtl:flex-row-reverse">
      <span className="w-[30px] h-[30px] rounded-lg inline-grid place-items-center bg-brand-soft text-brand-dark shrink-0">
        <Icon aria-hidden="true" size={17} strokeWidth={2.2} />
      </span>
      <div className="rtl:text-right">
        <span className="block text-[12px] text-muted">{label}</span>
        <strong className="text-[13.5px] text-text font-semibold">{value}</strong>
      </div>
    </div>
  );
}

export function OrderDetailContent({ order: initial }: { order: ApiOrder }) {
  const [order, setOrder] = useState(initial);
  const { t } = useLang();
  const product = order.product;
  const lineTotal = order.priceWithCommission * order.quantity;
  const netTotal = order.priceWithoutCommission * order.quantity;
  const commission = lineTotal - netTotal;

  const NEXT_LABEL: Record<OrderStatus, string | null> = {
    new: t("markReadyToShip"),
    ready: t("markShipped"),
    shipped: t("markDelivered"),
    delivered: null,
    cancelled: null,
  };
  const nextAction = NEXT_LABEL[order.status];

  async function advance() {
    const next = ADVANCE_STATUS[order.status];
    if (!next) return;
    try {
      const updated = await api.orders.updateStatus(order.orderNumber, next);
      setOrder((prev) => ({ ...prev, status: updated.status }));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="grid gap-[20px] p-[22px_24px_48px] animate-[dashboard-fade-in_300ms_cubic-bezier(0.16,1,0.3,1)_both]">
      <header className="flex items-start justify-between gap-[18px]">
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1 text-[12.5px] text-muted no-underline mb-[6px] hover:text-brand-dark rtl:flex-row-reverse"
          >
            <ArrowLeft aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>{t("backToOrders")}</span>
          </Link>
          <h1 className="m-0">Order {order.orderNumber}</h1>
          <p className="mt-[7px] text-muted text-[13px] leading-[1.5]">{t("orderDetailSub")}</p>
        </div>
        <div className="flex items-center gap-3 rtl:flex-row-reverse">
          <StatusPill status={order.status} />
          {nextAction ? (
            <button className="discount-create-button" type="button" onClick={advance}>
              {nextAction}
            </button>
          ) : null}
        </div>
      </header>

      <section
        className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 max-[880px]:grid-cols-1 rtl:[direction:rtl]"
        aria-label="Order details"
      >
        <article className="dashboard-panel p-[20px_22px] grid gap-3 rtl:text-right">
          <h2 className="text-[14px] font-bold m-0 mb-[6px] text-text">{t("customerCard")}</h2>
          <DetailRow label={t("customerName")} value={order.customerName} icon={User} />
          <DetailRow label={t("phone")} value={order.customerPhone} icon={Phone} />
          <DetailRow label={t("address")} value={order.customerAddress} icon={MapPin} />
          <DetailRow
            label={t("cityProvince")}
            value={`${order.city} – ${order.province}`}
            icon={MapPin}
          />
        </article>

        <article className="dashboard-panel p-[20px_22px] grid gap-3 rtl:text-right">
          <h2 className="text-[14px] font-bold m-0 mb-[6px] text-text">{t("orderCard")}</h2>
          <DetailRow label={t("orderNumberFull")} value={order.orderNumber} icon={Hash} />
          <DetailRow label={t("orderTimeFull")} value={order.dateTime.replace("T", " ").slice(0, 16)} icon={CalendarDays} />
          <DetailRow label={t("paymentMethod")} value={order.paymentMethod} icon={CreditCard} />
          <DetailRow label={t("deliveryStatus")} value={order.deliveryStatus} icon={Truck} />
          <DetailRow label={t("deliveryAgent")} value={order.deliveryAgent} icon={ClipboardList} />
        </article>

        <article className="dashboard-panel p-[20px_22px] grid gap-3 rtl:text-right">
          <h2 className="text-[14px] font-bold m-0 mb-[6px] text-text">{t("productCard")}</h2>
          <DetailRow label={t("product")} value={product?.nameEn ?? order.productId} icon={Package} />
          <DetailRow label={t("sku")} value={product?.sku ?? "-"} icon={Hash} />
          <DetailRow label={t("vendorCode")} value={product?.vendorCode ?? "-"} icon={Hash} />
          <DetailRow label={t("color")} value={order.color} icon={Package} />
          <DetailRow label={t("size")} value={order.size} icon={Package} />
          <DetailRow label={t("quantity")} value={String(order.quantity)} icon={Package} />
        </article>

        <article className="dashboard-panel p-[20px_22px] grid gap-3 rtl:text-right">
          <h2 className="text-[14px] font-bold m-0 mb-[6px] text-text">{t("pricingCard")}</h2>
          <DetailRow
            label={t("priceExclFull")}
            value={formatIqd(order.priceWithoutCommission)}
            icon={CreditCard}
          />
          <DetailRow
            label={t("priceInclFull")}
            value={formatIqd(order.priceWithCommission)}
            icon={CreditCard}
          />
          <DetailRow label={t("quantity")} value={String(order.quantity)} icon={Package} />
          <div className="mt-2 border-t border-border pt-3 grid gap-2">
            <div className="flex items-center justify-between text-[13px] text-muted rtl:flex-row-reverse">
              <span>{t("netTotal")}</span>
              <strong className="text-text font-semibold">{formatIqd(netTotal)}</strong>
            </div>
            <div className="flex items-center justify-between text-[13px] text-muted rtl:flex-row-reverse">
              <span>{t("platformCommission")}</span>
              <strong className="text-text font-semibold">{formatIqd(commission)}</strong>
            </div>
            <div className="flex items-center justify-between text-[13px] text-muted border-t border-dashed border-border pt-2 font-bold rtl:flex-row-reverse">
              <span className="text-[14.5px] text-text">{t("orderTotal")}</span>
              <strong className="text-[14.5px] text-text">{formatIqd(lineTotal)}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
