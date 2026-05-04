import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const productLogs = [
  {
    user: "beautifulgirl2294@gmail.com",
    name: "Sheglam It-Curl One Curling Iron - 400 W - Silver",
    item: "sv2411203071322707",
    action: "Modified",
    createdTime: "03/01/26 09:07",
  },
  {
    user: "amnah.qader@elryan.com",
    name: "Sheglam It-Curl One Curling Iron - 400 W - Silver",
    item: "sv2411203071322707",
    action: "Modified",
    createdTime: "06/12/25 09:19",
  },
  {
    user: "waseem.mohammad@elryan.com",
    name: "Sheglam It-Curl One Curling Iron - 400 W - Silver",
    item: "sv2411203071322707",
    action: "Modified",
    createdTime: "04/12/25 08:48",
  },
  {
    user: "doaa.mohammed@elryan.com",
    name: "Sheglam It-Curl One Curling Iron - 400 W - Silver",
    item: "sv2411203071322707",
    action: "Modified",
    createdTime: "02/12/25 15:59",
  },
  {
    user: "doaa.mohammed@elryan.com",
    name: "Sheglam It-Curl One Curling Iron - 400 W - Silver",
    item: "sv2411203071322707",
    action: "Modified",
    createdTime: "01/12/25 09:14",
  },
  {
    user: "beautifulgirl2294@gmail.com",
    name: "Sheglam It-Curl One Curling Iron - 400 W - Silver",
    item: "sv2411203071322707",
    action: "Created",
    createdTime: "29/09/25 09:31",
  },
];

function ProductThumbnail() {
  return (
    <span className="product-logs-thumbnail" aria-label="Sheglam curling iron thumbnail">
      <svg viewBox="0 0 42 42" role="img" aria-hidden="true">
        <rect x="0" y="0" width="42" height="42" fill="#ffffff" />
        <path d="M19.5 6.5h3.2v25.8h-3.2z" fill="#b9c0c7" />
        <path d="M18.3 7.2h5.6v16.5h-5.6z" fill="#e6e8eb" />
        <path d="M18.7 8.2h4.9v12.9h-4.9z" fill="#d6865f" />
        <path d="M19.7 24h2.9v9.4h-2.9z" fill="#8d98a1" />
        <path d="M18.6 33.1h5.2v1.4h-5.2z" fill="#6c757d" />
        <path d="M16.9 9.2c.7-1.8 1.8-2.9 3.3-3.5v3.5z" fill="#f0b58e" />
        <path d="M23 5.9c1.4.7 2.3 1.8 2.9 3.3H23z" fill="#f0b58e" />
        <path d="M16.7 22.2h8.7" stroke="#c9ced4" strokeWidth="1.2" />
      </svg>
    </span>
  );
}

export function ProductLogsContent() {
  return (
    <div className="product-logs-page">
      <h1>Product Logs</h1>

      <section className="product-logs-panel" aria-label="Product logs">
        <p>Below is a list of all product log actions.</p>

        <div className="product-logs-filters">
          <label className="product-logs-filter product-logs-action-filter">
            <span>Action Type:</span>
            <span className="product-logs-select">
              <select aria-label="Action type" defaultValue="">
                <option value="" />
                <option value="modified">Modified</option>
                <option value="created">Created</option>
              </select>
              <ChevronDown aria-hidden="true" size={14} strokeWidth={2.2} />
            </span>
          </label>

          <label className="product-logs-filter product-logs-search-filter">
            <span>Search:</span>
            <input aria-label="Search product logs" />
          </label>

          <label className="product-logs-filter product-logs-date-filter">
            <span>Date:</span>
            <span className="product-logs-date-input">
              <input aria-label="Date range" defaultValue="Date Range" readOnly />
              <CalendarDays aria-hidden="true" size={14} strokeWidth={2} />
            </span>
          </label>
        </div>

        <div className="product-logs-table-wrap">
          <table className="product-logs-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>User</th>
                <th>Name</th>
                <th>Item</th>
                <th>Action Type</th>
                <th>Created Time</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {productLogs.map((log) => (
                <tr key={`${log.user}-${log.createdTime}`}>
                  <td>
                    <ProductThumbnail />
                  </td>
                  <td>{log.user}</td>
                  <td>{log.name}</td>
                  <td>{log.item}</td>
                  <td>
                    <span
                      className={`product-logs-badge${
                        log.action === "Created" ? " is-created" : ""
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td>{log.createdTime}</td>
                  <td>
                    <button className="product-logs-details" type="button">
                      <span>Details</span>
                      <ChevronDown aria-hidden="true" size={15} strokeWidth={2.2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="product-logs-pagination" aria-label="Product logs pagination">
          <span>Items per page</span>
          <button className="product-logs-page-size" type="button">
            <span>20</span>
            <ChevronDown aria-hidden="true" size={14} strokeWidth={2.2} />
          </button>
          <span>1 - 6 of 6</span>
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
