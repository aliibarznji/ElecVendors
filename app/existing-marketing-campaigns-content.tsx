"use client";

import { Clipboard, Clock, Download, Eye, Megaphone, Plus } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { ApiMarketingCampaign } from "./lib/utils";

function downloadCampaignReport(campaign: ApiMarketingCampaign) {
  const pkgName = campaign.package?.name ?? campaign.packageId;
  const ctr =
    campaign.views > 0
      ? ((campaign.clicks / campaign.views) * 100).toFixed(2)
      : "0";
  const headers = ["Metric", "Value"];
  const rows: [string, string | number][] = [
    ["Campaign Code", campaign.code],
    ["Package", pkgName],
    ["Status", campaign.status],
    ["Purchase Date", campaign.purchasedAt],
    ["Start Date", campaign.startsAt ?? "-"],
    ["End Date", campaign.endsAt ?? "-"],
    ["Views", campaign.views],
    ["Clicks", campaign.clicks],
    ["Click-Through Rate (%)", ctr],
    ["Sales Generated", campaign.sales],
    ["Reach", campaign.reach],
  ];
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${v}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `campaign-report-${campaign.code}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function getCampaignRemaining(campaign: ApiMarketingCampaign) {
  if (!campaign.startsAt || !campaign.endsAt) return null;
  const end = new Date(campaign.endsAt).getTime();
  const now = Date.now();
  if (now >= end) return null;
  const diff = end - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours };
}

function statusLabel(status: ApiMarketingCampaign["status"]) {
  switch (status) {
    case "pending":
      return "Pending Approval";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "rejected":
      return "Rejected";
  }
}

function statusClass(status: ApiMarketingCampaign["status"]) {
  switch (status) {
    case "pending":
      return "is-pending";
    case "active":
      return "is-active";
    case "completed":
      return "is-completed";
    case "rejected":
      return "is-rejected";
  }
}

type FilterStatus = "all" | ApiMarketingCampaign["status"];

const TABS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
];

export function ExistingMarketingCampaignsContent() {
  const [campaigns, setCampaigns] = useState<ApiMarketingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.marketing
      .campaigns()
      .then((data) => setCampaigns(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      total: campaigns.length,
      active: campaigns.filter((c) => c.status === "active").length,
      pending: campaigns.filter((c) => c.status === "pending").length,
      completed: campaigns.filter((c) => c.status === "completed").length,
    }),
    [campaigns],
  );

  const filtered = useMemo(
    () =>
      filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter),
    [campaigns, filter],
  );

  return (
    <div className="existing-marketing-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("activeCampaigns")}</h1>
          <p className="dashboard-sub">
            Track campaign status, countdown, and performance reports after completion.
          </p>
        </div>
        <Link className="discount-create-button" href="/marketing/new">
          <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
          New Campaign
        </Link>
      </header>

      {!loading && campaigns.length > 0 && (
        <div className="campaigns-summary-strip">
          <div className="campaigns-summary-stat">
            <span className="stat-value">{counts.total}</span>
            <span className="stat-label">Total Campaigns</span>
          </div>
          <div className="campaigns-summary-stat campaigns-summary-active">
            <span className="stat-value">{counts.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="campaigns-summary-stat campaigns-summary-pending">
            <span className="stat-value">{counts.pending}</span>
            <span className="stat-label">Pending Approval</span>
          </div>
          <div className="campaigns-summary-stat campaigns-summary-completed">
            <span className="stat-value">{counts.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      )}

      <section className="campaigns-list-card product-list-card">
        <div className="campaign-status-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`campaign-status-tab${filter === tab.key ? " is-active" : ""}`}
              onClick={() => {
                setFilter(tab.key);
                setOpen(null);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Package</th>
                <th>Code</th>
                <th>Purchase Date</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Time Remaining</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="campaigns-empty-state">
                      <Megaphone size={34} strokeWidth={1.4} aria-hidden="true" />
                      <p>
                        {campaigns.length === 0
                          ? "No campaigns yet."
                          : "No campaigns match this filter."}
                      </p>
                      {campaigns.length === 0 && (
                        <Link className="discount-create-button" href="/marketing/new">
                          Browse Packages
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((campaign) => {
                  const pkg = campaign.package;
                  const remaining = getCampaignRemaining(campaign);
                  const ctr =
                    campaign.views > 0
                      ? ((campaign.clicks / campaign.views) * 100).toFixed(1)
                      : "0";
                  return (
                    <Fragment key={campaign.id}>
                      <tr className="product-list-data-row">
                        <td>{pkg?.name ?? campaign.packageId}</td>
                        <td>
                          {pkg ? `$${pkg.price.toLocaleString("en-US")} / ${pkg.durationDays}d` : "-"}
                        </td>
                        <td>
                          <span className="campaign-code">
                            <code>{campaign.code}</code>
                            <button
                              className="row-action-btn"
                              type="button"
                              aria-label="Copy Code"
                              onClick={() => navigator.clipboard?.writeText(campaign.code)}
                            >
                              <Clipboard aria-hidden="true" size={13} strokeWidth={2.4} />
                            </button>
                          </span>
                        </td>
                        <td>{campaign.purchasedAt.slice(0, 10)}</td>
                        <td>{pkg?.durationDays ?? "-"} days</td>
                        <td>
                          <span
                            className={`approved-status-badge ${statusClass(campaign.status)}`}
                          >
                            {statusLabel(campaign.status)}
                          </span>
                        </td>
                        <td>
                          {campaign.status === "active" && remaining ? (
                            <span className="countdown-badge">
                              <Clock size={12} strokeWidth={2.3} aria-hidden="true" />
                              {remaining.days}d {remaining.hours}h left
                            </span>
                          ) : remaining ? (
                            `${remaining.days}d ${remaining.hours}h`
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {campaign.status === "completed" || campaign.status === "active" ? (
                            <button
                              className="row-action-btn"
                              type="button"
                              onClick={() =>
                                setOpen((cur) => (cur === campaign.id ? null : campaign.id))
                              }
                            >
                              <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                              {campaign.status === "completed" ? "Report" : "Live Stats"}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>

                      {open === campaign.id && (
                        <tr key={`${campaign.id}-report`} className="row-details-row">
                          <td colSpan={8}>
                            <div className="campaign-report">
                              <div className="campaign-report-header">
                                <h4>
                                  {campaign.status === "completed"
                                    ? "Campaign Report"
                                    : "Live Stats"}{" "}
                                  — {campaign.code}
                                </h4>
                                {campaign.startsAt && campaign.endsAt && (
                                  <span className="campaign-report-dates">
                                    {campaign.startsAt.slice(0, 10)} →{" "}
                                    {campaign.endsAt.slice(0, 10)}
                                  </span>
                                )}
                              </div>

                              <div className="kpi-grid kpi-grid-3">
                                <article className="kpi-card kpi-blue">
                                  <p>Views</p>
                                  <strong>{campaign.views.toLocaleString("en-US")}</strong>
                                </article>
                                <article className="kpi-card kpi-cyan">
                                  <p>Clicks</p>
                                  <strong>{campaign.clicks.toLocaleString("en-US")}</strong>
                                </article>
                                <article className="kpi-card kpi-green">
                                  <p>Sales Generated</p>
                                  <strong>{campaign.sales.toLocaleString("en-US")}</strong>
                                </article>
                                <article className="kpi-card kpi-amber">
                                  <p>Reach</p>
                                  <strong>{campaign.reach.toLocaleString("en-US")}</strong>
                                </article>
                                <article className="kpi-card kpi-pink">
                                  <p>Click-Through Rate</p>
                                  <strong>{ctr}%</strong>
                                </article>
                              </div>

                              {campaign.status === "completed" && (
                                <button
                                  className="export-button"
                                  type="button"
                                  onClick={() => downloadCampaignReport(campaign)}
                                >
                                  <Download aria-hidden="true" size={16} strokeWidth={2.3} />
                                  <span>Download Report</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
