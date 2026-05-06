"use client";

import {
  Eye,
  PackageCheck,
  Pencil,
  Plus,
  QrCode,
  Search,
  Trash2,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import { formatIqd, totalProductQty, type ApiProduct } from "./lib/utils";

type ProductStatus = "published" | "unpublished" | "review";

const statusClass: Record<ProductStatus, string> = {
  published: "is-active",
  unpublished: "is-completed",
  review: "is-pending",
};

function ProductThumb({ product }: { product: ApiProduct }) {
  const { lang } = useLang();
  const name = lang === "ar" ? product.nameAr : product.nameEn;
  if (product.mainImage) {
    return <img className="sample-product-thumb product-image-thumb" src={product.mainImage} alt={name} />;
  }
  return (
    <div
      className="sample-product-thumb product-image-thumb"
      style={{ background: product.imageTone }}
      aria-label={name}
    >
      <span>{product.brand.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

function ProductSummary({ products }: { products: ApiProduct[] }) {
  const { t } = useLang();
  const published = products.filter((product) => product.status === "published").length;
  const review = products.filter((product) => product.status === "review").length;
  const outOfStock = products.filter((product) => totalProductQty(product.colors) === 0).length;

  return (
    <section className="inventory-summary-strip" aria-label="Product Summary">
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
          <p>{t("publishedCount")}</p>
          <strong>{published}</strong>
          <small>{t("publishedSub")}</small>
        </div>
      </article>
      <article className="inventory-summary-item inventory-amber">
        <span className="inventory-summary-icon">
          <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
        </span>
        <div>
          <p>{t("underReview")}</p>
          <strong>{review}</strong>
          <small>{t("underReviewSub")}</small>
        </div>
      </article>
      <article className="inventory-summary-item inventory-orange">
        <span className="inventory-summary-icon">
          <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
        </span>
        <div>
          <p>{t("outOfStock")}</p>
          <strong>{outOfStock}</strong>
          <small>{t("outOfStockSub")}</small>
        </div>
      </article>
    </section>
  );
}

export function ProductListContent() {
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<ProductStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<ApiProduct | null>(null);
  const { t, lang } = useLang();

  useEffect(() => {
    setLoading(true);
    api.products
      .list({
        status: activeStatus === "all" ? undefined : activeStatus,
        search: query || undefined,
        limit: 100,
      })
      .then((res) => {
        setItems(res.items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeStatus, query]);

  const statusLabel: Record<ProductStatus, string> = {
    published: t("published"),
    unpublished: t("unpublished"),
    review: t("awaitingReview"),
  };

  const statusTabs = [
    { id: "all" as const, label: t("allProducts") },
    { id: "published" as const, label: t("published") },
    { id: "unpublished" as const, label: t("unpublished") },
    { id: "review" as const, label: t("underReview") },
  ];

  const visible = useMemo(
    () =>
      items
        .filter((p) => brandFilter === "all" || p.brand === brandFilter)
        .filter((p) => categoryFilter === "all" || p.categoryLevel1 === categoryFilter),
    [items, brandFilter, categoryFilter],
  );

  const handleDelete = (id: string) => {
    api.products.delete(id).catch(() => {});
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="product-list-content">
      <header className="page-title-row">
        <div>
          <h1>{t("productManagement")}</h1>
          <p className="dashboard-sub">{t("productManagementSub")}</p>
        </div>
        <Link className="discount-create-button" href="/products/add">
          <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>{t("addProduct")}</span>
        </Link>
      </header>

      <ProductSummary products={items} />

      <section className="product-list-card" aria-label="Product List">
        <div className="product-status-tabs" role="tablist" aria-label="Product Status">
          {statusTabs.map((tab) => (
            <button
              className={`bulk-tab${activeStatus === tab.id ? " is-active" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => setActiveStatus(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="product-list-filters product-management-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder={t("searchProducts")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="product-list-filter">
            <span>{t("brand")}</span>
            <select
              className="product-list-search"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="all">{t("allBrands")}</option>
              {[...new Set(items.map((product) => product.brand))].map((brand) => (
                <option key={brand}>{brand}</option>
              ))}
            </select>
          </label>
          <label className="product-list-filter">
            <span>{t("category")}</span>
            <select
              className="product-list-search"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">{t("allCategories")}</option>
              {[...new Set(items.map((product) => product.categoryLevel1))].map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="product-list-table-wrap">
          <table className="product-list-table product-management-table">
            <thead>
              <tr>
                <th>{t("colImage")}</th>
                <th>{t("colProduct")}</th>
                <th>{t("colSellingPrice")}</th>
                <th>{t("colCostPrice")}</th>
                <th>{t("colDescription")}</th>
                <th>{t("colQuantity")}</th>
                <th>{t("colCodes")}</th>
                <th>{t("colCategory")}</th>
                <th>{t("colColors")}</th>
                <th>{t("colDate")}</th>
                <th>{t("colStatus")}</th>
                <th>{t("colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="empty-cell">
                    Loading…
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={12} className="empty-cell">
                    {t("noProductsMatch")}
                  </td>
                </tr>
              ) : (
                visible.map((product) => {
                  const qty = totalProductQty(product.colors);
                  return (
                    <tr className="product-list-data-row" key={product.id}>
                      <td>
                        <ProductThumb product={product} />
                      </td>
                      <td className="product-name-cell">
                        <strong>{lang === "ar" ? product.nameAr : product.nameEn}</strong>
                        {lang === "ar" && <span>{product.nameEn}</span>}
                      </td>
                      <td>{formatIqd(product.sellingPrice)}</td>
                      <td>{formatIqd(product.costPrice)}</td>
                      <td>{product.description}</td>
                      <td>
                        <span
                          className={`approved-status-badge ${
                            qty > 0 ? "is-active" : "is-rejected"
                          }`}
                        >
                          {qty > 0 ? `${qty} ${t("available")}` : t("outOfStock")}
                        </span>
                      </td>
                      <td>
                        <div className="stacked-meta">
                          <span>{t("skuLabel")}: {product.sku}</span>
                          <span>{t("barcodeLabel")}: {product.barcode}</span>
                          <span>{t("codeLabel")}: {product.vendorCode}</span>
                        </div>
                      </td>
                      <td>
                        <div className="stacked-meta">
                          <span>{product.brand}</span>
                          <span>
                            {[product.categoryLevel1, product.categoryLevel2, product.categoryLevel3, product.categoryLevel4]
                              .filter(Boolean)
                              .join(" / ")}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="color-swatch-row">
                          {product.colors.map((color) => (
                            <span key={color.code} title={lang === "ar" ? color.nameAr : color.nameEn}>
                              <i style={{ background: color.code }} />
                              {lang === "ar" ? color.nameAr : color.nameEn}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{product.createdAt.slice(0, 10)}</td>
                      <td>
                        <span className={`approved-status-badge ${statusClass[product.status]}`}>
                          {statusLabel[product.status]}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="row-action-btn"
                            type="button"
                            title={t("viewDetails")}
                            onClick={() => setSelected(product)}
                          >
                            <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                          </button>
                          <Link
                            className="row-action-btn"
                            href={`/products/add?id=${product.id}`}
                            title={t("editProduct")}
                          >
                            <Pencil aria-hidden="true" size={14} strokeWidth={2.4} />
                          </Link>
                          <button className="row-action-btn" type="button" title={t("qrCode")} disabled>
                            <QrCode aria-hidden="true" size={14} strokeWidth={2.4} />
                          </button>
                          <button className="row-action-btn" type="button" title={t("installments")} disabled>
                            <WalletCards aria-hidden="true" size={14} strokeWidth={2.4} />
                          </button>
                          <button
                            className="row-action-btn reject-btn"
                            type="button"
                            title={t("delete")}
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 aria-hidden="true" size={14} strokeWidth={2.4} />
                          </button>
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

      {selected ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card modal-wide">
            <header className="modal-header">
              <div>
                <h3>{lang === "ar" ? selected.nameAr : selected.nameEn}</h3>
                <p className="modal-sub">{selected.sku}</p>
              </div>
              <button
                className="modal-close"
                type="button"
                onClick={() => setSelected(null)}
                aria-label={t("close")}
              >
                ×
              </button>
            </header>
            <div className="modal-body product-detail-modal">
              <ProductThumb product={selected} />
              <div className="stacked-meta">
                <strong>{selected.highlights}</strong>
                <span>{selected.description}</span>
                <span>{t("keywords")}: {selected.keywords.join(", ")}</span>
                <span>{t("largeProduct")}: {selected.largeProduct ? "Yes" : "No"}</span>
                <span>{t("discountPlan")}: {selected.discountPlanStatus}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
