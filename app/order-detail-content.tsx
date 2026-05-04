import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Hash,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { StatusPill } from "./status-pill";
import {
  formatIqd,
  getProduct,
  type VendorOrder,
} from "./vendor-dashboard-data";

const NEXT_STATUS: Record<VendorOrder["status"], string | null> = {
  new: "Mark Ready to Ship",
  ready: "Mark Shipped",
  shipped: "Mark Delivered",
  delivered: null,
  cancelled: null,
};

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="order-detail-row">
      <span className="order-detail-icon">
        <Icon aria-hidden="true" size={17} strokeWidth={2.2} />
      </span>
      <div>
        <span className="order-detail-label">{label}</span>
        <strong className="order-detail-value">{value}</strong>
      </div>
    </div>
  );
}

export function OrderDetailContent({ order }: { order: VendorOrder }) {
  const product = getProduct(order.productId);
  const lineTotal = order.priceWithCommission * order.quantity;
  const netTotal = order.priceWithoutCommission * order.quantity;
  const commission = lineTotal - netTotal;
  const nextAction = NEXT_STATUS[order.status];

  return (
    <div className="dashboard-content order-detail-content">
      <header className="page-title-row">
        <div>
          <Link href="/orders" className="order-detail-back">
            <ArrowLeft aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>Back to Orders</span>
          </Link>
          <h1>Order {order.orderNumber}</h1>
          <p className="dashboard-sub">
            Customer, payment, fulfillment and pricing for this order.
          </p>
        </div>
        <div className="order-detail-actions">
          <StatusPill status={order.status} />
          {nextAction ? (
            <button className="discount-create-button" type="button">
              {nextAction}
            </button>
          ) : null}
        </div>
      </header>

      <section className="order-detail-grid" aria-label="Order details">
        <article className="dashboard-panel order-detail-card">
          <h2>Customer</h2>
          <DetailRow label="Customer Name" value={order.customerName} icon={User} />
          <DetailRow label="Phone" value={order.customerPhone} icon={Phone} />
          <DetailRow label="Address" value={order.customerAddress} icon={MapPin} />
          <DetailRow
            label="City / Province"
            value={`${order.city} – ${order.province}`}
            icon={MapPin}
          />
        </article>

        <article className="dashboard-panel order-detail-card">
          <h2>Order</h2>
          <DetailRow label="Order Number" value={order.orderNumber} icon={Hash} />
          <DetailRow label="Order Time" value={order.dateTime} icon={CalendarDays} />
          <DetailRow
            label="Payment Method"
            value={order.paymentMethod}
            icon={CreditCard}
          />
          <DetailRow
            label="Delivery Status"
            value={order.deliveryStatus}
            icon={Truck}
          />
          <DetailRow
            label="Delivery Agent"
            value={order.deliveryAgent}
            icon={ClipboardList}
          />
        </article>

        <article className="dashboard-panel order-detail-card">
          <h2>Product</h2>
          <DetailRow
            label="Product"
            value={product?.nameEn ?? order.productId}
            icon={Package}
          />
          <DetailRow label="SKU" value={product?.sku ?? "-"} icon={Hash} />
          <DetailRow
            label="Vendor Code"
            value={product?.vendorCode ?? "-"}
            icon={Hash}
          />
          <DetailRow label="Color" value={order.color} icon={Package} />
          <DetailRow label="Size" value={order.size} icon={Package} />
          <DetailRow
            label="Quantity"
            value={String(order.quantity)}
            icon={Package}
          />
        </article>

        <article className="dashboard-panel order-detail-card order-detail-pricing">
          <h2>Pricing</h2>
          <DetailRow
            label="Price (excl. commission)"
            value={formatIqd(order.priceWithoutCommission)}
            icon={CreditCard}
          />
          <DetailRow
            label="Price (incl. commission)"
            value={formatIqd(order.priceWithCommission)}
            icon={CreditCard}
          />
          <DetailRow
            label="Quantity"
            value={String(order.quantity)}
            icon={Package}
          />
          <div className="order-detail-totals">
            <div>
              <span>Net Total</span>
              <strong>{formatIqd(netTotal)}</strong>
            </div>
            <div>
              <span>Platform Commission</span>
              <strong>{formatIqd(commission)}</strong>
            </div>
            <div className="order-detail-grand">
              <span>Order Total</span>
              <strong>{formatIqd(lineTotal)}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
