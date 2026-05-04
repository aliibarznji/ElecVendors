"use client";

import { CheckCircle2, Download, FileSpreadsheet, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { products, validateBulkUpdateRow } from "./vendor-dashboard-data";

type Mode = "prices" | "stock";

const steps = [
  "Download current products file",
  "Upload file after editing",
  "Review errors and warnings",
  "Apply updates",
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
          <h1>Product Updates</h1>
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
                  <button className="bulk-export-button" type="button">
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
