"use client";

import { Check, Megaphone, ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  marketingPackages,
  vendorProfile,
  type MarketingCampaign,
} from "./vendor-dashboard-data";

export const CAMPAIGNS_KEY = "elecv-campaigns";

function readCampaigns(): MarketingCampaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CAMPAIGNS_KEY);
    return raw ? (JSON.parse(raw) as MarketingCampaign[]) : [];
  } catch {
    return [];
  }
}

function saveCampaign(campaign: MarketingCampaign) {
  if (typeof window === "undefined") return;
  const next = [campaign, ...readCampaigns()];
  window.localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(next));
  window.dispatchEvent(new StorageEvent("storage", { key: CAMPAIGNS_KEY }));
}

export function MarketingCampaignContent() {
  const [purchased, setPurchased] = useState<MarketingCampaign | null>(null);

  return (
    <div className="marketing-campaign-content dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>شراء حملة تسويقية</h1>
          <p className="dashboard-sub">
            اختر باقة تسويقية من المنصة. بعد الشراء تظهر عند مدير الحساب بحالة بانتظار الموافقة.
          </p>
        </div>
      </header>

      {purchased ? (
        <section className="marketing-confirmation-panel">
          <div className="confirmation-icon">
            <Megaphone aria-hidden="true" size={28} strokeWidth={2.4} />
          </div>
          <h2>تم إرسال طلب الحملة</h2>
          <p className="confirmation-package">{purchased.code}</p>
          <span className="approved-status-badge is-pending">بانتظار الموافقة</span>
          <p className="confirmation-helper">
            سيظهر الطلب في لوحة مدير الحساب، وعند الموافقة تصبح الحملة نشطة ويتم إرسال الكود
            للمورد ومدير الحساب.
          </p>
          <button
            className="marketing-package-buy-button"
            type="button"
            onClick={() => setPurchased(null)}
          >
            شراء باقة أخرى
          </button>
        </section>
      ) : (
        <section className="marketing-package-section" aria-label="باقات التسويق">
          <div className="marketing-package-grid">
            {marketingPackages.map((pkg) => (
              <article className="marketing-package-card" key={pkg.id}>
                <div className="marketing-package-heading">
                  <div>
                    <h2>{pkg.name}</h2>
                    <strong>${pkg.price.toLocaleString("en-US")}</strong>
                    <span>{pkg.durationDays} يوم</span>
                  </div>
                  <Megaphone aria-hidden="true" size={29} strokeWidth={2.1} />
                </div>
                <ul>
                  <li>
                    <Check aria-hidden="true" size={14} strokeWidth={2.4} />
                    <span>القنوات: {pkg.channels.join("، ")}</span>
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
                  onClick={() => {
                    const campaign: MarketingCampaign = {
                      id: `camp-${Date.now()}`,
                      packageId: pkg.id,
                      vendorId: vendorProfile.reference,
                      code: `EM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
                      status: "pending",
                      purchasedAt: "2026-05-04",
                      views: 0,
                      clicks: 0,
                      sales: 0,
                      reach: 0,
                    };
                    saveCampaign(campaign);
                    setPurchased(campaign);
                  }}
                >
                  <ShoppingCart aria-hidden="true" size={16} strokeWidth={2.4} />
                  شراء من اللوحة
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
