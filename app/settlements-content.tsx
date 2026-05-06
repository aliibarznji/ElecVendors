"use client";

import { Eye, Printer, RotateCcw } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import { formatIqd, type ApiSettlement, type ApiVendor } from "./lib/utils";

function SettlementReceipt({
  settlement,
  vendor,
}: {
  settlement: ApiSettlement;
  vendor: ApiVendor | null;
}) {
  const printedAt = new Date().toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const isPaid = settlement.status === "paid";
  const dateFormatted = new Date(settlement.date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="settlement-receipt">

      {/* Top color band */}
      <div className="receipt-top-band">
        <div className="receipt-band-left">
          <div className="receipt-brand-mark">E</div>
          <div>
            <div className="receipt-brand-name">Electromall</div>
            <div className="receipt-brand-sub">Vendor Settlement Statement</div>
          </div>
        </div>
        <div className="receipt-band-right">
          <div className="receipt-band-ref">{settlement.settlementNumber}</div>
          <div className="receipt-band-date">{dateFormatted}</div>
        </div>
      </div>

      {/* Paid stamp */}
      {isPaid && <div className="receipt-paid-stamp">PAID</div>}

      {/* Parties */}
      <div className="receipt-parties">
        <div className="receipt-party">
          <div className="receipt-party-label">Issued by</div>
          <div className="receipt-party-name">Electromall Platform</div>
          <div className="receipt-party-detail">Baghdad, Iraq</div>
          <div className="receipt-party-detail">support@electromall.com</div>
          <div className="receipt-party-detail">electromall.com</div>
        </div>
        <div className="receipt-party receipt-party-right">
          <div className="receipt-party-label">Issued to</div>
          <div className="receipt-party-name">{vendor?.name ?? "—"}</div>
          <div className="receipt-party-detail">Ref: {vendor?.reference ?? "—"}</div>
          <div className="receipt-party-detail">{vendor?.phone ?? "—"}</div>
          <div className="receipt-party-detail">{vendor?.companyLocation ?? "—"}</div>
        </div>
      </div>

      <div className="receipt-divider" />

      {/* Details table */}
      <table className="receipt-table">
        <thead>
          <tr><th>Field</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td>Settlement Number</td><td><strong>{settlement.settlementNumber}</strong></td></tr>
          <tr><td>Settlement Date</td><td>{dateFormatted}</td></tr>
          <tr><td>Payment Method</td><td>{settlement.paymentMethod}</td></tr>
          <tr><td>Number of Orders</td><td>{settlement.itemIds.length > 0 ? `${settlement.itemIds.length} orders` : "—"}</td></tr>
          <tr><td>Account Manager</td><td>{vendor?.accountManager || "Electromall Support"}</td></tr>
          <tr>
            <td>Status</td>
            <td>
              <span className={`receipt-status ${isPaid ? "receipt-status-paid" : "receipt-status-pending"}`}>
                {isPaid ? "✓ Paid & Settled" : "⏳ Pending Payment"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Total */}
      <div className="receipt-total-box">
        <div>
          <div className="receipt-total-label">Total Net Settlement Amount</div>
          <div className="receipt-total-sub">After platform commission deduction</div>
        </div>
        <div className="receipt-total-amount">{formatIqd(settlement.amount)}</div>
      </div>

      <div className="receipt-divider" />

      {/* Signatures */}
      <div className="receipt-signatures">
        <div className="receipt-sig-block">
          <div className="receipt-sig-line" />
          <div className="receipt-sig-label">Authorized Signatory — Electromall</div>
        </div>
        <div className="receipt-sig-block">
          <div className="receipt-sig-line" />
          <div className="receipt-sig-label">Vendor Acknowledgement — {vendor?.name ?? "Vendor"}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="receipt-footer">
        <p>This document is an official settlement statement issued by Electromall Iraq. Please retain for your records.</p>
        <p>Questions? Contact your account manager: <strong>{vendor?.accountManager || "Electromall Support"}</strong></p>
        <p className="receipt-printed-at">Generated: {printedAt}</p>
      </div>

    </div>
  );
}

export function SettlementsContent() {
  const [settlements, setSettlements] = useState<ApiSettlement[]>([]);
  const [vendor, setVendor] = useState<ApiVendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [printTarget, setPrintTarget] = useState<ApiSettlement | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.settlements
      .list({ date: date || undefined, paymentMethod: paymentMethod === "all" ? undefined : paymentMethod })
      .then((data) => setSettlements(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [date, paymentMethod]);

  useEffect(() => {
    api.profile.get().then(setVendor).catch(() => {});
  }, []);

  const visible = useMemo(() => settlements, [settlements]);

  const paid = settlements
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.amount, 0);
  const remaining = settlements
    .filter((s) => s.status === "remaining")
    .reduce((sum, s) => sum + s.amount, 0);

  const allMethods = [...new Set(settlements.map((s) => s.paymentMethod))];

  function printSettlement(settlement: ApiSettlement) {
    setPrintTarget(settlement);
    setTimeout(() => {
      window.print();
      setPrintTarget(null);
    }, 120);
  }

  function printAll() {
    setPrintTarget(null);
    setTimeout(() => window.print(), 120);
  }

  return (
    <div className="settlements-content account-statement-content">

      {/* ── Print receipt (shown only on @media print when printTarget set) ── */}
      {printTarget && (
        <div className="settlement-print-overlay" ref={printRef}>
          <SettlementReceipt settlement={printTarget} vendor={vendor} />
        </div>
      )}

      {/* ── Screen UI (hidden on print when single receipt is targeted) ── */}
      <div className={`settlements-screen-content${printTarget ? " no-print" : ""}`}>
        <header className="page-title-row">
          <div>
            <h1>{t("settlements")}</h1>
            <p className="dashboard-sub">{t("settlementsSub")}</p>
          </div>
          <button className="export-button" type="button" onClick={printAll}>
            <Printer aria-hidden="true" size={18} strokeWidth={2.3} />
            <span>{t("printStatement")}</span>
          </button>
        </header>

        <section className="statement-summary-grid" aria-label="Settlements Summary">
          <article className="statement-summary-card statement-summary-green">
            <p>Total Paid</p>
            <strong>{formatIqd(paid)}</strong>
          </article>
          <article className="statement-summary-card statement-summary-blue">
            <p>Total Remaining</p>
            <strong>{formatIqd(remaining)}</strong>
          </article>
          <article className="statement-summary-card statement-summary-amber">
            <p>Total Settlements</p>
            <strong>{settlements.length}</strong>
          </article>
        </section>

        <section className="account-statement-card">
          <div className="statement-topline">
            <p>Filter by date and payment method.</p>
            <button
              className="statement-reset"
              type="button"
              onClick={() => { setDate(""); setPaymentMethod("all"); setOpen(null); }}
            >
              <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
              {t("reset")}
            </button>
          </div>

          <div className="statement-filter-row">
            <label className="order-items-date">
              <span>{t("paymentDate")}</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="order-items-date">
              <span>{t("paymentMethod")}</span>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="all">All Methods</option>
                {allMethods.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
          </div>

          <div className="statement-table-wrap">
            <table className="statement-table purchase-order-table">
              <thead>
                <tr>
                  <th>{t("settlementMonth")}</th>
                  <th>{t("invoiceNumber")}</th>
                  <th>Items</th>
                  <th>{t("amount")}</th>
                  <th>{t("paymentMethod")}</th>
                  <th>{t("settlementStatus")}</th>
                  <th>{t("view")}</th>
                  <th>{t("print")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="empty-cell">Loading…</td></tr>
                ) : visible.length === 0 ? (
                  <tr><td colSpan={8} className="empty-cell">{t("noSettlements")}</td></tr>
                ) : (
                  visible.map((settlement) => (
                    <Fragment key={settlement.id}>
                      <tr className="product-list-data-row">
                        <td>{new Date(settlement.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                        <td><strong>{settlement.settlementNumber}</strong></td>
                        <td>{settlement.itemIds.length > 0 ? settlement.itemIds.length : "—"}</td>
                        <td><strong>{formatIqd(settlement.amount)}</strong></td>
                        <td>{settlement.paymentMethod}</td>
                        <td>
                          <span className={`approved-status-badge ${settlement.status === "paid" ? "is-active" : "is-pending"}`}>
                            {settlement.status === "paid" ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="row-action-btn"
                            type="button"
                            onClick={() => setOpen((c) => c === settlement.id ? null : settlement.id)}
                          >
                            <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                            {t("view")}
                          </button>
                        </td>
                        <td>
                          <button
                            className="row-action-btn row-action-btn--print"
                            type="button"
                            onClick={() => printSettlement(settlement)}
                          >
                            <Printer aria-hidden="true" size={14} strokeWidth={2.4} />
                            {t("print")}
                          </button>
                        </td>
                      </tr>

                      {open === settlement.id && (
                        <tr key={`${settlement.id}-detail`} className="row-details-row">
                          <td colSpan={8}>
                            <div className="settlement-detail-panel">
                              <div className="settlement-detail-grid">
                                <div className="settlement-detail-item">
                                  <span className="settlement-detail-label">Settlement #</span>
                                  <span className="settlement-detail-value">{settlement.settlementNumber}</span>
                                </div>
                                <div className="settlement-detail-item">
                                  <span className="settlement-detail-label">Date</span>
                                  <span className="settlement-detail-value">{new Date(settlement.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                                </div>
                                <div className="settlement-detail-item">
                                  <span className="settlement-detail-label">Payment Method</span>
                                  <span className="settlement-detail-value">{settlement.paymentMethod}</span>
                                </div>
                                <div className="settlement-detail-item">
                                  <span className="settlement-detail-label">Status</span>
                                  <span className={`approved-status-badge ${settlement.status === "paid" ? "is-active" : "is-pending"}`}>
                                    {settlement.status === "paid" ? "Paid" : "Pending"}
                                  </span>
                                </div>
                                <div className="settlement-detail-item">
                                  <span className="settlement-detail-label">Vendor</span>
                                  <span className="settlement-detail-value">{vendor?.name ?? "—"}</span>
                                </div>
                                <div className="settlement-detail-item">
                                  <span className="settlement-detail-label">Reference</span>
                                  <span className="settlement-detail-value">{vendor?.reference ?? "—"}</span>
                                </div>
                              </div>
                              <div className="settlement-detail-total">
                                <span>Total Amount</span>
                                <strong>{formatIqd(settlement.amount)}</strong>
                              </div>
                              <div className="settlement-detail-actions">
                                <button
                                  className="export-button"
                                  type="button"
                                  onClick={() => printSettlement(settlement)}
                                >
                                  <Printer aria-hidden="true" size={15} strokeWidth={2.3} />
                                  Print This Receipt
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
