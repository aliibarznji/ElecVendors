import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const purchaseOrderColumns = [
  "Order",
  "Total",
  "Order Date",
  "Status",
  "Receipt",
  "Details",
];

function PurchaseOrderFilter({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: "text" | "select";
}) {
  return (
    <label className="purchase-order-filter">
      <span>{label}</span>
      {type === "select" ? (
        <span className="purchase-order-select">
          <select defaultValue="" aria-label={label.replace(":", "")}>
            <option value="" disabled>
              {placeholder}
            </option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <ChevronDown aria-hidden="true" size={16} strokeWidth={2.1} />
        </span>
      ) : (
        <input placeholder={placeholder} />
      )}
    </label>
  );
}

export function PurchaseOrdersContent() {
  return (
    <div className="purchase-orders-content">
      <h1>Purchase Orders</h1>

      <section className="purchase-orders-card" aria-label="Purchase orders">
        <p className="purchase-orders-copy">
          The below table shows your purchase orders.
        </p>

        <div className="purchase-order-filters">
          <PurchaseOrderFilter label="Date:" placeholder="Date Filter" />
          <PurchaseOrderFilter
            label="Status:"
            placeholder="Select Status"
            type="select"
          />
          <PurchaseOrderFilter label="SKU:" placeholder="e.g. SKU12342" />
          <PurchaseOrderFilter
            label="Order Number:"
            placeholder="e.g. PO1234"
          />
          <button className="purchase-order-reset" type="button">
            Reset Filter
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                {purchaseOrderColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="purchase-order-empty-row">
                <td colSpan={purchaseOrderColumns.length} />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="purchase-order-pagination" aria-label="Purchase order pagination">
          <span>Items per page: 20</span>
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
