"use client";

import { Clipboard, Download, Eye } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { ApiMarketingCampaign } from "./lib/utils";

function downloadCampaignReport(campaign: ApiMarketingCampaign) {
  const pkgName = campaign.package?.name ?? campaign.packageId;
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
    ["Sales Generated", campaign.sales],
    ["Reach", campaign.reach],
  ];
  const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
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

export function ExistingMarketingCampaignsContent() {
  const [campaigns, setCampaigns] = useState<ApiMarketingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.marketing
      .campaigns()
      .then((data) => setCampaigns(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="existing-marketing-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("activeCampaigns")}</h1>
          <p className="dashboard-sub">
            Track campaign status, campaign code, countdown, and performance reports after completion.
          </p>
        </div>
        <Link className="discount-create-button" href="/marketing/new">
          New Campaign
        </Link>
      </header>

      <section className="campaigns-list-card product-list-card">
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
                <th>Report</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    Loading…
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    No campaigns found. Start by purchasing a marketing package.
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => {
                  const pkg = campaign.package;
                  const remaining = getCampaignRemaining(campaign);
                  return (
                    <Fragment key={campaign.id}>
                      <tr className="product-list-data-row">
                        <td>{pkg?.name ?? campaign.packageId}</td>
                        <td>{pkg ? `$${pkg.price} / ${pkg.durationDays} days` : "-"}</td>
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
                          <span className={`approved-status-badge ${statusClass(campaign.status)}`}>
                            {statusLabel(campaign.status)}
                          </span>
                        </td>
                        <td>
                          {remaining ? `${remaining.days} days / ${remaining.hours} hours` : "-"}
                        </td>
                        <td>
                          {campaign.status === "completed" || campaign.status === "active" ? (
                            <button
                              className="row-action-btn"
                              type="button"
                              onClick={() =>
                                setOpen((current) =>
                                  current === campaign.id ? null : campaign.id,
                                )
                              }
                            >
                              <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                              {campaign.status === "completed" ? "Download Report" : "Live Stats"}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                      {open === campaign.id ? (
                        <tr key={`${campaign.id}-report`} className="row-details-row">
                          <td colSpan={8}>
                            <div className="campaign-report">
                              <h4>Campaign Report - {campaign.code}</h4>
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
                              </div>
                              <button
                                className="export-button"
                                type="button"
                                onClick={() => downloadCampaignReport(campaign)}
                              >
                                <Download aria-hidden="true" size={16} strokeWidth={2.3} />
                                <span>Download Report</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : null}
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
