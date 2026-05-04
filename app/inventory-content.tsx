"use client";

import { AlertTriangle, PackageCheck, RotateCcw, Save, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  formatIqd,
  products,
  validateStockUpdate,
  type VendorProduct,
} from "./vendor-dashboard-data";

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

export function InventoryContent() {
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "available" | "out">("all");
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((product) => [product.id, product.quantity])),
  );
  const [message, setMessage] = useState("");

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const quantity = quantities[product.id];
      if (stockFilter === "available" && quantity <= 0) return false;
      if (stockFilter === "out" && quantity > 0) return false;
      if (!normalized) return true;
      return [product.nameAr, product.nameEn, product.sku, product.vendorCode, product.brand]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [query, quantities, stockFilter]);

  const availableCount = products.filter((product) => quantities[product.id] > 0).length;

  return (
    <div className="inventory-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>إدارة المخزون</h1>
          <p className="dashboard-sub">
            هذه الصفحة تتحكم بالمخزون فقط. الأسعار تظهر كسياق للقراءة ولا يتم تعديلها هنا.
          </p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={() => setMessage("تم حفظ تحديثات المخزون الصالحة.")}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>حفظ المخزون</span>
        </button>
      </header>

      {message ? <div className="success-banner">{message}</div> : null}

      <section className="inventory-summary-strip" aria-label="ملخص المخزون">
        <article className="inventory-summary-item inventory-blue">
          <span className="inventory-summary-icon">
            <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div>
            <p>إجمالي المنتجات</p>
            <strong>{products.length}</strong>
            <small>منتجات المورد</small>
          </div>
        </article>
        <article className="inventory-summary-item inventory-green">
          <span className="inventory-summary-icon">
            <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div>
            <p>منتجات متاحة</p>
            <strong>{availableCount}</strong>
            <small>كمية أكبر من صفر</small>
          </div>
        </article>
        <article className="inventory-summary-item inventory-orange">
          <span className="inventory-summary-icon">
            <AlertTriangle aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div>
            <p>نفد المخزون</p>
            <strong>{products.length - availableCount}</strong>
            <small>تحتاج إضافة كمية</small>
          </div>
        </article>
      </section>

      <section className="product-list-card inventory-card" aria-label="تحديث المخزون">
        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder="بحث بالاسم أو الكود أو اللون"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>الحالة</span>
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value as typeof stockFilter)}
            >
              <option value="all">كل المنتجات</option>
              <option value="available">متاح</option>
              <option value="out">نفد المخزون</option>
            </select>
          </label>
          <button
            className="purchase-order-reset"
            type="button"
            onClick={() => {
              setQuery("");
              setStockFilter("all");
              setMessage("");
            }}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>إعادة ضبط</span>
          </button>
        </div>

        <div className="inventory-product-grid">
          {visible.length === 0 ? (
            <div className="empty-state-panel">لا توجد منتجات مطابقة.</div>
          ) : (
            visible.map((product) => {
              const quantity = quantities[product.id];
              const validation = validateStockUpdate(quantity);
              const firstColor = product.colors[0];
              return (
                <article className="inventory-product-card" key={product.id}>
                  <div className="product-inline-summary">
                    <ProductThumb product={product} />
                    <div>
                      <strong>{product.nameAr}</strong>
                      <span>{product.sku}</span>
                      <span>
                        {firstColor.nameAr} / {firstColor.code}
                      </span>
                    </div>
                  </div>
                  <div className="inventory-context">
                    <span>سعر البيع: {formatIqd(product.sellingPrice)}</span>
                    <span>سعر الكلفة: {formatIqd(product.costPrice)}</span>
                  </div>
                  <span
                    className={`approved-status-badge ${
                      quantity > 0 ? "is-active" : "is-rejected"
                    }`}
                  >
                    {quantity > 0 ? "متاح" : "نفد المخزون"}
                  </span>
                  <label className="modal-field">
                    <span>الكمية المتاحة</span>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(event) =>
                        setQuantities((current) => ({
                          ...current,
                          [product.id]: Number(event.target.value),
                        }))
                      }
                    />
                  </label>
                  {!validation.valid ? (
                    <div className="validation-stack">
                      {validation.errors.map((error) => (
                        <span className="validation-error" key={error}>
                          {error}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
