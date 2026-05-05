"use client";

import { Check, Clock, FileText, Megaphone, ShoppingCart, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { ApiMarketingCampaign, ApiMarketingPackage } from "./lib/utils";

const FLOW_STEPS = [
  { Icon: ShoppingCart, label: "Select Package", sub: "Browse & purchase" },
  { Icon: Clock, label: "Pending Approval", sub: "Account manager reviews" },
  { Icon: Zap, label: "Campaign Active", sub: "Code sent to both parties" },
  { Icon: FileText, label: "Download Report", sub: "Full analytics on completion" },
];

export function MarketingCampaignContent() {
  const [packages, setPackages] = useState<ApiMarketingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState<ApiMarketingCampaign | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.marketing
      .packages()
      .then((data) => setPackages(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBuy = (packageId: string) => {
    setBuying(packageId);
    api.marketing
      .createCampaign(packageId)
      .then((campaign) => setPurchased(campaign))
      .catch(() => {})
      .finally(() => setBuying(null));
  };

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
    </div>
  );
}
