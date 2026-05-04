"use client";

import { Eye, Printer, RotateCcw } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import { formatIqd, type ApiSettlement } from "./lib/utils";

export function SettlementsContent() {
  const [settlements, setSettlements] = useState<ApiSettlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.settlements
      .list({
        date: date || undefined,
        paymentMethod: paymentMethod === "all" ? undefined : paymentMethod,
      })
      .then((data) => setSettlements(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [date, paymentMethod]);

  const visible = useMemo(() => settlements, [settlements]);

  const paid = settlements
    .filter((settlement) => settlement.status === "paid")
    .reduce((sum, settlement) => sum + settlement.amount, 0);
  const remaining = settlements
    .filter((settlement) => settlement.status === "remaining")
    .reduce((sum, settlement) => sum + settlement.amount, 0);

  const allMethods = [...new Set(settlements.map((s) => s.paymentMethod))];

  return (
    <div className="settlements-content account-statement-content">
      <header className="page-title-row">
        <div>
          <h1>{t("settlements")}</h1>
          <p className="dashboard-sub">{t("settlementsSub")}</p>
        </div>
        <button className="export-button" type="button" onClick={() => window.print()}>
          <Printer aria-hidden="true" size={18} strokeWidth={2.3} />
          <span>{t("printStatement")}</span>
        </button>
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
            {t("reset")}
          </button>
        </div>

        <div className="statement-filter-row">
          <label className="order-items-date">
            <span>{t("paymentDate")}</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="order-items-date">
            <span>{t("paymentMethod")}</span>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="all">All Methods</option>
              {allMethods.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="statement-table-wrap">
          <table className="statement-table purchase-order-table">
            <thead>
              <tr>
                <th>{t("settlementMonth")}</th>
                <th>{t("invoiceNumber")}</th>
                <th>No. of Products</th>
                <th>{t("amount")}</th>
                <th>{t("paymentMethod")}</th>
                <th>{t("settlementStatus")}</th>
                <th>{t("view")}</th>
                <th>{t("print")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    Loading…
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    {t("noSettlements")}
                  </td>
                </tr>
              ) : (
                visible.map((settlement) => (
                  <Fragment key={settlement.id}>
                    <tr className="product-list-data-row">
                      <td>{settlement.date.slice(0, 10)}</td>
                      <td>{settlement.settlementNumber}</td>
                      <td>{settlement.itemIds.length}</td>
                      <td>{formatIqd(settlement.amount)}</td>
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
                          {t("view")}
                        </button>
                      </td>
                      <td>
                        <button
                          className="row-action-btn"
                          type="button"
                          onClick={() => window.print()}
                        >
                          <Printer aria-hidden="true" size={14} strokeWidth={2.4} />
                          {t("print")}
                        </button>
                      </td>
                    </tr>
                    {open === settlement.id ? (
                      <tr key={`${settlement.id}-detail`} className="row-details-row">
                        <td colSpan={8}>
                          <div className="purchase-order-table-wrap">
                            <p className="dashboard-sub">
                              {settlement.itemIds.length} order items in this settlement.
                            </p>
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
