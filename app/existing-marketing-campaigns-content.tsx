"use client";

import { Clipboard, Download, Eye } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { CAMPAIGNS_KEY } from "./marketing-campaign-content";
import {
  getCampaignRemaining,
  marketingCampaigns,
  marketingPackages,
  type MarketingCampaign,
} from "./vendor-dashboard-data";

function statusLabel(status: MarketingCampaign["status"]) {
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

function statusClass(status: MarketingCampaign["status"]) {
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

function loadStoredCampaigns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CAMPAIGNS_KEY);
    return raw ? (JSON.parse(raw) as MarketingCampaign[]) : [];
  } catch {
    return [];
  }
}

export function ExistingMarketingCampaignsContent() {
  const [stored, setStored] = useState<MarketingCampaign[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setStored(loadStoredCampaigns());
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const campaigns = useMemo(() => [...stored, ...marketingCampaigns], [stored]);

  return (
    <div className="existing-marketing-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>Active Marketing Campaigns</h1>
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
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    No campaigns found. Start by purchasing a marketing package.
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => {
                  const pkg = marketingPackages.find((item) => item.id === campaign.packageId);
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
                        <td>{campaign.purchasedAt}</td>
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
                              <button className="export-button" type="button">
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
