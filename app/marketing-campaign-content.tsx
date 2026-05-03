"use client";

import { Briefcase, Check } from "lucide-react";
import { useState } from "react";

const marketingPackages = [
  {
    name: "Starter Package",
    price: "$250",
    features: [
      "1 Facebook Story, 1 Instagram Story",
      "1 Facebook post, 1 Instagram post",
      "Free Materials Design",
    ],
  },
  {
    name: "Bronze Package",
    price: "$500",
    features: [
      "1 week campaign",
      "Free Marketing Materials Design",
      "1 Facebook post, 1 Instagram post",
      "Reach of 250k-300k customers guaranteed",
      "1 Facebook Story, 1 Instagram Story",
    ],
  },
  {
    name: "Silver Package",
    price: "$1000",
    features: [
      "2 week campaign",
      "Free Marketing Materials Design",
      "1 Facebook post, 1 Instagram post",
      "Reach of 750k+ customers guaranteed",
      "Facebook & Instagram stories",
      "Mobile app notification",
    ],
  },
  {
    name: "Gold Package",
    price: "$2000",
    features: [
      "1 month campaign",
      "Free Marketing Materials Design",
      "2 Facebook post, 2 Instagram post",
      "Reach of 1.5M customers guaranteed",
      "Facebook & Instagram stories",
      "2 Mobile app notification",
      "Banner",
      "Facebook & Instagram stories",
    ],
  },
];

export function MarketingCampaignIllustration() {
  return (
    <svg
      className="marketing-campaign-illustration"
      viewBox="0 0 360 280"
      role="img"
      aria-label="People creating an online marketing campaign"
    >
      <g fill="#d6f6fb">
        <path d="M85 44c10-22 35-22 50-9 12 10 20 10 34 2 16-10 33 1 41 17H85z" />
        <path d="M226 26c13-16 31-5 41-2 10 3 23-10 39 1 10 7 15 18 17 31h-111c1-13 6-22 14-30z" />
        <path d="M52 103c15-15 35-5 44 6h-63c4-4 10-5 19-6z" />
      </g>

      <ellipse cx="180" cy="239" rx="142" ry="11" fill="#c8d2dd" opacity="0.55" />

      <g>
        <rect x="73" y="78" width="214" height="145" rx="8" fill="#00527b" />
        <rect x="87" y="88" width="186" height="118" rx="4" fill="#ffffff" />
        <rect x="99" y="101" width="162" height="13" fill="#91def0" />
        <rect x="104" y="105" width="48" height="4" fill="#ffffff" opacity="0.65" />
        <rect x="247" y="104" width="5" height="5" fill="#ffffff" opacity="0.75" />
        <rect x="255" y="104" width="5" height="5" fill="#ffffff" opacity="0.75" />
        <rect x="263" y="104" width="5" height="5" fill="#ffffff" opacity="0.75" />
        <rect x="106" y="121" width="87" height="51" rx="3" fill="#ff7fa8" />
        <rect x="202" y="121" width="59" height="36" rx="3" fill="#c5f2fb" />
        <rect x="106" y="180" width="54" height="27" rx="3" fill="#c5f2fb" />
        <rect x="170" y="180" width="42" height="27" rx="3" fill="#c5f2fb" />
        <rect x="221" y="180" width="39" height="27" rx="3" fill="#ffc0d2" />
        <circle cx="128" cy="146" r="17" fill="#ffffff" />
        <path
          d="M119 145l7 7 14-16"
          fill="none"
          stroke="#00618c"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <rect x="153" y="133" width="30" height="6" rx="2" fill="#ffffff" opacity="0.8" />
        <rect x="153" y="147" width="29" height="6" rx="2" fill="#ffffff" opacity="0.8" />
        <rect x="153" y="161" width="39" height="6" rx="2" fill="#ffffff" opacity="0.8" />
        <rect x="204" y="176" width="17" height="17" rx="4" fill="#0089be" />
        <rect x="233" y="176" width="17" height="17" rx="4" fill="#a7ebf4" />
        <rect x="83" y="219" width="194" height="11" rx="6" fill="#00618c" />
        <rect x="123" y="229" width="115" height="18" rx="9" fill="#00618c" />
      </g>

      <g>
        <circle cx="84" cy="162" r="11" fill="#ffbe97" />
        <path d="M74 174h20l11 56H61z" fill="#ff5b63" />
        <path d="M74 178l-24 25" stroke="#ff5b63" strokeLinecap="round" strokeWidth="8" />
        <path d="M96 178l25 23" stroke="#ff5b63" strokeLinecap="round" strokeWidth="8" />
        <path d="M64 230l-17 18" stroke="#ff5b63" strokeLinecap="round" strokeWidth="8" />
        <path d="M99 230l18 17" stroke="#ff5b63" strokeLinecap="round" strokeWidth="8" />
        <path d="M72 158c5-17 25-14 29 3l-9 3c-5-6-10-6-18 1z" fill="#003d5c" />
        <path d="M119 201l31-10" stroke="#1a99cb" strokeLinecap="round" strokeWidth="5" />
      </g>

      <g>
        <circle cx="184" cy="198" r="12" fill="#ffbe97" />
        <path d="M171 212h26l10 55h-46z" fill="#2bbde3" />
        <path d="M170 216l-23 34" stroke="#2bbde3" strokeLinecap="round" strokeWidth="8" />
        <path d="M198 216l22 34" stroke="#2bbde3" strokeLinecap="round" strokeWidth="8" />
        <path d="M166 267l-9 20" stroke="#2bbde3" strokeLinecap="round" strokeWidth="8" />
        <path d="M201 267l11 19" stroke="#2bbde3" strokeLinecap="round" strokeWidth="8" />
        <path d="M172 195c6-18 25-16 31 1l-7 6c-6-8-13-8-21 0z" fill="#003d5c" />
      </g>

      <g>
        <circle cx="245" cy="119" r="11" fill="#ffbe97" />
        <path d="M234 132h23l10 57h-45z" fill="#ff6f61" />
        <path d="M235 133l-16 30" stroke="#ff6f61" strokeLinecap="round" strokeWidth="8" />
        <path d="M255 133l21-28" stroke="#ff6f61" strokeLinecap="round" strokeWidth="8" />
        <path d="M226 189l-8 21" stroke="#ff6f61" strokeLinecap="round" strokeWidth="8" />
        <path d="M260 189l10 21" stroke="#ff6f61" strokeLinecap="round" strokeWidth="8" />
        <path d="M234 116c5-17 25-15 30 1l-7 6c-7-7-13-7-20 0z" fill="#003d5c" />
        <rect x="239" y="151" width="42" height="87" fill="#0a3a58" />
        <g stroke="#ffffff" strokeWidth="3">
          <path d="M239 166h42" />
          <path d="M239 181h42" />
          <path d="M239 196h42" />
          <path d="M239 211h42" />
          <path d="M239 226h42" />
        </g>
      </g>

      <g>
        <path
          d="M52 238l84 9"
          stroke="#73d5e6"
          strokeLinecap="round"
          strokeWidth="7"
        />
        <path d="M48 248h95" stroke="#0f86b0" strokeLinecap="round" strokeWidth="4" />
        <rect x="265" y="228" width="51" height="34" fill="#0089be" />
        <path d="M260 228l14-12h44l14 12z" fill="#14a8cf" />
      </g>

      <g fill="#004866">
        <path d="M58 168a42 42 0 0 1 21-39l9 16a24 24 0 0 0-12 23z" />
        <path d="M302 167a42 42 0 0 0-21-39l-9 16a24 24 0 0 1 12 23z" />
        <path d="M61 198a42 42 0 0 0 32 19l4-18a24 24 0 0 1-18-11z" />
        <path d="M299 198a42 42 0 0 1-32 19l-4-18a24 24 0 0 0 18-11z" />
      </g>
    </svg>
  );
}

function MarketingPackageCard({
  name,
  price,
  features,
}: {
  name: string;
  price: string;
  features: string[];
}) {
  return (
    <article className="marketing-package-card">
      <div className="marketing-package-heading">
        <div>
          <h2>{name}</h2>
          <strong>{price}</strong>
        </div>
        <Briefcase aria-hidden="true" size={29} strokeWidth={2.1} />
      </div>

      <ul>
        {features.map((feature, index) => (
          <li key={`${feature}-${index}`}>
            <Check aria-hidden="true" size={14} strokeWidth={2.4} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className="marketing-package-buy-button" type="button">
        Buy Now
      </button>
    </article>
  );
}

function MarketingPackageSelection() {
  return (
    <section className="marketing-package-section" aria-label="Marketing packages">
      <div className="marketing-package-scroll">
        <div className="marketing-package-grid">
          {marketingPackages.map((item) => (
            <MarketingPackageCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarketingCampaignContent() {
  const [showPackages, setShowPackages] = useState(false);

  return (
    <div className="marketing-campaign-content">
      <h1>New Marketing Campaign</h1>

      {showPackages ? (
        <MarketingPackageSelection />
      ) : (
        <section
          className="marketing-campaign-panel"
          aria-label="Create new marketing campaign"
        >
          <div className="marketing-campaign-visual-wrap">
            <MarketingCampaignIllustration />
          </div>

          <div className="marketing-campaign-copy">
            <h2>Create new campaign</h2>
            <p>
              Marketing campaigns can be used to drive traffic to your store or
              product. When used in combination with an offer or promotion, they
              can be very effective in increasing sales and increasing awareness
              of your products.
            </p>
            <p>
              Elryan.com uses advanced AI to analyse more than 26 data points
              for each customer, and recommend and advertise the most relevant
              product suggestions. Click start to create your first campaign and
              get your first $100 of advertising for free.
            </p>
          </div>

          <button
            className="marketing-campaign-start-button"
            type="button"
            onClick={() => setShowPackages(true)}
          >
            START
          </button>
        </section>
      )}
    </div>
  );
}
