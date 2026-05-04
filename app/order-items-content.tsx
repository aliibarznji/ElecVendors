"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Search,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import {
  filterOrders,
  formatIqd,
  getCancelledOrders,
  getMonthlyOrders,
  getMonthlySales,
  getNetSales,
  getProduct,
  orders,
  type OrderStatus,
  type VendorOrder,
} from "./vendor-dashboard-data";

const tabs: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "كل الطلبات" },
  { id: "new", label: "طلبات جديدة" },
  { id: "ready", label: "جاهز للشحن" },
  { id: "shipped", label: "تم الشحن" },
  { id: "delivered", label: "تم التسليم" },
];

const statusLabel: Record<OrderStatus, string> = {
  new: "جديد",
  ready: "جاهز للشحن",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const statusClass: Record<OrderStatus, string> = {
  new: "is-pending",
  ready: "is-active",
  shipped: "is-info",
  delivered: "is-completed",
  cancelled: "is-rejected",
};

function OrderStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <article className={`kpi-card kpi-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function ProductThumb({ order }: { order: VendorOrder }) {
  const product = getProduct(order.productId);
  return (
    <div
      className="sample-product-thumb"
      style={{ background: product?.imageTone }}
      aria-label={product?.nameAr ?? order.productId}
    >
      <span>{product?.brand.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export function OrderItemsContent() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("2026-05-01");
  const [to, setTo] = useState("2026-05-04");
  const [sort, setSort] = useState<"newest" | "oldest" | "amount">("newest");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterOrders(orders, activeTab, search, from, to, sort),
    [activeTab, from, search, sort, to],
  );

  return (
    <div className="order-items-content">
      <header className="page-title-row">
        <div>
          <h1>عناصر الطلبات</h1>
          <p className="dashboard-sub">
            متابعة عناصر الطلبات حسب الحالة مع السعر قبل وبعد العمولة وتفاصيل المنتج.
          </p>
        </div>
      </header>

      <section className="kpi-grid" aria-label="إحصائيات الطلبات الشهرية">
        <OrderStat label="عدد الطلبات الشهري" value={String(getMonthlyOrders())} tone="blue" />
        <OrderStat label="مبيعات الشهر" value={formatIqd(getMonthlySales())} tone="green" />
        <OrderStat label="صافي المبيعات" value={formatIqd(getNetSales(filtered))} tone="cyan" />
        <OrderStat label="الطلبات الملغية" value={String(getCancelledOrders())} tone="amber" />
      </section>

      <section className="order-items-card" aria-label="جدول الطلبات">
        <div className="bulk-tabs order-items-tabs">
          {tabs.map((tab) => (
            <button
              className={`bulk-tab${activeTab === tab.id ? " is-active" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder="بحث برقم الطلب أو SKU أو اسم العميل"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>من</span>
            <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label className="order-items-date">
            <span>إلى</span>
            <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
          <label className="order-items-date">
            <span>الترتيب</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="amount">الأعلى مبلغا</option>
            </select>
          </label>
          <button
            className="purchase-order-reset"
            type="button"
            onClick={() => {
              setSearch("");
              setFrom("");
              setTo("");
              setSort("newest");
              setActiveTab("all");
            }}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>إعادة ضبط</span>
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table order-items-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>وقت الطلب</th>
                <th>الصورة</th>
                <th>SKU</th>
                <th>اللون</th>
                <th>الكمية</th>
                <th>السعر بدون عمولة</th>
                <th>السعر مع العمولة</th>
                <th>الحالة</th>
                <th>تفاصيل المنتج</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-cell">
                    لا توجد طلبات مطابقة للفلاتر الحالية.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const product = getProduct(order.productId);
                  return (
                    <Fragment key={order.id}>
                      <tr className="product-list-data-row">
                        <td>{order.orderNumber}</td>
                        <td>{order.dateTime}</td>
                        <td>
                          <ProductThumb order={order} />
                        </td>
                        <td>{product?.sku}</td>
                        <td>{order.color}</td>
                        <td>{order.quantity}</td>
                        <td>{formatIqd(order.priceWithoutCommission)}</td>
                        <td>{formatIqd(order.priceWithCommission)}</td>
                        <td>
                          <span className={`approved-status-badge ${statusClass[order.status]}`}>
                            {statusLabel[order.status]}
                          </span>
                        </td>
                        <td>
                          <button
                            className="row-action-btn"
                            type="button"
                            onClick={() =>
                              setExpanded((current) =>
                                current === order.id ? null : order.id,
                              )
                            }
                          >
                            <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                            <span>عرض</span>
                          </button>
                        </td>
                      </tr>
                      {expanded === order.id ? (
                        <tr key={`${order.id}-detail`} className="row-details-row">
                          <td colSpan={10}>
                            <div className="row-details">
                              <div>
                                <span>المنتج</span>
                                <strong>{product?.nameAr}</strong>
                              </div>
                              <div>
                                <span>كود المنتج</span>
                                <strong>{product?.vendorCode}</strong>
                              </div>
                              <div>
                                <span>العميل</span>
                                <strong>{order.customerName}</strong>
                              </div>
                              <div>
                                <span>العنوان</span>
                                <strong>{order.customerAddress}</strong>
                              </div>
                              <div>
                                <span>الهاتف</span>
                                <strong>{order.customerPhone}</strong>
                              </div>
                              <div>
                                <span>الدفع</span>
                                <strong>{order.paymentMethod}</strong>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="purchase-order-pagination">
          <span>عدد العناصر: 20</span>
          <span>
            {filtered.length} من {orders.length}
          </span>
          <button type="button" aria-label="الصفحة السابقة" disabled>
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <button type="button" aria-label="الصفحة التالية" disabled>
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <ChevronDown aria-hidden="true" size={16} strokeWidth={2.1} />
        </div>
      </section>
    </div>
  );
}
