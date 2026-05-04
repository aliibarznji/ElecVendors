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
          <h1>Inventory Management</h1>
          <p className="dashboard-sub">
            This page controls inventory only. Prices are shown for context and are not edited here.
          </p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={() => setMessage("Valid inventory updates have been saved.")}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>Save Inventory</span>
        </button>
      </header>

      {message ? <div className="success-banner">{message}</div> : null}

      <section className="inventory-summary-strip" aria-label="Inventory Summary">
        <article className="inventory-summary-item inventory-blue">
          <span className="inventory-summary-icon">
            <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div>
            <p>Total Products</p>
            <strong>{products.length}</strong>
            <small>Vendor Products</small>
          </div>
        </article>
        <article className="inventory-summary-item inventory-green">
          <span className="inventory-summary-icon">
            <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div>
            <p>Available Products</p>
            <strong>{availableCount}</strong>
            <small>Quantity &gt; 0</small>
          </div>
        </article>
        <article className="inventory-summary-item inventory-orange">
          <span className="inventory-summary-icon">
            <AlertTriangle aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div>
            <p>Out of Stock</p>
            <strong>{products.length - availableCount}</strong>
            <small>Restock needed</small>
          </div>
        </article>
      </section>

      <section className="product-list-card inventory-card" aria-label="Update Inventory">
        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder="Search by name, code or color"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>Status</span>
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value as typeof stockFilter)}
            >
              <option value="all">All Products</option>
              <option value="available">Available</option>
              <option value="out">Out of Stock</option>
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
            <span>Reset</span>
          </button>
        </div>

        <div className="inventory-product-grid">
          {visible.length === 0 ? (
            <div className="empty-state-panel">No matching products.</div>
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
                    <span>Selling Price: {formatIqd(product.sellingPrice)}</span>
                    <span>Cost Price: {formatIqd(product.costPrice)}</span>
                  </div>
                  <span
                    className={`approved-status-badge ${
                      quantity > 0 ? "is-active" : "is-rejected"
                    }`}
                  >
                    {quantity > 0 ? "Available" : "Out of Stock"}
                  </span>
                  <label className="modal-field">
                    <span>Available Quantity</span>
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
