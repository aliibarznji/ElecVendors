import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";

const requisitionColumns = [
  "",
  "Name",
  "Item",
  "Brand",
  "Order Date",
  "Sales Order",
  "Order Quantity",
  "Confirmed Quantity",
  "Amount",
  "Selling Price",
  "Action",
];

function TextFilter({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: "text" | "date";
}) {
  return (
    <label className="purchase-requisition-filter">
      <span>{label}</span>
      <input type={type} placeholder={placeholder} aria-label={label.replace(":", "")} />
    </label>
  );
}

function BrandFilter() {
  return (
    <label className="purchase-requisition-filter">
      <span>Brand:</span>
      <span className="purchase-requisition-brand-select">
        <input aria-label="Brand" readOnly />
        <button type="button" aria-label="Clear brand">
          <X aria-hidden="true" size={14} strokeWidth={2} />
        </button>
        <ChevronDown aria-hidden="true" size={16} strokeWidth={2.1} />
      </span>
    </label>
  );
}

export function PurchaseRequisitionsContent() {
  return (
    <div className="purchase-requisitions-content">
      <h1>Purchase Requisitions</h1>

      <section
        className="purchase-requisitions-card"
        aria-label="Purchase requisitions"
      >
        <div className="purchase-requisitions-topline">
          <p>
            The table below lists the items along with their corresponding
            quantities that we have received from your product order.
          </p>

          <div className="purchase-requisition-actions">
            <button className="requisition-approve-button" type="button">
              Approve Selected
            </button>
            <button className="requisition-reject-button" type="button">
              Reject Selected
            </button>
          </div>
        </div>

        <div className="purchase-requisition-filters">
          <TextFilter
            label="Search Sales Order:"
            placeholder="Enter SO number"
          />
          <TextFilter label="SKU:" placeholder="Search by SKU" />
          <BrandFilter />
          <TextFilter
            label="Date From:"
            placeholder="mm/dd/yyyy"
            type="date"
          />
          <TextFilter
            label="Date To:"
            placeholder="mm/dd/yyyy"
            type="date"
          />
          <button className="purchase-requisition-reset" type="button">
            Reset Filter
          </button>
        </div>

        <div className="purchase-requisition-tools">
          <button className="requisition-columns-button" type="button">
            Show/Hide Columns
          </button>
        </div>

        <div className="purchase-requisition-table-wrap">
          <table className="purchase-requisition-table">
            <thead>
              <tr>
                {requisitionColumns.map((column, index) => (
                  <th key={`${column}-${index}`} scope="col">
                    {index === 0 ? (
                      <input type="checkbox" aria-label="Select all requisitions" />
                    ) : (
                      column
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="purchase-requisition-empty-row">
                <td colSpan={requisitionColumns.length} />
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="purchase-requisition-pagination"
          aria-label="Purchase requisition pagination"
        >
          <span>Items per page</span>
          <button type="button" className="requisition-page-size">
            <span>20</span>
            <ChevronDown aria-hidden="true" size={14} strokeWidth={2.1} />
          </button>
          <span>0 of 0</span>
          <button type="button" aria-label="Previous page" disabled>
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <button type="button" aria-label="Next page" disabled>
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
        </div>
      </section>
    </div>
  );
}
