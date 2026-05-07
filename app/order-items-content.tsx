"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  MapPin,
  Phone,
  Printer,
  RotateCcw,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "./lang-context";
import { StatusPill } from "./status-pill";
import { api, type OrdersParams } from "./lib/api";
import { formatIqd, type ApiOrder, type ApiProduct } from "./lib/utils";

function ProductThumb({ product }: { product?: ApiProduct }) {
  const { lang } = useLang();
  const name = product ? (lang === "ar" ? product.nameAr : product.nameEn) : "";
  if (product?.mainImage) {
    return <img className="sample-product-thumb" src={product.mainImage} alt={name} />;
  }
  return (
    <div className="sample-product-thumb" style={{ background: product?.imageTone }} aria-label={name}>
      <span>{product?.brand?.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

type OrderGroup = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  province: string;
  paymentMethod: string;
  dateTime: string;
  items: ApiOrder[];
  total: number;
};

function groupByOrderNumber(orders: ApiOrder[]): OrderGroup[] {
  const map = new Map<string, OrderGroup>();
  for (const o of orders) {
    const g = map.get(o.orderNumber) ?? {
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerAddress: o.customerAddress,
      city: o.city,
      province: o.province,
      paymentMethod: o.paymentMethod,
      dateTime: o.dateTime,
      items: [],
      total: 0,
    };
    g.items.push(o);
    g.total += o.priceWithCommission * o.quantity;
    map.set(o.orderNumber, g);
  }
  return [...map.values()].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
}

function printInvoice(group: OrderGroup) {
  const rows = group.items
    .map(
      (item, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${item.product?.nameEn ?? item.productId}</td>
        <td>${item.product?.sku ?? "-"}</td>
        <td>${item.color || "-"}</td>
        <td>${item.size || "-"}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">${formatIqd(item.priceWithCommission)}</td>
        <td style="text-align:right">${formatIqd(item.priceWithCommission * item.quantity)}</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Invoice — Order #${group.orderNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 48px; color: #1e293b; font-size: 13px; }
    .inv-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #3d5fb6; padding-bottom: 24px; margin-bottom: 32px; }
    .brand-name { font-size: 26px; font-weight: 800; color: #3d5fb6; letter-spacing: -0.5px; }
    .brand-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    .inv-label { font-size: 28px; font-weight: 700; color: #1e293b; text-align: right; }
    .inv-num { font-size: 14px; color: #64748b; text-align: right; margin-top: 4px; }
    .inv-date { font-size: 12px; color: #94a3b8; text-align: right; margin-top: 2px; }
    .inv-meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 32px; padding: 20px 24px; background: #f8faff; border-radius: 10px; border: 1px solid #e2e8f0; }
    .meta-block h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 8px; font-weight: 600; }
    .meta-block p { font-size: 13px; color: #334155; line-height: 1.6; }
    .meta-block p strong { font-weight: 600; color: #1e293b; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead th { background: #3d5fb6; color: #fff; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    thead th:last-child, thead th:nth-child(6), thead th:nth-child(7) { text-align: right; }
    tbody td { padding: 11px 12px; border-bottom: 1px solid #f1f3f9; font-size: 13px; color: #334155; vertical-align: middle; }
    tbody tr:hover { background: #f8faff; }
    .total-section { display: flex; justify-content: flex-end; margin-top: 8px; }
    .total-box { min-width: 280px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .total-row { display: flex; justify-content: space-between; padding: 10px 16px; font-size: 13px; border-bottom: 1px solid #f1f3f9; }
    .total-row.grand { background: #3d5fb6; color: #fff; font-weight: 700; font-size: 15px; border-bottom: none; }
    .inv-footer { margin-top: 48px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; line-height: 1.8; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #dcfce7; color: #16a34a; }
    @media print {
      body { padding: 24px; }
      @page { margin: 1cm; }
    }
  </style>
</head>
<body>
  <div class="inv-header">
    <div>
      <div class="brand-name">Electromall</div>
      <div class="brand-sub">Vendor Sales Invoice</div>
    </div>
    <div>
      <div class="inv-label">INVOICE</div>
      <div class="inv-num">#${group.orderNumber}</div>
      <div class="inv-date">${new Date(group.dateTime).toLocaleDateString("en-US", { dateStyle: "long" })}</div>
    </div>
  </div>

  <div class="inv-meta">
    <div class="meta-block">
      <h3>Bill To</h3>
      <p><strong>${group.customerName}</strong></p>
      <p>${group.customerPhone}</p>
      <p>${group.customerAddress}</p>
      <p>${group.city}, ${group.province}</p>
    </div>
    <div class="meta-block">
      <h3>Order Info</h3>
      <p><strong>Order #</strong> ${group.orderNumber}</p>
      <p><strong>Date</strong> ${group.dateTime.slice(0, 10)}</p>
      <p><strong>Payment</strong> ${group.paymentMethod}</p>
    </div>
    <div class="meta-block">
      <h3>Status</h3>
      <p><span class="status-badge">Accepted</span></p>
      <p style="margin-top:8px"><strong>Items</strong> ${group.items.length}</p>
      <p><strong>Total</strong> ${formatIqd(group.total)}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Product</th>
        <th>SKU</th>
        <th>Color</th>
        <th>Size</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Price</th>
        <th style="text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="total-section">
    <div class="total-box">
      <div class="total-row"><span>Items</span><span>${group.items.length}</span></div>
      <div class="total-row"><span>Payment Method</span><span>${group.paymentMethod}</span></div>
      <div class="total-row grand"><span>Total</span><span>${formatIqd(group.total)}</span></div>
    </div>
  </div>

  <div class="inv-footer">
    <p>Thank you for your business with Electromall.</p>
    <p>This invoice was generated automatically. For questions, contact your account manager.</p>
    <p style="margin-top:8px; color:#cbd5e1">Electromall Vendors Platform · ${new Date().getFullYear()}</p>
  </div>

  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

function NewOrdersSection() {
  const [groups, setGroups] = useState<OrderGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const { t, lang } = useLang();

  useEffect(() => {
    setLoading(true);
    api.orders
      .list({ status: "new", limit: 200 })
      .then((r) => setGroups(groupByOrderNumber(r.items)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function toggleOpen(orderNumber: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(orderNumber) ? next.delete(orderNumber) : next.add(orderNumber);
      return next;
    });
  }

  async function handleAccept(group: OrderGroup) {
    setProcessing((p) => new Set(p).add(group.orderNumber));
    try {
      await api.orders.updateStatus(group.orderNumber, "ready");
      setGroups((prev) => prev.filter((g) => g.orderNumber !== group.orderNumber));
    } finally {
      setProcessing((p) => { const n = new Set(p); n.delete(group.orderNumber); return n; });
    }
  }

  async function handleReject(group: OrderGroup) {
    setProcessing((p) => new Set(p).add(group.orderNumber));
    try {
      await api.orders.updateStatus(group.orderNumber, "cancelled");
      setGroups((prev) => prev.filter((g) => g.orderNumber !== group.orderNumber));
    } finally {
      setProcessing((p) => { const n = new Set(p); n.delete(group.orderNumber); return n; });
    }
  }

  return (
    <section className="new-orders-section" aria-label="New Orders">
      <div className="new-orders-header">
        <div className="new-orders-title-wrap">
          <ShoppingBag size={20} strokeWidth={2.2} aria-hidden="true" />
          <div>
            <h2>New Orders</h2>
            <p className="dashboard-sub">Incoming orders awaiting your acceptance</p>
          </div>
        </div>
        {!loading && (
          <span className="new-orders-count-badge">
            {groups.length} pending
          </span>
        )}
      </div>

      {loading ? (
        <div className="empty-cell" style={{ padding: "32px 0" }}>Loading…</div>
      ) : groups.length === 0 ? (
        <div className="new-orders-empty">
          <ShoppingBag size={36} strokeWidth={1.4} aria-hidden="true" />
          <p>No new orders at the moment</p>
        </div>
      ) : (
        <div className="new-orders-list">
          {groups.map((group) => {
            const isOpen = open.has(group.orderNumber);
            const busy = processing.has(group.orderNumber);
            return (
              <article className="new-order-card" key={group.orderNumber}>
                {/* Card header row */}
                <div className="new-order-card-top">
                  <div className="new-order-meta">
                    <span className="new-order-num">#{group.orderNumber}</span>
                    <span className="new-order-date">
                      {new Date(group.dateTime).toLocaleDateString("en-US", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="new-order-customer">
                    <span className="new-order-customer-icon">
                      <User size={13} strokeWidth={2.3} aria-hidden="true" />
                    </span>
                    <span>{group.customerName}</span>
                    <span className="new-order-sep">·</span>
                    <Phone size={12} strokeWidth={2.2} aria-hidden="true" />
                    <span>{group.customerPhone}</span>
                    <span className="new-order-sep">·</span>
                    <MapPin size={12} strokeWidth={2.2} aria-hidden="true" />
                    <span>{group.city}</span>
                  </div>

                  <div className="new-order-summary">
                    <span className="new-order-items-badge">
                      {group.items.length} {group.items.length === 1 ? "item" : "items"}
                    </span>
                    <strong className="new-order-total">{formatIqd(group.total)}</strong>
                  </div>

                  <div className="new-order-actions">
                    <button
                      className="new-order-details-btn"
                      type="button"
                      onClick={() => toggleOpen(group.orderNumber)}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? (
                        <ChevronUp size={14} strokeWidth={2.4} aria-hidden="true" />
                      ) : (
                        <ChevronDown size={14} strokeWidth={2.4} aria-hidden="true" />
                      )}
                      {isOpen ? "Hide Details" : "See Details"}
                    </button>
                    <button
                      className="new-order-accept-btn"
                      type="button"
                      disabled={busy}
                      onClick={() => handleAccept(group)}
                    >
                      <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                      Accept
                    </button>
                    <button
                      className="new-order-reject-btn"
                      type="button"
                      disabled={busy}
                      onClick={() => handleReject(group)}
                    >
                      <X size={14} strokeWidth={2.5} aria-hidden="true" />
                      Reject
                    </button>
                  </div>
                </div>

                {/* Expandable details */}
                {isOpen && (
                  <div className="new-order-detail-panel">
                    <div className="new-order-detail-info">
                      <span>
                        <MapPin size={12} aria-hidden="true" />
                        {group.customerAddress}, {group.city}, {group.province}
                      </span>
                      <span>Payment: <strong>{group.paymentMethod}</strong></span>
                    </div>

                    <div className="purchase-order-table-wrap" style={{ marginTop: 0 }}>
                      <table className="purchase-order-table new-order-items-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((item) => (
                            <tr className="product-list-data-row" key={item.id}>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <ProductThumb product={item.product} />
                                  <span>
                                    {item.product
                                      ? lang === "ar"
                                        ? item.product.nameAr
                                        : item.product.nameEn
                                      : item.productId}
                                  </span>
                                </div>
                              </td>
                              <td>{item.product?.sku ?? "-"}</td>
                              <td>{item.color || "-"}</td>
                              <td>{item.size || "-"}</td>
                              <td>{item.quantity}</td>
                              <td>{formatIqd(item.priceWithCommission)}</td>
                              <td>
                                <strong>{formatIqd(item.priceWithCommission * item.quantity)}</strong>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="new-order-detail-footer">
                      <div className="new-order-total-row">
                        <span>Total ({group.items.length} items)</span>
                        <strong>{formatIqd(group.total)}</strong>
                      </div>
                      <button
                        className="new-order-print-btn discount-create-button"
                        type="button"
                        onClick={() => printInvoice(group)}
                      >
                        <Printer size={15} strokeWidth={2.3} aria-hidden="true" />
                        Print Invoice
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function OrderItemsContent() {
  const [activeTab, setActiveTab] = useState<ApiOrder["status"] | "all">("all");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState(() =>
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
  );
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
    api.orders
      .list(params)
      .then((r) => { setOrders(r.items); setTotal(r.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab, search, from, to, sort, page]);

  useEffect(() => { setPage(1); }, [activeTab, search, from, to, sort]);

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
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>{t("from")}</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="order-items-date">
            <span>{t("to")}</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <label className="order-items-date">
            <span>{t("sort")}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
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
                  <td colSpan={10} className="empty-cell">{t("noOrdersMatch")}</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr className="product-list-data-row" key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.dateTime.replace("T", " ").slice(0, 16)}</td>
                    <td><ProductThumb product={order.product} /></td>
                    <td>{order.product?.sku}</td>
                    <td>{order.color}</td>
                    <td>{order.quantity}</td>
                    <td>{formatIqd(order.priceWithoutCommission)}</td>
                    <td>{formatIqd(order.priceWithCommission)}</td>
                    <td><StatusPill status={order.status} shortLabel /></td>
                    <td>
                      <Link className="row-action-btn" href={`/orders/${order.orderNumber}`}>
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
          <span>{orders.length} {t("from")} {total}</span>
          <span>{page} / {totalPages}</span>
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

      <NewOrdersSection />
    </div>
  );
}
