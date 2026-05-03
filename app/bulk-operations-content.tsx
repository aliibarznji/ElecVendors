"use client";

import { useState } from "react";

type Tab = "update" | "add";

export function BulkOperationsContent() {
  const [activeTab, setActiveTab] = useState<Tab>("update");

  return (
    <div className="bulk-content">
      <h1>Bulk Operations</h1>

      <div className="bulk-card">
        <div className="bulk-tabs">
          <button
            className={`bulk-tab${activeTab === "update" ? " is-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("update")}
          >
            Bulk Update
          </button>
          <button
            className={`bulk-tab${activeTab === "add" ? " is-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("add")}
          >
            Bulk Add
          </button>
        </div>

        <div className="bulk-tab-body">
          {activeTab === "update" ? <BulkUpdate /> : <BulkAdd />}
        </div>
      </div>
    </div>
  );
}

function BulkUpdate() {
  return (
    <div className="bulk-section">
      <h2>Mass update of prices and inventory</h2>

      <ol className="bulk-steps">
        <li>
          <span>Export your product list in a CSV file.</span>
          <button className="bulk-export-button" type="button">Export - CSV</button>
          <div className="bulk-checkboxes">
            <label className="bulk-checkbox-label">
              <input type="checkbox" />
              <span>Include cost_price in export (Advance Mode)</span>
            </label>
            <label className="bulk-checkbox-label">
              <input type="checkbox" />
              <span>Include missing category in export</span>
            </label>
          </div>
        </li>

        <li>
          Remove products that you don&apos;t want to update for quicker update process.
        </li>

        <li>Make updates to prices and inventory.</li>

        <li>
          <span>How to change the stock status (is_in_stock):</span>
          <ul className="bulk-sub-list">
            <li>In Stock: Enter 1</li>
            <li>Out of Stock: Enter 0</li>
          </ul>
        </li>

        <li>
          <span>
            Date and Time format for Start day (special_price_from) and End day
            (special_price_to):
          </span>
          <ul className="bulk-sub-list">
            <li>Format: MM/DD/YY, HH:MM:SS AM/PM</li>
            <li>Example: 1/1/2024, 12:00:00 AM</li>
          </ul>
        </li>

        <li>
          <span>Special Price (special_price):</span>
          <ul className="bulk-sub-list">
            <li>The special price must be less than the regular price.</li>
          </ul>
        </li>

        <li>
          <span>Upload the file again. (Max file size 1MB and max number of products 2500)</span>
          <div className="bulk-dropzone">
            <span>Click or drag CSV file here to upload</span>
          </div>
        </li>
      </ol>
    </div>
  );
}

function BulkAdd() {
  return (
    <div className="bulk-section">
      <h2>Mass add new inventory</h2>

      <ol className="bulk-steps">
        <li>
          <span>Export sample product list in a CSV file.</span>
          <button className="bulk-export-button" type="button">Export - CSV</button>
        </li>

        <li>
          Add new products that you want to create for quicker adding process.
        </li>

        <li>Make adds to prices and inventory.</li>

        <li>
          <span>How to add the stock status (stockStatus):</span>
          <ul className="bulk-sub-list">
            <li>In Stock: Enter In Stock</li>
            <li>Out of Stock: Enter Out of Stock</li>
          </ul>
        </li>

        <li>
          <span>For selling price please pay attention to these rules:</span>
          <ul className="bulk-sub-list">
            <li>
              If you see this field (elryanSellingPrice): Please write the price in USD
            </li>
            <li>
              If you see this field (elryanIQDSellingPrice): Please write the price in IQD
            </li>
          </ul>
        </li>

        <li>
          <span>Warranty Code:</span>
          <ul className="bulk-sub-list">
            <li>
              In case of warranty please write the warranty code from warranty page
              otherwise write leave it empty.
            </li>
          </ul>
        </li>

        <li>
          <span>Product Features (productFeatures):</span>
          <ul className="bulk-sub-list">
            <li>
              Adjust product features based on their category. Change the header to match
              the category-specific attribute. For example, in the Fashion category, update
              &apos;productFeatures&apos; to &apos;productFeatures.Size&apos; and list the size under that column.
            </li>
          </ul>
        </li>

        <li>
          <span>Mandatory Columns:</span>
          <ul className="bulk-sub-list">
            <li>
              The following columns are mandatory and must be filled in the Excel sheet:
              &apos;Depth (mm)&apos;, &apos;Height (mm)&apos;, &apos;Item Brand&apos;, &apos;Name with hierarchy&apos;,
              &apos;Magento Product Description&apos;, &apos;Magento Product Description (AR)&apos;,
              &apos;Product Name&apos;, &apos;Product Name (AR)&apos;, &apos;SKU&apos;, &apos;Width (mm)&apos;,
              &apos;pickUpTime&apos;, &apos;productImage&apos;, &apos;quantityAvailable&apos;, &apos;stockStatus&apos;,
              &apos;warranty_code&apos;, &apos;elryanIQDSellingPrice&apos; or &apos;elryanSellingPrice&apos;.
              Ensure all these fields are properly filled before submitting the CSV.
            </li>
          </ul>
        </li>

        <li>
          <span>Upload the new file. (Max file size 1MB and max number of products 2500)</span>
          <div className="bulk-dropzone">
            <span>Click or drag CSV file here to upload</span>
          </div>
        </li>
      </ol>
    </div>
  );
}
