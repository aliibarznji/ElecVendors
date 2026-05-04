"use client";

import { Eye, Printer, RotateCcw } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import {
  filterSettlements,
  formatIqd,
  getProduct,
  orders,
  settlementAmount,
  settlements,
} from "./vendor-dashboard-data";

export function SettlementsContent() {
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const visible = useMemo(
    () => filterSettlements(settlements, date, paymentMethod),
    [date, paymentMethod],
  );
  const paid = settlements
    .filter((settlement) => settlement.status === "paid")
    .reduce((sum, settlement) => sum + settlementAmount(settlement), 0);
  const remaining = settlements
    .filter((settlement) => settlement.status === "remaining")
    .reduce((sum, settlement) => sum + settlementAmount(settlement), 0);

  return (
    <div className="settlements-content account-statement-content">
      <header className="page-title-row">
        <div>
          <h1>Settlements</h1>
          <p className="dashboard-sub">
            Track paid and remaining sales with invoice details for printing or viewing.
          </p>
        </div>
      </header>

      <section className="statement-summary-grid" aria-label="Settlements Summary">
        <article className="statement-summary-card statement-summary-green">
          <p>Total Paid Sales</p>
          <strong>{formatIqd(paid)}</strong>
        </article>
        <article className="statement-summary-card statement-summary-blue">
          <p>Total Remaining Sales</p>
          <strong>{formatIqd(remaining)}</strong>
        </article>
      </section>

      <section className="account-statement-card">
        <div className="statement-topline">
          <p>Settlement filters by date and payment method.</p>
          <button
            className="statement-reset"
            type="button"
            onClick={() => {
              setDate("");
              setPaymentMethod("all");
              setOpen(null);
            }}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
            Reset
          </button>
        </div>

        <div className="statement-filter-row">
          <label className="order-items-date">
            <span>Settlement Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="order-items-date">
            <span>Payment Method</span>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="all">All Methods</option>
              {[...new Set(settlements.map((settlement) => settlement.paymentMethod))].map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="statement-table-wrap">
          <table className="statement-table purchase-order-table">
            <thead>
              <tr>
                <th>Settlement Date</th>
                <th>Invoice Number</th>
                <th>Number of Products</th>
                <th>Settlement Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>View</th>
                <th>Print</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    No matching settlements.
                  </td>
                </tr>
              ) : (
                visible.map((settlement) => (
                  <Fragment key={settlement.id}>
                    <tr className="product-list-data-row">
                      <td>{settlement.date}</td>
                      <td>{settlement.settlementNumber}</td>
                      <td>{settlement.itemIds.length}</td>
                      <td>{formatIqd(settlementAmount(settlement))}</td>
                      <td>{settlement.paymentMethod}</td>
                      <td>
                        <span
                          className={`approved-status-badge ${
                            settlement.status === "paid" ? "is-active" : "is-pending"
                          }`}
                        >
                          {settlement.status === "paid" ? "Paid" : "Remaining"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="row-action-btn"
                          type="button"
                          onClick={() =>
                            setOpen((current) =>
                              current === settlement.id ? null : settlement.id,
                            )
                          }
                        >
                          <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                          View
                        </button>
                      </td>
                      <td>
                        <button className="row-action-btn" type="button">
                          <Printer aria-hidden="true" size={14} strokeWidth={2.4} />
                          Print
                        </button>
                      </td>
                    </tr>
                    {open === settlement.id ? (
                      <tr key={`${settlement.id}-detail`} className="row-details-row">
                        <td colSpan={8}>
                          <div className="purchase-order-table-wrap">
                            <table className="purchase-order-table inner-table">
                              <thead>
                                <tr>
                                  <th>Image</th>
                                  <th>Product</th>
                                  <th>SKU</th>
                                  <th>Order Number</th>
                                  <th>Status</th>
                                  <th>Date</th>
                                  <th>Selling Price</th>
                                  <th>Cost</th>
                                  <th>Compensation/Discount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {settlement.itemIds.map((orderId) => {
                                  const order = orders.find((item) => item.id === orderId);
                                  const product = order ? getProduct(order.productId) : undefined;
                                  if (!order || !product) return null;
                                  return (
                                    <tr key={orderId}>
                                      <td>
                                        <div className="sample-product-thumb" style={{ background: product.imageTone }}>
                                          <span>{product.brand.slice(0, 2).toUpperCase()}</span>
                                        </div>
                                      </td>
                                      <td>{product.nameEn}</td>
                                      <td>{product.sku}</td>
                                      <td>{order.orderNumber}</td>
                                      <td>{order.deliveryStatus}</td>
                                      <td>{order.dateTime}</td>
                                      <td>{formatIqd(order.priceWithCommission)}</td>
                                      <td>{formatIqd(product.costPrice)}</td>
                                      <td>{formatIqd(order.priceWithCommission - order.priceWithoutCommission)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
