"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  EyeOff,
  ExternalLink,
  Filter,
  PackageCheck,
  Pencil,
  RotateCcw,
  Calendar,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const productListColumns = [
  "Thumbnail",
  "Name",
  "SKU",
  "Brand",
  "Selling Price",
  "Cost Price",
  "Offer Price",
  "Stock Status",
  "Content Score",
  "Live URL",
  "Edit",
  "Product Status",
];

const editModeColumns = [
  "Thumbnail",
  "Brand",
  "SKU",
  "Selling Price",
  "Cost / Margin",
  "Cost Price",
  "Offer Price",
  "Promotional Date",
  "Quantity Available",
  "Stock Status",
  "Product Status",
];

const sampleProduct = {
  name: "Sheglam It-Curl One Curling Iron - 400 W - Silver",
  sku: "sv2411203071322707",
  brand: "Sheglam",
  sellingPrice: 49000,
  costPrice: 45085,
  offerPrice: "",
  stockStatus: "Out of Stock",
  status: "Approved",
  quantity: 0,
};

function InventorySummaryItem({
  label,
  value,
  detail,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  tone: string;
  icon: LucideIcon;
}) {
  return (
    <article className={`inventory-summary-item inventory-${tone}`}>
      <span className="inventory-summary-icon">
        <Icon aria-hidden="true" size={18} strokeWidth={2.3} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function SelectFilter({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <label className={`product-list-filter${wide ? " is-wide" : ""}`}>
      <span>{label}</span>
      <div className="product-list-select">
        <input readOnly value={value} />
        <ChevronDown aria-hidden="true" size={17} strokeWidth={2.1} />
      </div>
    </label>
  );
}

export function ProductListContent() {
  const [editMode, setEditMode] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(sampleProduct.sellingPrice);
  const [offerPrice, setOfferPrice] = useState(sampleProduct.offerPrice);
  const [stockStatus, setStockStatus] = useState(sampleProduct.stockStatus);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const margin = sellingPrice > 0
    ? (((sellingPrice - sampleProduct.costPrice) / sellingPrice) * 100).toFixed(1)
    : "0.0";
  const cost = (sellingPrice * (1 - parseFloat(margin) / 100)).toFixed(2);
  const outOfStockCount = stockStatus === "Out of Stock" ? 1 : 0;
  const lowStockCount = stockStatus === "Low Stock" ? 1 : 0;
  const inStockCount = stockStatus === "In Stock" ? 1 : 0;
  const inventoryValue = sampleProduct.quantity * sampleProduct.costPrice;
  const inventorySummary = [
    {
      label: "Total SKUs",
      value: "1",
      detail: "Visible products",
      tone: "blue",
      icon: Boxes,
    },
    {
      label: "In Stock",
      value: String(inStockCount),
      detail: `${sampleProduct.quantity} available units`,
      tone: "green",
      icon: PackageCheck,
    },
    {
      label: "Low Stock",
      value: String(lowStockCount),
      detail: "Below reorder point",
      tone: "amber",
      icon: AlertTriangle,
    },
    {
      label: "Out of Stock",
      value: String(outOfStockCount),
      detail: outOfStockCount ? "Needs restock" : "No blocked SKUs",
      tone: "orange",
      icon: AlertTriangle,
    },
    {
      label: "Stock Value",
      value: `${inventoryValue.toLocaleString()} IQD`,
      detail: "At cost price",
      tone: "cyan",
      icon: Wallet,
    },
  ];

  return (
    <div className="product-list-content">
      <h1>Product List</h1>

      {editMode && (
        <div className="edit-mode-bar">
          <div className="edit-mode-bar-left">
            <button
              className="edit-mode-toggle-btn"
              type="button"
              onClick={() => setEditMode(false)}
              aria-pressed={true}
            >
              <span className="toggle-switch is-enabled" aria-hidden="true" style={{ width: 34, height: 17 }} />
              <strong>Edit Mode</strong>
            </button>
          </div>
          <div className="edit-mode-bar-right">
            <button
              className="edit-cancel-button"
              type="button"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
            <button className="edit-save-button" type="button">
              Save Changes
            </button>
          </div>
        </div>
      )}

      <section className="product-list-card" aria-label="Product list">
        {!editMode && (
          <>
            <div className="product-list-header">
              <p>
                The below table shows a list of all the products you are currently
                offering for sale.
              </p>
              <div className="product-list-actions">
                <button className="outline-filter-button" type="button">
                  <EyeOff aria-hidden="true" size={18} strokeWidth={2.1} />
                  <span>Hide All Filters</span>
                </button>
                <button className="apply-filter-button" type="button">
                  <Filter aria-hidden="true" size={17} strokeWidth={2.3} />
                  <span>Apply Filters</span>
                </button>
                <button className="reset-filter-button" type="button">
                  <RotateCcw aria-hidden="true" size={16} strokeWidth={2.2} />
                  <span>Reset Filters</span>
                </button>
                <button className="export-filter-button" type="button">
                  <Download aria-hidden="true" size={17} strokeWidth={2.3} />
                  <span>Export Excel</span>
                </button>
              </div>
            </div>

            <section
              className="inventory-summary-strip"
              aria-label="Inventory summary"
            >
              {inventorySummary.map((item) => (
                <InventorySummaryItem key={item.label} {...item} />
              ))}
            </section>

            <div className="product-list-filters">
              <SelectFilter label="Status:" value="All Statuses" />
              <label className="product-list-filter">
                <span>Search:</span>
                <input className="product-list-search" />
              </label>
              <SelectFilter label="Brand:" value="Select a Brand" />
              <SelectFilter label="Product Category" value="Select" wide />
              <SelectFilter label="Stock Status:" value="All Stock Statuses" />
              <SelectFilter label="Has Promotion:" value="All" />
            </div>

            <div className="score-filter">
              <span>Score:</span>
              <div className="score-slider" aria-hidden="true">
                <span />
              </div>
            </div>
          </>
        )}

        {editMode ? (
          <section
            className="inventory-summary-strip"
            aria-label="Inventory summary"
          >
            {inventorySummary.map((item) => (
              <InventorySummaryItem key={item.label} {...item} />
            ))}
          </section>
        ) : null}

        <div className="product-list-table-tools">
          <button
            className="edit-mode-toggle"
            type="button"
            onClick={() => setEditMode((v) => !v)}
            aria-pressed={editMode}
            style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}
          >
            <span
              className={`toggle-switch${editMode ? " is-enabled" : ""}`}
              aria-hidden="true"
              style={{ width: 34, height: 17 }}
            />
            <strong>Edit Mode</strong>
          </button>
          <button className="show-columns-button" type="button">
            Show/Hide Columns
          </button>
        </div>

        <div className="product-list-table-wrap">
          <table className="product-list-table">
            <thead>
              <tr>
                {(editMode ? editModeColumns : productListColumns).map((col) => (
                  <th key={col} scope="col">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editMode ? (
                <tr className="product-list-data-row">
                  <td>
                    <div className="sample-product-thumb" aria-label="Sample product thumbnail">
                      <span />
                    </div>
                  </td>
                  <td>{sampleProduct.brand}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{sampleProduct.sku}</td>
                  <td>
                    <input
                      className="edit-table-input"
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                    />
                  </td>
                  <td className="cost-margin-cell">
                    <span className="cost-line">
                      {Number(cost).toLocaleString("en-US", { minimumFractionDigits: 2 })} cost
                    </span>
                    <span className="margin-line">{margin}% margin</span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {sampleProduct.costPrice.toLocaleString()} IQD
                  </td>
                  <td>
                    <input
                      className="edit-table-input"
                      type="text"
                      placeholder="-"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                    />
                  </td>
                  <td>
                    <div className="edit-date-stack">
                      <div className="edit-date-row">
                        <input
                          className="edit-table-date"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          placeholder="Start Date"
                        />
                        <Calendar size={14} color="#9aa0ab" aria-hidden="true" />
                      </div>
                      <div className="edit-date-row">
                        <input
                          className="edit-table-date"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          placeholder="End Date"
                        />
                        <Calendar size={14} color="#9aa0ab" aria-hidden="true" />
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>{sampleProduct.quantity}</td>
                  <td>
                    <div className="edit-table-select-wrap">
                      <select
                        className="edit-table-select"
                        value={stockStatus}
                        onChange={(e) => setStockStatus(e.target.value)}
                      >
                        <option>In Stock</option>
                        <option>Out of Stock</option>
                        <option>Low Stock</option>
                      </select>
                      <ChevronDown size={13} color="#526178" aria-hidden="true" />
                    </div>
                  </td>
                  <td>
                    <span className="approved-status-badge">{sampleProduct.status}</span>
                  </td>
                </tr>
              ) : (
                <tr className="product-list-data-row">
                  <td>
                    <div className="sample-product-thumb" aria-label="Sample product thumbnail">
                      <span />
                    </div>
                  </td>
                  <td className="product-name-cell">{sampleProduct.name}</td>
                  <td>{sampleProduct.sku}</td>
                  <td>{sampleProduct.brand}</td>
                  <td>{sellingPrice.toLocaleString()} IQD</td>
                  <td>{sampleProduct.costPrice.toLocaleString()} IQD</td>
                  <td>{sampleProduct.offerPrice || "N/A"}</td>
                  <td>{stockStatus}</td>
                  <td>
                    <div className="content-score-pill">
                      <span>Score</span>
                      <strong>8</strong>
                    </div>
                  </td>
                  <td>
                    <button className="view-product-button" type="button">
                      <ExternalLink aria-hidden="true" size={16} strokeWidth={2.2} />
                      <span>View</span>
                    </button>
                  </td>
                  <td>
                    <button
                      className="edit-product-button"
                      type="button"
                      aria-label="Edit product"
                      onClick={() => setEditMode(true)}
                    >
                      <Pencil aria-hidden="true" size={17} strokeWidth={2.4} />
                    </button>
                  </td>
                  <td>
                    <span className="approved-status-badge">{sampleProduct.status}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="product-list-pagination">
          <span>Items per page:</span>
          <button type="button">
            10
            <ChevronDown aria-hidden="true" size={16} strokeWidth={2.1} />
          </button>
          <span>1 - 1 of 1</span>
          <button type="button" aria-label="Previous page" disabled>
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.2} />
          </button>
          <button type="button" aria-label="Next page" disabled>
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.2} />
          </button>
        </div>
      </section>
    </div>
  );
}
