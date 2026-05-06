"use client";

import { AlertTriangle, PackageCheck, RotateCcw, Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import { formatIqd, totalProductQty, type ApiProduct } from "./lib/utils";

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

export function InventoryContent() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "available" | "out">("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const { t, lang } = useLang();

  useEffect(() => {
    setLoading(true);
    api.products
      .list({ limit: 100 })
      .then((res) => {
        setProducts(res.items);
        setQuantities(
          Object.fromEntries(
            res.items.map((product) => [product.id, totalProductQty(product.colors)]),
          ),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const quantity = quantities[product.id] ?? 0;
      if (stockFilter === "available" && quantity <= 0) return false;
      if (stockFilter === "out" && quantity > 0) return false;
      if (!normalized) return true;
      return [product.nameAr, product.nameEn, product.sku, product.vendorCode, product.brand]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [query, quantities, stockFilter, products]);

  const availableCount = products.filter((product) => (quantities[product.id] ?? 0) > 0).length;

  const handleSave = () => {
    Promise.all(
      products.map((product) => {
        const newQty = quantities[product.id] ?? 0;
        return api.products.update(product.id, {
          ...product,
          colors: product.colors.map((c) => ({
            ...c,
            sizes: c.sizes.map((s) => ({ ...s, quantity: newQty })),
          })),
        });
      }),
    )
      .then(() => setMessage(t("inventorySaved")))
      .catch(() => setMessage(t("inventorySaved")));
  };

  return (
    <div className="inventory-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("inventoryManagement")}</h1>
          <p className="dashboard-sub">{t("inventoryManagementSub")}</p>
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

      {message ? <div className="success-banner">{message}</div> : null}

      <section className="inventory-summary-strip" aria-label="Inventory Summary">
        <article className="inventory-summary-item inventory-blue">
          <span className="inventory-summary-icon">
            <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div>
            <p>{t("totalProducts")}</p>
            <strong>{products.length}</strong>
            <small>{t("totalProductsSub")}</small>
          </div>
        </article>
        <article className="inventory-summary-item inventory-green">
          <span className="inventory-summary-icon">
            <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div>
            <p>{t("inStock")}</p>
            <strong>{availableCount}</strong>
            <small>{t("publishedSub")}</small>
          </div>
        </article>
        <article className="inventory-summary-item inventory-orange">
          <span className="inventory-summary-icon">
            <AlertTriangle aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div>
            <p>{t("outOfStock")}</p>
            <strong>{products.length - availableCount}</strong>
            <small>{t("outOfStockSub")}</small>
          </div>
        </article>
      </section>

      <section className="product-list-card inventory-card" aria-label="Update Inventory">
        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder={t("searchInventory")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>{t("status")}</span>
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value as typeof stockFilter)}
            >
              <option value="all">{t("allProducts")}</option>
              <option value="available">{t("inStock")}</option>
              <option value="out">{t("outOfStock")}</option>
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
            <span>{t("reset")}</span>
          </button>
        </div>

        <div className="inventory-product-grid">
          {loading ? (
            <div className="empty-state-panel">Loading…</div>
          ) : visible.length === 0 ? (
            <div className="empty-state-panel">{t("noInventoryMatch")}</div>
          ) : (
            visible.map((product) => {
              const quantity = quantities[product.id] ?? 0;
              const firstColor = product.colors[0];
              return (
                <article className="inventory-product-card" key={product.id}>
                  <div className="product-inline-summary">
                    <ProductThumb product={product} />
                    <div>
                      <strong>{lang === "ar" ? product.nameAr : product.nameEn}</strong>
                      <span>{product.sku}</span>
                      {firstColor ? (
                        <span>
                          {lang === "ar" ? firstColor.nameAr : firstColor.nameEn} / {firstColor.code}
                        </span>
                      ) : null}
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
                    {quantity > 0 ? t("inStock") : t("outOfStock")}
                  </span>
                  <label className="modal-field">
                    <span>{t("quantityColumn")}</span>
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
                  {quantity < 0 ? (
                    <div className="validation-stack">
                      <span className="validation-error">Quantity cannot be negative</span>
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
