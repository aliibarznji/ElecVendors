import { CalendarDays, Download } from "lucide-react";

const productStats = [
  { label: "Created", value: "0", color: "cyan" },
  { label: "Approved", value: "1", color: "green" },
  { label: "Rejected", value: "0", color: "orange" },
  { label: "Under Review", value: "0", color: "blue" },
  { label: "Supervised", value: "0", color: "pink" },
];

const orderStats = [
  { label: "Pending Approval", value: "0", color: "amber" },
  { label: "In Progress", value: "0", color: "cyan" },
  { label: "Delivered Orders", value: "0", color: "green" },
  { label: "Cancelled Orders", value: "0", color: "orange" },
  { label: "Rejected Orders", value: "0", color: "pink" },
];

const quickRanges = ["Last 7 Days", "Last 30 Days", "This Month", "Last Month"];

const recentOrderStatuses = [
  "All Statuses",
  "Cancelled",
  "Cancelled by Vendor",
  "Confirmed",
  "Delivered",
  "In Progress",
  "Pending Confirmation",
  "Rejected",
];

const productLegend = [
  { label: "Approved", color: "green" },
  { label: "Rejected", color: "orange" },
  { label: "Under Review", color: "blue" },
  { label: "Supervised", color: "pink" },
  { label: "Created", color: "cyan" },
];

const recentOrderColumns = [
  "Order #",
  "Item",
  "Quantity",
  "Selling Price",
  "Status",
];

const sellingItemColumns = [
  "Thumbnail",
  "Brand",
  "SKU",
  "Name",
  "Sold Quantity",
  "Selling Price",
];

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <article className={`metric-card metric-${color}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function EmptyTable({
  title,
  columns,
  showFilter = false,
}: {
  title: string;
  columns: string[];
  showFilter?: boolean;
}) {
  return (
    <section
      className={`dashboard-panel table-panel${showFilter ? " table-panel-large" : ""}`}
    >
      <div className="panel-heading">
        <h2>{title}</h2>
      </div>

      {showFilter ? (
        <select className="status-filter" aria-label="Filter recent orders">
          {recentOrderStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      ) : null}

      <div className="table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length}>No items found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function DashboardContent() {
  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-controls">
          <div className="primary-controls">
            <button className="export-button" type="button">
              <Download aria-hidden="true" size={20} strokeWidth={2.2} />
              <span>Export Dashboard Data</span>
            </button>
            <button className="date-range" type="button">
              <span>5/1/2026 - 5/31/2026</span>
              <CalendarDays aria-hidden="true" size={22} strokeWidth={2.1} />
            </button>
          </div>
          <div className="quick-ranges" aria-label="Quick date ranges">
            {quickRanges.map((range) => (
              <button className="range-button" key={range} type="button">
                {range}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="dashboard-panel stats-panel">
        <div className="stats-block">
          <h2>
            Products <span>(not date-filtered)</span>
          </h2>
          <div className="metric-grid">
            {productStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <article className="wide-metric">
            <p>Total Products</p>
            <strong>1</strong>
          </article>
        </div>

        <div className="panel-divider" />

        <div className="stats-block">
          <h2>
            Orders <span>(based on selected date)</span>
          </h2>
          <div className="metric-grid">
            {orderStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <article className="wide-metric">
            <p>Overall Revenue</p>
            <strong>0 IQD</strong>
          </article>
        </div>
      </section>

      <section className="chart-grid">
        <article className="dashboard-panel chart-panel">
          <h2>Products Status</h2>
          <div className="product-chart-layout">
            <div className="donut-chart" aria-label="Approved products 100%">
              <span>100%</span>
            </div>
            <ul className="chart-legend">
              {productLegend.map((item) => (
                <li key={item.label}>
                  <span className={`legend-dot dot-${item.color}`} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="dashboard-panel chart-panel">
          <h2>Orders Status</h2>
          <div className="empty-chart">No orders found</div>
        </article>
      </section>

      <EmptyTable title="Recent Orders" columns={recentOrderColumns} showFilter />
      <EmptyTable title="Top 10 Selling Items" columns={sellingItemColumns} />
      <EmptyTable title="Lowest 10 Selling Items" columns={sellingItemColumns} />
    </div>
  );
}
