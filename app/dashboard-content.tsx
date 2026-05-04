import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Download,
  MapPin,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  bestSellingProducts,
  formatIqd,
  getMonthlyOrders,
  getMonthlySales,
  getNetSales,
  getPendingOrders,
  getProduct,
  orders,
  ordersByMonth,
  salesByMonth,
  salesByProvince,
} from "./vendor-dashboard-data";

const quickRanges = ["آخر 7 أيام", "آخر 30 يوم", "هذا الشهر", "الشهر السابق"];

const statusLabel = {
  new: "طلب جديد",
  ready: "جاهز للشحن",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const statusClass = {
  new: "is-pending",
  ready: "is-active",
  shipped: "is-info",
  delivered: "is-completed",
  cancelled: "is-rejected",
};

function KpiCard({
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
    <article className={`dashboard-kpi-card kpi-${tone}`}>
      <div className="dashboard-kpi-top">
        <span className="dashboard-kpi-icon">
          <Icon aria-hidden="true" size={19} strokeWidth={2.25} />
        </span>
        <span className="dashboard-kpi-change">تحديث مباشر</span>
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span className="dashboard-kpi-detail">{detail}</span>
    </article>
  );
}

function BarChart({
  data,
  valueFormatter,
}: {
  data: { label: string; value: number }[];
  valueFormatter?: (value: number) => string;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className="revenue-trend-chart dashboard-bars" aria-label="مخطط شهري">
      {data.map((item) => {
        const height = Math.max((item.value / max) * 100, item.value ? 8 : 3);
        return (
          <div className="revenue-bar-item" key={item.label}>
            <span className="chart-value-label">
              {valueFormatter ? valueFormatter(item.value) : item.value}
            </span>
            <span className="revenue-bar-track">
              <span style={{ height: `${height}%` }} />
            </span>
            <small>{item.label}</small>
          </div>
        );
      })}
    </div>
  );
}

function ProductThumb({ tone, label }: { tone: string; label: string }) {
  return (
    <span
      className="sample-product-thumb dashboard-thumb"
      style={{ background: tone }}
      aria-label={label}
    >
      <span>{label.slice(0, 2).toUpperCase()}</span>
    </span>
  );
}

export function DashboardContent() {
  const monthlyOrders = getMonthlyOrders();
  const monthlySales = getMonthlySales();
  const pendingOrders = getPendingOrders();
  const netSales = getNetSales(orders.filter((order) => order.dateTime.startsWith("2026-05")));
  const provinceRows = salesByProvince().slice(0, 5);
  const bestSellers = bestSellingProducts().slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => b.dateTime.localeCompare(a.dateTime)).slice(0, 5);

  const kpis = [
    {
      label: "إجمالي طلبات الشهر",
      value: String(monthlyOrders),
      detail: "كل الطلبات المسجلة خلال أيار",
      tone: "green",
      icon: ShoppingCart,
    },
    {
      label: "إجمالي مبيعات الشهر",
      value: formatIqd(monthlySales),
      detail: "بعد احتساب العمولة على الطلب",
      tone: "blue",
      icon: TrendingUp,
    },
    {
      label: "الطلبات المعلقة",
      value: String(pendingOrders),
      detail: "تحتاج تأكيد المورد أو العميل",
      tone: "orange",
      icon: AlertTriangle,
    },
    {
      label: "صافي المبيعات",
      value: formatIqd(netSales),
      detail: "قبل عمولة المنصة",
      tone: "cyan",
      icon: Wallet,
    },
  ];

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <div>
          <h1>لوحة التحكم الرئيسية</h1>
          <p className="dashboard-sub">
            متابعة شهرية للطلبات، المبيعات، المدن، وأفضل المنتجات مبيعا.
          </p>
        </div>
        <div className="dashboard-controls">
          <div className="primary-controls">
            <button className="export-button" type="button">
              <Download aria-hidden="true" size={20} strokeWidth={2.2} />
              <span>تصدير بيانات اللوحة</span>
            </button>
            <button className="date-range" type="button">
              <span>2026/05/01 - 2026/05/04</span>
              <CalendarDays aria-hidden="true" size={22} strokeWidth={2.1} />
            </button>
          </div>
          <div className="quick-ranges" aria-label="نطاقات التاريخ السريعة">
            {quickRanges.map((range) => (
              <button className="range-button" key={range} type="button">
                {range}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="dashboard-kpi-grid" aria-label="مؤشرات شهرية">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="dashboard-analytics-grid" aria-label="التحليلات">
        <article className="dashboard-panel dashboard-analytics-panel revenue-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>المبيعات حسب الشهر</h2>
              <p>إجمالي المبيعات الشهرية للطلبات غير الملغية</p>
            </div>
            <strong>{formatIqd(monthlySales)}</strong>
          </div>
          <BarChart data={salesByMonth()} valueFormatter={(value) => `${Math.round(value / 1000)}k`} />
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>الطلبات حسب الشهر</h2>
              <p>عدد الطلبات كما يظهر في مرجع العميل</p>
            </div>
            <strong>{monthlyOrders}</strong>
          </div>
          <BarChart data={ordersByMonth()} />
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>المبيعات حسب المحافظة</h2>
              <p>توزيع الطلبات على المدن والمحافظات</p>
            </div>
            <MapPin aria-hidden="true" size={20} strokeWidth={2.3} />
          </div>
          <ul className="fulfillment-list dashboard-ranked-list">
            {provinceRows.map((row) => (
              <li className="fulfillment-step step-blue" key={row.province}>
                <div>
                  <span>{row.province}</span>
                  <strong>{row.orders}</strong>
                </div>
                <div className="fulfillment-track" aria-hidden="true">
                  <span style={{ width: `${Math.max((row.sales / provinceRows[0].sales) * 100, 5)}%` }} />
                </div>
                <small>{formatIqd(row.sales)}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-panel dashboard-analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>أفضل المنتجات مبيعا</h2>
              <p>ترتيب بالكمية المباعة ضمن الطلبات الحالية</p>
            </div>
            <BarChart3 aria-hidden="true" size={20} strokeWidth={2.3} />
          </div>
          <div className="best-seller-list">
            {bestSellers.map(({ product, sold }, index) => (
              <article key={product.id} className="best-seller-row">
                <span className="seller-rank">{index + 1}</span>
                <ProductThumb tone={product.imageTone} label={product.brand} />
                <div>
                  <strong>{product.nameAr}</strong>
                  <span>{product.sku}</span>
                </div>
                <b>{sold} قطعة</b>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-health-grid" aria-label="حالة التشغيل">
        <article className="dashboard-health-card health-green">
          <span>
            <CheckCircle2 aria-hidden="true" size={18} strokeWidth={2.25} />
          </span>
          <div>
            <p>نسبة الإنجاز</p>
            <strong>75%</strong>
            <small>جاهز، مشحون أو مسلم</small>
          </div>
        </article>
        <article className="dashboard-health-card health-orange">
          <span>
            <Package aria-hidden="true" size={18} strokeWidth={2.25} />
          </span>
          <div>
            <p>تنبيهات المخزون</p>
            <strong>1 SKU</strong>
            <small>منتج واحد نفد من المخزون</small>
          </div>
        </article>
        <article className="dashboard-health-card health-cyan">
          <span>
            <TrendingUp aria-hidden="true" size={18} strokeWidth={2.25} />
          </span>
          <div>
            <p>خطط الخصم النشطة</p>
            <strong>1</strong>
            <small>منتجان داخل الخطة</small>
          </div>
        </article>
        <article className="dashboard-health-card">
          <span>
            <Wallet aria-hidden="true" size={18} strokeWidth={2.25} />
          </span>
          <div>
            <p>تسوية قادمة</p>
            <strong>{formatIqd(185000)}</strong>
            <small>متبقية للدفع</small>
          </div>
        </article>
      </section>

      <section className="dashboard-panel table-panel table-panel-large">
        <div className="panel-heading">
          <h2>آخر الطلبات</h2>
        </div>
        <div className="table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>المنتج</th>
                <th>التاريخ والوقت</th>
                <th>المبلغ</th>
                <th>حالة الطلب</th>
                <th>حالة العميل/التوصيل</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const product = getProduct(order.productId);
                return (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{product?.nameAr ?? order.productId}</td>
                    <td>{order.dateTime}</td>
                    <td>{formatIqd(order.priceWithCommission * order.quantity)}</td>
                    <td>
                      <span className={`approved-status-badge ${statusClass[order.status]}`}>
                        {statusLabel[order.status]}
                      </span>
                    </td>
                    <td>{order.deliveryStatus}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
