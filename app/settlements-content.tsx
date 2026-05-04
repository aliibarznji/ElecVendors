"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Row = {
  id: string;
  thumbnail: string;
  orderNumber: string;
  product: string;
  sku: string;
  selling: number;
  commission: number;
  net: number;
  status: "Paid" | "Pending";
  date: string;
};

const sample: Row[] = [
  {
    id: "s1",
    thumbnail: "SG",
    orderNumber: "ORD-100190",
    product: "Sheglam Curling Iron Silver",
    sku: "sv2411203071322707",
    selling: 49000,
    commission: 3920,
    net: 45080,
    status: "Paid",
    date: "2026-04-30",
  },
  {
    id: "s2",
    thumbnail: "EM",
    orderNumber: "ORD-100214",
    product: "Electromall Curl Pro Black",
    sku: "em-curl-22-bk",
    selling: 38000,
    commission: 3040,
    net: 34960,
    status: "Pending",
    date: "—",
  },
  {
    id: "s3",
    thumbnail: "BR",
    orderNumber: "ORD-100222",
    product: "Braun Trimmer Mini Red",
    sku: "br-trim-09-rd",
    selling: 21000,
    commission: 1680,
    net: 19320,
    status: "Pending",
    date: "—",
  },
];

function fmt(n: number) {
  return `${n.toLocaleString()} IQD`;
}

export function SettlementsContent() {
  const [status, setStatus] = useState<"All" | "Paid" | "Pending">("All");
  const [date, setDate] = useState("");

  const visible = sample.filter((r) => {
    if (status !== "All" && r.status !== status) return false;
    if (date && r.date !== date) return false;
    return true;
  });

  const paid = sample
    .filter((r) => r.status === "Paid")
    .reduce((s, r) => s + r.net, 0);
  const pending = sample
    .filter((r) => r.status === "Pending")
    .reduce((s, r) => s + r.net, 0);

  return (
    <div className="settlements-content account-statement-content">
      <h1>Settlements</h1>

      <section className="statement-summary-grid" aria-label="Settlement totals">
        <article className="statement-summary-card statement-summary-green">
          <p>Total Paid Sales</p>
          <strong>{fmt(paid)}</strong>
        </article>
        <article className="statement-summary-card statement-summary-blue">
          <p>Total Remaining Sales</p>
          <strong>{fmt(pending)}</strong>
        </article>
      </section>

      <section className="account-statement-card">
        <div className="statement-topline">
          <p>Per-order settlement breakdown.</p>
          <button
            className="statement-reset"
            type="button"
            onClick={() => {
              setDate("");
              setStatus("All");
            }}
          >
            Reset Filters
          </button>
        </div>

        <div className="statement-filter-row">
          <label className="order-items-date">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>Status</span>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "All" | "Paid" | "Pending")
              }
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </label>
        </div>

        <div className="statement-table-wrap">
          <table className="statement-table purchase-order-table">
            <thead>
              <tr>
                <th>Thumb</th>
                <th>Order #</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Selling</th>
                <th>Commission</th>
                <th>Net</th>
                <th>Status</th>
                <th>Settlement Date</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-cell">
                    No settlements
                  </td>
                </tr>
              ) : (
                visible.map((r) => (
                  <tr key={r.id} className="product-list-data-row">
                    <td>
                      <div className="sample-product-thumb">
                        <span>{r.thumbnail}</span>
                      </div>
                    </td>
                    <td>{r.orderNumber}</td>
                    <td>{r.product}</td>
                    <td>{r.sku}</td>
                    <td>{fmt(r.selling)}</td>
                    <td>{fmt(r.commission)}</td>
                    <td>{fmt(r.net)}</td>
                    <td>
                      <span
                        className={`approved-status-badge ${
                          r.status === "Paid" ? "is-active" : "is-pending"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>{r.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="statement-pagination">
          <span>Items per page 20</span>
          <span>
            {visible.length} of {sample.length}
          </span>
          <button type="button" aria-label="Previous page" disabled>
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <button type="button" aria-label="Next page" disabled>
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
        </div>
      </section>
    </div>
  );
}
