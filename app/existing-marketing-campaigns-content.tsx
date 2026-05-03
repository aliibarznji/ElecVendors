import Link from "next/link";
import { MarketingCampaignIllustration } from "./marketing-campaign-content";

export function ExistingMarketingCampaignsContent() {
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
            product. When used in combination with an offer or promotion, they
            can be very effective in increasing sales and increasing awareness
            of your products.
          </p>
          <p>
            Elryan.com uses advanced AI to analyse more than 26 data points for
            each customer, and recommend and advertise the most relevant product
            suggestions. Click start to create your first campaign and get your
            first $100 of advertising for free.
          </p>
        </div>

        <Link className="existing-marketing-start-button" href="/marketing/new">
          START
        </Link>
      </section>
    </div>
  );
}
