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
import { useMemo, useState } from "react";
import {
  filterProducts,
  formatIqd,
  products as initialProducts,
  type ProductStatus,
  type VendorProduct,
} from "./vendor-dashboard-data";

const statusTabs: { id: ProductStatus | "all"; label: string }[] = [
  { id: "all", label: "كل المنتجات" },
  { id: "published", label: "منشورة" },
  { id: "unpublished", label: "غير منشورة" },
  { id: "review", label: "بانتظار المراجعة" },
];

const statusLabel: Record<ProductStatus, string> = {
  published: "منشور",
  unpublished: "غير منشور",
  review: "بانتظار المراجعة",
};

const statusClass: Record<ProductStatus, string> = {
  published: "is-active",
  unpublished: "is-completed",
  review: "is-pending",
};

function ProductThumb({ product }: { product: VendorProduct }) {
  return (
    <div
      className="sample-product-thumb product-image-thumb"
      style={{ background: product.imageTone }}
      aria-label={product.nameAr}
    >
      <span>{product.brand.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

function ProductSummary({ products }: { products: VendorProduct[] }) {
  const published = products.filter((product) => product.status === "published").length;
  const review = products.filter((product) => product.status === "review").length;
  const outOfStock = products.filter((product) => product.quantity === 0).length;

  return (
    <section className="inventory-summary-strip" aria-label="ملخص المنتجات">
      <article className="inventory-summary-item inventory-blue">
        <span className="inventory-summary-icon">
          <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
        </span>
        <div>
          <p>إجمالي المنتجات</p>
          <strong>{products.length}</strong>
          <small>مرجع المورد والمنتجات المرتبطة به</small>
        </div>
      </article>
      <article className="inventory-summary-item inventory-green">
        <span className="inventory-summary-icon">
          <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
        </span>
        <div>
          <p>منشورة</p>
          <strong>{published}</strong>
          <small>ظاهرة للعملاء حاليا</small>
        </div>
      </article>
      <article className="inventory-summary-item inventory-amber">
        <span className="inventory-summary-icon">
          <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
        </span>
        <div>
          <p>قيد المراجعة</p>
          <strong>{review}</strong>
          <small>بانتظار فريق البيانات</small>
        </div>
      </article>
      <article className="inventory-summary-item inventory-orange">
        <span className="inventory-summary-icon">
          <PackageCheck aria-hidden="true" size={18} strokeWidth={2.3} />
        </span>
        <div>
          <p>نفد المخزون</p>
          <strong>{outOfStock}</strong>
          <small>تحتاج تحديث كمية</small>
        </div>
      </article>
    </section>
  );
}

export function ProductListContent() {
  const [items, setItems] = useState(initialProducts);
  const [activeStatus, setActiveStatus] = useState<ProductStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<VendorProduct | null>(null);

  const visible = useMemo(
    () => filterProducts(items, activeStatus, query),
    [items, activeStatus, query],
  );

  return (
    <div className="product-list-content">
      <header className="page-title-row">
        <div>
          <h1>إدارة المنتجات</h1>
          <p className="dashboard-sub">
            كل منتجات المورد مع الأسعار، الأكواد، المخزون، الألوان، وحالة النشر.
          </p>
        </div>
        <Link className="discount-create-button" href="/products/add">
          <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>إضافة منتج</span>
        </Link>
      </header>

      <ProductSummary products={items} />

      <section className="product-list-card" aria-label="قائمة المنتجات">
        <div className="product-status-tabs" role="tablist" aria-label="حالة المنتج">
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
              placeholder="بحث بالاسم أو الباركود أو SKU"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="product-list-filter">
            <span>العلامة التجارية</span>
            <select className="product-list-search" defaultValue="all">
              <option value="all">كل العلامات</option>
              {[...new Set(items.map((product) => product.brand))].map((brand) => (
                <option key={brand}>{brand}</option>
              ))}
            </select>
          </label>
          <label className="product-list-filter">
            <span>التصنيف</span>
            <select className="product-list-search" defaultValue="all">
              <option value="all">كل التصنيفات</option>
              {[...new Set(items.map((product) => product.categoryLevels[0]))].map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="product-list-table-wrap">
          <table className="product-list-table product-management-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>المنتج</th>
                <th>السعر</th>
                <th>الكلفة</th>
                <th>الوصف</th>
                <th>الكمية</th>
                <th>الأكواد</th>
                <th>التصنيف</th>
                <th>الألوان</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={12} className="empty-cell">
                    لا توجد منتجات مطابقة للبحث أو الفلتر الحالي.
                  </td>
                </tr>
              ) : (
                visible.map((product) => (
                  <tr className="product-list-data-row" key={product.id}>
                    <td>
                      <ProductThumb product={product} />
                    </td>
                    <td className="product-name-cell">
                      <strong>{product.nameAr}</strong>
                      <span>{product.nameEn}</span>
                    </td>
                    <td>{formatIqd(product.sellingPrice)}</td>
                    <td>{formatIqd(product.costPrice)}</td>
                    <td>{product.description}</td>
                    <td>
                      <span
                        className={`approved-status-badge ${
                          product.quantity > 0 ? "is-active" : "is-rejected"
                        }`}
                      >
                        {product.quantity > 0 ? `${product.quantity} متاح` : "نفد"}
                      </span>
                    </td>
                    <td>
                      <div className="stacked-meta">
                        <span>SKU: {product.sku}</span>
                        <span>Barcode: {product.barcode}</span>
                        <span>Code: {product.vendorCode}</span>
                      </div>
                    </td>
                    <td>
                      <div className="stacked-meta">
                        <span>{product.brand}</span>
                        <span>{product.categoryLevels.join(" / ")}</span>
                      </div>
                    </td>
                    <td>
                      <div className="color-swatch-row">
                        {product.colors.map((color) => (
                          <span key={color.code} title={color.nameAr}>
                            <i style={{ background: color.code }} />
                            {color.nameAr}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{product.createdAt}</td>
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
                          title="عرض التفاصيل"
                          onClick={() => setSelected(product)}
                        >
                          <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                        </button>
                        <Link
                          className="row-action-btn"
                          href="/products/add"
                          title="تعديل المنتج"
                        >
                          <Pencil aria-hidden="true" size={14} strokeWidth={2.4} />
                        </Link>
                        <button className="row-action-btn" type="button" title="رمز QR">
                          <QrCode aria-hidden="true" size={14} strokeWidth={2.4} />
                        </button>
                        <button className="row-action-btn" type="button" title="التقسيط">
                          <WalletCards aria-hidden="true" size={14} strokeWidth={2.4} />
                        </button>
                        <button
                          className="row-action-btn reject-btn"
                          type="button"
                          title="حذف"
                          onClick={() =>
                            setItems((current) => current.filter((item) => item.id !== product.id))
                          }
                        >
                          <Trash2 aria-hidden="true" size={14} strokeWidth={2.4} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
                <h3>{selected.nameAr}</h3>
                <p className="modal-sub">{selected.sku}</p>
              </div>
              <button
                className="modal-close"
                type="button"
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
              >
                ×
              </button>
            </header>
            <div className="modal-body product-detail-modal">
              <ProductThumb product={selected} />
              <div className="stacked-meta">
                <strong>{selected.highlights}</strong>
                <span>{selected.description}</span>
                <span>كلمات مفتاحية: {selected.keywords.join(", ")}</span>
                <span>منتج كبير: {selected.largeProduct ? "نعم" : "لا"}</span>
                <span>خطة الخصم: {selected.discountPlanStatus}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
