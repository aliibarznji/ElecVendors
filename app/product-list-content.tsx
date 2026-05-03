import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  EyeOff,
  ExternalLink,
  Filter,
  Pencil,
  RotateCcw,
} from "lucide-react";

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

const sampleProduct = {
  name: "Sheglam It-Curl One Curling Iron - 400 W - Silver",
  sku: "sv24112030713",
  brand: "Sheglam",
  sellingPrice: "49,000 IQD",
  costPrice: "45,085 IQD",
  offerPrice: "N/A",
  stockStatus: "Out of Stock",
  status: "Approved",
};

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
  return (
    <div className="product-list-content">
      <h1>Product List</h1>

      <section className="product-list-card" aria-label="Product list">
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

        <div className="product-list-table-tools">
          <div className="edit-mode-toggle">
            <span className="toggle-switch" aria-hidden="true" />
            <strong>Edit Mode</strong>
          </div>
          <button className="show-columns-button" type="button">
            Show/Hide Columns
          </button>
        </div>

        <div className="product-list-table-wrap">
          <table className="product-list-table">
            <thead>
              <tr>
                {productListColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="product-list-data-row">
                <td>
                  <div className="sample-product-thumb" aria-label="Sample product thumbnail">
                    <span />
                  </div>
                </td>
                <td className="product-name-cell">{sampleProduct.name}</td>
                <td>{sampleProduct.sku}</td>
                <td>{sampleProduct.brand}</td>
                <td>{sampleProduct.sellingPrice}</td>
                <td>{sampleProduct.costPrice}</td>
                <td>{sampleProduct.offerPrice}</td>
                <td>{sampleProduct.stockStatus}</td>
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
                  <button className="edit-product-button" type="button" aria-label="Edit product">
                    <Pencil aria-hidden="true" size={17} strokeWidth={2.4} />
                  </button>
                </td>
                <td>
                  <span className="approved-status-badge">{sampleProduct.status}</span>
                </td>
              </tr>
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
