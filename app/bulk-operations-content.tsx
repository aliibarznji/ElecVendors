"use client";

import { CheckCircle2, Download, FileSpreadsheet, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import { totalProductQty, type ApiProduct } from "./lib/utils";

type Mode = "prices" | "stock";

const steps = [
  "Download current products file",
  "Upload file after editing",
  "Review errors and warnings",
  "Apply updates",
];

type SampleRow =
  | { sku: string; sellingPrice: number; costPrice: number; codeChanged?: boolean }
  | { sku: string; quantity: number };

function validateRow(row: SampleRow, mode: Mode): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (mode === "prices") {
    const r = row as { sku: string; sellingPrice: number; costPrice: number; codeChanged?: boolean };
    if (r.codeChanged) errors.push("SKU not found in your product catalog");
    if (r.costPrice > r.sellingPrice) errors.push("Cost price exceeds selling price");
    if (r.sellingPrice <= 0) errors.push("Selling price must be positive");
  } else {
    const r = row as { sku: string; quantity: number };
    if (r.quantity < 0) errors.push("Quantity cannot be negative");
  }
  return { valid: errors.length === 0, errors, warnings };
}

function downloadTemplate(products: ApiProduct[], mode: Mode) {
  const headers = mode === "prices" ? ["sku", "selling_price", "cost_price"] : ["sku", "quantity"];
  const rows = products.map((p) =>
    mode === "prices"
      ? [p.sku, p.sellingPrice, p.costPrice]
      : [p.sku, totalProductQty(p.colors)],
  );
  const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `products-${mode}-template.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function BulkOperationsContent({ initialMode = "prices" }: { initialMode?: Mode }) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [uploaded, setUploaded] = useState(false);
  const [applied, setApplied] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    api.products.list({ limit: 100 }).then((res) => setProducts(res.items)).catch(() => {});
  }, []);

  const sampleRows: SampleRow[] = useMemo(
    () =>
      mode === "prices"
        ? products.length > 0
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
          : []
        : products.length > 1
          ? [
              { sku: products[0].sku, quantity: 12 },
              { sku: products[1].sku, quantity: -3 },
            ]
          : [],
    [mode, products],
  );

  const validation = sampleRows.map((row) => validateRow(row, mode));
  const hasErrors = validation.some((result) => !result.valid);

  return (
    <div className="bulk-content">
      <header className="page-title-row">
        <div>
          <h1>{t("bulkUpdates")}</h1>
          <p className="dashboard-sub">
            CSV/XLSX gateway to update prices or inventory only without creating new products.
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
            Update Prices
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
            Update Inventory
          </button>
        </div>

        <div className="bulk-tab-body">
          <div className="warning-banner">
            Do not upload new products from this page, and do not change protected columns such as product name,
            SKU, barcode, or product code. This portal is for updates only.
          </div>

          <ol className="bulk-steps csv-steps">
            {steps.map((step, index) => (
              <li key={step}>
                <span>{step}</span>
                {index === 0 ? (
                  <button
                    className="bulk-export-button"
                    type="button"
                    onClick={() => downloadTemplate(products, mode)}
                  >
                    <Download aria-hidden="true" size={16} strokeWidth={2.4} />
                    Download current products file
                  </button>
                ) : null}
                {index === 1 ? (
                  <button
                    className="bulk-dropzone csv-upload-zone"
                    type="button"
                    onClick={() => setUploaded(true)}
                  >
                    <UploadCloud aria-hidden="true" size={24} strokeWidth={2.3} />
                    <span>{uploaded ? "Sample file uploaded" : "Click or drag CSV/XLSX file here"}</span>
                  </button>
                ) : null}
                {index === 2 && uploaded ? (
                  <div className="validation-review">
                    <table className="purchase-order-table">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>Result</th>
                          <th>Errors / Warnings</th>
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
                                {validation[rowIndex].valid ? "Valid" : "Needs correction"}
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
                    <span>Apply Updates</span>
                  </button>
                ) : null}
              </li>
            ))}
          </ol>

          {applied ? (
            <div className="success-banner">
              <CheckCircle2 aria-hidden="true" size={18} strokeWidth={2.4} />
              Valid updates have been applied to product data.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
