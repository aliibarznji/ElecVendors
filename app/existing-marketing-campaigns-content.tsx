"use client";

import { Clipboard, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { MarketingCampaignIllustration } from "./marketing-campaign-content";

type Campaign = {
  id: string;
  name: string;
  packageName: string;
  code: string;
  purchaseDate: string;
  duration: number;
  endDate: string;
  status: "Pending Approval" | "Active" | "Completed" | "Rejected";
};

const CAMPAIGNS_KEY = "elecv-campaigns";
const emptyCampaigns: Campaign[] = [];
let cachedCampaignsRaw: string | null = null;
let cachedCampaigns: Campaign[] = [];

function loadCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CAMPAIGNS_KEY);
    return raw ? (JSON.parse(raw) as Campaign[]) : [];
  } catch {
    return [];
  }
}

function getCampaignSnapshot() {
  if (typeof window === "undefined") return emptyCampaigns;

  const raw = window.localStorage.getItem(CAMPAIGNS_KEY) ?? "";
  if (raw === cachedCampaignsRaw) return cachedCampaigns;

  cachedCampaignsRaw = raw;
  cachedCampaigns = loadCampaigns();
  return cachedCampaigns;
}

function getCampaignServerSnapshot() {
  return emptyCampaigns;
}

function subscribeCampaigns(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function statusVariant(status: Campaign["status"]) {
  switch (status) {
    case "Active":
      return "is-active";
    case "Pending Approval":
      return "is-pending";
    case "Rejected":
      return "is-rejected";
    case "Completed":
      return "is-completed";
  }
}

function Countdown({ end }: { end: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const remaining = new Date(end).getTime() - now;
  if (remaining <= 0) return <span className="countdown">Ended</span>;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  return (
    <span className="countdown">
      {days}d {hours}h remaining
    </span>
  );
}

function ReportPanel({ campaign }: { campaign: Campaign }) {
  return (
    <div className="campaign-report">
      <h4>Campaign Report - {campaign.name}</h4>
      <div className="kpi-grid kpi-grid-3">
        <article className="kpi-card kpi-blue">
          <p>Views</p>
          <strong>184,210</strong>
        </article>
        <article className="kpi-card kpi-cyan">
          <p>Clicks</p>
          <strong>9,842</strong>
        </article>
        <article className="kpi-card kpi-green">
          <p>Resulting Sales</p>
          <strong>312</strong>
        </article>
        <article className="kpi-card kpi-amber">
          <p>Reach</p>
          <strong>521,300</strong>
        </article>
        <article className="kpi-card kpi-pink">
          <p>Performance Score</p>
          <strong>8.4 / 10</strong>
        </article>
      </div>
      <div className="campaign-report-actions">
        <button className="export-button" type="button">
          <Download aria-hidden="true" size={16} strokeWidth={2.3} />
          <span>Export PDF</span>
        </button>
        <button className="export-button" type="button">
          <Download aria-hidden="true" size={16} strokeWidth={2.3} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}

export function ExistingMarketingCampaignsContent() {
  const campaigns = useSyncExternalStore(
    subscribeCampaigns,
    getCampaignSnapshot,
    getCampaignServerSnapshot,
  );
  const [openReport, setOpenReport] = useState<string | null>(null);

  if (campaigns.length === 0) {
    return (
      <div className="existing-marketing-content">
        <h1>Existing Marketing Campaigns</h1>

        <section
          className="existing-marketing-panel"
          aria-label="Existing marketing campaigns empty state"
        >
          <div className="existing-marketing-visual-wrap">
            <MarketingCampaignIllustration />
          </div>

          <div className="existing-marketing-copy">
            <h2>You have not created any campaigns</h2>
            <p>
              Marketing campaigns can be used to drive traffic to your store or
              product. When used in combination with an offer or promotion,
              they can be very effective in increasing sales and increasing
              awareness of your products.
            </p>
            <p>
              Elryan.com uses advanced AI to analyse more than 26 data points
              for each customer, and recommend and advertise the most relevant
              product suggestions. Click start to create your first campaign and
              get your first $100 of advertising for free.
            </p>
          </div>

          <Link className="existing-marketing-start-button" href="/marketing/new">
            START
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="existing-marketing-content">
      <h1>Existing Marketing Campaigns</h1>

      <section className="campaigns-list-card">
        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Package</th>
                <th>Code</th>
                <th>Purchased</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Countdown</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <>
                  <tr key={c.id} className="product-list-data-row">
                    <td>{c.name}</td>
                    <td>{c.packageName}</td>
                    <td>
                      <span className="campaign-code">
                        <code>{c.code}</code>
                        <button
                          type="button"
                          className="row-action-btn"
                          aria-label="Copy code"
                          onClick={() =>
                            navigator.clipboard?.writeText(c.code).catch(() => {})
                          }
                        >
                          <Clipboard
                            aria-hidden="true"
                            size={13}
                            strokeWidth={2.4}
                          />
                        </button>
                      </span>
                    </td>
                    <td>{new Date(c.purchaseDate).toLocaleDateString()}</td>
                    <td>{c.duration} days</td>
                    <td>
                      <span
                        className={`approved-status-badge ${statusVariant(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.status === "Active" ? (
                        <Countdown end={c.endDate} />
                      ) : c.status === "Completed" ? (
                        "Ended"
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {c.status === "Completed" ? (
                        <button
                          className="row-action-btn"
                          type="button"
                          onClick={() =>
                            setOpenReport((v) => (v === c.id ? null : c.id))
                          }
                        >
                          <Download
                            aria-hidden="true"
                            size={14}
                            strokeWidth={2.4}
                          />
                          <span>Download Report</span>
                        </button>
                      ) : c.status === "Active" ? (
                        <button
                          className="row-action-btn"
                          type="button"
                          onClick={() =>
                            setOpenReport((v) => (v === c.id ? null : c.id))
                          }
                        >
                          View Live Stats
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  {openReport === c.id ? (
                    <tr key={`${c.id}-report`} className="row-details-row">
                      <td colSpan={8}>
                        <ReportPanel campaign={c} />
                      </td>
                    </tr>
                  ) : null}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
