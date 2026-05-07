"use client";

import { Calendar, Download, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import { bestSellingProducts, formatIqd, salesByProvince, type ApiOrder } from "./lib/utils";

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

const PIE_COLORS = [
  "#9b87f5", "#7c6df0", "#c8bcfa", "#6b5ee4",
  "#b8a8f8", "#d8d0fb", "#5047cc", "#a394f8",
];

function polarXY(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function PieChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const r = 70, cx = 80, cy = 80;
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const end = angle + sweep;
    const p1 = polarXY(cx, cy, r, angle);
    const p2 = polarXY(cx, cy, r, end);
    const path = `M ${cx} ${cy} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`;
    angle = end;
    return { path, color: PIE_COLORS[i % PIE_COLORS.length], label: d.label };
  });
  return (
    <div className="pie-chart-wrap">
      <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="pie-chart-legend">
        {slices.map((s, i) => (
          <div className="pie-legend-item" key={i}>
            <span className="pie-legend-dot" style={{ background: s.color }} />
            <span className="pie-legend-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({
  data,
  yLabel,
  xLabel,
}: {
  data: { label: string; value: number }[];
  yLabel?: string;
  xLabel?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 300, H = 175;
  const pad = { t: 10, r: 10, b: 38, l: 36 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;
  const step = chartW / Math.max(data.length, 1);
  const barW = Math.max(14, Math.min(52, step * 0.58));
  const tickCount = Math.min(max, 5);
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((i / tickCount) * max),
  );

  return (
    <div className="bar-chart-outer">
      {yLabel && <span className="bar-chart-ylabel">{yLabel}</span>}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {ticks.map((tick) => {
            const y = pad.t + chartH - (tick / max) * chartH;
            return (
              <g key={tick}>
                <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                <text x={pad.l - 4} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                  {tick}
                </text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const barH = Math.max((d.value / max) * chartH, 1);
            const x = pad.l + i * step + (step - barW) / 2;
            const y = pad.t + chartH - barH;
            return (
              <g key={d.label}>
                <rect x={x} y={y} width={barW} height={barH} fill="#9b87f5" rx="3" />
                <text
                  x={x + barW / 2}
                  y={H - pad.b + 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                >
                  {d.label.length > 8 ? `${d.label.slice(0, 7)}…` : d.label}
                </text>
              </g>
            );
          })}
        </svg>
        {xLabel && <span className="bar-chart-xlabel">{xLabel}</span>}
      </div>
    </div>
  );
}

function formatDateRange(from: string, to: string) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const f = new Date(`${from}T00:00:00`).toLocaleDateString("en-US", opts);
  const t = new Date(`${to}T00:00:00`).toLocaleDateString("en-US", opts);
  return `${f} – ${t}`;
}

export function SellerReportContent() {
  const [allOrders, setAllOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [lastUpdated, setLastUpdated] = useState("");
  const { t, lang } = useLang();

  function refresh() {
    setLoading(true);
    api.orders
      .list({ limit: 500 })
      .then((res) => {
        setAllOrders(res.items);
        setLastUpdated(
          new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  const filteredOrders = useMemo(
    () =>
      allOrders.filter((order) => {
        const date = order.dateTime.slice(0, 10);
        return date >= from && date <= to && order.status !== "cancelled";
      }),
    [allOrders, from, to],
  );

  const totalSales = filteredOrders.reduce(
    (sum, order) => sum + order.priceWithCommission * order.quantity,
    0,
  );

  const brandChartData = useMemo(() => {
    const map = Object.values(
      filteredOrders.reduce<Record<string, { label: string; value: number }>>((acc, o) => {
        if (!o.product) return acc;
        const b = o.product.brand;
        acc[b] = acc[b] ?? { label: b, value: 0 };
        acc[b].value += o.priceWithCommission * o.quantity;
        return acc;
      }, {}),
    );
    return map.sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filteredOrders]);

  const categoryChartData = useMemo(() => {
    const map = Object.values(
      filteredOrders.reduce<Record<string, { label: string; value: number }>>((acc, o) => {
        if (!o.product) return acc;
        const c = o.product.categoryLevel1;
        acc[c] = acc[c] ?? { label: c, value: 0 };
        acc[c].value += o.priceWithCommission * o.quantity;
        return acc;
      }, {}),
    );
    return map.sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filteredOrders]);

  const provinceChartData = useMemo(
    () =>
      salesByProvince(filteredOrders)
        .slice(0, 8)
        .map((r) => ({ label: r.province, value: r.orders })),
    [filteredOrders],
  );

  const itemChartData = useMemo(
    () =>
      bestSellingProducts(filteredOrders)
        .slice(0, 8)
        .map(({ product, sold }) => ({
          label: lang === "ar" ? product.nameAr : product.nameEn,
          value: sold,
        })),
    [filteredOrders, lang],
  );

  const chartPanels = [
    { id: "brand", titleKey: "salesByBrand" as const, type: "pie" as const, data: brandChartData },
    {
      id: "category",
      titleKey: "salesByCategory" as const,
      type: "pie" as const,
      data: categoryChartData,
    },
    {
      id: "province",
      titleKey: "salesByProvince" as const,
      type: "bar" as const,
      data: provinceChartData,
      yLabel: "Number of Orders",
      xLabel: "Cities",
    },
    {
      id: "items",
      titleKey: "salesByProduct" as const,
      type: "bar" as const,
      data: itemChartData,
      yLabel: "Units Sold",
      xLabel: "Products",
    },
  ];

  return (
    <div className="seller-report-content dashboard-content">
      <header className="dashboard-header">
        <div>
          <h1>{t("salesReport")}</h1>
          <p className="dashboard-sub">
            {t("lastUpdated")}: {lastUpdated}
          </p>
        </div>
        <div className="primary-controls">
          <button className="export-button" type="button" onClick={refresh}>
            <RefreshCw aria-hidden="true" size={18} strokeWidth={2.3} />
            <span>{t("refreshData")}</span>
          </button>
          <button
            className="export-button"
            type="button"
            onClick={() => {
              const headers = [
                "Sale Date",
                "Order #",
                "Product",
                "SKU",
                "Color",
                "Size",
                "Qty",
                "City",
                "Province",
                "Payment Method",
                "Price (incl. comm.)",
                "Commission",
              ];
              const rows = filteredOrders.map((order) => {
                const product = order.product;
                return [
                  order.dateTime,
                  order.orderNumber,
                  product?.nameEn ?? "",
                  product?.sku ?? "",
                  order.color,
                  order.size,
                  order.quantity,
                  order.city,
                  order.province,
                  order.paymentMethod,
                  order.priceWithCommission,
                  order.priceWithCommission - order.priceWithoutCommission,
                ];
              });
              downloadCsv(`sales-report-${from}-to-${to}.csv`, headers, rows);
            }}
          >
            <Download aria-hidden="true" size={18} strokeWidth={2.3} />
            <span>{t("exportCsv")}</span>
          </button>
        </div>
      </header>

      <section className="dashboard-panel report-range-panel">
        <label className="order-items-date">
          <span>From</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="order-items-date">
          <span>To</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <article className="kpi-card kpi-green report-total-card">
          <p>{t("totalSalesPeriod")}</p>
          <strong>{formatIqd(totalSales)}</strong>
        </article>
      </section>

      {loading ? (
        <div className="empty-cell">Loading…</div>
      ) : (
        <>
          <div className="report-grid">
            {chartPanels.map((panel) => (
              <section className="report-chart-card" key={panel.id}>
                <h2 className="report-chart-title">
                  {t(panel.titleKey)}
                </h2>
                <div className="report-chart-body">
                  {panel.data.length === 0 ? (
                    <div className="empty-cell">{t("noDataAvailable")}</div>
                  ) : panel.type === "pie" ? (
                    <PieChart data={panel.data} />
                  ) : (
                    <BarChart
                      data={panel.data}
                      yLabel={"yLabel" in panel ? panel.yLabel : undefined}
                      xLabel={"xLabel" in panel ? panel.xLabel : undefined}
                    />
                  )}
                </div>
                <div className="report-chart-footer">
                  <Calendar size={11} aria-hidden="true" />
                  <span>{formatDateRange(from, to)}</span>
                </div>
                <Link
                  className="report-view-details-btn discount-create-button"
                  href={`/seller-report/${panel.id}`}
                >
                  <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                  {t("viewDetails")}
                </Link>
              </section>
            ))}
          </div>

          <section className="dashboard-panel report-panel">
            <div className="panel-heading">
              <h2>{t("monthlySalesTable")}</h2>
            </div>
            <div className="purchase-order-table-wrap">
              <table className="purchase-order-table report-detail-table">
                <thead>
                  <tr>
                    <th>{t("saleDate")}</th>
                    <th>{t("productName")}</th>
                    <th>{t("image")}</th>
                    <th>{t("barcode")}</th>
                    <th>{t("color")}</th>
                    <th>{t("orderNum")}</th>
                    <th>{t("productCode")}</th>
                    <th>{t("city")}</th>
                    <th>{t("deliveryAgent")}</th>
                    <th>{t("shipmentStatus")}</th>
                    <th>{t("paymentMethod")}</th>
                    <th>{t("size")}</th>
                    <th>{t("price")}</th>
                    <th>{t("commission")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const product = order.product;
                    const commission =
                      order.priceWithCommission - order.priceWithoutCommission;
                    return (
                      <tr className="product-list-data-row" key={order.id}>
                        <td>{order.dateTime.slice(0, 10)}</td>
                        <td>
                          {product
                            ? lang === "ar"
                              ? product.nameAr
                              : product.nameEn
                            : ""}
                        </td>
                        <td>
                          {product?.mainImage ? (
                            <img
                              className="sample-product-thumb"
                              src={product.mainImage}
                              alt={lang === "ar" ? product.nameAr : product.nameEn}
                            />
                          ) : (
                            <div
                              className="sample-product-thumb"
                              style={{ background: product?.imageTone }}
                            >
                              <span>{product?.brand.slice(0, 2).toUpperCase()}</span>
                            </div>
                          )}
                        </td>
                        <td>{product?.barcode}</td>
                        <td>{order.color}</td>
                        <td>{order.orderNumber}</td>
                        <td>{product?.sku}</td>
                        <td>{order.city}</td>
                        <td>{order.deliveryAgent}</td>
                        <td>{order.deliveryStatus}</td>
                        <td>{order.paymentMethod}</td>
                        <td>{order.size}</td>
                        <td>{formatIqd(order.priceWithCommission)}</td>
                        <td>{formatIqd(commission)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
