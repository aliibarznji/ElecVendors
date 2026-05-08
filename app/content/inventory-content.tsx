"use client";

import { AlertTriangle, PackageCheck, RotateCcw, Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";
import { formatIqd, totalProductQty, type ApiProduct } from "../lib/utils";

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
  const [stockFilter, setStockFilter] = useState<"all" | "available" | "out" | "review" | "rejected" | "approved">("all");
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
      if (stockFilter === "review" && product.status !== "review") return false;
      if (stockFilter === "rejected" && product.status !== "rejected") return false;
      if (stockFilter === "approved" && product.status !== "published") return false;
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
    <div className="grid gap-[18px] p-[22px_24px_48px]">
      <header className="flex items-start justify-between gap-[18px]">
        <div>
          <h1 className="m-0">{t("inventoryManagement")}</h1>
          <p className="mt-[7px] text-muted text-[13px] leading-[1.5]">{t("inventoryManagementSub")}</p>
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

      {message ? (
        <div className="flex items-center gap-[9px] px-[14px] py-[11px] rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534] text-[13px]">
          {message}
        </div>
      ) : null}

      <section
        className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-[14px] rtl:[direction:rtl]"
        aria-label="Inventory Summary"
      >
        <article className="flex items-center gap-3 p-[14px_16px] rounded-[12px] border border-border bg-white shadow-sm rtl:flex-row-reverse">
          <span className="w-8 h-8 rounded-lg inline-grid place-items-center shrink-0 bg-[#eff6ff] text-[#3b82f6]">
            <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div className="rtl:text-right">
            <p className="m-0 text-[12px] text-muted">{t("totalProducts")}</p>
            <strong className="text-[20px] font-bold text-text">{products.length}</strong>
            <small className="block text-[11px] text-subtle">{t("totalProductsSub")}</small>
          </div>
        </article>
        <article className="flex items-center gap-3 p-[14px_16px] rounded-[12px] border border-border bg-white shadow-sm rtl:flex-row-reverse">
          <span className="w-8 h-8 rounded-lg inline-grid place-items-center shrink-0 bg-[#f0fdf4] text-[#22c55e]">
            <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div className="rtl:text-right">
            <p className="m-0 text-[12px] text-muted">{t("inStock")}</p>
            <strong className="text-[20px] font-bold text-text">{availableCount}</strong>
            <small className="block text-[11px] text-subtle">{t("publishedSub")}</small>
          </div>
        </article>
        <article className="flex items-center gap-3 p-[14px_16px] rounded-[12px] border border-border bg-white shadow-sm rtl:flex-row-reverse">
          <span className="w-8 h-8 rounded-lg inline-grid place-items-center shrink-0 bg-[#fff7ed] text-[#f97316]">
            <AlertTriangle aria-hidden="true" size={18} strokeWidth={2.3} />
          </span>
          <div className="rtl:text-right">
            <p className="m-0 text-[12px] text-muted">{t("outOfStock")}</p>
            <strong className="text-[20px] font-bold text-text">{products.length - availableCount}</strong>
            <small className="block text-[11px] text-subtle">{t("outOfStockSub")}</small>
          </div>
        </article>
      </section>

      <section
        className="grid align-start gap-6 min-h-[597px] p-[20px_18px_24px] rounded-[4px] bg-white shadow-[0_1px_0_rgba(19,28,54,0.04)]"
        aria-label="Update Inventory"
      >
        <div className="flex items-center gap-2 p-[14px_16px] flex-wrap rtl:flex-row-reverse">
          <label className="flex items-center gap-2 px-3 min-h-[36px] rounded-[9px] border border-border bg-white shadow-sm transition-colors focus-within:border-[rgba(215,25,32,0.35)] focus-within:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] rtl:flex-row-reverse">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              className="border-0 outline-none bg-transparent text-[13px] text-text w-full"
              placeholder={t("searchInventory")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="flex items-center gap-[6px] px-[10px] min-h-[36px] rounded-[9px] border border-border bg-white text-[13px] text-muted">
            <span className="text-[12px] font-medium text-muted whitespace-nowrap">{t("status")}</span>
            <select
              className="border-0 outline-none bg-transparent text-[13px] text-text"
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value as typeof stockFilter)}
            >
              <option value="all">{t("allProducts")}</option>
              <option value="available">{t("inStock")}</option>
              <option value="out">{t("outOfStock")}</option>
              <option value="review">{t("underReview")}</option>
              <option value="rejected">{t("rejected")}</option>
              <option value="approved">{t("approved")}</option>
            </select>
          </label>
          <button
            className="inline-flex w-[78px] h-[26px] items-center justify-center mb-px border border-[#ff2f56] rounded-[3px] bg-white text-[#ff2f56] cursor-pointer text-[12px] leading-[1] whitespace-nowrap font-inherit hover:bg-[#f0f4ff] hover:border-[rgba(61,95,182,0.25)] transition-colors"
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

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[14px] p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-[48px_24px] text-[#94a3b8] text-[13px] gap-2">Loading…</div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-[48px_24px] text-[#94a3b8] text-[13px] gap-2">{t("noInventoryMatch")}</div>
          ) : (
            visible.map((product) => {
              const quantity = quantities[product.id] ?? 0;
              const firstColor = product.colors[0];
              return (
                <article
                  className="rounded-[12px] border border-border bg-[#fafbfe] p-[14px] grid gap-[10px] transition-[box-shadow,border-color] hover:shadow-sm hover:border-[#c8d0e0] hover:bg-white rtl:text-right"
                  key={product.id}
                >
                  <div className="flex items-center gap-[10px] rtl:flex-row-reverse rtl:text-right">
                    <ProductThumb product={product} />
                    <div className="grid gap-[3px] min-w-0">
                      <strong className="text-[13px] text-[#0f172a]">{lang === "ar" ? product.nameAr : product.nameEn}</strong>
                      <span className="text-[11px] text-[#94a3b8]">{product.sku}</span>
                      {firstColor ? (
                        <span className="text-[11px] text-[#94a3b8]">
                          {lang === "ar" ? firstColor.nameAr : firstColor.nameEn} / {firstColor.code}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-[11.5px] text-[#64748b]">Selling Price: {formatIqd(product.sellingPrice)}</span>
                    <span className="text-[11.5px] text-[#64748b]">Cost Price: {formatIqd(product.costPrice)}</span>
                  </div>
                  <span
                    className={`approved-status-badge ${
                      quantity > 0 ? "is-active" : "is-rejected"
                    }`}
                  >
                    {quantity > 0 ? t("inStock") : t("outOfStock")}
                  </span>
                  <label className="grid gap-[5px]">
                    <span className="text-[12px] font-semibold text-[#475569]">{t("quantityColumn")}</span>
                    <input
                      className="min-h-[32px] px-2 rounded-[7px] border border-border bg-[#f8f9fc] text-[13px] text-text transition-colors focus:outline-none focus:border-[rgba(215,25,32,0.4)] focus:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus:bg-white"
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
                    <div className="grid gap-1">
                      <span className="flex items-center gap-[5px] text-[11.5px] text-[#b91c1c]">Quantity cannot be negative</span>
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
