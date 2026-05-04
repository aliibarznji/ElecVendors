"use client";

import { Pencil, Plus, RotateCcw, Save, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { deliveryPrices } from "./vendor-dashboard-data";

type Row = {
  province: string;
  small: number;
  large: number;
  freeRule: string;
};

export function DeliveryPricesContent() {
  const [rows, setRows] = useState<Row[]>(deliveryPrices);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const visible = useMemo(() => {
    const normalized = query.trim();
    return rows.filter((row) => !normalized || row.province.includes(normalized));
  }, [query, rows]);

  const update = (province: string, patch: Partial<Row>) =>
    setRows((current) =>
      current.map((row) => (row.province === province ? { ...row, ...patch } : row)),
    );

  const hasInvalid = rows.some((row) => row.small < 0 || row.large < 0 || row.large < row.small);

  return (
    <div className="delivery-prices-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>أسعار توصيل البائع</h1>
          <p className="dashboard-sub">
            تحديد أسعار التوصيل لكل محافظة للمنتجات الصغيرة والكبيرة وحالات التوصيل المجاني.
          </p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          disabled={hasInvalid}
          onClick={() => setMessage("تم حفظ أسعار التوصيل.")}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>حفظ الأسعار</span>
        </button>
      </header>

      {message ? <div className="success-banner">{message}</div> : null}
      {hasInvalid ? (
        <div className="warning-banner">
          تأكد أن الأسعار ليست سالبة وأن سعر المنتج الكبير لا يقل عن سعر المنتج الصغير.
        </div>
      ) : null}

      <section className="delivery-prices-card product-list-card">
        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder="بحث بالمحافظة"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            className="purchase-order-reset"
            type="button"
            onClick={() => {
              setQuery("");
              setMessage("");
            }}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>إعادة ضبط</span>
          </button>
          <button
            className="discount-create-button"
            type="button"
            onClick={() =>
              setRows((current) => [
                ...current,
                { province: "محافظة جديدة", small: 0, large: 0, freeRule: "" },
              ])
            }
          >
            <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
            <span>إضافة محافظة</span>
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>المحافظة</th>
                <th>منتجات صغيرة</th>
                <th>منتجات كبيرة</th>
                <th>قاعدة التوصيل المجاني</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const isEditing = editing === row.province;
                const invalid = row.small < 0 || row.large < 0 || row.large < row.small;
                return (
                  <tr className="product-list-data-row" key={row.province}>
                    <td>
                      {isEditing ? (
                        <input
                          className="edit-table-input"
                          value={row.province}
                          onChange={(event) => update(row.province, { province: event.target.value })}
                        />
                      ) : (
                        row.province
                      )}
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        value={row.small}
                        disabled={!isEditing}
                        onChange={(event) => update(row.province, { small: Number(event.target.value) })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        value={row.large}
                        disabled={!isEditing}
                        onChange={(event) => update(row.province, { large: Number(event.target.value) })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input delivery-rule-input"
                        value={row.freeRule}
                        disabled={!isEditing}
                        placeholder="مثال: مجاني فوق 150,000 د.ع"
                        onChange={(event) => update(row.province, { freeRule: event.target.value })}
                      />
                    </td>
                    <td>
                      <span className={`approved-status-badge ${invalid ? "is-rejected" : "is-active"}`}>
                        {invalid ? "يحتاج تصحيح" : row.freeRule ? "يتضمن مجاني" : "مدفوع"}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="row-action-btn"
                          type="button"
                          onClick={() => setEditing(isEditing ? null : row.province)}
                        >
                          <Pencil aria-hidden="true" size={14} strokeWidth={2.4} />
                          {isEditing ? "إنهاء" : "تعديل"}
                        </button>
                        <button
                          className="row-action-btn reject-btn"
                          type="button"
                          onClick={() => setRows((current) => current.filter((item) => item.province !== row.province))}
                        >
                          <Trash2 aria-hidden="true" size={14} strokeWidth={2.4} />
                          حذف
                        </button>
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
