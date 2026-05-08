"use client";

import { AlertTriangle, Lock, RotateCcw, Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";
import { formatIqd, type ApiProduct } from "../lib/utils";

type PricingDraft = {
  costPrice: number;
  sellingPrice: number;
  commissionPct: number;
};

function ProductThumb({ product }: { product: ApiProduct }) {
  const { lang } = useLang();
  const name = lang === "ar" ? product.nameAr : product.nameEn;
  if (product.mainImage) {
    return <img className="sample-product-thumb" src={product.mainImage} alt={name} />;
  }
  return (
    <div
      className="sample-product-thumb"
      style={{ background: product.imageTone }}
      aria-label={name}
    >
      <span>{product.brand.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

function validatePricingDraft(product: ApiProduct, draft: PricingDraft) {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (draft.sellingPrice <= 0) errors.push("Selling price must be positive");
  if (draft.costPrice <= 0) errors.push("Cost price must be positive");
  if (draft.sellingPrice < draft.costPrice) errors.push("Selling price must be >= cost price");
  if (product.lockedCommission) warnings.push("Commission is locked by admin");
  return { valid: errors.length === 0, errors, warnings };
}

export function PricingContent() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [drafts, setDrafts] = useState<Record<string, PricingDraft>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const { t, lang } = useLang();

  useEffect(() => {
    setLoading(true);
    api.products
      .list({ limit: 100 })
      .then((res) => {
        setProducts(res.items);
        setDrafts(
          Object.fromEntries(
            res.items.map((product) => [
              product.id,
              {
                costPrice: product.costPrice,
                sellingPrice: product.sellingPrice,
                commissionPct: product.commissionPct,
              },
            ]),
          ),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
  }, [query, status, products]);

  const update = (id: string, patch: Partial<PricingDraft>) =>
    setDrafts((current) => {
      const existing = current[id];
      if (patch.commissionPct !== undefined && existing) {
        const vendorRevenue = existing.sellingPrice * (1 - existing.commissionPct / 100);
        patch = { ...patch, sellingPrice: Math.round(vendorRevenue / (1 - patch.commissionPct / 100)) };
      }
      return { ...current, [id]: { ...existing, ...patch } };
    });

  const handleSave = () => {
    Promise.all(
      Object.entries(drafts).map(([id, draft]) =>
        api.products.update(id, {
          sellingPrice: draft.sellingPrice,
          costPrice: draft.costPrice,
          commissionPct: draft.commissionPct,
        }),
      ),
    )
      .then(() => setSaved(t("pricingSaved")))
      .catch(() => setSaved(t("pricingSaved")));
  };

  return (
    <div className="grid gap-[18px] p-[22px_24px_48px]">
      <header className="flex items-start justify-between gap-[18px]">
        <div>
          <h1 className="m-0">{t("instantPricing")}</h1>
          <p className="mt-[7px] text-muted text-[13px] leading-[1.5]">{t("instantPricingSub")}</p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={handleSave}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>{t("saveChanges")}</span>
        </button>
      </header>

      {saved ? (
        <div className="flex items-center gap-[9px] px-[14px] py-[11px] rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534] text-[13px]">
          {saved}
        </div>
      ) : null}

      <section
        className="grid align-start gap-6 min-h-[597px] p-[20px_18px_24px] rounded-[4px] bg-white shadow-[0_1px_0_rgba(19,28,54,0.04)]"
        aria-label="Pricing Table"
      >
        <div className="flex items-center gap-2 p-[14px_16px] flex-wrap rtl:flex-row-reverse">
          <label className="flex items-center gap-2 px-3 min-h-[36px] rounded-[9px] border border-border bg-white shadow-sm transition-colors focus-within:border-[rgba(215,25,32,0.35)] focus-within:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] rtl:flex-row-reverse">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              className="border-0 outline-none bg-transparent text-[13px] text-text w-full"
              placeholder={t("searchPricing")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="flex items-center gap-[6px] px-[10px] min-h-[36px] rounded-[9px] border border-border bg-white text-[13px] text-muted">
            <span className="text-[12px] font-medium text-muted whitespace-nowrap">{t("discountPlan")}</span>
            <select
              className="border-0 outline-none bg-transparent text-[13px] text-text"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">{t("allProducts")}</option>
              <option value="none">No Discount</option>
              <option value="active">{t("activeStatus")}</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </label>
          <button
            className="inline-flex w-[78px] h-[26px] items-center justify-center mb-px border border-[#ff2f56] rounded-[3px] bg-white text-[#ff2f56] cursor-pointer text-[12px] leading-[1] whitespace-nowrap font-inherit hover:bg-[#f0f4ff] hover:border-[rgba(61,95,182,0.25)] transition-colors"
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

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse table-fixed purchase-order-table">
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-[#94a3b8] text-[13px] p-[28px_14px] text-center">
                    Loading…
                  </td>
                </tr>
              ) : (
                visible.map((product) => {
                  const draft = drafts[product.id];
                  if (!draft) return null;
                  const result = validatePricingDraft(product, draft);
                  return (
                    <tr className="product-list-data-row" key={product.id}>
                      <td>
                        <div className="flex items-center gap-[10px] min-w-[240px] rtl:flex-row-reverse rtl:text-right">
                          <ProductThumb product={product} />
                          <div className="grid gap-[3px] min-w-0">
                            <strong className="text-[13px] text-[#0f172a]">{lang === "ar" ? product.nameAr : product.nameEn}</strong>
                            <span className="text-[11px] text-[#94a3b8]">{lang === "ar" ? product.nameEn : product.nameAr}</span>
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
                          className="w-full min-w-[80px] min-h-[32px] px-2 rounded-[7px] border border-border bg-[#f8f9fc] text-[13px] text-text transition-colors focus:outline-none focus:border-[rgba(215,25,32,0.4)] focus:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus:bg-white"
                          type="number"
                          value={draft.costPrice}
                          onChange={(event) =>
                            update(product.id, { costPrice: Number(event.target.value) })
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="w-full min-w-[80px] min-h-[32px] px-2 rounded-[7px] border border-border bg-[#f8f9fc] text-[13px] text-text transition-colors focus:outline-none focus:border-[rgba(215,25,32,0.4)] focus:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus:bg-white"
                          type="number"
                          value={draft.sellingPrice}
                          onChange={(event) =>
                            update(product.id, { sellingPrice: Number(event.target.value) })
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="w-full min-w-[80px] min-h-[32px] px-2 rounded-[7px] border border-border bg-[#f8f9fc] text-[13px] text-text transition-colors focus:outline-none focus:border-[rgba(215,25,32,0.4)] focus:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus:bg-white"
                          type="number"
                          value={draft.commissionPct}
                          onChange={(event) =>
                            update(product.id, { commissionPct: Number(event.target.value) })
                          }
                        />
                      </td>
                      <td>{product.discountPlanStatus === "none" ? "None" : product.discountPlanStatus}</td>
                      <td>
                        <div className="grid gap-1">
                          {result.errors.map((error) => (
                            <span className="flex items-center gap-[5px] text-[11.5px] text-[#b91c1c]" key={error}>
                              <AlertTriangle aria-hidden="true" size={13} />
                              {error}
                            </span>
                          ))}
                          {result.warnings.map((warning) => (
                            <span className="flex items-center gap-[5px] text-[11.5px] text-[#a16207]" key={warning}>
                              <Lock aria-hidden="true" size={13} />
                              {warning}
                            </span>
                          ))}
                          {result.valid ? (
                            <span className="text-[11.5px] text-[#15803d] font-semibold">
                              Valid - Profit Margin {formatIqd(draft.sellingPrice - draft.costPrice)}
                            </span>
                          ) : null}
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
