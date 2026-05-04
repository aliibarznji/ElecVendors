"use client";

import { Download, Eye, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  bestSellingProducts,
  formatIqd,
  getProduct,
  orders,
  salesByProvince,
} from "./vendor-dashboard-data";

function Bar({ value, max }: { value: number; max: number }) {
  return (
    <div className="report-bar" aria-hidden="true">
      <span style={{ width: `${Math.max((value / Math.max(max, 1)) * 100, 4)}%` }} />
    </div>
  );
}

export function SellerReportContent() {
  const [from, setFrom] = useState("2026-04-01");
  const [to, setTo] = useState("2026-05-04");
  const [lastUpdated, setLastUpdated] = useState("2026-05-04 12:00");
  const [detail, setDetail] = useState<string | null>(null);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const date = order.dateTime.slice(0, 10);
        return date >= from && date <= to && order.status !== "cancelled";
      }),
    [from, to],
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
        const product = getProduct(order.productId);
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
        const product = getProduct(order.productId);
        if (!product) return map;
        const category = product.categoryLevels[0];
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
    { id: "items", title: "Sales by Product", rows: itemRows },
    { id: "province", title: "Sales by Province/City", rows: provinceRows },
    { id: "brand", title: "Sales by Brand", rows: brandRows },
    { id: "category", title: "Sales by Category", rows: categoryRows },
  ];

  return (
    <div className="seller-report-content dashboard-content">
      <header className="dashboard-header">
        <div>
          <h1>Sales Report</h1>
          <p className="dashboard-sub">Last updated: {lastUpdated}</p>
        </div>
        <div className="primary-controls">
          <button
            className="export-button"
            type="button"
            onClick={() => setLastUpdated("2026-05-04 12:15")}
          >
            <RefreshCw aria-hidden="true" size={18} strokeWidth={2.3} />
            <span>Refresh Data</span>
          </button>
          <button className="export-button" type="button">
            <Download aria-hidden="true" size={18} strokeWidth={2.3} />
            <span>Export to Excel</span>
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
          <p>Total Sales for Period</p>
          <strong>{formatIqd(totalSales)}</strong>
        </article>
      </section>

      <div className="report-grid">
        {panels.map((panel) => {
          const max = Math.max(...panel.rows.map((row) => row.sales), 1);
          return (
            <section className="dashboard-panel report-panel" key={panel.id}>
              <div className="panel-heading">
                <h2>{panel.title}</h2>
                <button
                  className="row-action-btn"
                  type="button"
                  onClick={() => setDetail(detail === panel.id ? null : panel.id)}
                >
                  <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                  Details
                </button>
              </div>
              <div className="report-mini-chart">
                {panel.rows.length === 0 ? (
                  <div className="empty-cell">No data available</div>
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
            <h2>Details: {panels.find((panel) => panel.id === detail)?.title}</h2>
          </div>
          <p className="dashboard-sub">
            Details will open here in the current version and can be linked later to a Drill-down page.
          </p>
        </section>
      ) : null}

      <section className="dashboard-panel report-panel">
        <div className="panel-heading">
          <h2>Monthly Sales Report Table</h2>
        </div>
        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table report-detail-table">
            <thead>
              <tr>
                <th>Sale Date</th>
                <th>Product Name</th>
                <th>Image</th>
                <th>Barcode</th>
                <th>Color</th>
                <th>Order #</th>
                <th>Product Code</th>
                <th>City</th>
                <th>Delivery Agent</th>
                <th>Shipment Status</th>
                <th>Payment Method</th>
                <th>Size</th>
                <th>Price</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const product = getProduct(order.productId);
                const commission = order.priceWithCommission - order.priceWithoutCommission;
                return (
                  <tr className="product-list-data-row" key={order.id}>
                    <td>{order.dateTime}</td>
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
    </div>
  );
}
