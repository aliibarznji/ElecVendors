"use client";

import {
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  Package,
  Plus,
  Save,
  Search,
  Tag,
  X,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";
import {
  formatIqd,
  getDiscountStatus,
  type ApiDiscountPlan,
  type ApiProduct,
} from "../lib/utils";

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

function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function CreatePlanForm({
  products,
  onCancel,
  onSave,
}: {
  products: ApiProduct[];
  onCancel: () => void;
  onSave: (plan: ApiDiscountPlan) => void;
}) {
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [discountPct, setDiscountPct] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [productSearch, setProductSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      p.nameEn.toLowerCase().includes(q) ||
      p.nameAr.includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q),
    );
  }, [products, productSearch]);

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const handleSave = () => {
    if (!name.trim()) { setError("Plan name is required."); return; }
    if (selectedIds.size === 0) { setError("Select at least one product."); return; }
    if (discountPct <= 0 || discountPct > 100) { setError("Discount must be 1–100%."); return; }
    setError("");
    setSaving(true);
    api.discountPlans
      .create({
        name: name.trim(),
        startDate,
        endDate,
        productIds: Array.from(selectedIds),
        discountPct,
      })
      .then((plan) => onSave(plan))
      .catch(() => { setError("Failed to save plan. Try again."); setSaving(false); });
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

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div className="warranty-main-grid">
        <label className="warranty-field">
          <span>Plan Name</span>
          <div className="warranty-field-box">
            <input
              value={name}
              placeholder="e.g. Weekend Sale"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>Discount Percentage</span>
          <div className="warranty-field-box" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number"
              min={1}
              max={100}
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              style={{ width: 80 }}
            />
            <span style={{ color: "var(--muted)", fontSize: 14 }}>%</span>
          </div>
        </label>
        <label className="warranty-field">
          <span>Start Date</span>
          <div className="warranty-field-box">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>End Date</span>
          <div className="warranty-field-box">
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </label>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            Select Products
            {selectedIds.size > 0 && (
              <span style={{ marginLeft: 8, background: "var(--brand)", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 12 }}>
                {selectedIds.size} selected
              </span>
            )}
          </span>
          <button
            type="button"
            style={{ fontSize: 12, color: "var(--brand)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
            onClick={toggleAll}
          >
            {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? "Deselect All" : "Select All"}
          </button>
        </div>

        <label className="order-items-search" style={{ marginBottom: 10 }}>
          <Search aria-hidden="true" size={15} strokeWidth={2.2} />
          <input
            placeholder="Search products…"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </label>

        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", maxHeight: 340, overflowY: "auto" }}>
          <table className="purchase-order-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Product</th>
                <th>SKU</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Discounted Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={6} className="empty-cell">No products found.</td></tr>
              ) : (
                filteredProducts.map((p) => {
                  const checked = selectedIds.has(p.id);
                  const discounted = Math.round(p.sellingPrice * (1 - discountPct / 100));
                  return (
                    <tr
                      key={p.id}
                      className="product-list-data-row"
                      style={{ cursor: "pointer", background: checked ? "rgba(220,38,38,0.04)" : undefined }}
                      onClick={() => toggleProduct(p.id)}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProduct(p.id)}
                          style={{ cursor: "pointer", accentColor: "var(--brand)" }}
                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {p.mainImage && (
                            <img src={p.mainImage} alt="" style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 6, border: "1px solid var(--border)", background: "#f9f9f9" }} />
                          )}
                          <span style={{ fontWeight: 500, fontSize: 13 }}>
                            {lang === "ar" ? p.nameAr : p.nameEn}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--muted)" }}>{p.sku}</td>
                      <td style={{ fontSize: 12 }}>{p.brand}</td>
                      <td style={{ fontSize: 13 }}>{formatIqd(p.sellingPrice)}</td>
                      <td style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                        {discountPct > 0 ? formatIqd(discounted) : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
          <span>{saving ? "Saving…" : `Save Plan (${selectedIds.size} products)`}</span>
        </button>
      </div>
    </section>
  );
}

export function DiscountPlansContent() {
  const [plans, setPlans] = useState<ApiDiscountPlan[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DiscountStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [openPlan, setOpenPlan] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useLang();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.discountPlans.list(),
      api.products.list({ limit: 200 }).then((r) => r.items),
    ])
      .then(([planData, productData]) => {
        setPlans(planData);
        setProducts(productData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    if (exportOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [exportOpen]);

  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products],
  );

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return plans.filter((plan) => {
      const status = getDiscountStatus(plan.startDate, plan.endDate);
      if (filter !== "all" && status !== filter) return false;
      if (!normalized) return true;
      return plan.name.toLowerCase().includes(normalized);
    });
  }, [filter, plans, query]);

  const active = plans.filter(
    (p) => getDiscountStatus(p.startDate, p.endDate) === "active",
  ).length;
  const scheduled = plans.filter(
    (p) => getDiscountStatus(p.startDate, p.endDate) === "scheduled",
  ).length;
  const inactive = plans.filter(
    (p) => getDiscountStatus(p.startDate, p.endDate) === "inactive",
  ).length;
  const totalSales = plans.reduce((sum, p) => sum + p.sales, 0);

  const handleDelete = (id: string) => {
    api.discountPlans.delete(id).catch(() => {});
    setPlans((current) => current.filter((p) => p.id !== id));
  };

  function exportByItem() {
    const headers = [
      "Plan Name",
      "Plan Status",
      "Product Name",
      "SKU",
      "Brand",
      "Quantity Sold",
      "Unit Price (IQD)",
      "Total Price (IQD)",
    ];
    const rows: (string | number)[] [] = [];
    for (const plan of plans) {
      const status = getDiscountStatus(plan.startDate, plan.endDate);
      for (const productId of plan.productIds) {
        const product = productMap[productId];
        const qty = plan.itemsSold[productId] ?? 0;
        const unitPrice = product?.sellingPrice ?? 0;
        rows.push([
          plan.name,
          status,
          product ? (lang === "ar" ? product.nameAr : product.nameEn) : productId,
          product?.sku ?? "-",
          product?.brand ?? "-",
          qty,
          Math.round(unitPrice),
          Math.round(unitPrice * qty),
        ]);
      }
    }
    downloadCsv("discount-sales-by-item.csv", headers, rows);
    setExportOpen(false);
  }

  function exportByBrand() {
    const brandMap: Record<
      string,
      { brand: string; totalQty: number; totalPrice: number; totalItems: number }
    > = {};
    for (const plan of plans) {
      for (const productId of plan.productIds) {
        const product = productMap[productId];
        const brand = product?.brand ?? "Unknown";
        const qty = plan.itemsSold[productId] ?? 0;
        const unitPrice = product?.sellingPrice ?? 0;
        if (!brandMap[brand]) {
          brandMap[brand] = { brand, totalQty: 0, totalPrice: 0, totalItems: 0 };
        }
        brandMap[brand].totalQty += qty;
        brandMap[brand].totalPrice += unitPrice * qty;
        brandMap[brand].totalItems += 1;
      }
    }
    const rows = Object.values(brandMap)
      .sort((a, b) => b.totalPrice - a.totalPrice)
      .map((r) => [r.brand, r.totalItems, r.totalQty, Math.round(r.totalPrice)]);
    downloadCsv(
      "discount-sales-by-brand.csv",
      ["Brand", "Total Items (Products)", "Total Quantity Sold", "Total Price (IQD)"],
      rows,
    );
    setExportOpen(false);
  }

  return (
    <div className="discount-plans-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("discountPlans")}</h1>
          <p className="dashboard-sub">{t("discountPlansSub")}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Export dropdown */}
          <div className="export-dropdown-wrap" ref={exportRef}>
            <button
              className={`export-button${exportOpen ? " is-active" : ""}`}
              type="button"
              onClick={() => setExportOpen((v) => !v)}
            >
              <Download aria-hidden="true" size={16} strokeWidth={2.3} />
              <span>Export Data</span>
              <ChevronDown
                aria-hidden="true"
                size={13}
                strokeWidth={2.3}
                style={{
                  marginLeft: 2,
                  transition: "transform .2s",
                  transform: exportOpen ? "rotate(180deg)" : "none",
                }}
              />
            </button>

            {exportOpen && (
              <div className="export-dropdown-panel">
                <div className="export-dropdown-header">
                  <span>What would you like to download?</span>
                  <button
                    className="export-dropdown-close"
                    type="button"
                    aria-label="Close"
                    onClick={() => setExportOpen(false)}
                  >
                    <X size={14} strokeWidth={2.3} aria-hidden="true" />
                  </button>
                </div>
                <div className="export-options-list">
                  <button
                    className="export-option-btn"
                    type="button"
                    onClick={exportByItem}
                  >
                    <span className="export-option-icon">
                      <Package size={16} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span className="export-option-text">
                      <strong>Sales by Item</strong>
                      <span>Name · Quantity · Unit Price · Total Price</span>
                    </span>
                    <FileText
                      size={13}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="export-option-dl"
                    />
                  </button>
                  <button
                    className="export-option-btn"
                    type="button"
                    onClick={exportByBrand}
                  >
                    <span className="export-option-icon">
                      <Tag size={16} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span className="export-option-text">
                      <strong>Sales by Brand</strong>
                      <span>Brand · Total Items · Total Qty · Total Price</span>
                    </span>
                    <FileText
                      size={13}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="export-option-dl"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="discount-create-button"
            type="button"
            onClick={() => setCreating(true)}
          >
            <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
            <span>{t("createDiscount")}</span>
          </button>
        </div>
      </header>

      {creating ? (
        <CreatePlanForm
          products={products}
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
              <strong>{formatIqd(totalSales)}</strong>
            </article>
          </section>

          <section className="discount-plans-card" aria-label="Discount Plans List">
            <div className="order-items-filters">
              <label className="order-items-search">
                <Search aria-hidden="true" size={16} strokeWidth={2.2} />
                <input
                  placeholder="Search by plan name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                    <th>Discount</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Products</th>
                    <th>Sales</th>
                    <th>Items Sold</th>
                    <th>Status</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="empty-cell">
                        Loading…
                      </td>
                    </tr>
                  ) : visible.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="empty-cell">
                        No plans match this filter.
                      </td>
                    </tr>
                  ) : (
                    visible.map((plan) => {
                      const status = getDiscountStatus(
                        plan.startDate,
                        plan.endDate,
                      ) as DiscountStatus;
                      const sold = Object.values(plan.itemsSold).reduce(
                        (sum, v) => sum + v,
                        0,
                      );
                      return (
                        <Fragment key={plan.id}>
                          <tr className="product-list-data-row">
                            <td>{plan.name}</td>
                            <td>
                              <span style={{ fontWeight: 600, color: "#16a34a" }}>
                                {plan.discountPct ?? 0}%
                              </span>
                            </td>
                            <td>{plan.startDate.slice(0, 10)}</td>
                            <td>{plan.endDate.slice(0, 10)}</td>
                            <td>{plan.productIds.length}</td>
                            <td>{formatIqd(plan.sales)}</td>
                            <td>{sold}</td>
                            <td>
                              <span
                                className={`approved-status-badge ${statusClass[status]}`}
                              >
                                {statusLabel[status]}
                              </span>
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  className="row-action-btn"
                                  type="button"
                                  onClick={() =>
                                    setOpenPlan((cur) =>
                                      cur === plan.id ? null : plan.id,
                                    )
                                  }
                                >
                                  <CalendarDays
                                    aria-hidden="true"
                                    size={14}
                                    strokeWidth={2.4}
                                  />
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

                          {openPlan === plan.id && (
                            <tr key={`${plan.id}-detail`} className="row-details-row">
                              <td colSpan={9}>
                                <div className="discount-plan-detail">
                                  {plan.productIds.length === 0 ? (
                                    <p className="dashboard-sub">No products in this plan.</p>
                                  ) : (
                                    <table className="purchase-order-table discount-detail-table">
                                      <thead>
                                        <tr>
                                          <th>Product Name</th>
                                          <th>SKU</th>
                                          <th>Brand</th>
                                          <th>Original Price</th>
                                          <th>Discounted Price</th>
                                          <th>Qty Sold</th>
                                          <th>Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {plan.productIds.map((productId) => {
                                          const product = productMap[productId];
                                          const qty = plan.itemsSold[productId] ?? 0;
                                          const unitPrice = product?.sellingPrice ?? 0;
                                          const pct = plan.discountPct ?? 0;
                                          const discounted = Math.round(unitPrice * (1 - pct / 100));
                                          return (
                                            <tr
                                              className="product-list-data-row"
                                              key={productId}
                                            >
                                              <td>
                                                {product
                                                  ? lang === "ar"
                                                    ? product.nameAr
                                                    : product.nameEn
                                                  : productId}
                                              </td>
                                              <td>{product?.sku ?? "-"}</td>
                                              <td>{product?.brand ?? "-"}</td>
                                              <td style={{ textDecoration: pct > 0 ? "line-through" : undefined, color: "var(--muted)" }}>{formatIqd(unitPrice)}</td>
                                              <td style={{ color: "#16a34a", fontWeight: 600 }}>{pct > 0 ? formatIqd(discounted) : "—"}</td>
                                              <td>{qty}</td>
                                              <td>{formatIqd(discounted * qty)}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
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
