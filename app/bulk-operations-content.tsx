"use client";

import { CheckCircle2, Download, FileSpreadsheet, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { products, validateBulkUpdateRow } from "./vendor-dashboard-data";

type Mode = "prices" | "stock";

const steps = [
  "تحميل ملف المنتجات الحالي",
  "رفع الملف بعد التعديل",
  "مراجعة الأخطاء والتحذيرات",
  "تطبيق التحديثات",
];

export function BulkOperationsContent() {
  const [mode, setMode] = useState<Mode>("prices");
  const [uploaded, setUploaded] = useState(false);
  const [applied, setApplied] = useState(false);

  const sampleRows = useMemo(
    () =>
      mode === "prices"
        ? [
            {
              sku: products[0].sku,
              sellingPrice: products[0].sellingPrice,
              costPrice: products[0].costPrice,
            },
            {
              sku: "new-sku-not-allowed",
              sellingPrice: 20000,
              costPrice: 25000,
              codeChanged: true,
            },
          ]
        : [
            { sku: products[0].sku, quantity: 12 },
            { sku: products[1].sku, quantity: -3 },
          ],
    [mode],
  );

  const validation = sampleRows.map((row) => validateBulkUpdateRow(row, mode));
  const hasErrors = validation.some((result) => !result.valid);

  return (
    <div className="bulk-content">
      <header className="page-title-row">
        <div>
          <h1>تحديثات المنتجات</h1>
          <p className="dashboard-sub">
            بوابة CSV/XLSX لتحديث الأسعار أو المخزون فقط بدون إنشاء منتجات جديدة.
          </p>
        </div>
      </header>

      <section className="bulk-card csv-portal-card">
        <div className="bulk-tabs">
          <button
            className={`bulk-tab${mode === "prices" ? " is-active" : ""}`}
            type="button"
            onClick={() => {
              setMode("prices");
              setUploaded(false);
              setApplied(false);
            }}
          >
            تحديث الأسعار
          </button>
          <button
            className={`bulk-tab${mode === "stock" ? " is-active" : ""}`}
            type="button"
            onClick={() => {
              setMode("stock");
              setUploaded(false);
              setApplied(false);
            }}
          >
            تحديث المخزون
          </button>
        </div>

        <div className="bulk-tab-body">
          <div className="warning-banner">
            لا ترفع منتجات جديدة من هذه الصفحة، ولا تغير الأعمدة المحمية مثل اسم المنتج،
            SKU، الباركود، أو كود المنتج. هذه البوابة للتحديث فقط.
          </div>

          <ol className="bulk-steps csv-steps">
            {steps.map((step, index) => (
              <li key={step}>
                <span>{step}</span>
                {index === 0 ? (
                  <button className="bulk-export-button" type="button">
                    <Download aria-hidden="true" size={16} strokeWidth={2.4} />
                    تحميل ملف المنتجات الحالي
                  </button>
                ) : null}
                {index === 1 ? (
                  <button
                    className="bulk-dropzone csv-upload-zone"
                    type="button"
                    onClick={() => setUploaded(true)}
                  >
                    <UploadCloud aria-hidden="true" size={24} strokeWidth={2.3} />
                    <span>{uploaded ? "تم رفع الملف التجريبي" : "اضغط أو اسحب ملف CSV/XLSX هنا"}</span>
                  </button>
                ) : null}
                {index === 2 && uploaded ? (
                  <div className="validation-review">
                    <table className="purchase-order-table">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>النتيجة</th>
                          <th>الأخطاء / التحذيرات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleRows.map((row, rowIndex) => (
                          <tr key={row.sku}>
                            <td>{row.sku}</td>
                            <td>
                              <span
                                className={`approved-status-badge ${
                                  validation[rowIndex].valid ? "is-active" : "is-rejected"
                                }`}
                              >
                                {validation[rowIndex].valid ? "صالح" : "يحتاج تصحيح"}
                              </span>
                            </td>
                            <td>
                              <div className="validation-stack">
                                {[
                                  ...validation[rowIndex].errors,
                                  ...validation[rowIndex].warnings,
                                ].map((message) => (
                                  <span key={message}>{message}</span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
                {index === 3 && uploaded ? (
                  <button
                    className="discount-create-button"
                    type="button"
                    disabled={hasErrors}
                    onClick={() => setApplied(true)}
                  >
                    <FileSpreadsheet aria-hidden="true" size={16} strokeWidth={2.4} />
                    <span>تطبيق التحديثات</span>
                  </button>
                ) : null}
              </li>
            ))}
          </ol>

          {applied ? (
            <div className="success-banner">
              <CheckCircle2 aria-hidden="true" size={18} strokeWidth={2.4} />
              تم تطبيق التحديثات الصالحة على بيانات المنتجات.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
