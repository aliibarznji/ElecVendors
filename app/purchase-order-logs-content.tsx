import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Filter,
  History,
  RotateCcw,
} from "lucide-react";

const purchaseOrderLogColumns = [
  "Action",
  "Date",
  "Purchase Order",
  "User",
  "Rejection Reason",
];

export function PurchaseOrderLogsContent() {
  return (
    <div className="purchase-order-logs-page">
      <h1>Purchase Order Logs</h1>

      <section className="purchase-order-logs-panel" aria-label="Purchase order logs">
        <div className="purchase-order-logs-header">
          <p>
            The table below shows the history of purchase order actions
            (approvals and rejections).
          </p>

          <div className="purchase-order-logs-actions">
            <button className="purchase-order-logs-button is-outline" type="button">
              <EyeOff aria-hidden="true" size={14} strokeWidth={2.2} />
              <span>Hide All Filters</span>
            </button>
            <button className="purchase-order-logs-button is-primary" type="button">
              <Filter aria-hidden="true" size={14} strokeWidth={2.2} />
              <span>Apply Filters</span>
            </button>
            <button className="purchase-order-logs-button is-reset" type="button">
              <RotateCcw aria-hidden="true" size={14} strokeWidth={2.1} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        <div className="purchase-order-logs-filters">
          <label className="purchase-order-logs-filter">
            <span>Action Type:</span>
            <span className="purchase-order-logs-select">
              <select aria-label="Action type" defaultValue="all">
                <option value="all">All Actions</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown aria-hidden="true" size={14} strokeWidth={2.2} />
            </span>
          </label>

          <label className="purchase-order-logs-filter">
            <span>Search:</span>
            <input aria-label="Search purchase order logs" placeholder="PO number, Rejection reason" />
          </label>

          <label className="purchase-order-logs-filter">
            <span>Date Range:</span>
            <span className="purchase-order-logs-date-input">
              <input aria-label="Date range" defaultValue="Select Date Range" readOnly />
              <CalendarDays aria-hidden="true" size={14} strokeWidth={2} />
            </span>
          </label>
        </div>

        <div className="purchase-order-logs-table-wrap">
          <table className="purchase-order-logs-table">
            <thead>
              <tr>
                {purchaseOrderLogColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
          </table>

          <div className="purchase-order-logs-empty">
            <History aria-hidden="true" size={38} strokeWidth={2.1} />
            <h2>No Logs Found</h2>
            <p>There are no purchase order logs to display.</p>
          </div>
        </div>

        <div className="purchase-order-logs-pagination" aria-label="Purchase order logs pagination">
          <span>Items per page</span>
          <button className="purchase-order-logs-page-size" type="button">
            <span>20</span>
            <ChevronDown aria-hidden="true" size={14} strokeWidth={2.2} />
          </button>
          <span>0 of 0</span>
          <button type="button" aria-label="Previous page" disabled>
            <ChevronLeft aria-hidden="true" size={20} strokeWidth={2} />
          </button>
          <button type="button" aria-label="Next page" disabled>
            <ChevronRight aria-hidden="true" size={20} strokeWidth={2} />
          </button>
        </div>
      </section>
    </div>
  );
}
