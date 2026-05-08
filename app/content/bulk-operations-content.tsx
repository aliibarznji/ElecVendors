"use client";

import { CheckCircle2, Download, FileSpreadsheet, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";
import { totalProductQty, type ApiProduct } from "../lib/utils";

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
    <div className="grid gap-[18px] p-[22px_24px_48px]">
      <header className="flex items-start justify-between gap-[18px]">
        <div>
          <h1 className="m-0">{t("bulkUpdates")}</h1>
          <p className="mt-[7px] text-muted text-[13px] leading-[1.5]">
            CSV/XLSX gateway to update prices or inventory only without creating new products.
          </p>
        </div>
      </header>

      <section className="dashboard-panel p-[22px_24px] grid gap-4">
        <div className="flex gap-1 p-[14px_16px_0]">
          <button
            className={`px-[14px] py-[6px] rounded-lg text-[13px] font-medium border border-transparent bg-transparent text-muted cursor-pointer transition-colors hover:bg-[#f1f3f9] hover:text-text${mode === "prices" ? " !bg-brand !text-white !border-brand shadow-[0_2px_8px_rgba(215,25,32,0.2)]" : ""}`}
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
            className={`px-[14px] py-[6px] rounded-lg text-[13px] font-medium border border-transparent bg-transparent text-muted cursor-pointer transition-colors hover:bg-[#f1f3f9] hover:text-text${mode === "stock" ? " !bg-brand !text-white !border-brand shadow-[0_2px_8px_rgba(215,25,32,0.2)]" : ""}`}
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

        <div className="p-[20px_22px] grid gap-4">
          <div className="flex items-center gap-[9px] px-[14px] py-[11px] rounded-[10px] border border-[#fed7aa] bg-[#fff7ed] text-[#9a3412] text-[13px]">
            Do not upload new products from this page, and do not change protected columns such as product name,
            SKU, barcode, or product code. This portal is for updates only.
          </div>

          <ol className="grid gap-[10px]">
            {steps.map((step, index) => (
              <li key={step}>
                <span className="text-[#2d3a52] font-medium">{step}</span>
                {index === 0 ? (
                  <button
                    className="inline-flex items-center justify-center min-w-[128px] min-h-[38px] gap-[6px] border-0 rounded-lg bg-gradient-to-br from-[#4d6fcd] to-[#3558b4] text-white cursor-pointer font-inherit text-[13px] font-semibold tracking-[0.1px] shadow-[0_2px_6px_rgba(53,88,180,0.35),0_1px_2px_rgba(53,88,180,0.2)] transition-[transform,box-shadow,background] hover:bg-gradient-to-br hover:from-[#3d60be] hover:to-[#2a4da6] hover:-translate-y-px"
                    type="button"
                    onClick={() => downloadTemplate(products, mode)}
                  >
                    <Download aria-hidden="true" size={16} strokeWidth={2.4} />
                    Download current products file
                  </button>
                ) : null}
                {index === 1 ? (
                  <button
                    className="border-2 border-dashed border-border rounded-[12px] bg-[#fafbfe] p-8 text-center cursor-pointer text-[#94a3b8] text-[13px] transition-colors hover:border-[rgba(215,25,32,0.35)] hover:bg-[#fff0f0] hover:text-brand w-full"
                    type="button"
                    onClick={() => setUploaded(true)}
                  >
                    <UploadCloud aria-hidden="true" size={24} strokeWidth={2.3} />
                    <span>{uploaded ? "Sample file uploaded" : "Click or drag CSV/XLSX file here"}</span>
                  </button>
                ) : null}
                {index === 2 && uploaded ? (
                  <div className="rounded-[10px] border border-border overflow-hidden">
                    <table className="w-full min-w-[900px] border-collapse table-fixed purchase-order-table">
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
                              <div className="grid gap-1">
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
            <div className="flex items-center gap-[9px] px-[14px] py-[11px] rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534] text-[13px]">
              <CheckCircle2 aria-hidden="true" size={18} strokeWidth={2.4} />
              Valid updates have been applied to product data.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
