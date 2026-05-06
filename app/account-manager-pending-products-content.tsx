"use client";

import { AlertCircle, Check, Clock, Loader2, Package, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { AmProduct } from "./lib/utils";

function daysAgo(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

function QueueBadge({ days }: { days: number }) {
  const cls = days >= 5 ? "am-queue-badge--danger" : days >= 3 ? "am-queue-badge--warn" : "am-queue-badge--ok";
  return (
    <span className={`am-queue-badge ${cls}`}>
      <Clock size={11} />
      {days}d
    </span>
  );
}

export function AccountManagerPendingProductsContent() {
  const { t } = useLang();
  const [list, setList] = useState<AmProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejecting, setRejecting] = useState<AmProduct | null>(null);
  const [reason, setReason] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError("");
    api.am
      .pendingProducts()
      .then(setList)
      .catch(() => setError("Failed to load pending products"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function approve(p: AmProduct) {
    setActionId(p.id);
    try {
      await api.am.approveProduct(p.id);
      setList((all) => all.filter((x) => x.id !== p.id));
    } catch {
      // silent
    } finally {
      setActionId(null);
    }
  }

  async function reject() {
    if (!rejecting) return;
    setActionId(rejecting.id);
    try {
      await api.am.rejectProduct(rejecting.id, reason);
      setList((all) => all.filter((x) => x.id !== rejecting.id));
      setRejecting(null);
      setReason("");
    } catch {
      // silent
    } finally {
      setActionId(null);
    }
  }

  const urgent = list.filter((p) => daysAgo(p.createdAt) >= 3).length;

  return (
    <div className="am-page">
      <div className="am-page-header">
        <div>
          <h1>{t("pendingProducts")}</h1>
          <p className="dashboard-sub">Products submitted by vendors awaiting data team review</p>
        </div>
        {urgent > 0 && (
          <span className="am-alert-badge">
            <AlertCircle size={14} />
            {urgent} product{urgent > 1 ? "s" : ""} waiting 3+ days
          </span>
        )}
      </div>

      <div className="am-kpi-strip">
        <div className="am-kpi">
          <span>{list.length}</span>
          <label>Pending Review</label>
        </div>
        <div className="am-kpi am-kpi--cancelled">
          <span>{list.filter((p) => daysAgo(p.createdAt) >= 5).length}</span>
          <label>Overdue (5+ days)</label>
        </div>
        <div className="am-kpi am-kpi--new">
          <span>{list.filter((p) => daysAgo(p.createdAt) < 2).length}</span>
          <label>Fresh ({"<"} 2 days)</label>
        </div>
      </div>

      <section className="account-manager-card">
        <div className="am-section-head">
          <h2>Products Under Review</h2>
          <button className="row-action-btn" type="button" onClick={load} disabled={loading}>
            {loading ? <Loader2 size={13} className="spin" /> : null}
            Refresh
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
            <span>Loading pending products…</span>
          </div>
        ) : (
          <div className="purchase-order-table-wrap">
            <table className="purchase-order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Brand</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Uploaded</th>
                  <th>Queue</th>
                  <th>Approve</th>
                  <th>Reject</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="am-empty-state">
                        <Package size={32} strokeWidth={1.5} />
                        <strong>No products pending review</strong>
                        <span>All submitted products have been processed</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  list.map((p) => {
                    const days = daysAgo(p.createdAt);
                    const busy = actionId === p.id;
                    return (
                      <tr key={p.id} className="product-list-data-row">
                        <td>
                          <div className="am-product-info">
                            <div
                              className="sample-product-thumb"
                              style={{ background: p.imageTone || "#3d5fb6" }}
                            >
                              <span>{(p.nameEn || p.nameAr || "?").slice(0, 2).toUpperCase()}</span>
                            </div>
                            <div>
                              <strong>{p.nameEn || p.nameAr}</strong>
                              {p.nameAr && p.nameEn && (
                                <span className="am-sub-text">{p.nameAr}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td><code className="am-code">{p.sku}</code></td>
                        <td>{p.brand || "—"}</td>
                        <td>
                          <div className="am-vendor-cell">
                            <span className="am-vendor-name">{p.vendor?.name ?? p.vendorId}</span>
                            <span className="am-vendor-ref">{p.vendor?.reference}</span>
                          </div>
                        </td>
                        <td className="am-sub-text">
                          {[p.categoryLevel1, p.categoryLevel2].filter(Boolean).join(" › ") || "—"}
                        </td>
                        <td>{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
                        <td><QueueBadge days={days} /></td>
                        <td>
                          <button
                            className="row-action-btn approve-btn"
                            type="button"
                            onClick={() => approve(p)}
                            disabled={busy}
                          >
                            {busy ? <Loader2 size={13} className="spin" /> : <Check size={14} strokeWidth={2.5} />}
                            Approve
                          </button>
                        </td>
                        <td>
                          <button
                            className="row-action-btn reject-btn"
                            type="button"
                            onClick={() => setRejecting(p)}
                            disabled={busy}
                          >
                            <X size={14} strokeWidth={2.5} />
                            Reject
                          </button>
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

      {rejecting ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <header className="modal-header">
              <div>
                <h3>Reject Product</h3>
                <p className="modal-sub">{rejecting.nameEn || rejecting.nameAr}</p>
              </div>
              <button
                className="modal-close"
                type="button"
                onClick={() => { setRejecting(null); setReason(""); }}
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </header>
            <div className="modal-body">
              <label className="modal-field">
                <span>Reason for rejection</span>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Missing safety certificate, incomplete description…"
                />
              </label>
            </div>
            <footer className="modal-footer">
              <button
                className="modal-cancel"
                type="button"
                onClick={() => { setRejecting(null); setReason(""); }}
                disabled={actionId !== null}
              >
                Cancel
              </button>
              <button
                className="modal-primary"
                type="button"
                onClick={reject}
                disabled={!reason.trim() || actionId !== null}
              >
                {actionId ? <Loader2 size={14} className="spin" /> : null}
                Confirm Rejection
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
