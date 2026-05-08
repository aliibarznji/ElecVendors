"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  Building2,
  CalendarDays,
  Camera,
  Check,
  ClipboardCheck,
  Clipboard,
  Coins,
  CreditCard,
  FileText,
  Gauge,
  Globe2,
  Image as ImageIcon,
  Info,
  Loader2,
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
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";
import type { ApiVendor, ApiWarehouse } from "../lib/utils";
import type { Translations } from "../lib/translations";

const mapSrc =
  "https://www.google.com/maps?q=52R4%2B8H2%2C%20Erbil%2C%20Erbil%20Governorate%2C%20Iraq&output=embed";

function getStoredExtras(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("vp_extras");
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch { return null; }
}

type WhDraft = Omit<ApiWarehouse, "id" | "vendorId">;

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <header className="profile-section-heading">
      <Icon aria-hidden="true" size={20} strokeWidth={2.3} />
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
        <span className={`profile-field-value ${value ? "profile-value" : "profile-placeholder"}`}>
          {value || placeholder}
        </span>
        {Icon ? <Icon aria-hidden="true" className="profile-field-icon" size={20} strokeWidth={2.1} /> : null}
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
      className={`toggle-line${onChange ? " toggle-line--interactive" : ""}`}
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
      <ShieldCheck aria-hidden="true" size={15} strokeWidth={2.5} />
      <span>Location validated — Erbil Governorate</span>
    </p>
  );
}

function MapFrame({ title }: { title: string }) {
  return (
    <div className="map-frame">
      <iframe loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={mapSrc} title={title} />
    </div>
  );
}

function VendorAvatar({ name, src, onUpload }: { name: string; src: string; onUpload: (s: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const initials =
    name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "V";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (typeof ev.target?.result === "string") onUpload(ev.target.result); };
    reader.readAsDataURL(file);
  }

  return (
    <button type="button" className="profile-avatar" onClick={() => ref.current?.click()} title="Upload logo">
      {src ? <img src={src} alt="Vendor logo" /> : <span>{initials}</span>}
      <span className="profile-avatar-upload" aria-hidden="true">
        <Camera size={18} strokeWidth={2.2} />
      </span>
      <input ref={ref} type="file" accept="image/*" className="sr-only" onChange={handleFile} />
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
    <button type="button" className={`copy-btn${copied ? " copied" : ""}`} onClick={handleCopy} title="Copy">
      {copied ? <ClipboardCheck size={12} strokeWidth={2.4} /> : <Clipboard size={12} strokeWidth={2.4} />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

function perfClass(metric: "speed" | "cancel" | "rating" | "upload", value: number) {
  if (metric === "speed") return value < 24 ? "rate-good" : value < 48 ? "rate-warn" : "rate-bad";
  if (metric === "cancel") return value < 2 ? "rate-good" : value < 5 ? "rate-warn" : "rate-bad";
  if (metric === "rating") return value >= 4 ? "rate-good" : value >= 3 ? "rate-warn" : "rate-bad";
  return value >= 5 ? "rate-good" : value >= 2 ? "rate-warn" : "rate-bad";
}

function perfLabel(metric: "speed" | "cancel" | "rating" | "upload", value: number) {
  if (metric === "speed") return value < 24 ? "Excellent" : value < 48 ? "Average" : "Needs improvement";
  if (metric === "cancel") return value < 2 ? "Excellent" : value < 5 ? "Average" : "High — review orders";
  if (metric === "rating") return value >= 4 ? "Excellent" : value >= 3 ? "Good" : "Needs improvement";
  return value >= 5 ? "Very active" : value >= 2 ? "Active" : "Low activity";
}

function perfPct(metric: "speed" | "cancel" | "rating" | "upload", value: number) {
  if (metric === "speed") return Math.max(0, 100 - (value / 72) * 100);
  if (metric === "cancel") return Math.max(0, 100 - (value / 10) * 100);
  if (metric === "rating") return (value / 5) * 100;
  return Math.min((value / 10) * 100, 100);
}

function Sparkline({ data }: { data: readonly number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 120;
    const y = 30 - ((v - min) / range) * 26;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 120 32" className="sparkline" role="img" aria-label="Trend">
      <polyline fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function WarehouseEntry({ wh, index, onDelete }: { wh: ApiWarehouse; index: number; onDelete: () => void }) {
  return (
    <div className="warehouse-entry">
      <div className="warehouse-entry-header">
        <Warehouse aria-hidden="true" size={15} strokeWidth={2.3} />
        <h3>Warehouse {index + 1}: {wh.name}</h3>
        <button className="warehouse-delete-btn" type="button" onClick={onDelete} title="Remove">
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
          <Field helper="eg : +9647912345678" icon={Phone} label="Mobile Number:" value={<PhoneValue number={wh.phone} />} />
          <Field icon={MapPin} label="Warehouse Address:" value={wh.address} />
          <LocationStatus />
          <MapFrame title={`${wh.name} map`} />
        </div>
      </div>
    </div>
  );
}

function AddWarehouseForm({
  draft, onChange, onSave, onCancel, t,
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
          <EditInput label="Warehouse Name:" value={draft.name} onChange={(v) => onChange({ name: v })} placeholder="e.g. Main Storage" />
          <EditInput label={`${t("warehouseOpeningDays")}:`} value={draft.openingDays} onChange={(v) => onChange({ openingDays: v })} placeholder="e.g. Mon–Fri" />
          <EditInput label={`${t("warehouseOpeningTime")}:`} value={draft.openingTime} onChange={(v) => onChange({ openingTime: v })} type="time" />
          <EditInput label={`${t("warehouseClosingTime")}:`} value={draft.closingTime} onChange={(v) => onChange({ closingTime: v })} type="time" />
        </div>
        <div className="profile-column">
          <EditInput label="Phone:" value={draft.phone} onChange={(v) => onChange({ phone: v })} placeholder="07xxxxxxxxx" />
          <EditInput label="Warehouse Address:" value={draft.address} onChange={(v) => onChange({ address: v })} placeholder="Street, City" />
        </div>
      </div>
      <div className="warehouse-action-row">
        <button className="submit-all-button" type="button" onClick={onSave}>
          <Save aria-hidden="true" size={16} strokeWidth={2.3} />
          <span>{t("saveChanges")}</span>
        </button>
        <button className="warehouse-button" type="button" onClick={onCancel}>
          <X aria-hidden="true" size={15} strokeWidth={2.3} />
          <span>{t("cancelEdit")}</span>
        </button>
      </div>
    </div>
  );
}

const emptyWh: WhDraft = { name: "", address: "", phone: "", openingDays: "", openingTime: "", closingTime: "" };
function whStrip(wh: ApiWarehouse): WhDraft {
  const { id: _id, vendorId: _vid, ...rest } = wh;
  return rest;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ProfileContent() {
  const [vendor, setVendor] = useState<ApiVendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const { t } = useLang();

  const [accountType, setAccountType] = useState(() => String(getStoredExtras()?.accountType || "Company"));
  const [currency, setCurrency] = useState("Iraqi Dinar");
  const [whatsappEnabled, setWhatsappEnabled] = useState(() => !!getStoredExtras()?.whatsappEnabled);
  const [avatarSrc, setAvatarSrc] = useState("");

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => {
    const e = getStoredExtras();
    return {
      name: "",
      phone: "",
      companyLocation: "",
      webAddress: String(e?.webAddress || ""),
      category: String(e?.category || ""),
      comments: String(e?.comments || ""),
    };
  });
  const [saving, setSaving] = useState(false);
  const preDraftRef = useRef<typeof draft | null>(null);
  const preAccountTypeRef = useRef("Company");
  const preWhatsappRef = useRef(false);

  const [addingWh, setAddingWh] = useState(false);
  const [newWh, setNewWh] = useState<WhDraft>(emptyWh);

  const [commissionPct, setCommissionPct] = useState(5);
  const [savingCommission, setSavingCommission] = useState(false);

  const [deliveryLocal, setDeliveryLocal] = useState("");
  const [savingDelivery, setSavingDelivery] = useState(false);

  const [preparationDays, setPreparationDays] = useState(() => {
    const stored = getStoredExtras()?.preparationDays;
    return stored != null ? Number(stored) : 1;
  });
  const [deliveryDays, setDeliveryDays] = useState(() => {
    const stored = getStoredExtras()?.deliveryDays;
    return stored != null ? Number(stored) : 3;
  });
  const [origFulfillment, setOrigFulfillment] = useState({ prep: 1, delivery: 3 });
  const [savingFulfillment, setSavingFulfillment] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const docInputRef = useRef<HTMLInputElement>(null);
  const maxDocs = 10;
  const totalDocs = 1 + uploadedFiles.length;
  const slotsLeft = maxDocs - totalDocs;
  const docProgress = Math.round((totalDocs / maxDocs) * 100);

  useEffect(() => {
    api.profile.get()
      .then(setVendor)
      .catch(() => flash("Failed to load profile", "error"))
      .finally(() => setLoading(false));
    api.products.list({ limit: 100 })
      .then((r) => { if (r.items.length > 0) setCommissionPct(r.items[0].commissionPct); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (vendor && !deliveryLocal) {
      setDeliveryLocal(vendor.deliveryMechanism);
      const e = getStoredExtras();
      const prep = e?.preparationDays != null ? Number(e.preparationDays) : Math.max(1, Math.round((vendor.processingSpeedHours ?? 24) / 24));
      const del = e?.deliveryDays != null ? Number(e.deliveryDays) : 3;
      setPreparationDays(prep);
      setDeliveryDays(del);
      setOrigFulfillment({ prep, delivery: del });
    }
  }, [vendor, deliveryLocal]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(t);
  }, [banner]);

  function flash(msg: string, type: "success" | "error" = "success") {
    setBanner({ msg, type });
  }

  function startEdit() {
    if (!vendor) return;
    preDraftRef.current = { ...draft };
    preAccountTypeRef.current = accountType;
    preWhatsappRef.current = whatsappEnabled;
    setDraft((prev) => ({ ...prev, name: vendor.name, phone: vendor.phone, companyLocation: vendor.companyLocation }));
    setEditing(true);
  }

  function handleCancel() {
    if (preDraftRef.current) {
      setDraft(preDraftRef.current);
      setAccountType(preAccountTypeRef.current);
      setWhatsappEnabled(preWhatsappRef.current);
    }
    setEditing(false);
  }

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const updated = await api.profile.update({ name: draft.name, phone: draft.phone, companyLocation: draft.companyLocation });
      setVendor(updated);
      setEditing(false);
      try {
        localStorage.setItem("vp_extras", JSON.stringify({
          webAddress: draft.webAddress,
          category: draft.category,
          comments: draft.comments,
          accountType,
          whatsappEnabled,
        }));
      } catch {}
      flash(t("profileSaved"));
    } catch {
      flash("Error saving profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCommission() {
    setSavingCommission(true);
    try {
      const res = await api.products.list({ limit: 100 });
      await Promise.all(
        res.items.map((product) => {
          const vendorRevenue = product.sellingPrice * (1 - product.commissionPct / 100);
          const newSellingPrice = Math.round(vendorRevenue / (1 - commissionPct / 100));
          return api.products.update(product.id, { commissionPct, sellingPrice: newSellingPrice });
        }),
      );
      flash("Commission updated — all product prices recalculated.", "success");
    } catch {
      flash("Error updating commission.", "error");
    } finally {
      setSavingCommission(false);
    }
  }

  async function handleDeleteWarehouse(id: string) {
    if (!vendor || !window.confirm(t("confirmDeleteWarehouse"))) return;
    const warehouses = vendor.warehouses.filter((w) => w.id !== id).map(whStrip);
    try {
      const updated = await api.profile.update({ warehouses });
      setVendor(updated);
      flash(t("warehouseDeleted"));
    } catch {
      flash("Error removing warehouse.", "error");
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
      flash("Error adding warehouse.", "error");
    }
  }

  async function handleSaveDelivery() {
    setSavingDelivery(true);
    try {
      const updated = await api.profile.update({ deliveryMechanism: deliveryLocal });
      setVendor(updated);
      flash(t("deliveryMechanismSaved"));
    } catch {
      flash("Error saving delivery preference.", "error");
    } finally {
      setSavingDelivery(false);
    }
  }

  function handleSaveFulfillment() {
    setSavingFulfillment(true);
    try {
      const e = getStoredExtras() ?? {};
      localStorage.setItem("vp_extras", JSON.stringify({ ...e, preparationDays, deliveryDays }));
      setOrigFulfillment({ prep: preparationDays, delivery: deliveryDays });
      flash("Fulfillment times saved.");
    } finally {
      setSavingFulfillment(false);
    }
  }

  function handleDocFiles(files: FileList | null) {
    if (!files) return;
    setUploadedFiles((prev) => [...prev, ...Array.from(files).slice(0, slotsLeft)]);
  }

  const pointsAvailable = (vendor?.pointsEarned ?? 0) - (vendor?.pointsRedeemed ?? 0);
  const deliveryChanged = vendor && deliveryLocal !== vendor.deliveryMechanism;
  const fulfillmentChanged = preparationDays !== origFulfillment.prep || deliveryDays !== origFulfillment.delivery;

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading-state">
          <Loader2 size={32} className="spin" />
          <span>Loading profile…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Banner */}
      {banner && (
        <div className={banner.type === "error" ? "warning-banner profile-banner" : "success-banner profile-banner"}>
          {banner.type === "success" ? <Check size={16} strokeWidth={2.5} /> : <Info size={16} strokeWidth={2.5} />}
          {banner.msg}
        </div>
      )}

      {/* Page title */}
      <div className="profile-page-header">
        <div className="profile-page-title">
          <h1>{t("vendorProfile")}</h1>
          <p className="dashboard-sub">Manage your business information, documents, and settings</p>
        </div>
        {!editing ? (
          <button className="warehouse-button" type="button" onClick={startEdit} disabled={!vendor}>
            <Pencil size={14} strokeWidth={2.3} />
            <span>{t("editProfile")}</span>
          </button>
        ) : (
          <div className="profile-section-actions">
            <button className="submit-all-button" type="button" onClick={handleSaveProfile} disabled={saving}>
              {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} strokeWidth={2.3} />}
              <span>{saving ? "Saving…" : t("saveChanges")}</span>
            </button>
            <button className="warehouse-button" type="button" onClick={handleCancel}>
              <X size={14} strokeWidth={2.3} />
              <span>{t("cancelEdit")}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Hero Card ── */}
      <div className="profile-hero-card">
        <div className="profile-hero-body">
          <VendorAvatar name={vendor?.name ?? ""} src={avatarSrc} onUpload={setAvatarSrc} />
          <div className="profile-hero-meta">
            <div className="profile-hero-name-row">
              <strong>{vendor?.name ?? "—"}</strong>
              <span className="vendor-status-badge">
                <ShieldCheck size={11} strokeWidth={2.5} />
                Active &amp; Verified
              </span>
            </div>
            <span className="profile-hero-email">{vendor?.email ?? "—"}</span>
            <div className="profile-hero-tags">
              <span className="profile-hero-tag">
                <CalendarDays size={12} />
                Joined {vendor ? new Date(vendor.joinedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
              </span>
              <span className="profile-hero-tag">
                <User size={12} />
                AM: {vendor?.accountManager ?? "—"}
              </span>
              <span className="profile-hero-tag">
                <MapPin size={12} />
                {vendor?.companyLocation ?? "—"}
              </span>
            </div>
          </div>
          <div className="profile-hero-ref">
            <span className="profile-label">Vendor ID</span>
            <div className="profile-ref-row">
              <code className="profile-ref-code">{vendor?.reference ?? "—"}</code>
              {vendor?.reference && <CopyButton text={vendor.reference} />}
            </div>
          </div>
        </div>
      </div>

      {/* ── Primary Information ── */}
      <section className={`profile-section-card${editing ? " profile-section-card--editing" : ""}`}>
        <div className="profile-card-header">
          <SectionHeading icon={Info} title="Primary Information" />
        </div>
        <div className="profile-card-body">
          <div className="profile-grid">
            <ChoiceGroup label="Account Type:" options={["Individual", "Company"]} selected={accountType} onChange={editing ? setAccountType : undefined} />
            {editing ? (
              <EditInput label="Web Address / Facebook Page:" value={draft.webAddress} onChange={(v) => setDraft((p) => ({ ...p, webAddress: v }))} placeholder="https://..." />
            ) : (
              <Field icon={Building2} label="Web Address / Facebook Page:" value={draft.webAddress || undefined} placeholder="Not set" />
            )}
            <Field
              icon={CalendarDays}
              label="Date of Joining Electro Mall:"
              value={vendor ? new Date(vendor.joinedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : undefined}
            />
            {editing ? (
              <EditInput label="Vendor / Company Name:" value={draft.name} onChange={(v) => setDraft((p) => ({ ...p, name: v }))} />
            ) : (
              <Field icon={Users} label="Vendor / Company Name:" value={vendor?.name} />
            )}
            {editing ? (
              <EditInput label="Category of Products:" value={draft.category} onChange={(v) => setDraft((p) => ({ ...p, category: v }))} placeholder="e.g. Electronics" />
            ) : (
              <Field icon={Tags} label="Category of Products:" value={draft.category || undefined} placeholder="Not set" />
            )}
            {editing ? (
              <EditTextarea label="Comments:" value={draft.comments} onChange={(v) => setDraft((p) => ({ ...p, comments: v }))} placeholder="Any additional notes" />
            ) : (
              <Field icon={MessageSquareText} label="Comments:" value={draft.comments || undefined} placeholder="No comments" />
            )}
          </div>
        </div>
      </section>

      {/* ── Contact Details ── */}
      <section className={`profile-section-card${editing ? " profile-section-card--editing" : ""}`}>
        <div className="profile-card-header">
          <SectionHeading icon={User} title="Contact Details" />
        </div>
        <div className="profile-card-body">
          <div className="profile-grid profile-contact-grid">
            <div className="profile-column">
              {editing ? (
                <>
                  <Field icon={User} label="Account Manager:" value={vendor?.accountManager} helper="Set by Electro Mall — contact support to change" />
                  <Field icon={Mail} label="Email Address:" value={vendor?.email} helper="Contact support to change email" />
                  <EditInput label="Mobile Number:" value={draft.phone} onChange={(v) => setDraft((p) => ({ ...p, phone: v }))} placeholder="07xxxxxxxxx" />
                  <ToggleLine label="WhatsApp notification:" enabled={whatsappEnabled} onChange={() => setWhatsappEnabled((v) => !v)} />
                </>
              ) : (
                <>
                  <Field icon={User} label="Account Manager:" value={vendor?.accountManager} helper="Person responsible for account follow-up" />
                  <Field icon={Mail} label="Email Address:" value={vendor?.email} />
                  <Field helper="eg : +9647912345678" icon={Phone} label="Mobile Number:" value={vendor ? <PhoneValue number={vendor.phone} /> : undefined} />
                  <ToggleLine label="WhatsApp notification:" enabled={whatsappEnabled} onChange={() => setWhatsappEnabled((v) => !v)} />
                </>
              )}
            </div>
            <div className="profile-column">
              {editing ? (
                <>
                  <EditInput label="Company Location:" value={draft.companyLocation} onChange={(v) => setDraft((p) => ({ ...p, companyLocation: v }))} placeholder="City, Province" />
                  <Field icon={Globe2} label="Country:" value="Iraq" />
                  <LocationStatus />
                  <MapFrame title="Contact address map" />
                </>
              ) : (
                <>
                  <Field icon={Globe2} label="Country:" value="Iraq" />
                  <Field icon={MapPin} label="Company Location:" value={vendor?.companyLocation} />
                  <LocationStatus />
                  <MapFrame title="Contact address map" />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Warehouse Locations ── */}
      <section className="profile-section-card">
        <div className="profile-card-header">
          <SectionHeading icon={Warehouse} title="Warehouse Locations" />
          <span className="profile-count-badge">
            {vendor?.warehouses?.length ?? 0} warehouse{(vendor?.warehouses?.length ?? 0) !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="profile-card-body profile-card-body--warehouses">
          {vendor?.warehouses && vendor.warehouses.length > 0 ? (
            vendor.warehouses.map((wh, i) => (
              <WarehouseEntry key={wh.id} wh={wh} index={i} onDelete={() => handleDeleteWarehouse(wh.id)} />
            ))
          ) : (
            <div className="profile-empty-warehouses">
              <Warehouse size={28} strokeWidth={1.5} />
              <strong>No warehouses added yet</strong>
              <span>Add your warehouse locations to enable shipping configuration</span>
            </div>
          )}

          {addingWh ? (
            <AddWarehouseForm
              draft={newWh}
              onChange={(patch) => setNewWh((p) => ({ ...p, ...patch }))}
              onSave={handleAddWarehouse}
              onCancel={() => { setAddingWh(false); setNewWh(emptyWh); }}
              t={t}
            />
          ) : (
            <div className="warehouse-action-row">
              <button className="warehouse-button" type="button" onClick={() => setAddingWh(true)}>
                <MapPin size={15} strokeWidth={2.4} />
                <span>{t("addWarehouse")}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Payment Details ── */}
      <section className="profile-section-card">
        <div className="profile-card-header">
          <SectionHeading icon={CreditCard} title="Payment Details" />
        </div>
        <div className="profile-card-body">
          <div className="payment-stack">
            <ChoiceGroup label="Currency" options={["Iraqi Dinar", "US Dollar"]} selected={currency} onChange={setCurrency} />
            <p className="payment-note">
              You will receive payment in {currency === "Iraqi Dinar" ? "Iraqi Dinars" : "US Dollars"}.
            </p>
            <div className="profile-payment-row">
              <div className="profile-field">
                <span className="profile-label">Commission:</span>
                <div className="profile-field-box" style={{ gap: "8px", alignItems: "center" }}>
                  <input
                    className="profile-edit-input"
                    type="number"
                    min={0}
                    max={40}
                    step={0.5}
                    value={commissionPct}
                    onChange={(e) => setCommissionPct(Number(e.target.value))}
                    style={{ width: "72px" }}
                  />
                  <span className="profile-field-value profile-value">%</span>
                  <button
                    className="submit-all-button"
                    type="button"
                    onClick={handleSaveCommission}
                    disabled={savingCommission}
                    style={{ padding: "6px 12px", fontSize: "13px" }}
                  >
                    {savingCommission ? "Saving…" : "Apply to All Products"}
                  </button>
                </div>
              </div>
              <Field icon={WalletCards} label="Payment Method:" value="Cash" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Documents ── */}
      <section className="profile-section-card">
        <div className="profile-card-header">
          <SectionHeading icon={FileText} title="Documents" />
          <span className="profile-count-badge">{totalDocs} / {maxDocs} uploaded</span>
        </div>
        <div className="profile-card-body">
          <div className="documents-area">
            <div className="documents-copy">
              <h3>Identification</h3>
              <p>
                Attach a copy of your identification. For individuals: passport or national ID.
                For companies: company registration certificate.
              </p>
            </div>

            <div className="document-status-box">
              <div className="document-status-top">
                <span><strong>Documents uploaded:</strong> {totalDocs} of {maxDocs}</span>
                <strong className="slots-badge">{slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} remaining</strong>
              </div>
              <div className="document-progress">
                <span style={{ width: `${docProgress}%` }} />
              </div>
            </div>

            <div className="uploaded-documents">
              <h3>Uploaded Documents</h3>
              <article className="document-card document-card--saved">
                <div className="document-card-top">
                  <span className="document-number">1</span>
                  <span className="image-badge">
                    <ImageIcon size={13} strokeWidth={2.4} />
                    IMAGE
                  </span>
                </div>
                <div className="document-preview">
                  <span className="document-brand-mark">EM</span>
                  <span className="document-brand-text">electromall</span>
                </div>
                <div className="document-meta">
                  <strong>{vendor ? `${vendor.id.slice(0, 20)}…` : "—"}</strong>
                  <span>Image Document</span>
                </div>
              </article>

              {uploadedFiles.map((file, idx) => (
                <article className="document-card document-card--upload" key={`${file.name}-${idx}`}>
                  <div className="document-card-top">
                    <span className="document-number">{idx + 2}</span>
                    <span className="image-badge">
                      {file.type === "application/pdf"
                        ? <><FileText size={13} strokeWidth={2.4} /> PDF</>
                        : <><ImageIcon size={13} strokeWidth={2.4} /> IMAGE</>}
                    </span>
                    <button type="button" className="warehouse-delete-btn" onClick={() => setUploadedFiles((p) => p.filter((_, i) => i !== idx))}>
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

            {slotsLeft > 0 && (
              <div
                className="upload-dropzone"
                onClick={() => docInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleDocFiles(e.dataTransfer.files); }}
              >
                <input ref={docInputRef} type="file" multiple accept=".png,.jpg,.jpeg,.pdf" className="sr-only" onChange={(e) => handleDocFiles(e.target.files)} />
                <div className="upload-target">
                  <Upload size={36} strokeWidth={2.1} />
                  <strong>Browse or drag files here</strong>
                  <span>Up to {slotsLeft} more file{slotsLeft !== 1 ? "s" : ""} · PNG, JPEG, PDF · max 5MB each</span>
                </div>
              </div>
            )}

            <div className="submit-row">
              <button className="submit-all-button" type="button" onClick={() => flash(t("documentsSubmitted"))}>
                <Save size={16} strokeWidth={2.3} />
                <span>Submit All Documents</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Delivery Mechanism ── */}
      <section className="profile-section-card">
        <div className="profile-card-header">
          <SectionHeading icon={Truck} title="Delivery Mechanism" />
        </div>
        <div className="profile-card-body">
          <div className="payment-stack">
            <ChoiceGroup
              label="Delivery handled by:"
              options={["By the Vendor", "By Electro Mall"]}
              selected={deliveryLocal || (vendor?.deliveryMechanism ?? "By Electro Mall")}
              onChange={setDeliveryLocal}
            />
            <p className="payment-note">
              Electro Mall delivery includes platform shipping fees in your settlement.
              Vendor delivery requires you to handle dispatch and last-mile yourself.
            </p>
            {deliveryChanged && (
              <div className="submit-row">
                <button className="submit-all-button" type="button" onClick={handleSaveDelivery} disabled={savingDelivery}>
                  {savingDelivery ? <Loader2 size={14} className="spin" /> : <Save size={14} strokeWidth={2.3} />}
                  <span>{savingDelivery ? "Saving…" : t("saveChanges")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Order Fulfillment Times ── */}
      <section className="profile-section-card">
        <div className="profile-card-header">
          <SectionHeading icon={Timer} title="Order Fulfillment Times" />
        </div>
        <div className="profile-card-body">
          <div className="fulfillment-times-grid">
            <article className="fulfillment-time-card">
              <div className="fulfillment-time-icon fulfillment-prep-icon">
                <Timer size={20} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <p className="fulfillment-time-label">Item Preparation Time</p>
              <p className="fulfillment-time-sub">Days to pack &amp; prepare order</p>
              <div className="fulfillment-time-input-wrap">
                <input
                  className="fulfillment-time-input"
                  type="number"
                  min={0}
                  max={30}
                  value={preparationDays}
                  onChange={(e) => setPreparationDays(Math.max(0, Number(e.target.value)))}
                />
                <span>days</span>
              </div>
            </article>

            <article className="fulfillment-time-card">
              <div className="fulfillment-time-icon fulfillment-delivery-icon">
                <Truck size={20} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <p className="fulfillment-time-label">Delivery Lead Time</p>
              <p className="fulfillment-time-sub">Days from dispatch to customer</p>
              <div className="fulfillment-time-input-wrap">
                <input
                  className="fulfillment-time-input"
                  type="number"
                  min={0}
                  max={60}
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Math.max(0, Number(e.target.value)))}
                />
                <span>days</span>
              </div>
            </article>

            <article className="fulfillment-time-card fulfillment-total-card">
              <div className="fulfillment-time-icon fulfillment-total-icon">
                <CalendarDays size={20} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <p className="fulfillment-time-label">Total Estimated Window</p>
              <p className="fulfillment-time-sub">Preparation + delivery combined</p>
              <strong className="fulfillment-total-value">
                {preparationDays + deliveryDays} days
              </strong>
            </article>
          </div>

          {fulfillmentChanged && (
            <div className="submit-row">
              <button
                className="submit-all-button"
                type="button"
                onClick={handleSaveFulfillment}
                disabled={savingFulfillment}
              >
                {savingFulfillment ? (
                  <Loader2 size={14} className="spin" />
                ) : (
                  <Save size={14} strokeWidth={2.3} />
                )}
                <span>{savingFulfillment ? "Saving…" : t("saveChanges")}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Vendor Points ── */}
      <section className="profile-section-card">
        <div className="profile-card-header">
          <SectionHeading icon={Coins} title="Vendor Points" />
          <span className="profile-points-balance">
            <Coins size={14} />
            {pointsAvailable.toLocaleString()} pts available
          </span>
        </div>
        <div className="profile-card-body">
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
            <Megaphone size={18} strokeWidth={2.2} />
            <div>
              <strong>Use points for marketing campaigns</strong>
              <p>Points accumulate automatically with every completed order. Redeem them to fund marketing packages.</p>
            </div>
            <Link className="points-marketing-link" href="/marketing/new">Browse Packages</Link>
          </div>

          <div className="submit-row">
            <button
              className="submit-all-button"
              type="button"
              onClick={() => { if (window.confirm(t("redeemConfirm"))) flash(t("pointsRedeemed")); }}
            >
              <Award size={16} strokeWidth={2.3} />
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
                  <td colSpan={5} className="empty-cell">
                    {pointsAvailable === 0 ? "No transaction history yet" : "Transaction history coming soon"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Vendor Performance ── */}
      <section className="profile-section-card">
        <div className="profile-card-header">
          <SectionHeading icon={Gauge} title="Vendor Performance" />
        </div>
        <div className="profile-card-body">
          <div className="performance-grid performance-grid-4">
            {([
              {
                metric: "speed" as const,
                icon: Activity,
                label: "Order Processing Speed",
                value: vendor?.processingSpeedHours ?? 0,
                display: `${vendor?.processingSpeedHours ?? 0} h avg`,
                target: "target: < 24 h",
                sparkData: [6, 5.5, 5, 4.8, 5.2, 4.5, 4.2, vendor?.processingSpeedHours ?? 4],
              },
              {
                metric: "cancel" as const,
                icon: Info,
                label: "Cancellation Rate",
                value: vendor?.cancellationRate ?? 0,
                display: `${vendor?.cancellationRate ?? 0}%`,
                target: "target: < 2%",
                sparkData: [3, 2.8, 2.5, 2.4, 2, 1.9, 1.8, vendor?.cancellationRate ?? 1.8],
              },
              {
                metric: "rating" as const,
                icon: Star,
                label: "Customer Rating",
                value: vendor?.customerRating ?? 0,
                display: `${vendor?.customerRating ?? 0} / 5`,
                target: "target: ≥ 4.0",
                sparkData: [4.2, 4.3, 4.4, 4.5, 4.4, 4.5, 4.6, vendor?.customerRating ?? 4.6],
              },
              {
                metric: "upload" as const,
                icon: FileText,
                label: "Product Upload Activity",
                value: vendor?.uploadActivity ?? 0,
                display: `${vendor?.uploadActivity ?? 0} uploads`,
                target: "this month",
                sparkData: [2, 4, 3, 5, 4, 6, 5, vendor?.uploadActivity ?? 3],
              },
            ] as const).map(({ metric, icon: Icon, label, value, display, target, sparkData }) => {
              const cls = perfClass(metric, value);
              const lbl = perfLabel(metric, value);
              const pct = perfPct(metric, value);
              return (
                <article key={metric} className="performance-card">
                  <header className="performance-card-header">
                    <Icon aria-hidden="true" size={16} strokeWidth={2.3} />
                    <span>{label}</span>
                  </header>
                  <strong className={cls}>{display}</strong>
                  <div className="perf-progress-track">
                    <div className={`perf-progress-bar ${cls}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="perf-benchmark">
                    <span className={cls}>{lbl}</span>
                    <em> · {target}</em>
                  </span>
                  <Sparkline data={sparkData} />
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
