"use client";

import { Pencil, RotateCcw, Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";
import type { ApiDeliveryPrice } from "../lib/utils";

export function DeliveryPricesContent() {
  const [rows, setRows] = useState<ApiDeliveryPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.deliveryPrices
      .list()
      .then((data) => setRows(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const visible = useMemo(() => {
    const normalized = query.trim();
    return rows.filter((row) => !normalized || row.province.includes(normalized));
  }, [query, rows]);

  const hasInvalid = rows.some((row) => row.small < 0 || row.large < 0 || row.large < row.small);

  return (
    <div className="delivery-prices-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("deliveryPrices")}</h1>
          <p className="dashboard-sub">{t("deliveryPricesSub")}</p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          disabled={hasInvalid}
          onClick={() => setMessage(t("deliverySaved"))}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>{t("saveDeliveryPrices")}</span>
        </button>
      </header>

      {message ? <div className="success-banner">{message}</div> : null}
      {hasInvalid ? (
        <div className="warning-banner">
          Ensure prices are not negative and the large product price is not lower than the small product price.
        </div>
      ) : null}

      <section className="delivery-prices-card product-list-card">
        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder="Search by province"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            className="purchase-order-reset"
            type="button"
            onClick={() => {
              setQuery("");
              setMessage("");
            }}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>Reset</span>
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Province</th>
                <th>Small Products</th>
                <th>Large Products</th>
                <th>Free Delivery Rule</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    Loading…
                  </td>
                </tr>
              ) : (
                visible.map((row) => {
                  const isEditing = editing === row.id;
                  const invalid = row.small < 0 || row.large < 0 || row.large < row.small;
                  return (
                    <tr className="product-list-data-row" key={row.id}>
                      <td>{row.province}</td>
                      <td>
                        <input
                          className="edit-table-input"
                          type="number"
                          value={row.small}
                          disabled={!isEditing}
                          onChange={(event) =>
                            setRows((current) =>
                              current.map((r) =>
                                r.id === row.id ? { ...r, small: Number(event.target.value) } : r,
                              ),
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="edit-table-input"
                          type="number"
                          value={row.large}
                          disabled={!isEditing}
                          onChange={(event) =>
                            setRows((current) =>
                              current.map((r) =>
                                r.id === row.id ? { ...r, large: Number(event.target.value) } : r,
                              ),
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="edit-table-input delivery-rule-input"
                          value={row.freeRule}
                          disabled={!isEditing}
                          placeholder="e.g., Free over 150,000 IQD"
                          onChange={(event) =>
                            setRows((current) =>
                              current.map((r) =>
                                r.id === row.id ? { ...r, freeRule: event.target.value } : r,
                              ),
                            )
                          }
                        />
                      </td>
                      <td>
                        <span className={`approved-status-badge ${invalid ? "is-rejected" : "is-active"}`}>
                          {invalid ? "Needs correction" : row.freeRule ? "Includes free" : "Paid"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="row-action-btn"
                            type="button"
                            onClick={() => setEditing(isEditing ? null : row.id)}
                          >
                            <Pencil aria-hidden="true" size={14} strokeWidth={2.4} />
                            {isEditing ? "Finish" : "Edit"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
