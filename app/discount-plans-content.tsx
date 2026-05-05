"use client";

import { CalendarDays, Plus, Save, Search, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import { formatIqd, getDiscountStatus, type ApiDiscountPlan } from "./lib/utils";

type DiscountStatus = "active" | "scheduled" | "inactive";

const statusLabel: Record<DiscountStatus | "all", string> = {
  all: "All Plans",
  active: "Active",
  scheduled: "Scheduled",
  inactive: "Inactive",
};

const statusClass: Record<DiscountStatus, string> = {
  active: "is-active",
  scheduled: "is-pending",
  inactive: "is-completed",
};

function CreatePlanForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (plan: ApiDiscountPlan) => void;
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 10); return d.toISOString().slice(0, 10); });
  const [endDate, setEndDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 20); return d.toISOString().slice(0, 10); });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    setSaving(true);
    api.discountPlans
      .create({ name, startDate, endDate, productIds: [] })
      .then((plan) => {
        onSave(plan);
      })
      .catch(() => setSaving(false));
  };

  return (
    <section className="warranty-form-card" aria-label="Create Discount Plan">
      <div className="warranty-form-header">
        <h2>Create Discount Plan</h2>
        <button className="warranty-cancel-outline" type="button" onClick={onCancel}>
          <X aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>Cancel</span>
        </button>
      </div>
      <div className="warranty-main-grid">
        <label className="warranty-field">
          <span>Plan Name</span>
          <div className="warranty-field-box">
            <input
              value={name}
              placeholder="Weekend Discount"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>Start Date</span>
          <div className="warranty-field-box">
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>End Date</span>
          <div className="warranty-field-box">
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </label>
      </div>
      <div className="warranty-actions">
        <button className="warranty-cancel-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="save-warranty-button"
          type="button"
          disabled={saving}
          onClick={handleSave}
        >
          <Save aria-hidden="true" size={18} strokeWidth={2.4} />
          <span>Save Plan</span>
        </button>
      </div>
    </section>
  );
}

export function DiscountPlansContent() {
  const [plans, setPlans] = useState<ApiDiscountPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DiscountStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [openPlan, setOpenPlan] = useState<string | null>(null);
  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.discountPlans
      .list()
      .then((data) => setPlans(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return plans.filter((plan) => {
      const status = getDiscountStatus(plan.startDate, plan.endDate);
      if (filter !== "all" && status !== filter) return false;
      if (!normalized) return true;
      return plan.name.toLowerCase().includes(normalized);
    });
  }, [filter, plans, query]);

  const active = plans.filter((plan) => getDiscountStatus(plan.startDate, plan.endDate) === "active").length;
  const scheduled = plans.filter((plan) => getDiscountStatus(plan.startDate, plan.endDate) === "scheduled").length;
  const inactive = plans.filter((plan) => getDiscountStatus(plan.startDate, plan.endDate) === "inactive").length;
  const sales = plans.reduce((sum, plan) => sum + plan.sales, 0);

  const handleDelete = (id: string) => {
    api.discountPlans.delete(id).catch(() => {});
    setPlans((current) => current.filter((plan) => plan.id !== id));
  };

  return (
    <div className="discount-plans-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("discountPlans")}</h1>
          <p className="dashboard-sub">{t("discountPlansSub")}</p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={() => setCreating(true)}
        >
          <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>{t("createDiscount")}</span>
        </button>
      </header>

      {creating ? (
        <CreatePlanForm
          onCancel={() => setCreating(false)}
          onSave={(plan) => {
            setPlans((current) => [plan, ...current]);
            setCreating(false);
          }}
        />
      ) : (
        <>
          <section className="kpi-grid" aria-label="Discount Plans Summary">
            <article className="kpi-card kpi-green">
              <p>Active Plans</p>
              <strong>{active}</strong>
            </article>
            <article className="kpi-card kpi-blue">
              <p>Scheduled Plans</p>
              <strong>{scheduled}</strong>
            </article>
            <article className="kpi-card kpi-amber">
              <p>Inactive Plans</p>
              <strong>{inactive}</strong>
            </article>
            <article className="kpi-card kpi-cyan">
              <p>Discounted Items Sales</p>
              <strong>{formatIqd(sales)}</strong>
            </article>
          </section>

          <section className="discount-plans-card" aria-label="Discount Plans List">
            <div className="order-items-filters">
              <label className="order-items-search">
                <Search aria-hidden="true" size={16} strokeWidth={2.2} />
                <input
                  placeholder="Search by plan name"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <div className="discount-filter-chips">
                {(["all", "active", "scheduled", "inactive"] as const).map((item) => (
                  <button
                    className={`filter-chip${filter === item ? " is-on" : ""}`}
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                  >
                    {statusLabel[item]}
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
                    <th>Products Count</th>
                    <th>Sales</th>
                    <th>Items Sold</th>
                    <th>Status</th>
                    <th>View</th>
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
                        No plans match this filter.
                      </td>
                    </tr>
                  ) : (
                    visible.map((plan) => {
                      const status = getDiscountStatus(plan.startDate, plan.endDate) as DiscountStatus;
                      const sold = Object.values(plan.itemsSold).reduce((sum, value) => sum + value, 0);
                      return (
                        <Fragment key={plan.id}>
                          <tr className="product-list-data-row">
                            <td>{plan.name}</td>
                            <td>{plan.startDate.slice(0, 10)}</td>
                            <td>{plan.endDate.slice(0, 10)}</td>
                            <td>{plan.productIds.length}</td>
                            <td>{formatIqd(plan.sales)}</td>
                            <td>{sold}</td>
                            <td>
                              <span className={`approved-status-badge ${statusClass[status]}`}>
                                {statusLabel[status]}
                              </span>
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  className="row-action-btn"
                                  type="button"
                                  onClick={() =>
                                    setOpenPlan((current) =>
                                      current === plan.id ? null : plan.id,
                                    )
                                  }
                                >
                                  <CalendarDays aria-hidden="true" size={14} strokeWidth={2.4} />
                                  Details
                                </button>
                                <button
                                  className="row-action-btn reject-btn"
                                  type="button"
                                  onClick={() => handleDelete(plan.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                          {openPlan === plan.id ? (
                            <tr key={`${plan.id}-detail`} className="row-details-row">
                              <td colSpan={8}>
                                <div className="discount-plan-detail">
                                  {plan.productIds.length === 0 ? (
                                    <p className="dashboard-sub">No products in this plan.</p>
                                  ) : (
                                    plan.productIds.map((productId) => (
                                      <article className="best-seller-row" key={productId}>
                                        <span className="seller-rank">%</span>
                                        <div>
                                          <strong>{productId}</strong>
                                        </div>
                                        <b>{plan.itemsSold[productId] ?? 0} pcs</b>
                                      </article>
                                    ))
                                  )}
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
