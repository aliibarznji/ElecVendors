"use client";

import { AlertTriangle, Lock, RotateCcw, Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import {
  formatIqd,
  products,
  validatePricing,
  type VendorProduct,
} from "./vendor-dashboard-data";

type PricingDraft = {
  costPrice: number;
  sellingPrice: number;
  commissionPct: number;
};

function ProductThumb({ product }: { product: VendorProduct }) {
  return (
    <div
      className="sample-product-thumb"
      style={{ background: product.imageTone }}
      aria-label={product.nameAr}
    >
      <span>{product.brand.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export function PricingContent() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [drafts, setDrafts] = useState<Record<string, PricingDraft>>(() =>
    Object.fromEntries(
      products.map((product) => [
        product.id,
        {
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
          commissionPct: product.commissionPct,
        },
      ]),
    ),
  );
  const [saved, setSaved] = useState<string | null>(null);
  const { t } = useLang();

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(null), 4000);
    return () => clearTimeout(timer);
  }, [saved]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      if (status !== "all" && product.discountPlanStatus !== status) return false;
      if (!normalized) return true;
      return [product.nameAr, product.nameEn, product.sku, product.vendorCode]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [query, status]);

  const update = (id: string, patch: Partial<PricingDraft>) =>
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], ...patch },
    }));

  return (
    <div className="pricing-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("instantPricing")}</h1>
          <p className="dashboard-sub">{t("instantPricingSub")}</p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={() => setSaved(t("pricingSaved"))}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>{t("saveChanges")}</span>
        </button>
      </header>

      {saved ? <div className="success-banner">{saved}</div> : null}

      <section className="product-list-card pricing-card" aria-label="Pricing Table">
        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder={t("searchPricing")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>{t("discountPlan")}</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">{t("allProducts")}</option>
              <option value="none">No Discount</option>
              <option value="active">{t("activeStatus")}</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </label>
          <button
            className="purchase-order-reset"
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
              setSaved(null);
            }}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>{t("reset")}</span>
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table pricing-table">
            <thead>
              <tr>
                <th>{t("product")}</th>
                <th>{t("sku")}</th>
                <th>{t("status")}</th>
                <th>{t("colCostPrice")}</th>
                <th>{t("colSellingPrice")}</th>
                <th>Commission %</th>
                <th>{t("discountPlan")}</th>
                <th>Validation</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => {
                const draft = drafts[product.id];
                const result = validatePricing(product, draft);
                return (
                  <tr className="product-list-data-row" key={product.id}>
                    <td>
                      <div className="product-inline-summary">
                        <ProductThumb product={product} />
                        <div>
                          <strong>{product.nameAr}</strong>
                          <span>{product.nameEn}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.sku}</td>
                    <td>
                      <span
                        className={`approved-status-badge ${
                          product.status === "published" ? "is-active" : "is-pending"
                        }`}
                      >
                        {product.status === "published" ? t("published") : t("unpublished")}
                      </span>
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        value={draft.costPrice}
                        onChange={(event) =>
                          update(product.id, { costPrice: Number(event.target.value) })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        value={draft.sellingPrice}
                        onChange={(event) =>
                          update(product.id, { sellingPrice: Number(event.target.value) })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        value={draft.commissionPct}
                        onChange={(event) =>
                          update(product.id, { commissionPct: Number(event.target.value) })
                        }
                      />
                    </td>
                    <td>{product.discountPlanStatus === "none" ? "None" : product.discountPlanStatus}</td>
                    <td>
                      <div className="validation-stack">
                        {result.errors.map((error) => (
                          <span className="validation-error" key={error}>
                            <AlertTriangle aria-hidden="true" size={13} />
                            {error}
                          </span>
                        ))}
                        {result.warnings.map((warning) => (
                          <span className="validation-warning" key={warning}>
                            <Lock aria-hidden="true" size={13} />
                            {warning}
                          </span>
                        ))}
                        {result.valid ? (
                          <span className="validation-ok">
                            Valid - Profit Margin {formatIqd(draft.sellingPrice - draft.costPrice)}
                          </span>
                        ) : null}
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
