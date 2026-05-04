"use client";

import { Download, FileText } from "lucide-react";
import { useState } from "react";

const quickRanges = [
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
];

const itemRows = [
  { sku: "sv2411203071322707", name: "Sheglam Curling Iron Silver", units: 42, revenue: 2058000 },
  { sku: "em-curl-22-bk", name: "Electromall Curl Pro Black", units: 31, revenue: 1178000 },
  { sku: "br-trim-09-rd", name: "Braun Trimmer Mini Red", units: 24, revenue: 504000 },
  { sku: "ph-shav-44-bl", name: "Philips OneBlade Pro Blue", units: 17, revenue: 731000 },
];

const provinceRows = [
  { province: "Baghdad", orders: 58, revenue: 2870000 },
  { province: "Erbil", orders: 32, revenue: 1530000 },
  { province: "Basra", orders: 21, revenue: 980000 },
  { province: "Najaf", orders: 14, revenue: 612000 },
  { province: "Karbala", orders: 9, revenue: 410000 },
];

const brandRows = [
  { brand: "Sheglam", units: 42, revenue: 2058000 },
  { brand: "Electromall", units: 31, revenue: 1178000 },
  { brand: "Braun", units: 24, revenue: 504000 },
  { brand: "Philips", units: 17, revenue: 731000 },
];

const trend = [12, 18, 22, 19, 28, 31, 36, 33, 40, 45, 51, 49];

function fmt(n: number) {
  return `${n.toLocaleString()} IQD`;
}

function MaxBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="report-bar">
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

function TrendChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 300;
      const y = 80 - (v / max) * 70;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 300 90"
      className="trend-chart"
      role="img"
      aria-label="Sales trend"
    >
      <polyline
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function SellerReportContent() {
  const [from, setFrom] = useState("2026-04-01");
  const [to, setTo] = useState("2026-04-30");
  const [active, setActive] = useState("Last 30 Days");

  const totalSales = itemRows.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = provinceRows.reduce((s, r) => s + r.orders, 0);
  const itemsSold = itemRows.reduce((s, r) => s + r.units, 0);
  const aov = Math.round(totalSales / Math.max(totalOrders, 1));

  const itemMax = Math.max(...itemRows.map((r) => r.revenue));
  const provMax = Math.max(...provinceRows.map((r) => r.revenue));
  const brandMax = Math.max(...brandRows.map((r) => r.revenue));

  return (
    <div className="seller-report-content dashboard-content">
      <header className="dashboard-header">
        <h1>Seller Report</h1>
        <div className="dashboard-controls">
          <div className="primary-controls">
            <button className="export-button" type="button">
              <Download aria-hidden="true" size={20} strokeWidth={2.2} />
              <span>Export PDF</span>
            </button>
            <button className="export-button" type="button">
              <FileText aria-hidden="true" size={20} strokeWidth={2.2} />
              <span>Export Excel</span>
            </button>
          </div>
          <div className="quick-ranges">
            {quickRanges.map((r) => (
              <button
                key={r}
                type="button"
                className={`range-button${active === r ? " is-active" : ""}`}
                onClick={() => setActive(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="dashboard-panel report-range-panel">
        <label className="order-items-date">
          <span>From</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label className="order-items-date">
          <span>To</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <button className="apply-filter-button" type="button">
          Apply
        </button>
      </section>

      <section className="kpi-grid">
        <article className="kpi-card kpi-blue">
          <p>Total Sales</p>
          <strong>{fmt(totalSales)}</strong>
        </article>
        <article className="kpi-card kpi-green">
          <p>Total Orders</p>
          <strong>{totalOrders}</strong>
        </article>
        <article className="kpi-card kpi-cyan">
          <p>Average Order Value</p>
          <strong>{fmt(aov)}</strong>
        </article>
        <article className="kpi-card kpi-amber">
          <p>Items Sold</p>
          <strong>{itemsSold}</strong>
        </article>
      </section>

      <div className="report-grid">
        <section className="dashboard-panel report-panel">
          <div className="panel-heading">
            <h2>Sales by Item</h2>
          </div>
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Thumb</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Units</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {itemRows.map((r) => (
                <tr key={r.sku}>
                  <td>
                    <div className="sample-product-thumb"><span /></div>
                  </td>
                  <td>{r.name}</td>
                  <td>{r.sku}</td>
                  <td>{r.units}</td>
                  <td>
                    <div className="bar-cell">
                      <span>{fmt(r.revenue)}</span>
                      <MaxBar value={r.revenue} max={itemMax} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dashboard-panel report-panel">
          <div className="panel-heading">
            <h2>Sales by Province</h2>
          </div>
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Province</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {provinceRows.map((r) => (
                <tr key={r.province}>
                  <td>{r.province}</td>
                  <td>{r.orders}</td>
                  <td>
                    <div className="bar-cell">
                      <span>{fmt(r.revenue)}</span>
                      <MaxBar value={r.revenue} max={provMax} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dashboard-panel report-panel">
          <div className="panel-heading">
            <h2>Sales by Brand</h2>
          </div>
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Units</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {brandRows.map((r) => (
                <tr key={r.brand}>
                  <td>{r.brand}</td>
                  <td>{r.units}</td>
                  <td>
                    <div className="bar-cell">
                      <span>{fmt(r.revenue)}</span>
                      <MaxBar value={r.revenue} max={brandMax} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dashboard-panel report-panel">
          <div className="panel-heading">
            <h2>Sales Trend</h2>
          </div>
          <TrendChart data={trend} />
        </section>
      </div>
    </div>
  );
}
