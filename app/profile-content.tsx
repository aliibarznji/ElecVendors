"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  Badge,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Coins,
  Contact,
  CreditCard,
  FileText,
  Gauge,
  Globe2,
  Image as ImageIcon,
  Info,
  Mail,
  MapPin,
  Megaphone,
  MessageSquareText,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  Star,
  Tags,
  Timer,
  Trash2,
  Truck,
  Upload,
  User,
  Users,
  WalletCards,
  Warehouse,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { ApiVendor, ApiWarehouse } from "./lib/utils";
import type { Translations } from "./translations";

const mapSrc =
  "https://www.google.com/maps?q=52R4%2B8H2%2C%20Erbil%2C%20Erbil%20Governorate%2C%20Iraq&output=embed";

type WhDraft = Omit<ApiWarehouse, "id" | "vendorId">;

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
  action,
}: {
  label: string;
  value?: ReactNode;
  placeholder?: string;
  icon?: LucideIcon;
  helper?: string;
  action?: ReactNode;
}) {
  return (
    <div className="profile-field">
      <span className="profile-label">{label}</span>
      <div className="profile-field-box">
        <span className={value ? "profile-value" : "profile-placeholder"} style={{ flex: 1 }}>
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
        {action ?? null}
      </div>
      {helper ? <span className="field-helper">{helper}</span> : null}
    </div>
  );
}

function EditInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="profile-field">
      <span className="profile-label">{label}</span>
      <input
        className="profile-edit-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function EditTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="profile-field">
      <span className="profile-label">{label}</span>
      <textarea
        className="profile-edit-textarea"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
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
  onChange,
}: {
  label: string;
  options: string[];
  selected: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="profile-field">
      <span className="profile-label">{label}</span>
      <div className="profile-choice-group" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <span
            aria-checked={option === selected}
            className={`profile-choice${option === selected ? " is-selected" : ""}${onChange ? " profile-choice--clickable" : ""}`}
            key={option}
            role="radio"
            tabIndex={0}
            onClick={() => onChange?.(option)}
            onKeyDown={(e) => e.key === "Enter" && onChange?.(option)}
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
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange?: () => void;
}) {
  return (
    <div
      className="toggle-line"
      style={{ cursor: onChange ? "pointer" : undefined }}
      onClick={onChange}
    >
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

function perfClass(
  metric: "speed" | "cancel" | "rating" | "upload",
  value: number,
) {
  if (metric === "speed")
    return value < 24 ? "rate-good" : value < 48 ? "rate-warn" : "rate-bad";
  if (metric === "cancel")
    return value < 2 ? "rate-good" : value < 5 ? "rate-warn" : "rate-bad";
  if (metric === "rating")
    return value >= 4 ? "rate-good" : value >= 3 ? "rate-warn" : "rate-bad";
  return value >= 5 ? "rate-good" : value >= 2 ? "rate-warn" : "rate-bad";
}

function perfLabel(
  metric: "speed" | "cancel" | "rating" | "upload",
  value: number,
) {
  if (metric === "speed")
    return value < 24 ? "Excellent" : value < 48 ? "Average" : "Needs improvement";
  if (metric === "cancel")
    return value < 2 ? "Excellent" : value < 5 ? "Average" : "High — review orders";
  if (metric === "rating")
    return value >= 4 ? "Excellent" : value >= 3 ? "Good" : "Needs improvement";
  return value >= 5 ? "Very active" : value >= 2 ? "Active" : "Low activity";
}

function VendorAvatar({
  name,
  src,
  onUpload,
}: {
  name: string;
  src: string;
  onUpload: (src: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "V";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") onUpload(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <button
      type="button"
      className="profile-avatar"
      onClick={() => ref.current?.click()}
      title="Upload logo"
    >
      {src ? <img src={src} alt="Vendor logo" /> : <span>{initials}</span>}
      <span className="profile-avatar-upload" aria-hidden="true">
        <Camera size={20} strokeWidth={2.2} />
      </span>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className={`copy-btn${copied ? " copied" : ""}`}
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      {copied ? (
        <ClipboardCheck size={12} strokeWidth={2.4} />
      ) : (
        <Clipboard size={12} strokeWidth={2.4} />
      )}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

function WarehouseEntry({
  wh,
  index,
  onDelete,
}: {
  wh: ApiWarehouse;
  index: number;
  onDelete: () => void;
}) {
  return (
    <div className="warehouse-entry">
      <div className="warehouse-entry-header">
        <Warehouse aria-hidden="true" size={15} strokeWidth={2.3} />
        <h3>
          Warehouse {index + 1}: {wh.name}
        </h3>
        <button
          className="warehouse-delete-btn"
          type="button"
          onClick={onDelete}
          title="Remove warehouse"
        >
          <Trash2 size={14} strokeWidth={2.3} />
          <span>Remove</span>
        </button>
      </div>
      <div className="profile-grid profile-contact-grid">
        <div className="profile-column">
          <Field icon={Globe2} label="Country:" value="Iraq" />
          <Field icon={Warehouse} label="Warehouse Name:" value={wh.name} />
          <Field icon={CalendarDays} label="Opening Days:" value={wh.openingDays} />
          <Field icon={Timer} label="Opening Time:" value={wh.openingTime} />
          <Field icon={Timer} label="Closing Time:" value={wh.closingTime} />
          <ToggleLine label="Shipping Status:" enabled />
        </div>
        <div className="profile-column">
          <Field
            helper="eg : +9647912345678"
            icon={Phone}
            label="Mobile Number:"
            value={<PhoneValue number={wh.phone} />}
          />
          <Field icon={MapPin} label="Warehouse Address:" value={wh.address} />
          <LocationStatus />
          <MapFrame title={`${wh.name} map`} />
        </div>
      </div>
    </div>
  );
}

function AddWarehouseForm({
  draft,
  onChange,
  onSave,
  onCancel,
  t,
}: {
  draft: WhDraft;
  onChange: (patch: Partial<WhDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
  t: (key: keyof Translations) => string;
}) {
  return (
    <div className="warehouse-entry warehouse-entry--form">
      <div className="warehouse-entry-header">
        <Warehouse aria-hidden="true" size={15} strokeWidth={2.3} />
        <h3>{t("newWarehouse")}</h3>
      </div>
      <div className="profile-grid profile-contact-grid">
        <div className="profile-column">
          <EditInput
            label="Warehouse Name:"
            value={draft.name}
            onChange={(v) => onChange({ name: v })}
            placeholder="e.g. Main Storage"
          />
          <EditInput
            label={`${t("warehouseOpeningDays")}:`}
            value={draft.openingDays}
            onChange={(v) => onChange({ openingDays: v })}
            placeholder="e.g. Mon–Fri"
          />
          <EditInput
            label={`${t("warehouseOpeningTime")}:`}
            value={draft.openingTime}
            onChange={(v) => onChange({ openingTime: v })}
            type="time"
          />
          <EditInput
            label={`${t("warehouseClosingTime")}:`}
            value={draft.closingTime}
            onChange={(v) => onChange({ closingTime: v })}
            type="time"
          />
        </div>
        <div className="profile-column">
          <EditInput
            label="Phone:"
            value={draft.phone}
            onChange={(v) => onChange({ phone: v })}
            placeholder="07xxxxxxxxx"
          />
          <EditInput
            label="Warehouse Address:"
            value={draft.address}
            onChange={(v) => onChange({ address: v })}
            placeholder="Street, City"
          />
        </div>
      </div>
      <div className="warehouse-action-row">
        <button className="submit-all-button" type="button" onClick={onSave}>
          <Save aria-hidden="true" size={17} strokeWidth={2.3} />
          <span>{t("saveChanges")}</span>
        </button>
        <button className="warehouse-button" type="button" onClick={onCancel}>
          <X aria-hidden="true" size={16} strokeWidth={2.3} />
          <span>{t("cancelEdit")}</span>
        </button>
      </div>
    </div>
  );
}

const emptyWh: WhDraft = {
  name: "",
  address: "",
  phone: "",
  openingDays: "",
  openingTime: "",
  closingTime: "",
};

function whStrip(wh: ApiWarehouse): WhDraft {
  const { id: _id, vendorId: _vid, ...rest } = wh;
  return rest;
}

export function ProfileContent() {
  const [banner, setBanner] = useState("");
  const [vendor, setVendor] = useState<ApiVendor | null>(null);
  const { t } = useLang();

  // Profile settings (local UI state)
  const [accountType, setAccountType] = useState("Company");
  const [currency, setCurrency] = useState("Iraqi Dinar");
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("");

  // Edit-profile mode
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    companyLocation: "",
    webAddress: "",
    category: "",
    comments: "",
  });
  const [saving, setSaving] = useState(false);

  // Warehouse management
  const [addingWh, setAddingWh] = useState(false);
  const [newWh, setNewWh] = useState<WhDraft>(emptyWh);

  // Delivery mechanism
  const [deliveryLocal, setDeliveryLocal] = useState("");
  const [savingDelivery, setSavingDelivery] = useState(false);

  // Document uploads
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const docInputRef = useRef<HTMLInputElement>(null);
  const maxDocs = 10;
  const totalDocs = 1 + uploadedFiles.length;
  const slotsLeft = maxDocs - totalDocs;
  const docProgress = Math.round((totalDocs / maxDocs) * 100);

  useEffect(() => {
    api.profile.get().then(setVendor).catch(() => {});
  }, []);

  useEffect(() => {
    if (vendor && !deliveryLocal) setDeliveryLocal(vendor.deliveryMechanism);
  }, [vendor, deliveryLocal]);

  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(""), 4000);
    return () => clearTimeout(timer);
  }, [banner]);

  function flash(msg: string) {
    setBanner(msg);
  }

  function startEdit() {
    if (!vendor) return;
    setDraft({
      name: vendor.name,
      phone: vendor.phone,
      companyLocation: vendor.companyLocation,
      webAddress: draft.webAddress,
      category: draft.category,
      comments: draft.comments,
    });
    setEditing(true);
  }

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const updated = await api.profile.update({
        name: draft.name,
        phone: draft.phone,
        companyLocation: draft.companyLocation,
      });
      setVendor(updated);
      setEditing(false);
      flash(t("profileSaved"));
    } catch {
      flash("Error saving profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteWarehouse(id: string) {
    if (!vendor) return;
    if (!window.confirm(t("confirmDeleteWarehouse"))) return;
    const warehouses = vendor.warehouses.filter((w) => w.id !== id).map(whStrip);
    try {
      const updated = await api.profile.update({ warehouses });
      setVendor(updated);
      flash(t("warehouseDeleted"));
    } catch {
      flash("Error removing warehouse.");
    }
  }

  async function handleAddWarehouse() {
    if (!vendor) return;
    const warehouses = [...vendor.warehouses.map(whStrip), newWh];
    try {
      const updated = await api.profile.update({ warehouses });
      setVendor(updated);
      setAddingWh(false);
      setNewWh(emptyWh);
      flash(t("warehouseAdded"));
    } catch {
      flash("Error adding warehouse.");
    }
  }

  async function handleSaveDelivery() {
    setSavingDelivery(true);
    try {
      const updated = await api.profile.update({ deliveryMechanism: deliveryLocal });
      setVendor(updated);
      flash(t("deliveryMechanismSaved"));
    } catch {
      flash("Error saving delivery preference.");
    } finally {
      setSavingDelivery(false);
    }
  }

  function handleDocFiles(files: FileList | null) {
    if (!files) return;
    const allowed = Array.from(files).slice(0, slotsLeft);
    setUploadedFiles((prev) => [...prev, ...allowed]);
  }

  function removeDoc(idx: number) {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  const pointsAvailable = (vendor?.pointsEarned ?? 0) - (vendor?.pointsRedeemed ?? 0);
  const deliveryChanged = vendor && deliveryLocal !== vendor.deliveryMechanism;

  return (
    <div className="profile-content">
      {banner ? <div className="success-banner">{banner}</div> : null}
      <h1>{t("vendorProfile")}</h1>

      <div className="profile-card">
        {/* ── Primary Information ── */}
        <section className="profile-section">
          <SectionHeading icon={Info} title="Primary Information" />
          <div className="profile-grid">
            <ChoiceGroup
              label="Account Type:"
              options={["Individual", "Company"]}
              selected={accountType}
              onChange={setAccountType}
            />
            <Field
              icon={Building2}
              label="Web Address / Facebook Page:"
              value={draft.webAddress || undefined}
              placeholder="Web Address"
            />
            <Field
              icon={Badge}
              label="Vendor ID:"
              value={
                vendor?.reference ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {vendor.reference}
                    <CopyButton text={vendor.reference} />
                  </span>
                ) : undefined
              }
              helper={vendor ? `Internal ID: ${vendor.id.slice(0, 20)}…` : undefined}
            />
            <Field
              icon={CalendarDays}
              label="Date of Joining Electro Mall:"
              value={
                vendor
                  ? new Date(vendor.joinedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : undefined
              }
            />
            <Field
              icon={Users}
              label="Vendor / Company Name:"
              value={
                vendor ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {vendor.name}
                    <span className="vendor-status-badge">
                      <ShieldCheck size={12} strokeWidth={2.5} />
                      Verified
                    </span>
                  </span>
                ) : undefined
              }
            />
            <Field
              icon={Tags}
              label="Category of Products:"
              value={draft.category || undefined}
              placeholder="—"
            />
            <Field
              icon={MessageSquareText}
              label="Comments:"
              value={draft.comments || undefined}
              placeholder="Enter your comments"
            />
          </div>
        </section>

        {/* ── Contact Details ── */}
        <section className="profile-section">
          <div className="section-heading-row">
            <SectionHeading icon={Contact} title="Contact Details" />
            {!editing ? (
              <button className="warehouse-button" type="button" onClick={startEdit}>
                <Pencil aria-hidden="true" size={15} strokeWidth={2.3} />
                <span>{t("editProfile")}</span>
              </button>
            ) : (
              <div className="profile-section-actions">
                <button
                  className="submit-all-button"
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  <Save aria-hidden="true" size={17} strokeWidth={2.3} />
                  <span>{saving ? "Saving…" : t("saveChanges")}</span>
                </button>
                <button
                  className="warehouse-button"
                  type="button"
                  onClick={() => setEditing(false)}
                >
                  <X aria-hidden="true" size={16} strokeWidth={2.3} />
                  <span>{t("cancelEdit")}</span>
                </button>
              </div>
            )}
          </div>

          <div className="profile-avatar-section">
            <VendorAvatar
              name={vendor?.name ?? ""}
              src={avatarSrc}
              onUpload={setAvatarSrc}
            />
            <div className="profile-avatar-meta">
              <strong>{vendor?.name ?? "—"}</strong>
              <span>{vendor?.email ?? ""}</span>
              <span className="vendor-status-badge" style={{ marginTop: 4, width: "fit-content" }}>
                <ShieldCheck size={12} strokeWidth={2.5} />
                Active &amp; Verified
              </span>
            </div>
          </div>

          <div className="profile-grid profile-contact-grid">
            <div className="profile-column">
              {editing ? (
                <>
                  <EditInput
                    label="Vendor / Company Name:"
                    value={draft.name}
                    onChange={(v) => setDraft((p) => ({ ...p, name: v }))}
                  />
                  <EditInput
                    label="Web Address / Facebook Page:"
                    value={draft.webAddress}
                    onChange={(v) => setDraft((p) => ({ ...p, webAddress: v }))}
                    placeholder="https://..."
                  />
                  <EditInput
                    label="Category of Products:"
                    value={draft.category}
                    onChange={(v) => setDraft((p) => ({ ...p, category: v }))}
                    placeholder="e.g. Electronics"
                  />
                  <Field
                    icon={User}
                    label="Account Manager:"
                    value={vendor?.accountManager}
                    helper="Set by Electro Mall — contact support to change"
                  />
                  <Field
                    icon={Mail}
                    label="Email Address:"
                    value={vendor?.email}
                    helper="Contact support to change email"
                  />
                  <EditInput
                    label="Mobile Number:"
                    value={draft.phone}
                    onChange={(v) => setDraft((p) => ({ ...p, phone: v }))}
                    placeholder="07xxxxxxxxx"
                  />
                  <ToggleLine
                    label="WhatsApp notification:"
                    enabled={whatsappEnabled}
                    onChange={() => setWhatsappEnabled((v) => !v)}
                  />
                  <EditTextarea
                    label="Comments:"
                    value={draft.comments}
                    onChange={(v) => setDraft((p) => ({ ...p, comments: v }))}
                    placeholder="Any additional notes or comments"
                  />
                </>
              ) : (
                <>
                  <Field icon={User} label="Vendor / Company Name:" value={vendor?.name} />
                  <Field
                    icon={User}
                    label="Account Manager:"
                    value={vendor?.accountManager}
                    helper="Person responsible for account follow-up"
                  />
                  <Field icon={Mail} label="Email Address:" value={vendor?.email} />
                  <Field
                    helper="eg : +9647912345678"
                    icon={Phone}
                    label="Mobile Number:"
                    value={vendor ? <PhoneValue number={vendor.phone} /> : undefined}
                  />
                  <ToggleLine
                    label="WhatsApp notification:"
                    enabled={whatsappEnabled}
                    onChange={() => setWhatsappEnabled((v) => !v)}
                  />
                </>
              )}
            </div>
            <div className="profile-column">
              {editing ? (
                <>
                  <EditInput
                    label="Company Location:"
                    value={draft.companyLocation}
                    onChange={(v) => setDraft((p) => ({ ...p, companyLocation: v }))}
                    placeholder="City, Province"
                  />
                  <Field icon={Globe2} label="Country:" value="Iraq" />
                  <LocationStatus />
                  <MapFrame title="Contact address map" />
                </>
              ) : (
                <>
                  <Field icon={Globe2} label="Country:" value="Iraq" />
                  <Field
                    icon={MapPin}
                    label="Company Location:"
                    value={vendor?.companyLocation}
                  />
                  <LocationStatus />
                  <MapFrame title="Contact address map" />
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Warehouse Locations ── */}
        <section className="profile-section">
          <SectionHeading icon={Warehouse} title="Warehouse Locations" />

          {vendor?.warehouses && vendor.warehouses.length > 0 ? (
            vendor.warehouses.map((wh, i) => (
              <WarehouseEntry
                key={wh.id}
                wh={wh}
                index={i}
                onDelete={() => handleDeleteWarehouse(wh.id)}
              />
            ))
          ) : (
            <p className="payment-note">No warehouses added yet.</p>
          )}

          {addingWh ? (
            <AddWarehouseForm
              draft={newWh}
              onChange={(patch) => setNewWh((p) => ({ ...p, ...patch }))}
              onSave={handleAddWarehouse}
              onCancel={() => {
                setAddingWh(false);
                setNewWh(emptyWh);
              }}
              t={t}
            />
          ) : (
            <div className="warehouse-action-row">
              <button
                className="warehouse-button"
                type="button"
                onClick={() => setAddingWh(true)}
              >
                <MapPin aria-hidden="true" size={17} strokeWidth={2.4} />
                <span>{t("addWarehouse")}</span>
              </button>
            </div>
          )}
        </section>

        {/* ── Payment Details ── */}
        <section className="profile-section">
          <SectionHeading icon={CreditCard} title="Payment Details" />
          <div className="payment-stack">
            <ChoiceGroup
              label="Currency"
              options={["Iraqi Dinar", "US Dollar"]}
              selected={currency}
              onChange={setCurrency}
            />
            <p className="payment-note">
              You will receive payment in{" "}
              {currency === "Iraqi Dinar" ? "Iraqi Dinars" : "US Dollars"}.
            </p>
            <Field label="Commission:" value="8.0%" />
            <Field icon={WalletCards} label="Payment Method:" value="Cash" />
          </div>
        </section>

        {/* ── Documents ── */}
        <section className="profile-section">
          <SectionHeading icon={FileText} title="Documents" />
          <div className="documents-area">
            <div className="documents-copy">
              <h3>Identification</h3>
              <p>
                Please attach a copy of your identification (if you selected
                individual, this should be a copy of your passport or ID; if you
                selected company this should be a copy of your company registration
                certificate)
              </p>
            </div>

            <div className="document-status-box">
              <div className="document-status-top">
                <span>
                  <strong>Documents Status:</strong> {totalDocs} / {maxDocs} documents uploaded
                </span>
                <strong className="slots-badge">
                  {slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} remaining
                </strong>
              </div>
              <div className="document-progress">
                <span style={{ width: `${docProgress}%` }} />
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
                  <strong>{vendor ? `${vendor.id.slice(0, 20)}...` : "—"}</strong>
                  <span>Image Document</span>
                </div>
              </article>

              {uploadedFiles.map((file, idx) => (
                <article className="document-card" key={`${file.name}-${idx}`}>
                  <div className="document-card-top">
                    <span className="document-number">{idx + 2}</span>
                    <span className="image-badge">
                      {file.type === "application/pdf" ? (
                        <>
                          <FileText aria-hidden="true" size={14} strokeWidth={2.4} />
                          PDF
                        </>
                      ) : (
                        <>
                          <ImageIcon aria-hidden="true" size={14} strokeWidth={2.4} />
                          IMAGE
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      className="warehouse-delete-btn"
                      style={{ marginLeft: "auto" }}
                      onClick={() => removeDoc(idx)}
                      title="Remove"
                    >
                      <Trash2 size={13} strokeWidth={2.3} />
                    </button>
                  </div>
                  <div className="document-meta">
                    <strong>{file.name}</strong>
                    <span>{(file.size / 1024).toFixed(0)} KB</span>
                  </div>
                </article>
              ))}
            </div>

            {slotsLeft > 0 ? (
              <div
                className="upload-dropzone"
                onClick={() => docInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDocFiles(e.dataTransfer.files);
                }}
                style={{ cursor: "pointer" }}
              >
                <input
                  ref={docInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleDocFiles(e.target.files)}
                />
                <div className="upload-target">
                  <Upload aria-hidden="true" size={38} strokeWidth={2.2} />
                  <strong>Browse to find or drag files here</strong>
                  <span>
                    You can add {slotsLeft} more file{slotsLeft !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="upload-instructions">
              <strong>
                <Info aria-hidden="true" size={15} strokeWidth={2.5} />
                Upload Instructions:
              </strong>
              <ul>
                <li>Maximum 10 documents total</li>
                <li>Supported formats: PNG, JPEG, PDF</li>
                <li>Maximum file size: 5MB per file</li>
                <li>You can upload multiple files at once or come back to add more later</li>
              </ul>
            </div>

            <div className="submit-row">
              <button
                className="submit-all-button"
                type="button"
                onClick={() => flash(t("documentsSubmitted"))}
              >
                <Save aria-hidden="true" size={20} strokeWidth={2.3} />
                <span>Submit All</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Delivery Mechanism ── */}
        <section className="profile-section">
          <SectionHeading icon={Truck} title="Delivery Mechanism" />
          <div className="payment-stack">
            <ChoiceGroup
              label="Delivery handled by:"
              options={["By the Vendor", "By Electro Mall"]}
              selected={deliveryLocal || (vendor?.deliveryMechanism ?? "By Electro Mall")}
              onChange={setDeliveryLocal}
            />
            <p className="payment-note">
              Choosing Electro Mall delivery includes platform shipping fees in your
              settlement. Vendor delivery requires you to handle dispatch and
              last-mile yourself.
            </p>
            {deliveryChanged ? (
              <div className="submit-row">
                <button
                  className="submit-all-button"
                  type="button"
                  onClick={handleSaveDelivery}
                  disabled={savingDelivery}
                >
                  <Save aria-hidden="true" size={18} strokeWidth={2.3} />
                  <span>{savingDelivery ? "Saving…" : t("saveChanges")}</span>
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* ── Vendor Points ── */}
        <section className="profile-section">
          <SectionHeading icon={Coins} title="Vendor Points" />

          <div className="kpi-grid">
            <article className="kpi-card kpi-blue">
              <p>Total Points Earned</p>
              <strong>{(vendor?.pointsEarned ?? 0).toLocaleString("en-US")}</strong>
            </article>
            <article className="kpi-card kpi-amber">
              <p>Points Redeemed</p>
              <strong>{(vendor?.pointsRedeemed ?? 0).toLocaleString("en-US")}</strong>
            </article>
            <article className="kpi-card kpi-green">
              <p>Available Balance</p>
              <strong>{pointsAvailable.toLocaleString("en-US")}</strong>
            </article>
            <article className="kpi-card kpi-pink">
              <p>Points per Order</p>
              <strong>Automatic</strong>
            </article>
          </div>

          <div className="points-marketing-banner">
            <Megaphone aria-hidden="true" size={18} strokeWidth={2.2} />
            <div>
              <strong>Use points for marketing campaigns</strong>
              <p>
                Points accumulate automatically with every completed order. Redeem
                them to fund marketing packages on the platform.
              </p>
            </div>
            <Link className="points-marketing-link" href="/marketing/new">
              Browse Packages
            </Link>
          </div>

          <div className="submit-row">
            <button
              className="submit-all-button"
              type="button"
              onClick={() => {
                if (window.confirm(t("redeemConfirm"))) {
                  flash(t("pointsRedeemed"));
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
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", color: "#94a3b8", padding: "16px" }}
                  >
                    {pointsAvailable === 0
                      ? "No transaction history yet"
                      : "Transaction history coming soon"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Vendor Performance ── */}
        <section className="profile-section">
          <SectionHeading icon={Gauge} title="Vendor Performance" />

          <div className="performance-grid performance-grid-4">
            <article className="performance-card">
              <header className="performance-card-header">
                <Activity aria-hidden="true" size={18} strokeWidth={2.3} />
                <span>Order Processing Speed</span>
              </header>
              <strong className={perfClass("speed", vendor?.processingSpeedHours ?? 0)}>
                {vendor?.processingSpeedHours ?? 0} h avg
              </strong>
              <span className="perf-benchmark">
                {perfLabel("speed", vendor?.processingSpeedHours ?? 0)}
                <em> · target: &lt;24 h</em>
              </span>
              <Sparkline
                data={[6, 5.5, 5, 4.8, 5.2, 4.5, 4.2, vendor?.processingSpeedHours ?? 4]}
              />
            </article>

            <article className="performance-card">
              <header className="performance-card-header">
                <Info aria-hidden="true" size={18} strokeWidth={2.3} />
                <span>Cancellation Rate</span>
              </header>
              <strong className={perfClass("cancel", vendor?.cancellationRate ?? 0)}>
                {vendor?.cancellationRate ?? 0}%
              </strong>
              <span className="perf-benchmark">
                {perfLabel("cancel", vendor?.cancellationRate ?? 0)}
                <em> · target: &lt;2%</em>
              </span>
              <Sparkline
                data={[3, 2.8, 2.5, 2.4, 2, 1.9, 1.8, vendor?.cancellationRate ?? 1.8]}
              />
            </article>

            <article className="performance-card">
              <header className="performance-card-header">
                <Star aria-hidden="true" size={18} strokeWidth={2.3} />
                <span>Customer Rating</span>
              </header>
              <strong className={perfClass("rating", vendor?.customerRating ?? 0)}>
                {vendor?.customerRating ?? 0} / 5
              </strong>
              <span className="perf-benchmark">
                {perfLabel("rating", vendor?.customerRating ?? 0)}
                <em> · target: ≥4.0</em>
              </span>
              <Sparkline
                data={[4.2, 4.3, 4.4, 4.5, 4.4, 4.5, 4.6, vendor?.customerRating ?? 4.6]}
              />
            </article>

            <article className="performance-card">
              <header className="performance-card-header">
                <FileText aria-hidden="true" size={18} strokeWidth={2.3} />
                <span>Product Upload Activity</span>
              </header>
              <strong className={perfClass("upload", vendor?.uploadActivity ?? 0)}>
                {vendor?.uploadActivity ?? 0} uploads
              </strong>
              <span className="perf-benchmark">
                {perfLabel("upload", vendor?.uploadActivity ?? 0)}
                <em> · this month</em>
              </span>
              <Sparkline
                data={[2, 4, 3, 5, 4, 6, 5, vendor?.uploadActivity ?? 3]}
              />
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
    <svg viewBox="0 0 120 32" className="sparkline" role="img" aria-label="Trend">
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
