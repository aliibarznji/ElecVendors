"use client";

import { Download, Eye, RefreshCw } from "lucide-react";
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

function Bar({ value, max }: { value: number; max: number }) {
  return (
    <div className="report-bar" aria-hidden="true">
      <span style={{ width: `${Math.max((value / Math.max(max, 1)) * 100, 4)}%` }} />
    </div>
  );
}

export function SellerReportContent() {
  const [allOrders, setAllOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("2026-04-01");
  const [to, setTo] = useState("2026-05-04");
  const [lastUpdated, setLastUpdated] = useState("2026-05-04 12:00");
  const [detail, setDetail] = useState<string | null>(null);
  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.orders
      .list({ limit: 500 })
      .then((res) => {
        setAllOrders(res.items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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

  const itemRows = bestSellingProducts(filteredOrders).map(({ product, sold }) => ({
    label: product.nameAr,
    sub: product.sku,
    value: sold,
    sales: filteredOrders
      .filter((order) => order.productId === product.id)
      .reduce((sum, order) => sum + order.priceWithCommission * order.quantity, 0),
  }));

  const provinceRows = salesByProvince(filteredOrders).map((row) => ({
    label: row.province,
    sub: `${row.orders} orders`,
    value: row.orders,
    sales: row.sales,
  }));

  const brandRows = Object.values(
    filteredOrders.reduce<Record<string, { label: string; sub: string; value: number; sales: number }>>(
      (map, order) => {
        const product = order.product;
        if (!product) return map;
        const current = map[product.brand] ?? {
          label: product.brand,
          sub: "Brand",
          value: 0,
          sales: 0,
        };
        current.value += order.quantity;
        current.sales += order.priceWithCommission * order.quantity;
        map[product.brand] = current;
        return map;
      },
      {},
    ),
  );

  const categoryRows = Object.values(
    filteredOrders.reduce<Record<string, { label: string; sub: string; value: number; sales: number }>>(
      (map, order) => {
        const product = order.product;
        if (!product) return map;
        const category = product.categoryLevel1;
        const current = map[category] ?? {
          label: category,
          sub: "Main Category",
          value: 0,
          sales: 0,
        };
        current.value += order.quantity;
        current.sales += order.priceWithCommission * order.quantity;
        map[category] = current;
        return map;
      },
      {},
    ),
  );

  const panels = [
    { id: "items", titleKey: "salesByProduct" as const, rows: itemRows },
    { id: "province", titleKey: "salesByProvince" as const, rows: provinceRows },
    { id: "brand", titleKey: "salesByBrand" as const, rows: brandRows },
    { id: "category", titleKey: "salesByCategory" as const, rows: categoryRows },
  ];

  return (
    <div className="seller-report-content dashboard-content">
      <header className="dashboard-header">
        <div>
          <h1>{t("salesReport")}</h1>
          <p className="dashboard-sub">{t("lastUpdated")}: {lastUpdated}</p>
        </div>
        <div className="primary-controls">
          <button
            className="export-button"
            type="button"
            onClick={() => {
              setLoading(true);
              api.orders
                .list({ limit: 500 })
                .then((res) => {
                  setAllOrders(res.items);
                  setLastUpdated(new Date().toISOString().slice(0, 16).replace("T", " "));
                })
                .catch(() => {})
                .finally(() => setLoading(false));
            }}
          >
            <RefreshCw aria-hidden="true" size={18} strokeWidth={2.3} />
            <span>{t("refreshData")}</span>
          </button>
          <button
            className="export-button"
            type="button"
            onClick={() => {
              const headers = [
                "Sale Date", "Order #", "Product", "SKU", "Color", "Size",
                "Qty", "City", "Province", "Payment Method", "Price (incl. comm.)", "Commission",
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
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label className="order-items-date">
          <span>To</span>
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
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
            {panels.map((panel) => {
              const max = Math.max(...panel.rows.map((row) => row.sales), 1);
              return (
                <section className="dashboard-panel report-panel" key={panel.id}>
                  <div className="panel-heading">
                    <h2>{t(panel.titleKey)}</h2>
                    <button
                      className="row-action-btn"
                      type="button"
                      onClick={() => setDetail(detail === panel.id ? null : panel.id)}
                    >
                      <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                      {t("details")}
                    </button>
                  </div>
                  <div className="report-mini-chart">
                    {panel.rows.length === 0 ? (
                      <div className="empty-cell">{t("noDataAvailable")}</div>
                    ) : (
                      panel.rows.map((row) => (
                        <div className="report-chart-row" key={`${panel.id}-${row.label}`}>
                          <div>
                            <strong>{row.label}</strong>
                            <span>{row.sub}</span>
                          </div>
                          <Bar value={row.sales} max={max} />
                          <b>{formatIqd(row.sales)}</b>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          {detail ? (
            <section className="dashboard-panel report-panel">
              <div className="panel-heading">
                <h2>{t("detailsPanel")} {t(panels.find((panel) => panel.id === detail)?.titleKey ?? "salesByProduct")}</h2>
              </div>
              <p className="dashboard-sub">
                Details will open here in the current version and can be linked later to a Drill-down page.
              </p>
            </section>
          ) : null}

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
                    const commission = order.priceWithCommission - order.priceWithoutCommission;
                    return (
                      <tr className="product-list-data-row" key={order.id}>
                        <td>{order.dateTime.slice(0, 10)}</td>
                        <td>{product?.nameAr}</td>
                        <td>
                          <div className="sample-product-thumb" style={{ background: product?.imageTone }}>
                            <span>{product?.brand.slice(0, 2).toUpperCase()}</span>
                          </div>
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
