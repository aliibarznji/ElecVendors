"use client";

import { Eye, Printer, RotateCcw } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import {
  filterSettlements,
  formatIqd,
  getProduct,
  orders,
  settlementAmount,
  settlements,
} from "./vendor-dashboard-data";

export function SettlementsContent() {
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const visible = useMemo(
    () => filterSettlements(settlements, date, paymentMethod),
    [date, paymentMethod],
  );
  const paid = settlements
    .filter((settlement) => settlement.status === "paid")
    .reduce((sum, settlement) => sum + settlementAmount(settlement), 0);
  const remaining = settlements
    .filter((settlement) => settlement.status === "remaining")
    .reduce((sum, settlement) => sum + settlementAmount(settlement), 0);

  return (
    <div className="settlements-content account-statement-content">
      <header className="page-title-row">
        <div>
          <h1>التسويات</h1>
          <p className="dashboard-sub">
            متابعة المبيعات المدفوعة والمتبقية مع تفاصيل الفاتورة للطباعة أو العرض.
          </p>
        </div>
      </header>

      <section className="statement-summary-grid" aria-label="ملخص التسويات">
        <article className="statement-summary-card statement-summary-green">
          <p>إجمالي المبيعات المدفوعة</p>
          <strong>{formatIqd(paid)}</strong>
        </article>
        <article className="statement-summary-card statement-summary-blue">
          <p>إجمالي المبيعات المتبقية</p>
          <strong>{formatIqd(remaining)}</strong>
        </article>
      </section>

      <section className="account-statement-card">
        <div className="statement-topline">
          <p>فلاتر التسوية حسب التاريخ وطريقة الدفع.</p>
          <button
            className="statement-reset"
            type="button"
            onClick={() => {
              setDate("");
              setPaymentMethod("all");
              setOpen(null);
            }}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
            إعادة ضبط
          </button>
        </div>

        <div className="statement-filter-row">
          <label className="order-items-date">
            <span>تاريخ التسوية</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="order-items-date">
            <span>طريقة الدفع</span>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="all">كل الطرق</option>
              {[...new Set(settlements.map((settlement) => settlement.paymentMethod))].map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="statement-table-wrap">
          <table className="statement-table purchase-order-table">
            <thead>
              <tr>
                <th>تاريخ التسوية</th>
                <th>رقم الفاتورة</th>
                <th>عدد المنتجات</th>
                <th>مبلغ التسوية</th>
                <th>طريقة الدفع</th>
                <th>الحالة</th>
                <th>عرض</th>
                <th>طباعة</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    لا توجد تسويات مطابقة.
                  </td>
                </tr>
              ) : (
                visible.map((settlement) => (
                  <Fragment key={settlement.id}>
                    <tr className="product-list-data-row">
                      <td>{settlement.date}</td>
                      <td>{settlement.settlementNumber}</td>
                      <td>{settlement.itemIds.length}</td>
                      <td>{formatIqd(settlementAmount(settlement))}</td>
                      <td>{settlement.paymentMethod}</td>
                      <td>
                        <span
                          className={`approved-status-badge ${
                            settlement.status === "paid" ? "is-active" : "is-pending"
                          }`}
                        >
                          {settlement.status === "paid" ? "مدفوعة" : "متبقية"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="row-action-btn"
                          type="button"
                          onClick={() =>
                            setOpen((current) =>
                              current === settlement.id ? null : settlement.id,
                            )
                          }
                        >
                          <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                          عرض
                        </button>
                      </td>
                      <td>
                        <button className="row-action-btn" type="button">
                          <Printer aria-hidden="true" size={14} strokeWidth={2.4} />
                          طباعة
                        </button>
                      </td>
                    </tr>
                    {open === settlement.id ? (
                      <tr key={`${settlement.id}-detail`} className="row-details-row">
                        <td colSpan={8}>
                          <div className="purchase-order-table-wrap">
                            <table className="purchase-order-table inner-table">
                              <thead>
                                <tr>
                                  <th>الصورة</th>
                                  <th>المنتج</th>
                                  <th>كود المنتج</th>
                                  <th>رقم الطلب</th>
                                  <th>الحالة</th>
                                  <th>التاريخ</th>
                                  <th>سعر البيع</th>
                                  <th>الكلفة</th>
                                  <th>تعويض/خصم</th>
                                </tr>
                              </thead>
                              <tbody>
                                {settlement.itemIds.map((orderId) => {
                                  const order = orders.find((item) => item.id === orderId);
                                  const product = order ? getProduct(order.productId) : undefined;
                                  if (!order || !product) return null;
                                  return (
                                    <tr key={orderId}>
                                      <td>
                                        <div className="sample-product-thumb" style={{ background: product.imageTone }}>
                                          <span>{product.brand.slice(0, 2).toUpperCase()}</span>
                                        </div>
                                      </td>
                                      <td>{product.nameAr}</td>
                                      <td>{product.sku}</td>
                                      <td>{order.orderNumber}</td>
                                      <td>{order.deliveryStatus}</td>
                                      <td>{order.dateTime}</td>
                                      <td>{formatIqd(order.priceWithCommission)}</td>
                                      <td>{formatIqd(product.costPrice)}</td>
                                      <td>{formatIqd(order.priceWithCommission - order.priceWithoutCommission)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
