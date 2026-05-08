"use client";

import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";
import { bestSellingProducts, formatIqd, salesByProvince, type ApiOrder } from "../lib/utils";

type Preset = "today" | "yesterday" | "last7" | "last30" | "thisMonth" | "lastMonth" | "custom";

function presetRange(p: Exclude<Preset, "custom">): { from: string; to: string } {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  switch (p) {
    case "today":
      return { from: fmt(now), to: fmt(now) };
    case "yesterday": {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      return { from: fmt(d), to: fmt(d) };
    }
    case "last7": {
      const d = new Date(now);
      d.setDate(d.getDate() - 6);
      return { from: fmt(d), to: fmt(now) };
    }
    case "last30": {
      const d = new Date(now);
      d.setDate(d.getDate() - 29);
      return { from: fmt(d), to: fmt(now) };
    }
    case "thisMonth":
      return {
        from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
        to: fmt(now),
      };
    case "lastMonth": {
      const f = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const t = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from: fmt(f), to: fmt(t) };
    }
  }
}

const SECTION_META = {
  brand: { titleKey: "salesByBrand" as const, sub: "Sales performance by brand" },
  category: { titleKey: "salesByCategory" as const, sub: "Sales performance by category" },
  province: { titleKey: "salesByProvince" as const, sub: "Sales distribution by province/city" },
  items: { titleKey: "salesByProduct" as const, sub: "Best-selling products breakdown" },
} as const;

const PRESETS: { key: Preset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last7", label: "Last 7 Days" },
  { key: "last30", label: "Last 30 Days" },
  { key: "thisMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
];

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

export function SellerReportDetailContent({ section }: { section: string }) {
  const meta = SECTION_META[section as keyof typeof SECTION_META];
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [activePreset, setActivePreset] = useState<Preset>("thisMonth");
  const [from, setFrom] = useState(() => presetRange("thisMonth").from);
  const [to, setTo] = useState(() => presetRange("thisMonth").to);
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);
  const { t, lang } = useLang();

  useEffect(() => {
    setLoading(true);
    api.orders
      .list({ limit: 500 })
      .then((res) => {
        setOrders(res.items);
        setLastUpdated(
          new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const date = o.dateTime.slice(0, 10);
        return date >= from && date <= to && o.status !== "cancelled";
      }),
    [orders, from, to],
  );

  function applyPreset(p: Preset) {
    setActivePreset(p);
    if (p !== "custom") {
      const range = presetRange(p);
      setFrom(range.from);
      setTo(range.to);
    }
  }

  function applyCustom() {
    setFrom(customFrom);
    setTo(customTo);
  }

  const brandRows = useMemo(
    () =>
      Object.values(
        filteredOrders.reduce<
          Record<string, { brand: string; orders: number; units: number; revenue: number }>
        >((acc, o) => {
          if (!o.product) return acc;
          const b = o.product.brand;
          acc[b] = acc[b] ?? { brand: b, orders: 0, units: 0, revenue: 0 };
          acc[b].orders += 1;
          acc[b].units += o.quantity;
          acc[b].revenue += o.priceWithCommission * o.quantity;
          return acc;
        }, {}),
      ).sort((a, b) => b.revenue - a.revenue),
    [filteredOrders],
  );

  const categoryRows = useMemo(
    () =>
      Object.values(
        filteredOrders.reduce<
          Record<string, { category: string; orders: number; units: number; revenue: number }>
        >((acc, o) => {
          if (!o.product) return acc;
          const c = o.product.categoryLevel1;
          acc[c] = acc[c] ?? { category: c, orders: 0, units: 0, revenue: 0 };
          acc[c].orders += 1;
          acc[c].units += o.quantity;
          acc[c].revenue += o.priceWithCommission * o.quantity;
          return acc;
        }, {}),
      ).sort((a, b) => b.revenue - a.revenue),
    [filteredOrders],
  );

  const provinceRows = useMemo(() => salesByProvince(filteredOrders), [filteredOrders]);

  const itemRows = useMemo(
    () =>
      bestSellingProducts(filteredOrders).map(({ product, sold }) => ({
        name: lang === "ar" ? product.nameAr : product.nameEn,
        sku: product.sku,
        brand: product.brand,
        units: sold,
        revenue: filteredOrders
          .filter((o) => o.productId === product.id)
          .reduce((s, o) => s + o.priceWithCommission * o.quantity, 0),
      })),
    [filteredOrders, lang],
  );

  function handleDownload() {
    if (section === "brand") {
      downloadCsv(
        `brand-report-${from}-to-${to}.csv`,
        ["Brand", "Orders", "Units Sold", "Revenue (IQD)"],
        brandRows.map((r) => [r.brand, r.orders, r.units, Math.round(r.revenue)]),
      );
    } else if (section === "category") {
      downloadCsv(
        `category-report-${from}-to-${to}.csv`,
        ["Category", "Orders", "Units Sold", "Revenue (IQD)"],
        categoryRows.map((r) => [r.category, r.orders, r.units, Math.round(r.revenue)]),
      );
    } else if (section === "province") {
      downloadCsv(
        `province-report-${from}-to-${to}.csv`,
        ["Province", "Orders", "Revenue (IQD)"],
        provinceRows.map((r) => [r.province, r.orders, Math.round(r.sales)]),
      );
    } else if (section === "items") {
      downloadCsv(
        `products-report-${from}-to-${to}.csv`,
        ["Product", "SKU", "Brand", "Units Sold", "Revenue (IQD)"],
        itemRows.map((r) => [r.name, r.sku, r.brand, r.units, Math.round(r.revenue)]),
      );
    }
  }

  if (!meta) {
    return (
      <div className="dashboard-content">
        <div className="empty-cell">Report section not found.</div>
      </div>
    );
  }

  return (
    <div className="seller-report-detail-content dashboard-content">
      <nav className="report-detail-breadcrumb">
        <Link href="/seller-report">{t("salesReport")}</Link>
        <span>›</span>
        <span>{meta.sub}</span>
      </nav>

      <section className="report-detail-card">
        <div className="report-detail-card-header">
          <div className="report-detail-title-row">
            <Link className="report-back-btn" href="/seller-report" aria-label="Back">
              <ArrowLeft size={16} strokeWidth={2.3} aria-hidden="true" />
            </Link>
            <div>
              <h1>{t(meta.titleKey)}</h1>
              <p className="dashboard-sub">
                {meta.sub}
                {lastUpdated && ` • ${lastUpdated}`}
              </p>
            </div>
          </div>
          <button className="discount-create-button" type="button" onClick={handleDownload}>
            <Download aria-hidden="true" size={15} strokeWidth={2.3} />
            Download CSV
          </button>
        </div>

        <div className="report-detail-filter-row">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              className={`report-preset-btn${activePreset === p.key ? " is-active" : ""}`}
              onClick={() => applyPreset(p.key)}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            className={`report-preset-btn report-custom-toggle${activePreset === "custom" ? " is-active" : ""}`}
            onClick={() => applyPreset("custom")}
          >
            Custom ↓
          </button>
        </div>

        {activePreset === "custom" && (
          <div className="report-custom-range">
            <label className="order-items-date">
              <span>Start Date</span>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </label>
            <label className="order-items-date">
              <span>End Date</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </label>
            <button className="apply-filter-button" type="button" onClick={applyCustom}>
              Apply
            </button>
          </div>
        )}

        <div className="report-detail-table-section">
          {loading ? (
            <div className="empty-cell">Loading…</div>
          ) : (
            <div className="purchase-order-table-wrap">
              {section === "brand" && (
                <table className="purchase-order-table">
                  <thead>
                    <tr>
                      <th>Brand</th>
                      <th>Orders</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brandRows.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="empty-cell">
                          {t("noDataAvailable")}
                        </td>
                      </tr>
                    ) : (
                      brandRows.map((r) => (
                        <tr className="product-list-data-row" key={r.brand}>
                          <td>{r.brand}</td>
                          <td>{r.orders}</td>
                          <td>{r.units}</td>
                          <td>{formatIqd(r.revenue)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {section === "category" && (
                <table className="purchase-order-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Orders</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryRows.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="empty-cell">
                          {t("noDataAvailable")}
                        </td>
                      </tr>
                    ) : (
                      categoryRows.map((r) => (
                        <tr className="product-list-data-row" key={r.category}>
                          <td>{r.category}</td>
                          <td>{r.orders}</td>
                          <td>{r.units}</td>
                          <td>{formatIqd(r.revenue)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {section === "province" && (
                <table className="purchase-order-table">
                  <thead>
                    <tr>
                      <th>Province / City</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provinceRows.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="empty-cell">
                          {t("noDataAvailable")}
                        </td>
                      </tr>
                    ) : (
                      provinceRows.map((r) => (
                        <tr className="product-list-data-row" key={r.province}>
                          <td>{r.province}</td>
                          <td>{r.orders}</td>
                          <td>{formatIqd(r.sales)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {section === "items" && (
                <table className="purchase-order-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Brand</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="empty-cell">
                          {t("noDataAvailable")}
                        </td>
                      </tr>
                    ) : (
                      itemRows.map((r) => (
                        <tr className="product-list-data-row" key={r.sku}>
                          <td>{r.name}</td>
                          <td>{r.sku}</td>
                          <td>{r.brand}</td>
                          <td>{r.units}</td>
                          <td>{formatIqd(r.revenue)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
