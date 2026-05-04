"use client";

import { Check, Megaphone, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { ApiMarketingCampaign, ApiMarketingPackage } from "./lib/utils";

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
      .then((campaign) => {
        setPurchased(campaign);
      })
      .catch(() => {})
      .finally(() => setBuying(null));
  };

  return (
    <div className="marketing-campaign-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("newCampaign")}</h1>
          <p className="dashboard-sub">{t("newCampaignSub")}</p>
        </div>
      </header>

      {purchased ? (
        <section className="marketing-confirmation-panel">
          <div className="confirmation-icon">
            <Megaphone aria-hidden="true" size={28} strokeWidth={2.4} />
          </div>
          <h2>Campaign request submitted</h2>
          <p className="confirmation-package">{purchased.code}</p>
          <span className="approved-status-badge is-pending">Pending approval</span>
          <p className="confirmation-helper">
            The request will appear in the account manager panel, and upon approval, the campaign will become active and the code will be sent
            to the vendor and account manager.
          </p>
          <button
            className="marketing-package-buy-button"
            type="button"
            onClick={() => setPurchased(null)}
          >
            Buy another package
          </button>
        </section>
      ) : loading ? (
        <div className="empty-cell">Loading…</div>
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
                <ul>
                  <li>
                    <Check aria-hidden="true" size={14} strokeWidth={2.4} />
                    <span>Channels: {pkg.channels.join(", ")}</span>
                  </li>
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
                  <ShoppingCart aria-hidden="true" size={16} strokeWidth={2.4} />
                  Buy from panel
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
