"use client";

import { ArrowRightLeft, Check, Megaphone, Send, UserPlus, X } from "lucide-react";
import { Fragment, useState } from "react";
import {
  marketingCampaigns,
  marketingPackages,
  todayIso,
  type MarketingCampaign,
} from "./vendor-dashboard-data";

const vendors = ["Sheglam Iraq", "Electromall Direct", "Braun Distributor", "Philips Iraq"];
const agents = ["Agent Sara", "Agent Hussein", "Agent Lina", "Agent Omar"];

type Item = {
  id: string;
  product: string;
  sku: string;
  qty: number;
  agent: string;
};

type Order = {
  id: string;
  orderNumber: string;
  vendor: string;
  customer: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  payment: string;
  fulfillment: "Vendor" | "Company";
  status: string;
  items: Item[];
};

const sample: Order[] = [
  {
    id: "o1",
    orderNumber: "AM-300001",
    vendor: "Sheglam Iraq",
    customer: "Mariam K.",
    customerPhone: "+964 770 145 8800",
    customerAddress: "Karrada, Baghdad",
    total: 53900,
    payment: "Cash on Delivery",
    fulfillment: "Vendor",
    status: "Pending Vendor Acceptance",
    items: [
      {
        id: "i1",
        product: "Sheglam Curling Iron Silver",
        sku: "sv2411203071322707",
        qty: 1,
        agent: "Agent Sara",
      },
    ],
  },
  {
    id: "o2",
    orderNumber: "AM-300002",
    vendor: "Electromall Direct",
    customer: "Hassan A.",
    customerPhone: "+964 750 332 1140",
    customerAddress: "Ankawa, Erbil",
    total: 83600,
    payment: "FastPay",
    fulfillment: "Company",
    status: "Awaiting Transfer",
    items: [
      {
        id: "i2",
        product: "Curl Pro Black",
        sku: "em-curl-22-bk",
        qty: 1,
        agent: "Agent Hussein",
      },
      {
        id: "i3",
        product: "Buds White",
        sku: "or-buds-12-wh",
        qty: 2,
        agent: "Agent Lina",
      },
    ],
  },
];

function FulfillmentModal({
  order,
  onClose,
  onSave,
}: {
  order: Order;
  onClose: () => void;
  onSave: (f: "Vendor" | "Company") => void;
}) {
  const [pick, setPick] = useState<"Vendor" | "Company">(order.fulfillment);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <div>
            <h3>Set Fulfillment - {order.orderNumber}</h3>
          </div>
          <button className="modal-close" type="button" onClick={onClose}>
            <X aria-hidden="true" size={18} strokeWidth={2.4} />
          </button>
        </header>
        <div className="modal-body">
          <label className="modal-radio">
            <input
              type="radio"
              checked={pick === "Vendor"}
              onChange={() => setPick("Vendor")}
            />
            <span>Shipping by Vendor</span>
          </label>
          <label className="modal-radio">
            <input
              type="radio"
              checked={pick === "Company"}
              onChange={() => setPick("Company")}
            />
            <span>Shipping by Company</span>
          </label>
        </div>
        <footer className="modal-footer">
          <button className="modal-cancel" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-primary"
            type="button"
            onClick={() => onSave(pick)}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}

function TransferAgentModal({
  item,
  onClose,
  onSave,
}: {
  item: Item;
  onClose: () => void;
  onSave: (agent: string, reason: string) => void;
}) {
  const [agent, setAgent] = useState(item.agent);
  const [reason, setReason] = useState("Unavailable");
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <div>
            <h3>Transfer Item to Another Agent</h3>
          </div>
          <button className="modal-close" type="button" onClick={onClose}>
            <X aria-hidden="true" size={18} strokeWidth={2.4} />
          </button>
        </header>
        <div className="modal-body">
          <p className="modal-sub">{item.product}</p>
          <label className="modal-field">
            <span>Agent</span>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
            >
              {agents.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label className="modal-field">
            <span>Reason</span>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option>Unavailable</option>
              <option>Cheaper at second agent</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <footer className="modal-footer">
          <button className="modal-cancel" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-primary"
            type="button"
            onClick={() => onSave(agent, reason)}
          >
            Transfer
          </button>
        </footer>
      </div>
    </div>
  );
}

export function AccountManagerOrdersContent() {
  const [orders, setOrders] = useState(sample);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(marketingCampaigns);
  const [vendorFilter, setVendorFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fulfillmentFor, setFulfillmentFor] = useState<Order | null>(null);
  const [transferItem, setTransferItem] = useState<{
    orderId: string;
    item: Item;
  } | null>(null);

  const visible = orders.filter((o) => {
    if (vendorFilter.length > 0 && !vendorFilter.includes(o.vendor))
      return false;
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="account-manager-orders-content">
      <h1>Vendor Orders</h1>

      <section className="account-manager-card">
        <div className="am-filters">
          <label className="order-items-date">
            <span>Vendor</span>
            <select
              value={vendorFilter[0] ?? ""}
              onChange={(e) =>
                setVendorFilter(e.target.value ? [e.target.value] : [])
              }
            >
              <option value="">All Vendors</option>
              {vendors.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="order-items-date">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Pending Vendor Acceptance</option>
              <option>Awaiting Transfer</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
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
            onClick={() => {
              setVendorFilter([]);
              setStatusFilter("All");
              setFrom("");
              setTo("");
            }}
          >
            Reset
          </button>
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Vendor</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <Fragment key={o.id}>
                  <tr className="product-list-data-row">
                    <td>{o.orderNumber}</td>
                    <td>{o.vendor}</td>
                    <td>{o.customer}</td>
                    <td>{o.customerPhone}</td>
                    <td>{o.customerAddress}</td>
                    <td>{o.items.length}</td>
                    <td>{o.total.toLocaleString()} IQD</td>
                    <td>{o.payment}</td>
                    <td>{o.fulfillment === "Vendor" ? "By Vendor" : "By Company"}</td>
                    <td>
                      <span className="approved-status-badge is-pending">
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="row-action-btn"
                          type="button"
                          title="Transfer to Vendor"
                          onClick={() =>
                            setOrders((all) =>
                              all.map((x) =>
                                x.id === o.id
                                  ? { ...x, status: "Pending Vendor Acceptance" }
                                  : x,
                              ),
                            )
                          }
                        >
                          <Send aria-hidden="true" size={14} strokeWidth={2.4} />
                        </button>
                        <button
                          className="row-action-btn"
                          type="button"
                          title="Set Fulfillment"
                          onClick={() => setFulfillmentFor(o)}
                        >
                          <UserPlus
                            aria-hidden="true"
                            size={14}
                            strokeWidth={2.4}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="row-details-row">
                    <td colSpan={11}>
                      <div className="am-items">
                        {o.items.map((item) => (
                          <div key={item.id} className="am-item-row">
                            <div>
                              <strong>{item.product}</strong>
                              <span>
                                {item.sku} · qty {item.qty}
                              </span>
                            </div>
                            <div className="am-item-actions">
                              <label>
                                Agent
                                <select
                                  value={item.agent}
                                  onChange={(e) =>
                                    setOrders((all) =>
                                      all.map((x) =>
                                        x.id === o.id
                                          ? {
                                              ...x,
                                              items: x.items.map((i) =>
                                                i.id === item.id
                                                  ? { ...i, agent: e.target.value }
                                                  : i,
                                              ),
                                            }
                                          : x,
                                      ),
                                    )
                                  }
                                >
                                  {agents.map((a) => (
                                    <option key={a}>{a}</option>
                                  ))}
                                </select>
                              </label>
                              <button
                                className="row-action-btn"
                                type="button"
                                title="Transfer to another agent"
                                onClick={() =>
                                  setTransferItem({ orderId: o.id, item })
                                }
                              >
                                <ArrowRightLeft
                                  aria-hidden="true"
                                  size={14}
                                  strokeWidth={2.4}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="account-manager-card campaign-approval-card">
        <div className="panel-heading">
          <h2>موافقات الحملات التسويقية</h2>
        </div>
        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>الكود</th>
                <th>الباقة</th>
                <th>المورد</th>
                <th>تاريخ الشراء</th>
                <th>الحالة</th>
                <th>اعتماد</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const pkg = marketingPackages.find((item) => item.id === campaign.packageId);
                return (
                  <tr className="product-list-data-row" key={campaign.id}>
                    <td>{campaign.code}</td>
                    <td>{pkg?.name}</td>
                    <td>{campaign.vendorId}</td>
                    <td>{campaign.purchasedAt}</td>
                    <td>
                      <span
                        className={`approved-status-badge ${
                          campaign.status === "pending" ? "is-pending" : "is-active"
                        }`}
                      >
                        {campaign.status === "pending" ? "بانتظار الموافقة" : campaign.status}
                      </span>
                    </td>
                    <td>
                      {campaign.status === "pending" ? (
                        <button
                          className="row-action-btn approve-btn"
                          type="button"
                          onClick={() =>
                            setCampaigns((current) =>
                              current.map((item) =>
                                item.id === campaign.id
                                  ? {
                                      ...item,
                                      status: "active",
                                      startsAt: todayIso,
                                      endsAt: "2026-05-18",
                                    }
                                  : item,
                              ),
                            )
                          }
                        >
                          <Check aria-hidden="true" size={14} strokeWidth={2.4} />
                          اعتماد وإرسال الكود
                        </button>
                      ) : (
                        <span className="row-action-btn">
                          <Megaphone aria-hidden="true" size={14} strokeWidth={2.4} />
                          تم الإرسال
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {fulfillmentFor ? (
        <FulfillmentModal
          order={fulfillmentFor}
          onClose={() => setFulfillmentFor(null)}
          onSave={(f) => {
            setOrders((all) =>
              all.map((x) =>
                x.id === fulfillmentFor.id ? { ...x, fulfillment: f } : x,
              ),
            );
            setFulfillmentFor(null);
          }}
        />
      ) : null}

      {transferItem ? (
        <TransferAgentModal
          item={transferItem.item}
          onClose={() => setTransferItem(null)}
          onSave={(agent) => {
            setOrders((all) =>
              all.map((x) =>
                x.id === transferItem.orderId
                  ? {
                      ...x,
                      items: x.items.map((i) =>
                        i.id === transferItem.item.id ? { ...i, agent } : i,
                      ),
                    }
                  : x,
              ),
            );
            setTransferItem(null);
          }}
        />
      ) : null}
    </div>
  );
}
