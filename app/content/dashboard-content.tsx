"use client";

import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  MapPin,
  ShoppingCart,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/lang-context";
import { StatusPill } from "../components/status-pill";
import { api } from "../lib/api";
import {
  bestSellingProducts,
  formatIqd,
  salesByProvince,
  type ApiOrder,
} from "../lib/utils";

const TODAY = new Date().toISOString().slice(0, 10);
const THIS_MONTH_START = `${TODAY.slice(0, 7)}-01`;

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

function fmtDisplayDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const RANGE_KEYS = ["lastSevenDays", "last30Days", "thisMonth", "lastMonth"] as const;
const RANGE_INTERNAL = ["Last 7 Days", "Last 30 Days", "This Month", "Last Month"] as const;

function rangeFrom(label: string): string {
  const today = new Date(TODAY);
  if (label === "This Month") return THIS_MONTH_START;
  if (label === "Last Month") {
    today.setMonth(today.getMonth() - 1);
    return `${today.toISOString().slice(0, 7)}-01`;
  }
  const days = label === "Last 7 Days" ? 7 : 30;
  today.setDate(today.getDate() - days);
  return today.toISOString().slice(0, 10);
}

function KpiCard({
  label,
  value,
  detail,
  tone,
  icon: Icon,
  liveLabel,
}: {
  label: string;
  value: string;
  detail: string;
  tone: string;
  icon: LucideIcon;
  liveLabel: string;
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

function BarChart({
  data,
  valueFormatter,
}: {
  data: { label: string; value: number }[];
  valueFormatter?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="revenue-trend-chart dashboard-bars" aria-label="Monthly chart">
      {data.map((item) => {
        const height = Math.max((item.value / max) * 100, item.value ? 8 : 3);
        return (
          <div className="revenue-bar-item" key={item.label}>
            <span className="chart-value-label">
              {valueFormatter ? valueFormatter(item.value) : item.value}
            </span>
            <span className="revenue-bar-track">
              <span style={{ height: `${height}%` }} />
            </span>
            <small>{item.label}</small>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({
  data,
  valueFormatter,
}: {
  data: { label: string; value: number }[];
  valueFormatter?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 100;
  const H = 100;
  const stepX = data.length > 1 ? W / (data.length - 1) : 0;
  const pts = data.map((d, i) => ({
    x: i * stepX,
    y: H - (d.value / max) * (H - 12) - 4,
  }));
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const area = `${path} L ${W} ${H} L 0 ${H} Z`;
  return (
    <div className="dashboard-line-chart" aria-label="Monthly trend">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img">
        <path className="dashboard-line-area" d={area} />
        <path className="dashboard-line-stroke" d={path} />
        {pts.map((p, i) => (
          <circle
            key={data[i].label}
            cx={p.x}
            cy={p.y}
            r={1.4}
            className="dashboard-line-dot"
          />
        ))}
      </svg>
      <div className="dashboard-line-labels">
        {data.map((d) => (
          <span key={d.label}>
            <small>{d.label}</small>
            <strong>{valueFormatter ? valueFormatter(d.value) : d.value}</strong>
          </span>
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

  const [fromDate, setFromDate] = useState(THIS_MONTH_START);
  const [toDate, setToDate] = useState(TODAY);
  const [pendingFrom, setPendingFrom] = useState(THIS_MONTH_START);
  const [pendingTo, setPendingTo] = useState(TODAY);
  const [dateOpen, setDateOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useLang();

  useEffect(() => {
    api.orders
      .list({ limit: 500 })
      .then((r) => setAllOrders(r.items))
      .catch(console.error);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    if (exportOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [exportOpen]);

  function applyQuickRange(internal: string) {
    const f = rangeFrom(internal);
    setActiveRange((cur) => (cur === internal ? null : internal));
    if (activeRange !== internal) {
      setFromDate(f);
      setToDate(TODAY);
      setPendingFrom(f);
      setPendingTo(TODAY);
    }
  }

  function applyCustomDate() {
    setFromDate(pendingFrom);
    setToDate(pendingTo);
    setActiveRange(null);
    setDateOpen(false);
  }

  const filteredOrders = allOrders.filter((o) => {
    const d = o.dateTime.slice(0, 10);
    return d >= fromDate && d <= toDate;
  });

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
    {
      label: t("monthlyOrdersTotal"),
      value: String(monthlyOrders),
      detail: t("monthlyOrdersDetail"),
      tone: "green",
      icon: ShoppingCart,
    },
    {
      label: t("monthlySalesTotal"),
      value: formatIqd(monthlySales),
      detail: t("monthlySalesDetail"),
      tone: "blue",
      icon: TrendingUp,
    },
    {
      label: t("pendingOrdersLabel"),
      value: String(pendingOrders),
      detail: t("pendingOrdersDetail"),
      tone: "orange",
      icon: AlertTriangle,
    },
    {
      label: t("netSalesLabel"),
      value: formatIqd(netSales),
      detail: t("netSalesDetail"),
      tone: "cyan",
      icon: Wallet,
    },
  ];

  const quickRanges = RANGE_KEYS.map((key, i) => ({
    label: t(key),
    internal: RANGE_INTERNAL[i],
  }));

  const exportOptions = [
    {
      key: "orders",
      label: "All Orders",
      sub: "Order number, product, date, status, city",
      icon: ShoppingCart,
      action: () => {
        const headers = [
          "Order #",
          "Product",
          "Date",
          "Qty",
          "Price (IQD)",
          "Status",
          "City",
          "Province",
          "Payment",
        ];
        const rows = filteredOrders.map((o) => [
          o.orderNumber,
          o.product?.nameEn ?? o.productId,
          o.dateTime.slice(0, 10),
          o.quantity,
          Math.round(o.priceWithCommission * o.quantity),
          o.status,
          o.city,
          o.province,
          o.paymentMethod,
        ]);
        downloadCsv(`orders-${fromDate}-to-${toDate}.csv`, headers, rows);
        setExportOpen(false);
      },
    },
    {
      key: "province",
      label: "Sales by Province",
      sub: "Orders count and revenue per city",
      icon: MapPin,
      action: () => {
        const rows = salesByProvince(filteredOrders).map((r) => [
          r.province,
          r.orders,
          Math.round(r.sales),
        ]);
        downloadCsv(
          `province-sales-${fromDate}-to-${toDate}.csv`,
          ["Province", "Orders", "Revenue (IQD)"],
          rows,
        );
        setExportOpen(false);
      },
    },
    {
      key: "bestsellers",
      label: "Best Selling Products",
      sub: "Top products by units sold and revenue",
      icon: TrendingUp,
      action: () => {
        const rows = bestSellingProducts(filteredOrders).map(({ product, sold }) => [
          product.nameEn,
          product.sku,
          product.brand,
          sold,
          Math.round(
            filteredOrders
              .filter((o) => o.productId === product.id)
              .reduce((s, o) => s + o.priceWithCommission * o.quantity, 0),
          ),
        ]);
        downloadCsv(
          `best-sellers-${fromDate}-to-${toDate}.csv`,
          ["Product", "SKU", "Brand", "Units Sold", "Revenue (IQD)"],
          rows,
        );
        setExportOpen(false);
      },
    },
    {
      key: "monthly",
      label: "Monthly Summary",
      sub: "Orders and revenue grouped by month",
      icon: BarChart3,
      action: () => {
        const rows = lastFiveMonths().map(({ label, prefix }) => {
          const mo = allOrders.filter((o) => o.dateTime.startsWith(prefix));
          const rev = mo
            .filter((o) => o.status !== "cancelled")
            .reduce((s, o) => s + o.priceWithCommission * o.quantity, 0);
          return [label, mo.length, Math.round(rev)];
        });
        downloadCsv("monthly-summary.csv", ["Month", "Orders", "Revenue (IQD)"], rows);
        setExportOpen(false);
      },
    },
  ];

  return (
    <div className="grid gap-5 px-7 pt-6 pb-12 [animation:dashboard-fade-in_400ms_var(--ease-out)_both]">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1>{t("mainDashboard")}</h1>
          <p className="mt-[7px] text-muted text-[13px] leading-relaxed">{t("dashboardSub")}</p>
        </div>
        <div className="grid justify-items-end gap-[10px]">
          <div className="primary-controls">
            {/* Export dropdown */}
            <div className="export-dropdown-wrap" ref={exportRef}>
              <button
                className={`export-button${exportOpen ? " is-active" : ""}`}
                type="button"
                onClick={() => setExportOpen((v) => !v)}
              >
                <Download aria-hidden="true" size={18} strokeWidth={2.2} />
                <span>{t("exportDashboard")}</span>
                <ChevronDown
                  aria-hidden="true"
                  size={14}
                  strokeWidth={2.3}
                  style={{
                    marginLeft: 2,
                    transition: "transform .2s",
                    transform: exportOpen ? "rotate(180deg)" : "none",
                  }}
                />
              </button>

              {exportOpen && (
                <div className="export-dropdown-panel">
                  <div className="export-dropdown-header">
                    <span>What would you like to download?</span>
                    <button
                      className="export-dropdown-close"
                      type="button"
                      aria-label="Close"
                      onClick={() => setExportOpen(false)}
                    >
                      <X size={14} strokeWidth={2.3} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="export-dropdown-date-hint">
                    <CalendarDays size={11} aria-hidden="true" />
                    {fmtDisplayDate(fromDate)} – {fmtDisplayDate(toDate)}
                  </p>
                  <div className="export-options-list">
                    {exportOptions.map((opt) => (
                      <button
                        key={opt.key}
                        className="export-option-btn"
                        type="button"
                        onClick={opt.action}
                      >
                        <span className="export-option-icon">
                          <opt.icon size={16} strokeWidth={2.2} aria-hidden="true" />
                        </span>
                        <span className="export-option-text">
                          <strong>{opt.label}</strong>
                          <span>{opt.sub}</span>
                        </span>
                        <FileText
                          size={13}
                          strokeWidth={2}
                          aria-hidden="true"
                          className="export-option-dl"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive date range */}
            <div className="date-range-wrap">
              <button
                className={`date-range${dateOpen ? " is-active" : ""}`}
                type="button"
                onClick={() => {
                  setPendingFrom(fromDate);
                  setPendingTo(toDate);
                  setDateOpen((v) => !v);
                }}
              >
                <span>
                  {fmtDisplayDate(fromDate)} – {fmtDisplayDate(toDate)}
                </span>
                <CalendarDays aria-hidden="true" size={18} strokeWidth={2.1} />
              </button>

              {dateOpen && (
                <div className="date-picker-panel">
                  <label className="date-picker-field">
                    <span>Start Date</span>
                    <input
                      type="date"
                      value={pendingFrom}
                      max={pendingTo}
                      onChange={(e) => setPendingFrom(e.target.value)}
                    />
                  </label>
                  <label className="date-picker-field">
                    <span>End Date</span>
                    <input
                      type="date"
                      value={pendingTo}
                      min={pendingFrom}
                      max={TODAY}
                      onChange={(e) => setPendingTo(e.target.value)}
                    />
                  </label>
                  <button
                    className="apply-filter-button"
                    type="button"
                    onClick={applyCustomDate}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="quick-ranges" aria-label="Quick date ranges">
            {quickRanges.map((range) => (
              <button
                className={`range-button${activeRange === range.internal ? " is-active" : ""}`}
                key={range.internal}
                type="button"
                onClick={() => applyQuickRange(range.internal)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-4" aria-label="Monthly indicators">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} liveLabel={t("liveUpdate")} />
        ))}
      </section>

      <section className="dashboard-analytics-grid" aria-label="Analytics">
        <article className="dashboard-panel dashboard-analytics-panel revenue-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>{t("salesByMonth")}</h2>
              <p>{t("salesByMonthSub")}</p>
            </div>
            <strong>{formatIqd(monthlySales)}</strong>
          </div>
          <LineChart
            data={salesByMonth(filteredOrders)}
            valueFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>{t("ordersByMonth")}</h2>
              <p>{t("ordersByMonthSub")}</p>
            </div>
            <strong>{monthlyOrders}</strong>
          </div>
          <BarChart data={ordersByMonth(filteredOrders)} />
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>{t("salesByCity")}</h2>
              <p>{t("salesByCitySub")}</p>
            </div>
            <MapPin aria-hidden="true" size={20} strokeWidth={2.3} />
          </div>
          <ul className="fulfillment-list dashboard-ranked-list">
            {provinceRows.map((row) => (
              <li className="fulfillment-step step-blue" key={row.province}>
                <div>
                  <span>{row.province}</span>
                  <strong>{row.orders}</strong>
                </div>
                <div className="fulfillment-track" aria-hidden="true">
                  <span
                    style={{
                      width: `${Math.max(
                        (row.sales / (provinceRows[0]?.sales || 1)) * 100,
                        5,
                      )}%`,
                    }}
                  />
                </div>
                <small>{formatIqd(row.sales)}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>{t("bestSelling")}</h2>
              <p>{t("bestSellingSub")}</p>
            </div>
            <BarChart3 aria-hidden="true" size={20} strokeWidth={2.3} />
          </div>
          <div className="best-seller-list">
            {bestSellers.map(({ product, sold }, index) => (
              <article key={product.id} className="best-seller-row">
                <span className="seller-rank">{index + 1}</span>
                {product.mainImage ? (
                  <img
                    className="sample-product-thumb dashboard-thumb"
                    src={product.mainImage}
                    alt={lang === "ar" ? product.nameAr : product.nameEn}
                  />
                ) : (
                  <span
                    className="sample-product-thumb dashboard-thumb"
                    style={{ background: product.imageTone }}
                    aria-label={product.brand}
                  >
                    <span>{product.brand.slice(0, 2).toUpperCase()}</span>
                  </span>
                )}
                <div>
                  <strong>{lang === "ar" ? product.nameAr : product.nameEn}</strong>
                  <span>{product.sku}</span>
                </div>
                <b>
                  {sold} {t("units")}
                </b>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-panel table-panel table-panel-large">
        <div className="flex items-center justify-between gap-4 mb-[22px]">
          <h2>{t("recentOrders")}</h2>
        </div>
        <div className="w-full overflow-x-auto rounded-[10px] border border-border">
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
                  <td>
                    <StatusPill status={order.status} />
                  </td>
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
