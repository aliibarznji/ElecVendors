"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusPill } from "./status-pill";
import {
  filterOrders,
  formatIqd,
  getCancelledOrders,
  getMonthlyOrders,
  getMonthlySales,
  getNetSales,
  getProduct,
  orders,
  type OrderStatus,
  type VendorOrder,
} from "./vendor-dashboard-data";

const tabs: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "All Orders" },
  { id: "new", label: "New Orders" },
  { id: "ready", label: "Ready to Ship" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
];

function OrderStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <article className={`kpi-card kpi-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function ProductThumb({ order }: { order: VendorOrder }) {
  const product = getProduct(order.productId);
  return (
    <div
      className="sample-product-thumb"
      style={{ background: product?.imageTone }}
      aria-label={product?.nameAr ?? order.productId}
    >
      <span>{product?.brand.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export function OrderItemsContent() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("2026-05-01");
  const [to, setTo] = useState("2026-05-04");
  const [sort, setSort] = useState<"newest" | "oldest" | "amount">("newest");

  const filtered = useMemo(
    () => filterOrders(orders, activeTab, search, from, to, sort),
    [activeTab, from, search, sort, to],
  );

  return (
    <div className="order-items-content">
      <header className="page-title-row">
        <div>
          <h1>Order Items</h1>
          <p className="dashboard-sub">
            Track order items by status with price before and after commission and product details.
          </p>
        </div>
      </header>

      <section className="kpi-grid" aria-label="Monthly Order Statistics">
        <OrderStat label="Monthly Orders" value={String(getMonthlyOrders())} tone="blue" />
        <OrderStat label="Monthly Sales" value={formatIqd(getMonthlySales())} tone="green" />
        <OrderStat label="Net Sales" value={formatIqd(getNetSales(filtered))} tone="cyan" />
        <OrderStat label="Cancelled Orders" value={String(getCancelledOrders())} tone="amber" />
      </section>

      <section className="order-items-card" aria-label="Orders Table">
        <div className="bulk-tabs order-items-tabs">
          {tabs.map((tab) => (
            <button
              className={`bulk-tab${activeTab === tab.id ? " is-active" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder="Search by order number, SKU, or customer name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>From</span>
            <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label className="order-items-date">
            <span>To</span>
            <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
          <label className="order-items-date">
            <span>Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="amount">Highest Amount</option>
            </select>
          </label>
          <button
            className="purchase-order-reset"
            type="button"
            onClick={() => {
              setSearch("");
              setFrom("");
              setTo("");
              setSort("newest");
              setActiveTab("all");
            }}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>Reset</span>
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table order-items-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Order Time</th>
                <th>Image</th>
                <th>SKU</th>
                <th>Color</th>
                <th>Qty</th>
                <th>Price (excl. commission)</th>
                <th>Price (incl. commission)</th>
                <th>Status</th>
                <th>Product Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-cell">
                    No orders match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const product = getProduct(order.productId);
                  return (
                    <tr className="product-list-data-row" key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.dateTime}</td>
                      <td>
                        <ProductThumb order={order} />
                      </td>
                      <td>{product?.sku}</td>
                      <td>{order.color}</td>
                      <td>{order.quantity}</td>
                      <td>{formatIqd(order.priceWithoutCommission)}</td>
                      <td>{formatIqd(order.priceWithCommission)}</td>
                      <td>
                        <StatusPill status={order.status} shortLabel />
                      </td>
                      <td>
                        <Link
                          className="row-action-btn"
                          href={`/orders/${order.orderNumber}`}
                        >
                          <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="purchase-order-pagination">
          <span>Items per page: 20</span>
          <span>
            {filtered.length} From {orders.length}
          </span>
          <button type="button" aria-label="Previous Page" disabled>
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <button type="button" aria-label="Next Page" disabled>
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <ChevronDown aria-hidden="true" size={16} strokeWidth={2.1} />
        </div>
      </section>
    </div>
  );
}
