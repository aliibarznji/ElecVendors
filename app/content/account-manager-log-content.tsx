"use client";

import { AlertCircle, ClipboardList, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";
import type { AmLogEntry } from "../lib/utils";

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
    <div className="flex flex-col gap-5 px-7 pt-6 pb-12">
      <div className="flex items-start justify-between gap-4">
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
        <div className="flex flex-wrap items-end gap-[10px] px-5 py-4 border-b border-border rtl:flex-row-reverse">
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
          <button className="discount-create-button" type="button" onClick={load}>
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
          <div className="flex items-center gap-[9px] mx-5 mb-4 px-[14px] py-[11px] rounded-[10px] border border-[#fed7aa] bg-[#fff7ed] text-[#9a3412] text-[13px]">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-[10px] px-5 py-12 text-[#64748b] text-[13.5px]">
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
                      <div className="flex flex-col items-center gap-2 px-5 py-12 text-[#94a3b8] text-center">
                        <ClipboardList size={32} strokeWidth={1.5} />
                        <strong className="text-[14px] font-semibold text-[#475569]">No log entries yet</strong>
                        <span className="text-[13px]">Actions taken from the Account Manager section appear here</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  entries.map((e) => (
                    <tr key={e.id} className="product-list-data-row">
                      <td className="font-mono text-[12.5px] text-[#475569] whitespace-nowrap">{e.timestamp}</td>
                      <td>
                        <span className="inline-flex px-[10px] py-[2px] rounded-full bg-[#eff6ff] text-[#1d4ed8] text-[11.5px] font-semibold border border-[#bfdbfe]">
                          {e.user}
                        </span>
                      </td>
                      <td>
                        <span className={`approved-status-badge ${ACTION_BADGE[e.action] ?? "is-info"}`}>
                          {e.action}
                        </span>
                      </td>
                      <td><code className="font-mono text-[12px] bg-[#f1f5f9] px-[6px] py-[2px] rounded-[4px] text-[#334155]">{e.reference}</code></td>
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
