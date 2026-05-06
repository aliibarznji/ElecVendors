"use client";

import { AlertCircle, ClipboardList, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { AmLogEntry } from "./lib/utils";

const ACTION_TYPES = [
  "All",
  "Status Update",
  "Agent Assignment",
  "Fulfillment Change",
  "Approval",
  "Rejection",
  "Campaign Approval",
];

const ACTION_BADGE: Record<string, string> = {
  "Status Update": "is-info",
  "Agent Assignment": "is-pending",
  "Fulfillment Change": "is-pending",
  Approval: "is-active",
  Rejection: "is-rejected",
  "Campaign Approval": "is-active",
};

export function AccountManagerLogContent() {
  const { t } = useLang();
  const [entries, setEntries] = useState<AmLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionFilter, setActionFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function load() {
    setLoading(true);
    setError("");
    api.am
      .log({
        action: actionFilter !== "All" ? actionFilter : undefined,
        search: search || undefined,
        dateFrom: from || undefined,
        dateTo: to || undefined,
      })
      .then(setEntries)
      .catch(() => setError("Failed to load log"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="am-page">
      <div className="am-page-header">
        <div>
          <h1>{t("operationsLog")}</h1>
          <p className="dashboard-sub">All actions performed by the account manager — updates every page load</p>
        </div>
        <button className="row-action-btn" type="button" onClick={load} disabled={loading}>
          <RefreshCw size={13} strokeWidth={2.3} />
          Refresh
        </button>
      </div>

      <section className="account-manager-card">
        <div className="am-filters">
          <label className="order-items-date">
            <span>Action Type</span>
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
              {ACTION_TYPES.map((a) => <option key={a}>{a}</option>)}
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
          <label className="order-items-search">
            <input
              placeholder="Search reference or details…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button className="apply-filter-button" type="button" onClick={load}>
            Apply
          </button>
          <button
            className="purchase-order-reset"
            type="button"
            onClick={() => { setActionFilter("All"); setSearch(""); setFrom(""); setTo(""); }}
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
            <span>Loading log entries…</span>
          </div>
        ) : (
          <div className="purchase-order-table-wrap">
            <table className="purchase-order-table">
              <thead>
                <tr>
                  <th>Date / Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Reference</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="am-empty-state">
                        <ClipboardList size={32} strokeWidth={1.5} />
                        <strong>No log entries yet</strong>
                        <span>Actions taken from the Account Manager section appear here</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  entries.map((e) => (
                    <tr key={e.id} className="product-list-data-row">
                      <td className="am-timestamp">{e.timestamp}</td>
                      <td>
                        <span className="am-user-badge">{e.user}</span>
                      </td>
                      <td>
                        <span className={`approved-status-badge ${ACTION_BADGE[e.action] ?? "is-info"}`}>
                          {e.action}
                        </span>
                      </td>
                      <td><code className="am-code">{e.reference}</code></td>
                      <td>{e.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
