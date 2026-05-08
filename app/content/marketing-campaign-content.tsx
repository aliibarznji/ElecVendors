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
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";
import type { ApiMarketingCampaign, ApiMarketingPackage } from "../lib/utils";

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
    <div className="grid gap-[18px] p-[22px_24px_48px]">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[21px] font-bold tracking-[-0.4px] text-text m-0">{t("newCampaign")}</h1>
          <p className="text-[13px] text-muted mt-[3px] leading-[1.5]">
            Select a marketing package below to start promoting your products across platform channels.
          </p>
        </div>
      </header>

      {/* How It Works flow card */}
      <div className="border border-border rounded-[12px] bg-surface shadow-sm p-[16px_22px_20px] grid gap-[14px]">
        <p className="m-0 text-[12px] font-bold tracking-[0.5px] uppercase text-[#94a3b8]">How It Works</p>
        <div className="campaign-flow-steps grid grid-cols-4 gap-2 relative">
          {FLOW_STEPS.map(({ Icon, label, sub }, i) => (
            <div className="flex flex-col items-center gap-[5px] text-center relative z-[1]" key={label}>
              <div className="inline-grid place-items-center w-9 h-9 rounded-full bg-[#eff2fb] text-[#3d60ae] border-2 border-white shadow-[0_0_0_2px_#c7d2fe]">
                <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <span className="text-[10px] font-bold text-[#94a3b8] tracking-[0.3px]">{i + 1}</span>
              <span className="text-[12px] font-bold text-[#1e2a45] leading-[1.3]">{label}</span>
              <span className="text-[11px] text-[#94a3b8] leading-[1.3]">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {purchased ? (
        <section className="rounded-[14px] border border-[#bbf7d0] bg-[#f0fdf4] p-[20px_22px] grid gap-[10px]">
          <div className="inline-grid place-items-center w-10 h-10 rounded-full bg-[#dcfce7] text-[#15803d]">
            <Megaphone aria-hidden="true" size={22} strokeWidth={2.4} />
          </div>
          <h2 className="text-[18px] font-bold text-text m-0">Campaign Request Submitted</h2>
          <p className="text-[14px] font-bold text-text m-0">{purchased.package?.name ?? purchased.packageId}</p>
          <div className="inline-flex items-center gap-[10px] bg-[#f1f5f9] border border-[#cbd5e1] rounded-[8px] px-[14px] py-2 text-[13px] text-[#64748b]">
            <span>Campaign Code</span>
            <code className="font-mono text-[15px] font-bold text-[#0f172a] tracking-[1.5px]">{purchased.code}</code>
          </div>
          <span className="approved-status-badge is-pending">Pending Approval</span>
          <p className="text-[13px] text-muted leading-[1.5] m-0">
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
        <div className="text-subtle text-[13px] py-7 text-center">Loading packages…</div>
      ) : (
        <section className="grid gap-[14px]" aria-label="Marketing Packages">
          <div className="grid gap-[14px]" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
            {packages.map((pkg) => (
              <article
                className="rounded-[14px] border border-border bg-surface shadow-sm p-5 grid gap-3 transition-[box-shadow,transform,border-color] hover:shadow hover:-translate-y-0.5 hover:border-[rgba(215,25,32,0.2)]"
                key={pkg.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid gap-1">
                    <h2 className="text-[15px] font-bold text-text m-0">{pkg.name}</h2>
                    <strong className="text-[22px] font-bold text-text">${pkg.price.toLocaleString("en-US")}</strong>
                    <span className="text-[12px] text-muted">{pkg.durationDays} days</span>
                  </div>
                  <Megaphone aria-hidden="true" size={29} strokeWidth={2.1} />
                </div>

                <div className="flex flex-wrap gap-[5px] px-5 pt-2.5">
                  {pkg.channels.map((ch) => (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#eff2fb] text-[#3d60ae] text-[11px] font-semibold whitespace-nowrap"
                      key={ch}
                    >{ch}</span>
                  ))}
                </div>

                <ul className="grid gap-2 list-none m-0 p-0">
                  {pkg.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-[13px] text-text">
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

      <header className="flex items-start justify-between gap-4" style={{ marginTop: "2rem" }}>
        <div>
          <h1 className="text-[21px] font-bold tracking-[-0.4px] text-text m-0">{t("activeCampaigns")}</h1>
          <p className="text-[13px] text-muted mt-[3px] leading-[1.5]">
            Track campaign status, countdown, and performance reports after completion.
          </p>
        </div>
      </header>

      {!campaignsLoading && campaigns.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          <div className="border border-border rounded-[10px] bg-surface shadow-sm px-[18px] py-[14px] flex flex-col gap-[3px]">
            <span className="text-[24px] font-bold text-[#0f172a] leading-none">{counts.total}</span>
            <span className="text-[11.5px] text-[#64748b]">Total Campaigns</span>
          </div>
          <div className="border border-border border-t-[3px] border-t-[#25a66a] rounded-[10px] bg-surface shadow-sm px-[18px] py-[14px] flex flex-col gap-[3px]">
            <span className="text-[24px] font-bold text-[#0f172a] leading-none">{counts.active}</span>
            <span className="text-[11.5px] text-[#64748b]">Active</span>
          </div>
          <div className="border border-border border-t-[3px] border-t-[#f2a51a] rounded-[10px] bg-surface shadow-sm px-[18px] py-[14px] flex flex-col gap-[3px]">
            <span className="text-[24px] font-bold text-[#0f172a] leading-none">{counts.pending}</span>
            <span className="text-[11.5px] text-[#64748b]">Pending Approval</span>
          </div>
          <div className="border border-border border-t-[3px] border-t-[#94a3b8] rounded-[10px] bg-surface shadow-sm px-[18px] py-[14px] flex flex-col gap-[3px]">
            <span className="text-[24px] font-bold text-[#0f172a] leading-none">{counts.completed}</span>
            <span className="text-[11.5px] text-[#64748b]">Completed</span>
          </div>
        </div>
      )}

      <section className="campaigns-list-card product-list-card">
        <div className="flex gap-0 border-b border-border px-1">
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
                    <div className="flex flex-col items-center gap-[10px] py-9 px-5 text-[#94a3b8]">
                      <Megaphone size={34} strokeWidth={1.4} aria-hidden="true" />
                      <p className="m-0 text-[14px] text-[#64748b]">
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
                          <span className="inline-flex items-center gap-1 font-mono text-[12px] bg-[#f1f3f9] px-[7px] py-[2px] rounded-[5px] text-[#334155]">
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
                            <span className="inline-flex items-center gap-[5px] bg-[#eff6ff] text-[#1d4ed8] rounded-[6px] px-[9px] py-[3px] text-[12px] font-semibold whitespace-nowrap">
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
                            <div className="p-[14px_16px] bg-[#fafbfe] border-t border-border grid gap-3">
                              <div className="flex items-baseline gap-3 flex-wrap">
                                <h4 className="m-0 text-[14px] font-bold text-[#0f172a]">
                                  {campaign.status === "completed"
                                    ? "Campaign Report"
                                    : "Live Stats"}{" "}
                                  — {campaign.code}
                                </h4>
                                {campaign.startsAt && campaign.endsAt && (
                                  <span className="text-[12px] text-[#94a3b8] font-medium">
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
