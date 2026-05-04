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
import { useLang } from "./lang-context";
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
  const { t } = useLang();

  const filtered = useMemo(
    () => filterOrders(orders, activeTab, search, from, to, sort),
    [activeTab, from, search, sort, to],
  );


  return (
    <div className="order-items-content">
      <header className="page-title-row">
        <div>
          <h1>{t("orderItems")}</h1>
          <p className="dashboard-sub">{t("orderItemsSub")}</p>
        </div>
      </header>

      <section className="kpi-grid" aria-label="Monthly Order Statistics">
        <article className="kpi-card kpi-blue">
          <p>{t("monthlyOrders")}</p>
          <strong>{String(getMonthlyOrders())}</strong>
        </article>
        <article className="kpi-card kpi-green">
          <p>{t("monthlySales")}</p>
          <strong>{formatIqd(getMonthlySales())}</strong>
        </article>
        <article className="kpi-card kpi-cyan">
          <p>{t("netSales")}</p>
          <strong>{formatIqd(getNetSales(filtered))}</strong>
        </article>
        <article className="kpi-card kpi-amber">
          <p>{t("cancelledOrders")}</p>
          <strong>{String(getCancelledOrders())}</strong>
        </article>
      </section>

      <section className="order-items-card" aria-label="Orders Table">
        <div className="bulk-tabs order-items-tabs">
          {(["all", "new", "ready", "shipped", "delivered"] as const).map((id) => {
            const labels: Record<string, string> = {
              all: t("allOrders"),
              new: t("newOrders"),
              ready: t("readyToShip"),
              shipped: t("shipped"),
              delivered: t("delivered"),
            };
            return (
              <button
                className={`bulk-tab${activeTab === id ? " is-active" : ""}`}
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
              >
                {labels[id]}
              </button>
            );
          })}
        </div>

        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder={t("searchOrders")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>{t("from")}</span>
            <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label className="order-items-date">
            <span>{t("to")}</span>
            <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
          <label className="order-items-date">
            <span>{t("sort")}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
              <option value="newest">{t("newest")}</option>
              <option value="oldest">{t("oldest")}</option>
              <option value="amount">{t("highestAmount")}</option>
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
            <span>{t("reset")}</span>
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table order-items-table">
            <thead>
              <tr>
                <th>{t("orderNumber")}</th>
                <th>{t("orderTime")}</th>
                <th>{t("image")}</th>
                <th>{t("sku")}</th>
                <th>{t("color")}</th>
                <th>{t("qty")}</th>
                <th>{t("priceExcl")}</th>
                <th>{t("priceIncl")}</th>
                <th>{t("status")}</th>
                <th>{t("productDetails")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-cell">
                    {t("noOrdersMatch")}
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
                          <span>{t("viewOrder")}</span>
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
          <span>{t("itemsPerPage")}</span>
          <span>
            {filtered.length} {t("from")} {orders.length}
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
