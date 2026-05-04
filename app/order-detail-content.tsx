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
import { useLang } from "./lang-context";
import { StatusPill } from "./status-pill";
import { api } from "./lib/api";
import { formatIqd, type ApiOrder } from "./lib/utils";

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
    <div className="order-detail-row">
      <span className="order-detail-icon">
        <Icon aria-hidden="true" size={17} strokeWidth={2.2} />
      </span>
      <div>
        <span className="order-detail-label">{label}</span>
        <strong className="order-detail-value">{value}</strong>
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
    <div className="dashboard-content order-detail-content">
      <header className="page-title-row">
        <div>
          <Link href="/orders" className="order-detail-back">
            <ArrowLeft aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>{t("backToOrders")}</span>
          </Link>
          <h1>Order {order.orderNumber}</h1>
          <p className="dashboard-sub">{t("orderDetailSub")}</p>
        </div>
        <div className="order-detail-actions">
          <StatusPill status={order.status} />
          {nextAction ? (
            <button className="discount-create-button" type="button" onClick={advance}>
              {nextAction}
            </button>
          ) : null}
        </div>
      </header>

      <section className="order-detail-grid" aria-label="Order details">
        <article className="dashboard-panel order-detail-card">
          <h2>{t("customerCard")}</h2>
          <DetailRow label={t("customerName")} value={order.customerName} icon={User} />
          <DetailRow label={t("phone")} value={order.customerPhone} icon={Phone} />
          <DetailRow label={t("address")} value={order.customerAddress} icon={MapPin} />
          <DetailRow
            label={t("cityProvince")}
            value={`${order.city} – ${order.province}`}
            icon={MapPin}
          />
        </article>

        <article className="dashboard-panel order-detail-card">
          <h2>{t("orderCard")}</h2>
          <DetailRow label={t("orderNumberFull")} value={order.orderNumber} icon={Hash} />
          <DetailRow label={t("orderTimeFull")} value={order.dateTime.replace("T", " ").slice(0, 16)} icon={CalendarDays} />
          <DetailRow label={t("paymentMethod")} value={order.paymentMethod} icon={CreditCard} />
          <DetailRow label={t("deliveryStatus")} value={order.deliveryStatus} icon={Truck} />
          <DetailRow label={t("deliveryAgent")} value={order.deliveryAgent} icon={ClipboardList} />
        </article>

        <article className="dashboard-panel order-detail-card">
          <h2>{t("productCard")}</h2>
          <DetailRow label={t("product")} value={product?.nameEn ?? order.productId} icon={Package} />
          <DetailRow label={t("sku")} value={product?.sku ?? "-"} icon={Hash} />
          <DetailRow label={t("vendorCode")} value={product?.vendorCode ?? "-"} icon={Hash} />
          <DetailRow label={t("color")} value={order.color} icon={Package} />
          <DetailRow label={t("size")} value={order.size} icon={Package} />
          <DetailRow label={t("quantity")} value={String(order.quantity)} icon={Package} />
        </article>

        <article className="dashboard-panel order-detail-card order-detail-pricing">
          <h2>{t("pricingCard")}</h2>
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
          <div className="order-detail-totals">
            <div>
              <span>{t("netTotal")}</span>
              <strong>{formatIqd(netTotal)}</strong>
            </div>
            <div>
              <span>{t("platformCommission")}</span>
              <strong>{formatIqd(commission)}</strong>
            </div>
            <div className="order-detail-grand">
              <span>{t("orderTotal")}</span>
              <strong>{formatIqd(lineTotal)}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
