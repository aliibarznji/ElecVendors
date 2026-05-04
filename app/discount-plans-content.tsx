"use client";

import { CalendarDays, Plus, Save, Search, X } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import {
  discountPlans as initialPlans,
  formatIqd,
  getDiscountStatus,
  getProduct,
  type DiscountPlan,
  type DiscountStatus,
} from "./vendor-dashboard-data";

const statusLabel: Record<DiscountStatus | "all", string> = {
  all: "كل الخطط",
  active: "نشطة",
  scheduled: "مجدولة",
  inactive: "غير نشطة",
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
  onSave: (plan: DiscountPlan) => void;
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("2026-05-10");
  const [endDate, setEndDate] = useState("2026-05-20");
  const [productIds, setProductIds] = useState(["prod-1"]);

  return (
    <section className="warranty-form-card" aria-label="إنشاء خطة خصم">
      <div className="warranty-form-header">
        <h2>إنشاء خطة خصم</h2>
        <button className="warranty-cancel-outline" type="button" onClick={onCancel}>
          <X aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>إلغاء</span>
        </button>
      </div>
      <div className="warranty-main-grid">
        <label className="warranty-field">
          <span>اسم الخطة</span>
          <div className="warranty-field-box">
            <input
              value={name}
              placeholder="خصم نهاية الأسبوع"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>تاريخ البداية</span>
          <div className="warranty-field-box">
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>تاريخ النهاية</span>
          <div className="warranty-field-box">
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>المنتجات</span>
          <div className="warranty-field-box">
            <select
              multiple
              value={productIds}
              onChange={(event) =>
                setProductIds(
                  Array.from(event.target.selectedOptions).map((option) => option.value),
                )
              }
            >
              {["prod-1", "prod-2", "prod-3", "prod-4"].map((id) => (
                <option key={id} value={id}>
                  {getProduct(id)?.nameAr}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
      <div className="warranty-actions">
        <button className="warranty-cancel-button" type="button" onClick={onCancel}>
          إلغاء
        </button>
        <button
          className="save-warranty-button"
          type="button"
          onClick={() =>
            onSave({
              id: `disc-${Date.now()}`,
              name: name || "خطة خصم جديدة",
              startDate,
              endDate,
              productIds,
              sales: 0,
              itemsSold: Object.fromEntries(productIds.map((id) => [id, 0])),
            })
          }
        >
          <Save aria-hidden="true" size={18} strokeWidth={2.4} />
          <span>حفظ الخطة</span>
        </button>
      </div>
    </section>
  );
}

export function DiscountPlansContent() {
  const [plans, setPlans] = useState(initialPlans);
  const [filter, setFilter] = useState<DiscountStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [openPlan, setOpenPlan] = useState<string | null>(null);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return plans.filter((plan) => {
      const status = getDiscountStatus(plan);
      if (filter !== "all" && status !== filter) return false;
      if (!normalized) return true;
      return plan.name.toLowerCase().includes(normalized);
    });
  }, [filter, plans, query]);

  const active = plans.filter((plan) => getDiscountStatus(plan) === "active").length;
  const scheduled = plans.filter((plan) => getDiscountStatus(plan) === "scheduled").length;
  const inactive = plans.filter((plan) => getDiscountStatus(plan) === "inactive").length;
  const sales = plans.reduce((sum, plan) => sum + plan.sales, 0);

  return (
    <div className="discount-plans-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>خطط الخصم</h1>
          <p className="dashboard-sub">
            إنشاء خطط تحتوي عدة منتجات مع تاريخ بداية ونهاية ومتابعة المبيعات والكميات.
          </p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={() => setCreating(true)}
        >
          <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>إنشاء خطة خصم</span>
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
          <section className="kpi-grid" aria-label="ملخص خطط الخصم">
            <article className="kpi-card kpi-green">
              <p>خطط نشطة</p>
              <strong>{active}</strong>
            </article>
            <article className="kpi-card kpi-blue">
              <p>خطط مجدولة</p>
              <strong>{scheduled}</strong>
            </article>
            <article className="kpi-card kpi-amber">
              <p>خطط غير نشطة</p>
              <strong>{inactive}</strong>
            </article>
            <article className="kpi-card kpi-cyan">
              <p>مبيعات منتجات مخفضة</p>
              <strong>{formatIqd(sales)}</strong>
            </article>
          </section>

          <section className="discount-plans-card" aria-label="قائمة خطط الخصم">
            <div className="order-items-filters">
              <label className="order-items-search">
                <Search aria-hidden="true" size={16} strokeWidth={2.2} />
                <input
                  placeholder="بحث باسم الخطة"
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
                    <th>اسم الخطة</th>
                    <th>البداية</th>
                    <th>النهاية</th>
                    <th>عدد المنتجات</th>
                    <th>المبيعات</th>
                    <th>القطع المباعة</th>
                    <th>الحالة</th>
                    <th>عرض</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-cell">
                        لا توجد خطط ضمن هذا الفلتر.
                      </td>
                    </tr>
                  ) : (
                    visible.map((plan) => {
                      const status = getDiscountStatus(plan);
                      const sold = Object.values(plan.itemsSold).reduce((sum, value) => sum + value, 0);
                      return (
                        <Fragment key={plan.id}>
                          <tr className="product-list-data-row">
                            <td>{plan.name}</td>
                            <td>{plan.startDate}</td>
                            <td>{plan.endDate}</td>
                            <td>{plan.productIds.length}</td>
                            <td>{formatIqd(plan.sales)}</td>
                            <td>{sold}</td>
                            <td>
                              <span className={`approved-status-badge ${statusClass[status]}`}>
                                {statusLabel[status]}
                              </span>
                            </td>
                            <td>
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
                                تفاصيل
                              </button>
                            </td>
                          </tr>
                          {openPlan === plan.id ? (
                            <tr key={`${plan.id}-detail`} className="row-details-row">
                              <td colSpan={8}>
                                <div className="discount-plan-detail">
                                  {plan.productIds.map((productId) => {
                                    const product = getProduct(productId);
                                    return (
                                      <article className="best-seller-row" key={productId}>
                                        <span className="seller-rank">%</span>
                                        <div>
                                          <strong>{product?.nameAr}</strong>
                                          <span>{product?.sku}</span>
                                        </div>
                                        <b>{plan.itemsSold[productId] ?? 0} قطعة</b>
                                      </article>
                                    );
                                  })}
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
