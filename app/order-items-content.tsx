"use client";

import {
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "all", label: "All Orders" },
  { id: "new", label: "New Orders" },
  { id: "ready", label: "Ready to Ship" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type OrderRow = {
  id: string;
  orderNumber: string;
  orderTime: string;
  thumbnail: string;
  sku: string;
  color: string;
  quantity: number;
  basePrice: number;
  finalPrice: number;
  status: TabId;
  statusLabel: string;
  customerAddress: string;
  customerPhone: string;
  paymentMethod: string;
  available: boolean;
  stock: number;
};

const sampleOrders: OrderRow[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-100214",
    orderTime: "2026-05-02 09:14",
    thumbnail: "SG",
    sku: "sv2411203071322707",
    color: "Silver",
    quantity: 1,
    basePrice: 49000,
    finalPrice: 53900,
    status: "new",
    statusLabel: "New",
    customerAddress: "Karrada, Baghdad",
    customerPhone: "+964 770 145 8800",
    paymentMethod: "Cash on Delivery",
    available: true,
    stock: 12,
  },
  {
    id: "ord-2",
    orderNumber: "ORD-100221",
    orderTime: "2026-05-02 11:42",
    thumbnail: "EM",
    sku: "em-curl-22-bk",
    color: "Black",
    quantity: 2,
    basePrice: 38000,
    finalPrice: 41800,
    status: "ready",
    statusLabel: "Ready to Ship",
    customerAddress: "Ankawa, Erbil",
    customerPhone: "+964 750 332 1140",
    paymentMethod: "FastPay Wallet",
    available: true,
    stock: 5,
  },
  {
    id: "ord-3",
    orderNumber: "ORD-100222",
    orderTime: "2026-05-03 08:01",
    thumbnail: "BR",
    sku: "br-trim-09-rd",
    color: "Red",
    quantity: 1,
    basePrice: 21000,
    finalPrice: 23100,
    status: "shipped",
    statusLabel: "Shipped",
    customerAddress: "Al Hamra, Basra",
    customerPhone: "+964 780 998 7321",
    paymentMethod: "Card",
    available: false,
    stock: 0,
  },
  {
    id: "ord-4",
    orderNumber: "ORD-100190",
    orderTime: "2026-04-28 16:25",
    thumbnail: "SG",
    sku: "sv2411203071322707",
    color: "Silver",
    quantity: 3,
    basePrice: 49000,
    finalPrice: 53900,
    status: "delivered",
    statusLabel: "Delivered",
    customerAddress: "Mansour, Baghdad",
    customerPhone: "+964 771 220 4441",
    paymentMethod: "Cash on Delivery",
    available: true,
    stock: 8,
  },
];

function formatIqd(value: number) {
  return `${value.toLocaleString()} IQD`;
}

function StatusBadge({ status, label }: { status: TabId; label: string }) {
  const variant =
    status === "new"
      ? "is-pending"
      : status === "ready"
        ? "is-active"
        : status === "shipped"
          ? "is-info"
          : "is-completed";
  return <span className={`approved-status-badge ${variant}`}>{label}</span>;
}

function ExpressPricingModal({
  row,
  onClose,
  onApply,
}: {
  row: OrderRow;
  onClose: () => void;
  onApply: (price: number, commission: number) => void;
}) {
  const [cost, setCost] = useState(row.basePrice);
  const [selling, setSelling] = useState(row.finalPrice);
  const [commission, setCommission] = useState(10);
  const margin =
    selling > 0 ? (((selling - cost) / selling) * 100).toFixed(1) : "0.0";

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <div>
            <Zap aria-hidden="true" size={20} strokeWidth={2.4} />
            <h3>Express Pricing</h3>
          </div>
          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <X aria-hidden="true" size={18} strokeWidth={2.4} />
          </button>
        </header>

        <div className="modal-body">
          <p className="modal-sub">SKU: {row.sku}</p>
          <label className="modal-field">
            <span>Cost Price (IQD)</span>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
            />
          </label>
          <label className="modal-field">
            <span>Selling Price (IQD)</span>
            <input
              type="number"
              value={selling}
              onChange={(e) => setSelling(Number(e.target.value))}
            />
          </label>
          <label className="modal-field">
            <span>Commission %</span>
            <input
              type="number"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
            />
          </label>
          <div className="modal-margin-display">
            <span>Calculated Margin</span>
            <strong>{margin}%</strong>
          </div>
        </div>

        <footer className="modal-footer">
          <button className="modal-cancel" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-primary"
            type="button"
            onClick={() => onApply(selling, commission)}
          >
            Apply
          </button>
        </footer>
      </div>
    </div>
  );
}

function InventoryModal({
  row,
  onClose,
  onSave,
}: {
  row: OrderRow;
  onClose: () => void;
  onSave: (available: boolean, stock: number) => void;
}) {
  const [available, setAvailable] = useState(row.available);
  const [stock, setStock] = useState(row.stock);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <div>
            <Boxes aria-hidden="true" size={20} strokeWidth={2.4} />
            <h3>Inventory Management</h3>
          </div>
          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <X aria-hidden="true" size={18} strokeWidth={2.4} />
          </button>
        </header>

        <div className="modal-body">
          <p className="modal-sub">SKU: {row.sku}</p>

          <div className="modal-toggle-row">
            <span>Product Status</span>
            <button
              className="modal-toggle"
              type="button"
              onClick={() => setAvailable((v) => !v)}
              aria-pressed={available}
            >
              <span
                className={`toggle-switch${available ? " is-enabled" : ""}`}
              />
              <strong>{available ? "Available" : "Out of Stock"}</strong>
            </button>
          </div>

          <label className="modal-field">
            <span>Available Quantity</span>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </label>
        </div>

        <footer className="modal-footer">
          <button className="modal-cancel" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-primary"
            type="button"
            onClick={() => onSave(available, stock)}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}

export function OrderItemsContent() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [orders, setOrders] = useState(sampleOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pricingFor, setPricingFor] = useState<OrderRow | null>(null);
  const [inventoryFor, setInventoryFor] = useState<OrderRow | null>(null);

  const filtered = orders.filter((row) => {
    if (activeTab !== "all" && row.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !row.orderNumber.toLowerCase().includes(q) &&
        !row.sku.toLowerCase().includes(q)
      )
        return false;
    }
    if (from && row.orderTime < from) return false;
    if (to && row.orderTime > `${to} 23:59`) return false;
    return true;
  });

  const reset = () => {
    setSearch("");
    setFrom("");
    setTo("");
  };

  return (
    <div className="order-items-content">
      <h1>Order Items</h1>

      <section className="order-items-card" aria-label="Order items">
        <div className="bulk-tabs order-items-tabs">
          {tabs.map((tab) => (
            <button
              className={`bulk-tab${activeTab === tab.id ? " is-active" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="order-items-filters">
          <label className="order-items-search">
            <Search aria-hidden="true" size={16} strokeWidth={2.2} />
            <input
              placeholder="Search by Order # or SKU"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>From</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="order-items-date">
            <span>To</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <button
            className="purchase-order-reset"
            type="button"
            onClick={reset}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={2.2} />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table order-items-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Order Time</th>
                <th>Thumb</th>
                <th>SKU</th>
                <th>Color</th>
                <th>Qty</th>
                <th>Price (excl.)</th>
                <th>Price (incl.)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-cell">
                    No orders match the selected filters
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <>
                    <tr key={row.id} className="product-list-data-row">
                      <td>{row.orderNumber}</td>
                      <td>{row.orderTime}</td>
                      <td>
                        <div className="sample-product-thumb">
                          <span>{row.thumbnail}</span>
                        </div>
                      </td>
                      <td>{row.sku}</td>
                      <td>{row.color}</td>
                      <td>{row.quantity}</td>
                      <td>{formatIqd(row.basePrice)}</td>
                      <td>{formatIqd(row.finalPrice)}</td>
                      <td>
                        <StatusBadge
                          status={row.status}
                          label={row.statusLabel}
                        />
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="row-action-btn"
                            type="button"
                            title="Express Pricing"
                            onClick={() => setPricingFor(row)}
                          >
                            <Zap
                              aria-hidden="true"
                              size={15}
                              strokeWidth={2.4}
                            />
                          </button>
                          <button
                            className="row-action-btn"
                            type="button"
                            title="Stock Management"
                            onClick={() => setInventoryFor(row)}
                          >
                            <Boxes
                              aria-hidden="true"
                              size={15}
                              strokeWidth={2.4}
                            />
                          </button>
                          <button
                            className="row-action-btn"
                            type="button"
                            title="Details"
                            onClick={() =>
                              setExpanded((v) => (v === row.id ? null : row.id))
                            }
                          >
                            <ChevronDown
                              aria-hidden="true"
                              size={15}
                              strokeWidth={2.4}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === row.id ? (
                      <tr key={`${row.id}-detail`} className="row-details-row">
                        <td colSpan={10}>
                          <div className="row-details">
                            <div>
                              <span>Address</span>
                              <strong>{row.customerAddress}</strong>
                            </div>
                            <div>
                              <span>Phone</span>
                              <strong>{row.customerPhone}</strong>
                            </div>
                            <div>
                              <span>Payment</span>
                              <strong>{row.paymentMethod}</strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="purchase-order-pagination">
          <span>Items per page: 20</span>
          <span>
            {filtered.length} of {filtered.length}
          </span>
          <button type="button" aria-label="Previous page" disabled>
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <button type="button" aria-label="Next page" disabled>
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
        </div>
      </section>

      {pricingFor ? (
        <ExpressPricingModal
          row={pricingFor}
          onClose={() => setPricingFor(null)}
          onApply={(price) => {
            setOrders((current) =>
              current.map((r) =>
                r.id === pricingFor.id ? { ...r, finalPrice: price } : r,
              ),
            );
            setPricingFor(null);
          }}
        />
      ) : null}

      {inventoryFor ? (
        <InventoryModal
          row={inventoryFor}
          onClose={() => setInventoryFor(null)}
          onSave={(available, stock) => {
            setOrders((current) =>
              current.map((r) =>
                r.id === inventoryFor.id ? { ...r, available, stock } : r,
              ),
            );
            setInventoryFor(null);
          }}
        />
      ) : null}
    </div>
  );
}
