"use client";

import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Download,
  MapPin,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "./lang-context";
import { StatusPill } from "./status-pill";
import { api } from "./lib/api";
import {
  bestSellingProducts,
  formatIqd,
  salesByProvince,
  type ApiOrder,
  type ApiProduct,
} from "./lib/utils";

const TODAY = new Date().toISOString().slice(0, 10);

function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const RANGE_KEYS = ["lastSevenDays", "last30Days", "thisMonth", "lastMonth"] as const;
const RANGE_INTERNAL = ["Last 7 Days", "Last 30 Days", "This Month", "Last Month"] as const;

function rangeFrom(label: string): string {
  const today = new Date(TODAY);
  if (label === "This Month") return `${TODAY.slice(0, 7)}-01`;
  if (label === "Last Month") {
    today.setMonth(today.getMonth() - 1);
    return `${today.toISOString().slice(0, 7)}-01`;
  }
  const days = label === "Last 7 Days" ? 7 : 30;
  today.setDate(today.getDate() - days);
  return today.toISOString().slice(0, 10);
}

function KpiCard({
  label, value, detail, tone, icon: Icon, liveLabel,
}: {
  label: string; value: string; detail: string; tone: string; icon: LucideIcon; liveLabel: string;
}) {
  return (
    <article className={`dashboard-kpi-card kpi-${tone}`}>
      <div className="dashboard-kpi-top">
        <span className="dashboard-kpi-icon">
          <Icon aria-hidden="true" size={19} strokeWidth={2.25} />
        </span>
        <span className="dashboard-kpi-change">{liveLabel}</span>
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span className="dashboard-kpi-detail">{detail}</span>
    </article>
  );
}

function BarChart({ data, valueFormatter }: { data: { label: string; value: number }[]; valueFormatter?: (v: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="revenue-trend-chart dashboard-bars" aria-label="Monthly chart">
      {data.map((item) => {
        const height = Math.max((item.value / max) * 100, item.value ? 8 : 3);
        return (
          <div className="revenue-bar-item" key={item.label}>
            <span className="chart-value-label">{valueFormatter ? valueFormatter(item.value) : item.value}</span>
            <span className="revenue-bar-track"><span style={{ height: `${height}%` }} /></span>
            <small>{item.label}</small>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data, valueFormatter }: { data: { label: string; value: number }[]; valueFormatter?: (v: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 100; const H = 100;
  const stepX = data.length > 1 ? W / (data.length - 1) : 0;
  const pts = data.map((d, i) => ({ x: i * stepX, y: H - (d.value / max) * (H - 12) - 4 }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  const area = `${path} L ${W} ${H} L 0 ${H} Z`;
  return (
    <div className="dashboard-line-chart" aria-label="Monthly trend">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img">
        <path className="dashboard-line-area" d={area} />
        <path className="dashboard-line-stroke" d={path} />
        {pts.map((p, i) => <circle key={data[i].label} cx={p.x} cy={p.y} r={1.4} className="dashboard-line-dot" />)}
      </svg>
      <div className="dashboard-line-labels">
        {data.map((d) => (
          <span key={d.label}><small>{d.label}</small><strong>{valueFormatter ? valueFormatter(d.value) : d.value}</strong></span>
        ))}
      </div>
    </div>
  );
}

function lastFiveMonths(): { label: string; prefix: string }[] {
  const months = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 4; i >= 0; i--) {
    const t = new Date(d);
    t.setMonth(d.getMonth() - i);
    months.push({
      label: t.toLocaleString("en-US", { month: "long" }),
      prefix: t.toISOString().slice(0, 7),
    });
  }
  return months;
}

function ordersByMonth(orders: ApiOrder[]) {
  return lastFiveMonths().map(({ label, prefix }) => ({
    label,
    value: orders.filter((o) => o.dateTime.startsWith(prefix)).length,
  }));
}

function salesByMonth(orders: ApiOrder[]) {
  return lastFiveMonths().map(({ label, prefix }) => ({
    label,
    value: orders
      .filter((o) => o.dateTime.startsWith(prefix) && o.status !== "cancelled")
      .reduce((s, o) => s + o.priceWithCommission * o.quantity, 0),
  }));
}

export function DashboardContent() {
  const [allOrders, setAllOrders] = useState<ApiOrder[]>([]);
  const [activeRange, setActiveRange] = useState<string | null>(null);
  const { t } = useLang();

  useEffect(() => {
    api.orders.list({ limit: 500 }).then((r) => setAllOrders(r.items)).catch(console.error);
  }, []);

  const filteredOrders = activeRange
    ? allOrders.filter((o) => {
        const d = o.dateTime.slice(0, 10);
        return d >= rangeFrom(activeRange) && d <= TODAY;
      })
    : allOrders;

  const month = TODAY.slice(0, 7);
  const monthlyOrders = allOrders.filter((o) => o.dateTime.startsWith(month)).length;
  const monthlySales = allOrders
    .filter((o) => o.dateTime.startsWith(month) && o.status !== "cancelled")
    .reduce((s, o) => s + o.priceWithCommission * o.quantity, 0);
  const pendingOrders = allOrders.filter((o) => o.status === "new").length;
  const netSales = allOrders
    .filter((o) => o.dateTime.startsWith(month) && o.status !== "cancelled")
    .reduce((s, o) => s + o.priceWithoutCommission * o.quantity, 0);

  const provinceRows = salesByProvince(filteredOrders).slice(0, 5);
  const bestSellers = bestSellingProducts(filteredOrders).slice(0, 5);
  const recentOrders = [...filteredOrders]
    .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
    .slice(0, 10);

  const kpis = [
    { label: t("monthlyOrdersTotal"), value: String(monthlyOrders), detail: t("monthlyOrdersDetail"), tone: "green", icon: ShoppingCart },
    { label: t("monthlySalesTotal"), value: formatIqd(monthlySales), detail: t("monthlySalesDetail"), tone: "blue", icon: TrendingUp },
    { label: t("pendingOrdersLabel"), value: String(pendingOrders), detail: t("pendingOrdersDetail"), tone: "orange", icon: AlertTriangle },
    { label: t("netSalesLabel"), value: formatIqd(netSales), detail: t("netSalesDetail"), tone: "cyan", icon: Wallet },
  ];

  const quickRanges = RANGE_KEYS.map((key, i) => ({ label: t(key), internal: RANGE_INTERNAL[i] }));

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <div>
          <h1>{t("mainDashboard")}</h1>
          <p className="dashboard-sub">{t("dashboardSub")}</p>
        </div>
        <div className="dashboard-controls">
          <div className="primary-controls">
            <button
              className="export-button"
              type="button"
              onClick={() => {
                const headers = ["Order #", "Product", "Date", "Amount (IQD)", "Status", "City"];
                const rows = recentOrders.map((o) => [
                  o.orderNumber,
                  o.product?.nameEn ?? o.productId,
                  o.dateTime,
                  o.priceWithCommission * o.quantity,
                  o.status,
                  o.city,
                ]);
                downloadCsv("dashboard-orders.csv", headers, rows);
              }}
            >
              <Download aria-hidden="true" size={20} strokeWidth={2.2} />
              <span>{t("exportDashboard")}</span>
            </button>
            <button className="date-range" type="button">
              <span>2026/05/01 - 2026/05/05</span>
              <CalendarDays aria-hidden="true" size={22} strokeWidth={2.1} />
            </button>
          </div>
          <div className="quick-ranges" aria-label="Quick date ranges">
            {quickRanges.map((range) => (
              <button
                className={`range-button${activeRange === range.internal ? " is-active" : ""}`}
                key={range.internal}
                type="button"
                onClick={() => setActiveRange((cur) => (cur === range.internal ? null : range.internal))}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="dashboard-kpi-grid" aria-label="Monthly indicators">
        {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} liveLabel={t("liveUpdate")} />)}
      </section>

      <section className="dashboard-analytics-grid" aria-label="Analytics">
        <article className="dashboard-panel dashboard-analytics-panel revenue-panel">
          <div className="analytics-panel-heading">
            <div><h2>{t("salesByMonth")}</h2><p>{t("salesByMonthSub")}</p></div>
            <strong>{formatIqd(monthlySales)}</strong>
          </div>
          <LineChart data={salesByMonth(filteredOrders)} valueFormatter={(v) => `${Math.round(v / 1000)}k`} />
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div><h2>{t("ordersByMonth")}</h2><p>{t("ordersByMonthSub")}</p></div>
            <strong>{monthlyOrders}</strong>
          </div>
          <BarChart data={ordersByMonth(filteredOrders)} />
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div><h2>{t("salesByCity")}</h2><p>{t("salesByCitySub")}</p></div>
            <MapPin aria-hidden="true" size={20} strokeWidth={2.3} />
          </div>
          <ul className="fulfillment-list dashboard-ranked-list">
            {provinceRows.map((row) => (
              <li className="fulfillment-step step-blue" key={row.province}>
                <div><span>{row.province}</span><strong>{row.orders}</strong></div>
                <div className="fulfillment-track" aria-hidden="true">
                  <span style={{ width: `${Math.max((row.sales / (provinceRows[0]?.sales || 1)) * 100, 5)}%` }} />
                </div>
                <small>{formatIqd(row.sales)}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div><h2>{t("bestSelling")}</h2><p>{t("bestSellingSub")}</p></div>
            <BarChart3 aria-hidden="true" size={20} strokeWidth={2.3} />
          </div>
          <div className="best-seller-list">
            {bestSellers.map(({ product, sold }, index) => (
              <article key={product.id} className="best-seller-row">
                <span className="seller-rank">{index + 1}</span>
                <span className="sample-product-thumb dashboard-thumb" style={{ background: product.imageTone }} aria-label={product.brand}>
                  <span>{product.brand.slice(0, 2).toUpperCase()}</span>
                </span>
                <div>
                  <strong>{product.nameAr}</strong>
                  <span>{product.sku}</span>
                </div>
                <b>{sold} {t("units")}</b>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-panel table-panel table-panel-large">
        <div className="panel-heading">
          <h2>{t("recentOrders")}</h2>
        </div>
        <div className="table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>{t("orderNumber")}</th>
                <th>{t("product")}</th>
                <th>{t("orderTime")}</th>
                <th>{t("amount")}</th>
                <th>{t("status")}</th>
                <th>{t("deliveryStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.product?.nameEn ?? order.productId}</td>
                  <td>{order.dateTime.replace("T", " ").slice(0, 16)}</td>
                  <td>{formatIqd(order.priceWithCommission * order.quantity)}</td>
                  <td><StatusPill status={order.status} /></td>
                  <td>{order.deliveryStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
