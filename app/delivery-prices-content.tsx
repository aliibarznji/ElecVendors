"use client";

import { Pencil, Plus, RotateCcw, Save, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { deliveryPrices } from "./vendor-dashboard-data";

type Row = {
  province: string;
  small: number;
  large: number;
  freeRule: string;
};

export function DeliveryPricesContent() {
  const [rows, setRows] = useState<Row[]>(deliveryPrices);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const { t } = useLang();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const visible = useMemo(() => {
    const normalized = query.trim();
    return rows.filter((row) => !normalized || row.province.includes(normalized));
  }, [query, rows]);

  const update = (province: string, patch: Partial<Row>) =>
    setRows((current) =>
      current.map((row) => (row.province === province ? { ...row, ...patch } : row)),
    );

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
          <button
            className="discount-create-button"
            type="button"
            onClick={() =>
              setRows((current) => [
                ...current,
                { province: "New Province", small: 0, large: 0, freeRule: "" },
              ])
            }
          >
            <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
            <span>Add Province</span>
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
              {visible.map((row) => {
                const isEditing = editing === row.province;
                const invalid = row.small < 0 || row.large < 0 || row.large < row.small;
                return (
                  <tr className="product-list-data-row" key={row.province}>
                    <td>
                      {isEditing ? (
                        <input
                          className="edit-table-input"
                          value={row.province}
                          onChange={(event) => update(row.province, { province: event.target.value })}
                        />
                      ) : (
                        row.province
                      )}
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        value={row.small}
                        disabled={!isEditing}
                        onChange={(event) => update(row.province, { small: Number(event.target.value) })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        value={row.large}
                        disabled={!isEditing}
                        onChange={(event) => update(row.province, { large: Number(event.target.value) })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input delivery-rule-input"
                        value={row.freeRule}
                        disabled={!isEditing}
                        placeholder="e.g., Free over 150,000 IQD"
                        onChange={(event) => update(row.province, { freeRule: event.target.value })}
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
                          onClick={() => setEditing(isEditing ? null : row.province)}
                        >
                          <Pencil aria-hidden="true" size={14} strokeWidth={2.4} />
                          {isEditing ? "Finish" : "Edit"}
                        </button>
                        <button
                          className="row-action-btn reject-btn"
                          type="button"
                          onClick={() => setRows((current) => current.filter((item) => item.province !== row.province))}
                        >
                          <Trash2 aria-hidden="true" size={14} strokeWidth={2.4} />
                          Delete
                        </button>
                      </div>
                    </td>
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
