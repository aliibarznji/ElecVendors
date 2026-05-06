"use client";

import {
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  Loader2,
  Send,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { AmCampaign, AmOrder } from "./lib/utils";
import { formatIqd } from "./lib/utils";

const ORDER_STATUSES = ["all", "new", "ready", "shipped", "delivered", "cancelled"] as const;
const STATUS_LABEL: Record<string, string> = {
  all: "All",
  new: "New",
  ready: "Ready to Ship",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const STATUS_BADGE: Record<string, string> = {
  new: "is-pending",
  ready: "is-info",
  shipped: "is-active",
  delivered: "is-completed",
  cancelled: "is-rejected",
};

const AGENTS = [
  "Agent Sara",
  "Agent Hussein",
  "Agent Lina",
  "Agent Omar",
  "Agent Zainab",
];

function FulfillmentModal({
  order,
  onClose,
  onSave,
  saving,
}: {
  order: AmOrder;
  onClose: () => void;
  onSave: (f: string) => void;
  saving: boolean;
}) {
  const current = order.deliveryStatus?.startsWith("fulfillment:")
    ? order.deliveryStatus.replace("fulfillment:", "")
    : "Vendor";
  const [pick, setPick] = useState(current);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <div>
            <h3>Set Fulfillment</h3>
            <p className="modal-sub">{order.orderNumber}</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose}>
            <X size={18} strokeWidth={2.4} />
          </button>
        </header>
        <div className="modal-body">
          {(["Vendor", "Company"] as const).map((opt) => (
            <label key={opt} className="modal-radio">
              <input type="radio" checked={pick === opt} onChange={() => setPick(opt)} />
              <span>{opt === "Vendor" ? "Shipped by Vendor" : "Shipped by Company"}</span>
            </label>
          ))}
        </div>
        <footer className="modal-footer">
          <button className="modal-cancel" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="modal-primary"
            type="button"
            onClick={() => onSave(pick)}
            disabled={saving}
          >
            {saving ? <Loader2 size={14} className="spin" /> : null}
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}

export function AccountManagerOrdersContent() {
  const { t } = useLang();
  const [orders, setOrders] = useState<AmOrder[]>([]);
  const [campaigns, setCampaigns] = useState<AmCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [vendorFilter, setVendorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fulfillmentFor, setFulfillmentFor] = useState<AmOrder | null>(null);
  const [savingFulfillment, setSavingFulfillment] = useState(false);
  const [updatingAgent, setUpdatingAgent] = useState<string | null>(null);
  const [approvingCampaign, setApprovingCampaign] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError("");
    Promise.all([
      api.am.orders({ vendor: vendorFilter || undefined, status: statusFilter !== "all" ? statusFilter : undefined, dateFrom: from || undefined, dateTo: to || undefined }),
      api.am.campaigns(),
    ])
      .then(([o, c]) => { setOrders(o); setCampaigns(c); })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const vendorNames = useMemo(() => {
    const names = [...new Set(orders.map((o) => o.vendor?.name).filter(Boolean))];
    return names.sort();
  }, [orders]);

  const visible = useMemo(() => {
    return orders.filter((o) => {
      if (vendorFilter && o.vendor?.name !== vendorFilter) return false;
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (from && o.dateTime.slice(0, 10) < from) return false;
      if (to && o.dateTime.slice(0, 10) > to) return false;
      return true;
    });
  }, [orders, vendorFilter, statusFilter, from, to]);

  const pendingCampaigns = campaigns.filter((c) => c.status === "pending");

  async function handleAgentChange(orderNumber: string, agent: string) {
    setUpdatingAgent(orderNumber);
    try {
      const updated = await api.am.updateOrderAgent(orderNumber, agent);
      setOrders((all) => all.map((o) => (o.orderNumber === orderNumber ? { ...o, ...updated } : o)));
    } catch {
      // silent
    } finally {
      setUpdatingAgent(null);
    }
  }

  async function handleTransferToVendor(orderNumber: string) {
    try {
      const updated = await api.am.updateOrderStatus(orderNumber, "new");
      setOrders((all) => all.map((o) => (o.orderNumber === orderNumber ? { ...o, ...updated } : o)));
    } catch {
      // silent
    }
  }

  async function handleFulfillmentSave(fulfillment: string) {
    if (!fulfillmentFor) return;
    setSavingFulfillment(true);
    try {
      const updated = await api.am.updateOrderAgent(fulfillmentFor.orderNumber, fulfillmentFor.deliveryAgent ?? "", fulfillment);
      setOrders((all) => all.map((o) => (o.orderNumber === fulfillmentFor.orderNumber ? { ...o, ...updated } : o)));
      setFulfillmentFor(null);
    } catch {
      // silent
    } finally {
      setSavingFulfillment(false);
    }
  }

  async function handleApproveCampaign(id: string) {
    setApprovingCampaign(id);
    try {
      const updated = await api.am.approveCampaign(id);
      setCampaigns((all) => all.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    } catch {
      // silent
    } finally {
      setApprovingCampaign(null);
    }
  }

  return (
    <div className="am-page">
      <div className="am-page-header">
        <div>
          <h1>{t("vendorOrders")}</h1>
          <p className="dashboard-sub">All vendor orders — assign agents, set fulfillment, transfer to vendor</p>
        </div>
        {pendingCampaigns.length > 0 && (
          <span className="am-alert-badge">
            <AlertCircle size={14} />
            {pendingCampaigns.length} campaign{pendingCampaigns.length > 1 ? "s" : ""} pending approval
          </span>
        )}
      </div>

      {/* KPI strip */}
      <div className="am-kpi-strip">
        <div className="am-kpi">
          <span>{orders.length}</span>
          <label>Total Orders</label>
        </div>
        <div className="am-kpi am-kpi--new">
          <span>{orders.filter((o) => o.status === "new").length}</span>
          <label>New</label>
        </div>
        <div className="am-kpi am-kpi--shipped">
          <span>{orders.filter((o) => o.status === "shipped").length}</span>
          <label>Shipped</label>
        </div>
        <div className="am-kpi am-kpi--delivered">
          <span>{orders.filter((o) => o.status === "delivered").length}</span>
          <label>Delivered</label>
        </div>
        <div className="am-kpi am-kpi--cancelled">
          <span>{orders.filter((o) => o.status === "cancelled").length}</span>
          <label>Cancelled</label>
        </div>
      </div>

      {/* Orders section */}
      <section className="account-manager-card">
        <div className="am-section-head">
          <h2>Vendor Orders</h2>
          <button className="row-action-btn" type="button" onClick={load} disabled={loading}>
            {loading ? <Loader2 size={13} className="spin" /> : null}
            Refresh
          </button>
        </div>

        <div className="am-filters">
          <label className="order-items-date">
            <span>Vendor</span>
            <select value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}>
              <option value="">All Vendors</option>
              {vendorNames.map((v) => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="order-items-date">
            <span>Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
          </label>
          <label className="order-items-date">
            <span>From</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="order-items-date">
            <span>To</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button
            className="apply-filter-button"
            type="button"
            onClick={load}
          >
            Apply
          </button>
          <button
            className="purchase-order-reset"
            type="button"
            onClick={() => { setVendorFilter(""); setStatusFilter("all"); setFrom(""); setTo(""); }}
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="warning-banner" style={{ margin: "0 20px 16px" }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="am-loading-row">
            <Loader2 size={24} className="spin" />
            <span>Loading orders…</span>
          </div>
        ) : (
          <div className="purchase-order-table-wrap">
            <table className="purchase-order-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Vendor</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Agent</th>
                  <th>Fulfillment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="empty-cell">No orders match the current filters</td>
                  </tr>
                ) : (
                  visible.map((o) => {
                    const fulfillment = o.deliveryStatus?.startsWith("fulfillment:")
                      ? o.deliveryStatus.replace("fulfillment:", "")
                      : "Vendor";
                    return (
                      <tr key={o.id} className="product-list-data-row">
                        <td><strong className="am-order-num">{o.orderNumber}</strong></td>
                        <td>
                          <div className="am-vendor-cell">
                            <span className="am-vendor-name">{o.vendor?.name ?? o.vendorId}</span>
                            <span className="am-vendor-ref">{o.vendor?.reference}</span>
                          </div>
                        </td>
                        <td>{o.customerName}</td>
                        <td className="am-phone">{o.customerPhone}</td>
                        <td className="am-address">{o.city}, {o.province}</td>
                        <td className="am-product-cell">{o.product?.nameEn || o.product?.nameAr || "—"}</td>
                        <td>{o.quantity}</td>
                        <td><strong>{formatIqd(o.priceWithCommission * o.quantity)}</strong></td>
                        <td>{o.paymentMethod}</td>
                        <td>
                          <div className="am-agent-cell">
                            {updatingAgent === o.orderNumber
                              ? <Loader2 size={13} className="spin" />
                              : null}
                            <select
                              className="am-agent-select"
                              value={o.deliveryAgent || ""}
                              onChange={(e) => handleAgentChange(o.orderNumber, e.target.value)}
                              disabled={updatingAgent === o.orderNumber}
                            >
                              <option value="">— Unassigned —</option>
                              {AGENTS.map((a) => <option key={a}>{a}</option>)}
                            </select>
                          </div>
                        </td>
                        <td>
                          <span className={`am-fulfillment-badge ${fulfillment === "Company" ? "am-fulfillment--company" : "am-fulfillment--vendor"}`}>
                            <Truck size={11} />
                            {fulfillment}
                          </span>
                        </td>
                        <td>
                          <span className={`approved-status-badge ${STATUS_BADGE[o.status] ?? "is-pending"}`}>
                            {STATUS_LABEL[o.status] ?? o.status}
                          </span>
                        </td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="row-action-btn"
                              type="button"
                              title="Transfer to Vendor"
                              onClick={() => handleTransferToVendor(o.orderNumber)}
                              disabled={o.status === "new"}
                            >
                              <Send size={13} strokeWidth={2.4} />
                            </button>
                            <button
                              className="row-action-btn"
                              type="button"
                              title="Set Fulfillment"
                              onClick={() => setFulfillmentFor(o)}
                            >
                              <ArrowRightLeft size={13} strokeWidth={2.4} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Campaign Approvals */}
      <section className="account-manager-card">
        <div className="am-section-head">
          <h2>Marketing Campaign Approvals</h2>
          {pendingCampaigns.length > 0 && (
            <span className="am-pending-count">{pendingCampaigns.length} pending</span>
          )}
        </div>
        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Package</th>
                <th>Vendor</th>
                <th>Purchase Date</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-cell">No campaigns</td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="product-list-data-row">
                    <td><code className="am-code">{c.code}</code></td>
                    <td>{c.package?.name}</td>
                    <td>
                      <div className="am-vendor-cell">
                        <span className="am-vendor-name">{c.vendor?.name ?? c.vendorId}</span>
                        <span className="am-vendor-ref">{c.vendor?.reference}</span>
                      </div>
                    </td>
                    <td>{new Date(c.purchasedAt).toLocaleDateString("en-GB")}</td>
                    <td>{c.package?.durationDays ?? "—"} days</td>
                    <td>
                      <span className={`approved-status-badge ${c.status === "pending" ? "is-pending" : c.status === "active" ? "is-active" : c.status === "completed" ? "is-completed" : "is-rejected"}`}>
                        {c.status === "pending" ? "Awaiting Approval" : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {c.status === "pending" ? (
                        <button
                          className="row-action-btn approve-btn"
                          type="button"
                          onClick={() => handleApproveCampaign(c.id)}
                          disabled={approvingCampaign === c.id}
                        >
                          {approvingCampaign === c.id
                            ? <Loader2 size={13} className="spin" />
                            : <CheckCircle2 size={13} strokeWidth={2.4} />}
                          Approve & Activate
                        </button>
                      ) : (
                        <span className="am-sent-label">
                          Code sent
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {fulfillmentFor ? (
        <FulfillmentModal
          order={fulfillmentFor}
          onClose={() => setFulfillmentFor(null)}
          onSave={handleFulfillmentSave}
          saving={savingFulfillment}
        />
      ) : null}
    </div>
  );
}
