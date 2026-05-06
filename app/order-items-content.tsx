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
import { useEffect, useState } from "react";
import { useLang } from "./lang-context";
import { StatusPill } from "./status-pill";
import { api, type OrdersParams } from "./lib/api";
import { formatIqd, totalProductQty, type ApiOrder, type ApiProduct } from "./lib/utils";

function ProductThumb({ product }: { product?: ApiProduct }) {
  const { lang } = useLang();
  const name = product ? (lang === "ar" ? product.nameAr : product.nameEn) : "";
  if (product?.mainImage) {
    return <img className="sample-product-thumb" src={product.mainImage} alt={name} />;
  }
  return (
    <div
      className="sample-product-thumb"
      style={{ background: product?.imageTone }}
      aria-label={name}
    >
      <span>{product?.brand.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export function OrderItemsContent() {
  const [activeTab, setActiveTab] = useState<ApiOrder["status"] | "all">("all");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [sort, setSort] = useState<"newest" | "oldest" | "amount">("newest");
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();
  const PAGE_SIZE = 100;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    setLoading(true);
    const params: OrdersParams = {
      status: activeTab === "all" ? undefined : activeTab,
      search: search || undefined,
      dateFrom: from || undefined,
      dateTo: to || undefined,
      sort,
      limit: PAGE_SIZE,
      page,
    };
    api.orders.list(params)
      .then((r) => { setOrders(r.items); setTotal(r.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab, search, from, to, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, from, to, sort]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyOrders = orders.filter((o) => o.dateTime.startsWith(currentMonth)).length;
  const monthlySales = orders
    .filter((o) => o.dateTime.startsWith(currentMonth) && o.status !== "cancelled")
    .reduce((s, o) => s + o.priceWithCommission * o.quantity, 0);
  const netSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.priceWithoutCommission * o.quantity, 0);
  const cancelledOrders = orders.filter(
    (o) => o.dateTime.startsWith(currentMonth) && o.status === "cancelled",
  ).length;

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
          <strong>{String(monthlyOrders)}</strong>
        </article>
        <article className="kpi-card kpi-green">
          <p>{t("monthlySales")}</p>
          <strong>{formatIqd(monthlySales)}</strong>
        </article>
        <article className="kpi-card kpi-cyan">
          <p>{t("netSales")}</p>
          <strong>{formatIqd(netSales)}</strong>
        </article>
        <article className="kpi-card kpi-amber">
          <p>{t("cancelledOrders")}</p>
          <strong>{String(cancelledOrders)}</strong>
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
              {loading ? (
                <tr>
                  <td colSpan={10} className="empty-cell">Loading…</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-cell">
                    {t("noOrdersMatch")}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr className="product-list-data-row" key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.dateTime.replace("T", " ").slice(0, 16)}</td>
                    <td>
                      <ProductThumb product={order.product} />
                    </td>
                    <td>{order.product?.sku}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="purchase-order-pagination">
          <span>{t("itemsPerPage")}</span>
          <span>
            {orders.length} {t("from")} {total}
          </span>
          <span>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            aria-label="Previous Page"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <button
            type="button"
            aria-label="Next Page"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <ChevronDown aria-hidden="true" size={16} strokeWidth={2.1} />
        </div>
      </section>
    </div>
  );
}
