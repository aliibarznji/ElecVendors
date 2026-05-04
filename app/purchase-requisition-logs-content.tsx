import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";

const purchaseRequisitionLogColumns = [
  "Action",
  "Rejection Reason",
  "Date",
  "Total Items",
  "Currency",
  "User",
  "Purchase Orders",
  "Warehouse",
];

export function PurchaseRequisitionLogsContent() {
  return (
    <div className="purchase-requisition-logs-page">
      <h1>Purchase Requisitions Logs</h1>

      <section
        className="purchase-requisition-logs-panel"
        aria-label="Purchase requisitions logs"
      >
        <div className="purchase-requisition-logs-header">
          <p>
            The table below shows the history of purchase requisition actions
            (accepts and rejects).
          </p>

          <button className="purchase-requisition-logs-reset" type="button">
            Reset Filters
          </button>
        </div>

        <div className="purchase-requisition-logs-filters">
          <label className="purchase-requisition-logs-filter">
            <span>Action Type:</span>
            <span className="purchase-requisition-logs-select">
              <select aria-label="Action type" defaultValue="all">
                <option value="all">All Actions</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown aria-hidden="true" size={14} strokeWidth={2.2} />
            </span>
          </label>

          <label className="purchase-requisition-logs-filter">
            <span>Search:</span>
            <input
              aria-label="Search purchase requisition logs"
              placeholder="SKU, Item name, PO or SO number"
            />
          </label>

          <label className="purchase-requisition-logs-filter">
            <span>Date Range:</span>
            <span className="purchase-requisition-logs-date-input">
              <input aria-label="Date range" defaultValue="-" readOnly />
              <CalendarDays aria-hidden="true" size={14} strokeWidth={2} />
            </span>
          </label>
        </div>

        <div className="purchase-requisition-logs-tools">
          <button type="button">Show/Hide Columns</button>
        </div>

        <div className="purchase-requisition-logs-table-wrap">
          <table className="purchase-requisition-logs-table">
            <thead>
              <tr>
                {purchaseRequisitionLogColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
          </table>

          <div className="purchase-requisition-logs-empty">
            <History aria-hidden="true" size={38} strokeWidth={2.1} />
            <h2>No Logs Found</h2>
            <p>There are no purchase requisition logs to display.</p>
          </div>
        </div>

        <div
          className="purchase-requisition-logs-pagination"
          aria-label="Purchase requisitions logs pagination"
        >
          <span>Items per page</span>
          <button className="purchase-requisition-logs-page-size" type="button">
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
