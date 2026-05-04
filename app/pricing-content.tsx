"use client";

import { AlertTriangle, Lock, RotateCcw, Save, Search } from "lucide-react";
import { useMemo, useState } from "react";
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
          <h1>التسعير السريع</h1>
          <p className="dashboard-sub">
            تعديل سعر الكلفة، سعر البيع، ونسبة العمولة مع تحذيرات الاتفاقات الخاصة.
          </p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={() => setSaved("تم حفظ الأسعار التي لا تحتوي أخطاء أو قيود.")}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>حفظ التغييرات</span>
        </button>
      </header>

      {saved ? <div className="success-banner">{saved}</div> : null}

      <section className="product-list-card pricing-card" aria-label="جدول التسعير">
        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder="بحث باسم المنتج أو الكود"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>خطة الخصم</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">كل المنتجات</option>
              <option value="none">بدون خصم</option>
              <option value="active">خصم نشط</option>
              <option value="scheduled">خصم مجدول</option>
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
            <span>إعادة ضبط</span>
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table pricing-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الكود</th>
                <th>الحالة</th>
                <th>سعر الكلفة</th>
                <th>سعر البيع</th>
                <th>العمولة %</th>
                <th>خطة الخصم</th>
                <th>التحقق</th>
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
                        {product.status === "published" ? "منشور" : "غير منشور/مراجعة"}
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
                    <td>{product.discountPlanStatus === "none" ? "لا يوجد" : product.discountPlanStatus}</td>
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
                            صالح - هامش البيع {formatIqd(draft.sellingPrice - draft.costPrice)}
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
