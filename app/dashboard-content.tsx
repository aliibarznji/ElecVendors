import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Download,
  Megaphone,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";

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

const dashboardKpis: {
  label: string;
  value: string;
  detail: string;
  change: string;
  tone: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Net Sales",
    value: "322,300 IQD",
    detail: "After discounts and VAT",
    change: "+12.4%",
    tone: "blue",
    icon: TrendingUp,
  },
  {
    label: "Orders",
    value: "4",
    detail: "New, ready, shipped, delivered",
    change: "+2",
    tone: "green",
    icon: ShoppingCart,
  },
  {
    label: "Average Order Value",
    value: "80,575 IQD",
    detail: "Selected date range",
    change: "+6.1%",
    tone: "cyan",
    icon: Wallet,
  },
  {
    label: "Stock Alerts",
    value: "1",
    detail: "Requires restock review",
    change: "0 units",
    tone: "orange",
    icon: AlertTriangle,
  },
];

const revenueTrend = [
  { label: "May 1", value: 0 },
  { label: "May 2", value: 137500 },
  { label: "May 3", value: 184800 },
  { label: "May 4", value: 0 },
];

const fulfillmentSteps = [
  { label: "New", value: 1, rate: 25, color: "blue" },
  { label: "Ready to Ship", value: 1, rate: 25, color: "cyan" },
  { label: "Shipped", value: 1, rate: 25, color: "amber" },
  { label: "Delivered", value: 1, rate: 25, color: "green" },
];

const healthCards = [
  {
    label: "Inventory Health",
    value: "0 units",
    detail: "1 SKU out of stock",
    icon: Package,
    tone: "orange",
  },
  {
    label: "Fulfillment Rate",
    value: "75%",
    detail: "Ready, shipped, or delivered",
    icon: CheckCircle2,
    tone: "green",
  },
  {
    label: "Active Marketing",
    value: "2",
    detail: "Campaigns and discount plans",
    icon: Megaphone,
    tone: "blue",
  },
  {
    label: "Pending Settlement",
    value: "185,000 IQD",
    detail: "Expected next payout",
    icon: Activity,
    tone: "cyan",
  },
];

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

function DashboardKpiCard({
  label,
  value,
  detail,
  change,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  change: string;
  tone: string;
  icon: LucideIcon;
}) {
  return (
    <article className={`dashboard-kpi-card kpi-${tone}`}>
      <div className="dashboard-kpi-top">
        <span className="dashboard-kpi-icon">
          <Icon aria-hidden="true" size={19} strokeWidth={2.25} />
        </span>
        <span className="dashboard-kpi-change">{change}</span>
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span className="dashboard-kpi-detail">{detail}</span>
    </article>
  );
}

function RevenueTrendChart() {
  const maxRevenue = Math.max(...revenueTrend.map((item) => item.value), 1);

  return (
    <div className="revenue-trend-chart" aria-label="Revenue trend by day">
      {revenueTrend.map((item) => {
        const height = Math.max((item.value / maxRevenue) * 100, item.value ? 8 : 3);
        return (
          <div className="revenue-bar-item" key={item.label}>
            <span className="revenue-bar-track">
              <span style={{ height: `${height}%` }} />
            </span>
            <small>{item.label.replace("May ", "")}</small>
          </div>
        );
      })}
    </div>
  );
}

function FulfillmentStep({
  label,
  value,
  rate,
  color,
}: {
  label: string;
  value: number;
  rate: number;
  color: string;
}) {
  return (
    <li className={`fulfillment-step step-${color}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="fulfillment-track" aria-hidden="true">
        <span style={{ width: `${rate}%` }} />
      </div>
      <small>{rate}%</small>
    </li>
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
              <span>5/1/2026 - 5/4/2026</span>
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

      <section className="dashboard-kpi-grid" aria-label="Selected KPIs">
        {dashboardKpis.map((kpi) => (
          <DashboardKpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

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

      <section className="dashboard-analytics-grid" aria-label="Analytics">
        <article className="dashboard-panel dashboard-analytics-panel revenue-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Revenue Trend</h2>
              <p>Daily sales in the selected range</p>
            </div>
            <strong>322,300 IQD</strong>
          </div>
          <RevenueTrendChart />
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Fulfillment Pipeline</h2>
              <p>Order movement by current status</p>
            </div>
          </div>
          <ul className="fulfillment-list">
            {fulfillmentSteps.map((step) => (
              <FulfillmentStep key={step.label} {...step} />
            ))}
          </ul>
        </article>

        <div className="dashboard-health-grid">
          {healthCards.map((item) => {
            const Icon = item.icon;
            return (
              <article
                className={`dashboard-health-card health-${item.tone}`}
                key={item.label}
              >
                <span>
                  <Icon aria-hidden="true" size={18} strokeWidth={2.25} />
                </span>
                <div>
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                  <small>{item.detail}</small>
                </div>
              </article>
            );
          })}
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
    </div>
  );
}
