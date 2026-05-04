"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useLang } from "./lang-context";
import {
  Activity,
  Award,
  Badge,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  Contact,
  CreditCard,
  Coins,
  FileText,
  Gauge,
  Globe2,
  Image as ImageIcon,
  Info,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Save,
  Star,
  Tags,
  Timer,
  Truck,
  User,
  Users,
  WalletCards,
  Warehouse,
} from "lucide-react";

const mapSrc =
  "https://www.google.com/maps?q=52R4%2B8H2%2C%20Erbil%2C%20Erbil%20Governorate%2C%20Iraq&output=embed";

function SectionHeading({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <header className="profile-section-heading">
      <Icon aria-hidden="true" size={24} strokeWidth={2.3} />
      <h2>{title}</h2>
    </header>
  );
}

function Field({
  label,
  value,
  placeholder,
  icon: Icon,
  helper,
}: {
  label: string;
  value?: ReactNode;
  placeholder?: string;
  icon?: LucideIcon;
  helper?: string;
}) {
  return (
    <div className="profile-field">
      <span className="profile-label">{label}</span>
      <div className="profile-field-box">
        <span className={value ? "profile-value" : "profile-placeholder"}>
          {value || placeholder}
        </span>
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="profile-field-icon"
            size={22}
            strokeWidth={2.1}
          />
        ) : null}
      </div>
      {helper ? <span className="field-helper">{helper}</span> : null}
    </div>
  );
}

function PhoneValue({ number }: { number: string }) {
  return (
    <span className="phone-value">
      <span className="country-flag" aria-hidden="true" />
      <strong>+964</strong>
      <span className="phone-caret" aria-hidden="true" />
      <span>{number}</span>
    </span>
  );
}

function ChoiceGroup({
  label,
  options,
  selected,
}: {
  label: string;
  options: string[];
  selected: string;
}) {
  return (
    <div className="profile-field">
      <span className="profile-label">{label}</span>
      <div className="profile-choice-group" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <span
            aria-checked={option === selected}
            className={`profile-choice${option === selected ? " is-selected" : ""}`}
            key={option}
            role="radio"
            tabIndex={0}
          >
            <span className="choice-dot" aria-hidden="true" />
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}

function ToggleLine({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="toggle-line">
      <span>{label}</span>
      <span className={`toggle-switch${enabled ? " is-enabled" : ""}`} />
      <strong>{enabled ? "Enabled" : "Disabled"}</strong>
    </div>
  );
}

function LocationStatus() {
  return (
    <p className="location-status">
      <CheckCircle2 aria-hidden="true" size={17} strokeWidth={2.5} />
      <span>Location validated - Erbil Governorate</span>
    </p>
  );
}

function MapFrame({ title }: { title: string }) {
  return (
    <div className="map-frame">
      <iframe
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
        title={title}
      />
    </div>
  );
}

export function ProfileContent() {
  const [banner, setBanner] = useState("");
  const { t } = useLang();

  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(""), 4000);
    return () => clearTimeout(timer);
  }, [banner]);

  return (
    <div className="profile-content">
      {banner ? <div className="success-banner">{banner}</div> : null}
      <h1>{t("vendorProfile")}</h1>

      <div className="profile-card">
        <section className="profile-section">
          <SectionHeading icon={Info} title="Primary Information" />
          <div className="profile-grid">
            <ChoiceGroup
              label="Account Type:"
              options={["Individual", "Company"]}
              selected="Company"
            />
            <Field
              icon={Building2}
              label="Web Address/Facebook Page:"
              placeholder="Web Address"
            />
            <Field
              icon={Badge}
              label="Vendor ID:"
              value="VEN-68c7c5e47bd93a0041cfb75b"
              helper="Raw ID: 68c7c5e47bd93a0041cfb75b"
            />
            <Field
              icon={CalendarDays}
              label="Date of Joining Electro Mall:"
              value="12 Mar 2024"
            />
            <Field
              icon={Tags}
              label="Category of your products:"
              value="beauty"
            />
            <Field
              icon={Users}
              label="Individual/Company Name:"
              value="Shex jaffar"
            />
            <Field
              icon={MessageSquareText}
              label="Comments:"
              placeholder="Enter your comments"
            />
            <Field
              icon={Tags}
              label="Category:"
              value="Brand Distributor/Owner"
            />
          </div>
        </section>

        <section className="profile-section">
          <SectionHeading icon={Contact} title="Contact Details" />
          <div className="profile-grid profile-contact-grid">
            <div className="profile-column">
              <Field
                icon={User}
                label="Contact Person:"
                value="Mr Ahmed sales manager"
              />
              <Field
                icon={Mail}
                label="Email Address:"
                value="beautifulgril2294@gmail.com"
              />
              <Field
                helper="eg : +9647912345678"
                icon={Phone}
                label="Mobile Number:"
                value={<PhoneValue number="7504930644" />}
              />
              <ToggleLine label="WhatsApp notification:" enabled={false} />
            </div>
            <div className="profile-column">
              <Field
                helper="eg : +9647912345678"
                icon={Phone}
                label="Alternate Number:"
                value={<PhoneValue number="7504930644" />}
              />
              <Field icon={Globe2} label="Country:" value="Iraq" />
              <Field
                icon={MapPin}
                label="Enter Address:"
                value="52R4+8H2, Erbil, Erbil Governorate, Iraq"
              />
              <LocationStatus />
              <MapFrame title="Contact address map" />
            </div>
          </div>
        </section>

        <section className="profile-section">
          <SectionHeading icon={Truck} title="Shipping Details" />
          <div className="profile-grid profile-contact-grid">
            <div className="profile-column">
              <Field icon={Globe2} label="Country:" value="Iraq" />
              <Field
                icon={Warehouse}
                label="Warehouse name:"
                value="Warehouse 1"
              />
              <Field
                icon={CalendarDays}
                label="Opening Days:"
                value="Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday"
              />
              <Field icon={Timer} label="Opening Time:" value="10:00" />
              <Field icon={Timer} label="Closing Time:" value="17:00" />
              <ToggleLine label="Shipping Status:" enabled />
            </div>
            <div className="profile-column">
              <Field
                helper="eg : +9647912345678"
                icon={Phone}
                label="Mobile Number:"
                value={<PhoneValue number="7504930644" />}
              />
              <Field
                icon={MapPin}
                label="Warehouse Address:"
                value="52R4+8H2, Erbil, Erbil Governorate, Iraq"
              />
              <LocationStatus />
              <MapFrame title="Warehouse address map" />
            </div>
          </div>
          <div className="warehouse-action-row">
            <button
              className="warehouse-button"
              type="button"
              onClick={() => setBanner(t("warehouseContact"))}
            >
              <MapPin aria-hidden="true" size={17} strokeWidth={2.4} />
              <span>Add warehouse</span>
            </button>
          </div>
        </section>

        <section className="profile-section">
          <SectionHeading icon={CreditCard} title="Payment Details" />
          <div className="payment-stack">
            <ChoiceGroup
              label="Currency"
              options={["Iraqi Dinar", "US Dollar"]}
              selected="Iraqi Dinar"
            />
            <p className="payment-note">
              You will receive payment in Iraqi Dinars.
            </p>
            <Field label="Commission:" value="8.0%" />
            <Field icon={WalletCards} label="Payment Method:" value="Cash" />
          </div>
        </section>

        <section className="profile-section">
          <SectionHeading icon={FileText} title="Documents" />
          <div className="documents-area">
            <div className="documents-copy">
              <h3>Identification</h3>
              <p>
                Please attach a copy of your identification (if you selected
                individual, this should be a copy of your passport or ID, if you
                selected company this should be a copy of your company
                registration certificate)
              </p>
            </div>

            <div className="document-status-box">
              <div className="document-status-top">
                <span>
                  <strong>Documents Status:</strong> 1 / 10 documents uploaded
                </span>
                <strong className="slots-badge">9 slots remaining</strong>
              </div>
              <div className="document-progress">
                <span />
              </div>
            </div>

            <div className="uploaded-documents">
              <h3>Uploaded Documents</h3>
              <p>Your identification documents and certificates</p>
              <article className="document-card">
                <div className="document-card-top">
                  <span className="document-number">1</span>
                  <span className="image-badge">
                    <ImageIcon aria-hidden="true" size={14} strokeWidth={2.4} />
                    IMAGE
                  </span>
                </div>
                <div className="document-preview">
                  <span className="document-brand-mark">EM</span>
                  <span className="document-brand-text">electromall</span>
                </div>
                <div className="document-meta">
                  <strong>68c7c5e47bd93a0041...</strong>
                  <span>Image Document</span>
                </div>
              </article>
            </div>

            <div className="upload-dropzone">
              <div className="upload-target">
                <Camera aria-hidden="true" size={38} strokeWidth={2.2} />
                <strong>Browse to find or drag files here</strong>
                <span>You can add 9 more file(s)</span>
              </div>
            </div>

            <div className="upload-instructions">
              <strong>
                <Info aria-hidden="true" size={15} strokeWidth={2.5} />
                Upload Instructions:
              </strong>
              <ul>
                <li>Maximum 10 documents total</li>
                <li>Supported formats: PNG, JPEG, PDF</li>
                <li>Maximum file size: 5MB per file</li>
                <li>
                  You can upload multiple files at once or come back to add more
                  later
                </li>
              </ul>
            </div>

            <div className="submit-row">
              <button
                className="submit-all-button"
                type="button"
                onClick={() => setBanner(t("documentsSubmitted"))}
              >
                <Save aria-hidden="true" size={20} strokeWidth={2.3} />
                <span>Submit All</span>
              </button>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <SectionHeading icon={Truck} title="Delivery Mechanism" />
          <div className="payment-stack">
            <ChoiceGroup
              label="Delivery handled by:"
              options={["By the Vendor", "By Electro Mall"]}
              selected="By Electro Mall"
            />
            <p className="payment-note">
              Choosing Electro Mall delivery includes platform shipping fees in
              your settlement; vendor delivery requires you to handle dispatch
              and last-mile yourself.
            </p>
          </div>
        </section>

        <section className="profile-section">
          <SectionHeading icon={Coins} title="Vendor Points" />
          <div className="kpi-grid kpi-grid-3">
            <article className="kpi-card kpi-blue">
              <p>Total Points Earned</p>
              <strong>1,240</strong>
            </article>
            <article className="kpi-card kpi-amber">
              <p>Points Redeemed</p>
              <strong>320</strong>
            </article>
            <article className="kpi-card kpi-green">
              <p>Available Balance</p>
              <strong>920</strong>
            </article>
          </div>
          <p className="payment-note">
            Points are calculated automatically per completed order. Redeem
            points for marketing campaigns and platform services.
          </p>
          <div className="submit-row">
            <button
              className="submit-all-button"
              type="button"
              onClick={() => {
                if (window.confirm(t("redeemConfirm"))) {
                  setBanner(t("pointsRedeemed"));
                }
              }}
            >
              <Award aria-hidden="true" size={18} strokeWidth={2.3} />
              <span>Redeem Points</span>
            </button>
          </div>
          <div className="purchase-order-table-wrap">
            <table className="purchase-order-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order #</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>2026-04-29</td><td>ORD-100190</td><td>Earned</td><td>+ 40</td><td>920</td></tr>
                <tr><td>2026-04-22</td><td>—</td><td>Redeemed</td><td>− 200</td><td>880</td></tr>
                <tr><td>2026-04-14</td><td>ORD-100151</td><td>Earned</td><td>+ 60</td><td>1,080</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="profile-section">
          <SectionHeading icon={Gauge} title="Vendor Performance" />
          <div className="performance-grid">
            <article className="performance-card">
              <header>
                <Activity aria-hidden="true" size={18} strokeWidth={2.3} />
                <span>Order Processing Speed</span>
              </header>
              <strong>4.2 h</strong>
              <Sparkline data={[6, 5.5, 5, 4.8, 5.2, 4.5, 4.2, 4]} />
            </article>
            <article className="performance-card">
              <header>
                <Info aria-hidden="true" size={18} strokeWidth={2.3} />
                <span>Cancellation Rate</span>
              </header>
              <strong className="rate-good">1.8%</strong>
              <Sparkline data={[3, 2.8, 2.5, 2.4, 2, 1.9, 1.8, 1.8]} />
            </article>
            <article className="performance-card">
              <header>
                <Star aria-hidden="true" size={18} strokeWidth={2.3} />
                <span>Customer Rating</span>
              </header>
              <strong>4.6 / 5</strong>
              <Sparkline data={[4.2, 4.3, 4.4, 4.5, 4.4, 4.5, 4.6, 4.6]} />
            </article>
            <article className="performance-card">
              <header>
                <FileText aria-hidden="true" size={18} strokeWidth={2.3} />
                <span>Product Upload Activity</span>
              </header>
              <strong>32 / 28</strong>
              <Sparkline data={[2, 4, 3, 5, 4, 6, 5, 3]} />
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 120;
      const y = 30 - ((v - min) / range) * 26;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 120 32"
      className="sparkline"
      role="img"
      aria-label="Trend"
    >
      <polyline
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
