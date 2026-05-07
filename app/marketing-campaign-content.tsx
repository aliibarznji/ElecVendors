"use client";

import {
  Check,
  Clipboard,
  Clock,
  Download,
  Eye,
  FileText,
  Megaphone,
  Plus,
  ShoppingCart,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { ApiMarketingCampaign, ApiMarketingPackage } from "./lib/utils";

const FLOW_STEPS = [
  { Icon: ShoppingCart, label: "Select Package", sub: "Browse & purchase" },
  { Icon: Clock, label: "Pending Approval", sub: "Account manager reviews" },
  { Icon: Zap, label: "Campaign Active", sub: "Code sent to both parties" },
  { Icon: FileText, label: "Download Report", sub: "Full analytics on completion" },
];

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
    case "pending": return "Pending Approval";
    case "active": return "Active";
    case "completed": return "Completed";
    case "rejected": return "Rejected";
  }
}

function statusClass(status: ApiMarketingCampaign["status"]) {
  switch (status) {
    case "pending": return "is-pending";
    case "active": return "is-active";
    case "completed": return "is-completed";
    case "rejected": return "is-rejected";
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

export function MarketingCampaignContent() {
  const [packages, setPackages] = useState<ApiMarketingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState<ApiMarketingCampaign | null>(null);
  const [buying, setBuying] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<ApiMarketingCampaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.marketing
      .packages()
      .then((data) => setPackages(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchCampaigns = useCallback(() => {
    setCampaignsLoading(true);
    api.marketing
      .campaigns()
      .then((data) => setCampaigns(data))
      .catch(() => {})
      .finally(() => setCampaignsLoading(false));
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleBuy = (packageId: string) => {
    setBuying(packageId);
    api.marketing
      .createCampaign(packageId)
      .then((campaign) => {
        setPurchased(campaign);
        fetchCampaigns();
      })
      .catch(() => {})
      .finally(() => setBuying(null));
  };

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
    <div className="marketing-campaign-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("newCampaign")}</h1>
          <p className="dashboard-sub">
            Select a marketing package below to start promoting your products across platform channels.
          </p>
        </div>
      </header>

      <div className="campaign-flow-card">
        <p className="campaign-flow-title">How It Works</p>
        <div className="campaign-flow-steps">
          {FLOW_STEPS.map(({ Icon, label, sub }, i) => (
            <div className="campaign-flow-step" key={label}>
              <div className="campaign-flow-step-icon">
                <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <span className="campaign-flow-step-num">{i + 1}</span>
              <span className="campaign-flow-step-label">{label}</span>
              <span className="campaign-flow-step-sub">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {purchased ? (
        <section className="marketing-confirmation-panel">
          <div className="confirmation-icon">
            <Megaphone aria-hidden="true" size={22} strokeWidth={2.4} />
          </div>
          <h2>Campaign Request Submitted</h2>
          <p className="confirmation-package">{purchased.package?.name ?? purchased.packageId}</p>
          <div className="campaign-code-reveal">
            <span>Campaign Code</span>
            <code>{purchased.code}</code>
          </div>
          <span className="approved-status-badge is-pending">Pending Approval</span>
          <p className="confirmation-helper">
            Your request is now with the account manager for review. Once approved, the campaign code
            will be sent to both you and your account manager, and the campaign will go live.
          </p>
          <button
            className="marketing-package-buy-button"
            type="button"
            onClick={() => setPurchased(null)}
          >
            Buy Another Package
          </button>
        </section>
      ) : loading ? (
        <div className="empty-cell">Loading packages…</div>
      ) : (
        <section className="marketing-package-section" aria-label="Marketing Packages">
          <div className="marketing-package-grid">
            {packages.map((pkg) => (
              <article className="marketing-package-card" key={pkg.id}>
                <div className="marketing-package-heading">
                  <div>
                    <h2>{pkg.name}</h2>
                    <strong>${pkg.price.toLocaleString("en-US")}</strong>
                    <span>{pkg.durationDays} days</span>
                  </div>
                  <Megaphone aria-hidden="true" size={29} strokeWidth={2.1} />
                </div>

                <div className="marketing-package-channels">
                  {pkg.channels.map((ch) => (
                    <span className="marketing-channel-tag" key={ch}>{ch}</span>
                  ))}
                </div>

                <ul>
                  {pkg.details.map((detail) => (
                    <li key={detail}>
                      <Check aria-hidden="true" size={14} strokeWidth={2.4} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="marketing-package-buy-button"
                  type="button"
                  disabled={buying === pkg.id}
                  onClick={() => handleBuy(pkg.id)}
                >
                  <ShoppingCart aria-hidden="true" size={15} strokeWidth={2.4} />
                  {buying === pkg.id ? "Processing…" : "Purchase Package"}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <header className="page-title-row" style={{ marginTop: "2rem" }}>
        <div>
          <h1>{t("activeCampaigns")}</h1>
          <p className="dashboard-sub">
            Track campaign status, countdown, and performance reports after completion.
          </p>
        </div>
      </header>

      {!campaignsLoading && campaigns.length > 0 && (
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
              {campaignsLoading ? (
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
