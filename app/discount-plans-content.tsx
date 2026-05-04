"use client";

import { Plus, Save, Search, Tag, Trash2, X } from "lucide-react";
import { useState } from "react";

type Plan = {
  id: string;
  name: string;
  start: string;
  end: string;
  status: "Active" | "Inactive";
  type: "Percentage" | "Fixed Amount";
  value: number;
  productSkus: string[];
  itemsSold: number;
};

const samplePlans: Plan[] = [
  {
    id: "p1",
    name: "Spring Beauty 10%",
    start: "2026-04-15",
    end: "2026-05-15",
    status: "Active",
    type: "Percentage",
    value: 10,
    productSkus: ["sv2411203071322707", "em-curl-22-bk"],
    itemsSold: 42,
  },
  {
    id: "p2",
    name: "Eid Bundle Fixed",
    start: "2026-03-01",
    end: "2026-03-20",
    status: "Inactive",
    type: "Fixed Amount",
    value: 5000,
    productSkus: ["br-trim-09-rd"],
    itemsSold: 18,
  },
];

const productCatalog = [
  { sku: "sv2411203071322707", name: "Sheglam Curling Iron 400W Silver" },
  { sku: "em-curl-22-bk", name: "Electromall Curl Pro Black" },
  { sku: "br-trim-09-rd", name: "Braun Trimmer Mini Red" },
  { sku: "ph-shav-44-bl", name: "Philips OneBlade Pro Blue" },
  { sku: "or-buds-12-wh", name: "Oraimo Wireless Buds White" },
];

function PlanForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (plan: Plan) => void;
}) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [type, setType] = useState<"Percentage" | "Fixed Amount">("Percentage");
  const [value, setValue] = useState(10);
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const matches = productCatalog.filter(
    (p) =>
      !picked.includes(p.sku) &&
      (!search ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <section
      className="warranty-form-card"
      aria-label="Create discount plan"
    >
      <div className="warranty-form-header">
        <h2>Create Discount Plan</h2>
        <button
          className="warranty-cancel-outline"
          type="button"
          onClick={onCancel}
        >
          <X aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>Cancel</span>
        </button>
      </div>

      <div className="warranty-main-grid">
        <label className="warranty-field">
          <span>Plan Name:</span>
          <div className="warranty-field-box">
            <input
              placeholder="Spring Beauty 10%"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Tag aria-hidden="true" size={21} strokeWidth={2.1} />
          </div>
        </label>
        <label className="warranty-field">
          <span>Discount Type:</span>
          <div className="warranty-field-box">
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "Percentage" | "Fixed Amount")
              }
            >
              <option>Percentage</option>
              <option>Fixed Amount</option>
            </select>
          </div>
        </label>
        <label className="warranty-field">
          <span>Start Date:</span>
          <div className="warranty-field-box">
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>End Date:</span>
          <div className="warranty-field-box">
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>Value{type === "Percentage" ? " (%)" : " (IQD)"}:</span>
          <div className="warranty-field-box">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>
        </label>
      </div>

      <div className="discount-products-block">
        <h3>Products in Plan</h3>
        <label className="discount-product-search">
          <Search aria-hidden="true" size={15} strokeWidth={2.2} />
          <input
            placeholder="Search by SKU or name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {search ? (
          <ul className="discount-product-results">
            {matches.length === 0 ? (
              <li className="empty-cell">No matches</li>
            ) : (
              matches.map((p) => (
                <li key={p.sku}>
                  <div>
                    <strong>{p.name}</strong>
                    <span>{p.sku}</span>
                  </div>
                  <button
                    type="button"
                    className="row-action-btn"
                    onClick={() => {
                      setPicked((v) => [...v, p.sku]);
                      setSearch("");
                    }}
                  >
                    <Plus aria-hidden="true" size={14} strokeWidth={2.4} />
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}

        <div className="discount-chip-row">
          {picked.length === 0 ? (
            <span className="empty-cell">No products added yet</span>
          ) : (
            picked.map((sku) => (
              <span key={sku} className="discount-chip">
                {sku}
                <button
                  type="button"
                  aria-label={`Remove ${sku}`}
                  onClick={() =>
                    setPicked((v) => v.filter((s) => s !== sku))
                  }
                >
                  <X aria-hidden="true" size={12} strokeWidth={2.5} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="warranty-actions">
        <button
          className="warranty-cancel-button"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="save-warranty-button"
          type="button"
          onClick={() =>
            onSave({
              id: `p${Date.now()}`,
              name: name || "Untitled Plan",
              start,
              end,
              status: "Active",
              type,
              value,
              productSkus: picked,
              itemsSold: 0,
            })
          }
        >
          <Save aria-hidden="true" size={18} strokeWidth={2.4} />
          <span>Save Plan</span>
        </button>
      </div>
    </section>
  );
}

export function DiscountPlansContent() {
  const [plans, setPlans] = useState(samplePlans);
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [creating, setCreating] = useState(false);
  const [openPlan, setOpenPlan] = useState<string | null>(null);

  const visible = plans.filter((p) =>
    filter === "All" ? true : p.status === filter,
  );

  return (
    <div className="discount-plans-content">
      <h1>Discount Plans</h1>

      {creating ? (
        <PlanForm
          onCancel={() => setCreating(false)}
          onSave={(plan) => {
            setPlans((v) => [plan, ...v]);
            setCreating(false);
          }}
        />
      ) : (
        <section
          className="discount-plans-card"
          aria-label="Discount plans list"
        >
          <div className="discount-plans-toolbar">
            <button
              className="discount-create-button"
              type="button"
              onClick={() => setCreating(true)}
            >
              <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
              <span>Create Discount Plan</span>
            </button>
            <div className="discount-filter-chips">
              {(["All", "Active", "Inactive"] as const).map((c) => (
                <button
                  className={`filter-chip${filter === c ? " is-on" : ""}`}
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="purchase-order-table-wrap">
            <table className="purchase-order-table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th># Products</th>
                  <th>Status</th>
                  <th>Items Sold</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-cell">
                      No plans for this filter
                    </td>
                  </tr>
                ) : (
                  visible.map((plan) => (
                    <>
                      <tr key={plan.id} className="product-list-data-row">
                        <td>{plan.name}</td>
                        <td>{plan.start}</td>
                        <td>{plan.end}</td>
                        <td>{plan.productSkus.length}</td>
                        <td>
                          <span
                            className={`approved-status-badge ${
                              plan.status === "Active"
                                ? "is-active"
                                : "is-completed"
                            }`}
                          >
                            {plan.status}
                          </span>
                        </td>
                        <td>{plan.itemsSold}</td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="row-action-btn"
                              type="button"
                              onClick={() =>
                                setOpenPlan((v) =>
                                  v === plan.id ? null : plan.id,
                                )
                              }
                            >
                              View
                            </button>
                            {plan.status === "Active" ? (
                              <button
                                className="row-action-btn"
                                type="button"
                                onClick={() =>
                                  setPlans((all) =>
                                    all.map((p) =>
                                      p.id === plan.id
                                        ? { ...p, status: "Inactive" }
                                        : p,
                                    ),
                                  )
                                }
                              >
                                End Plan
                              </button>
                            ) : (
                              <button
                                className="row-action-btn"
                                type="button"
                                onClick={() =>
                                  setPlans((all) =>
                                    all.filter((p) => p.id !== plan.id),
                                  )
                                }
                              >
                                <Trash2
                                  aria-hidden="true"
                                  size={14}
                                  strokeWidth={2.4}
                                />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {openPlan === plan.id ? (
                        <tr
                          key={`${plan.id}-detail`}
                          className="row-details-row"
                        >
                          <td colSpan={7}>
                            <div className="discount-plan-detail">
                              <h4>Included Products</h4>
                              <table className="purchase-order-table inner-table">
                                <thead>
                                  <tr>
                                    <th>Thumb</th>
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Original</th>
                                    <th>Discounted</th>
                                    <th>Sold During Plan</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {plan.productSkus.map((sku) => {
                                    const product = productCatalog.find(
                                      (p) => p.sku === sku,
                                    );
                                    const original = 50000;
                                    const discounted =
                                      plan.type === "Percentage"
                                        ? Math.round(
                                            original * (1 - plan.value / 100),
                                          )
                                        : original - plan.value;
                                    return (
                                      <tr key={sku}>
                                        <td>
                                          <div className="sample-product-thumb">
                                            <span />
                                          </div>
                                        </td>
                                        <td>{product?.name ?? sku}</td>
                                        <td>{sku}</td>
                                        <td>{original.toLocaleString()} IQD</td>
                                        <td>
                                          {discounted.toLocaleString()} IQD
                                        </td>
                                        <td>
                                          {Math.floor(plan.itemsSold / Math.max(plan.productSkus.length, 1))}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
