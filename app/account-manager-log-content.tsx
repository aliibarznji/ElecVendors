"use client";

import { useState } from "react";
import { useLang } from "./lang-context";

const actions = [
  "Order Transfer",
  "Agent Assignment",
  "Item Reassignment",
  "Approval",
  "Rejection",
  "Fulfillment Change",
];

type Entry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  reference: string;
  details: string;
};

const entries: Entry[] = [
  {
    id: "l1",
    timestamp: "2026-05-03 09:21",
    user: "AM Sara",
    action: "Order Transfer",
    reference: "AM-300001",
    details: "Transferred to Shex jaffar",
  },
  {
    id: "l2",
    timestamp: "2026-05-03 10:04",
    user: "AM Sara",
    action: "Agent Assignment",
    reference: "AM-300001 / item 1",
    details: "Assigned Agent Sara",
  },
  {
    id: "l3",
    timestamp: "2026-05-03 11:42",
    user: "AM Lina",
    action: "Approval",
    reference: "PROD-22918",
    details: "Approved Shex jaffar Lipstick",
  },
  {
    id: "l4",
    timestamp: "2026-05-03 14:55",
    user: "AM Lina",
    action: "Rejection",
    reference: "PROD-22939",
    details: "Missing safety certificate",
  },
];

export function AccountManagerLogContent() {
  const { t } = useLang();
  const [actionType, setActionType] = useState("All");
  const [user, setUser] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const visible = entries.filter((e) => {
    if (actionType !== "All" && e.action !== actionType) return false;
    if (user && !e.user.toLowerCase().includes(user.toLowerCase())) return false;
    if (from && e.timestamp.slice(0, 10) < from) return false;
    if (to && e.timestamp.slice(0, 10) > to) return false;
    return true;
  });

  return (
    <div className="account-manager-log-content">
      <h1>{t("operationsLog")}</h1>

      <section className="account-manager-card">
        <div className="am-filters">
          <label className="order-items-date">
            <span>Action Type</span>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            >
              <option>All</option>
              {actions.map((a) => (
                <option key={a}>{a}</option>
              ))}
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
          <label className="order-items-search">
            <input
              placeholder="Search user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </label>
        </div>

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
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    No log entries
                  </td>
                </tr>
              ) : (
                visible.map((e) => (
                  <tr key={e.id} className="product-list-data-row">
                    <td>{e.timestamp}</td>
                    <td>{e.user}</td>
                    <td>{e.action}</td>
                    <td>{e.reference}</td>
                    <td>{e.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
