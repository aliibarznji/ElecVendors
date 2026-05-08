"use client";

import { Eye, Pencil, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "../lib/lang-context";

type Warranty = {
  id: string;
  title: string;
  duration: string;
  maintenanceNumber: string;
  maintenancePhone: string;
  location: string;
  terms: string;
  active: boolean;
};

const initialWarranty: Warranty = {
  id: "war-1",
  title: "Hair Care Devices Warranty",
  duration: "12 months",
  maintenanceNumber: "9229-972-7704",
  maintenancePhone: "+964 750 493 0644",
  location: "Erbil Service Center - Street 100",
  terms: "Covers manufacturing defects. Does not cover breakage, misuse, or liquid damage.",
  active: true,
};

function WarrantyForm({
  warranty,
  onCancel,
  onSave,
}: {
  warranty: Warranty;
  onCancel: () => void;
  onSave: (warranty: Warranty) => void;
}) {
  const [draft, setDraft] = useState(warranty);
  const [submitted, setSubmitted] = useState(false);
  const hasError =
    !draft.duration.trim() ||
    !draft.maintenanceNumber.trim() ||
    !draft.maintenancePhone.trim() ||
    !draft.location.trim();

  return (
    <section
      className="rounded-[14px] border border-border bg-white shadow-sm p-[22px_24px] grid gap-4"
      aria-label="Warranty Form"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[#0f172a] m-0">Warranty Details</h2>
        <button
          className="inline-flex items-center gap-1.5 px-3 min-h-[32px] rounded-lg border border-border bg-white text-[13px] font-medium text-muted cursor-pointer transition-colors hover:bg-surface-soft hover:border-[#c8d0e0] hover:text-text"
          type="button"
          onClick={onCancel}
        >
          <X aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>Cancel</span>
        </button>
      </div>
      {submitted && hasError ? (
        <div className="flex items-center gap-[9px] px-[14px] py-[11px] rounded-[10px] border border-[#fed7aa] bg-[#fff7ed] text-[#9a3412] text-[13px]">
          Warranty duration, maintenance number, hotline, and maintenance
          center location are required.
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-[14px]">
        <label className="grid gap-[5px]">
          <span className="text-[12px] font-semibold text-[#475569]">Warranty Title</span>
          <div className="flex items-center min-h-[36px] px-[10px] rounded-[9px] border border-border bg-[#f8f9fc] transition-colors focus-within:border-[rgba(215,25,32,0.4)] focus-within:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus-within:bg-white">
            <input
              className="border-0 outline-none bg-transparent text-[13px] text-text w-full"
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            />
          </div>
        </label>
        <label className="grid gap-[5px]">
          <span className="text-[12px] font-semibold text-[#475569]">Warranty Duration</span>
          <div className="flex items-center min-h-[36px] px-[10px] rounded-[9px] border border-border bg-[#f8f9fc] transition-colors focus-within:border-[rgba(215,25,32,0.4)] focus-within:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus-within:bg-white">
            <input
              className="border-0 outline-none bg-transparent text-[13px] text-text w-full"
              value={draft.duration}
              onChange={(event) => setDraft({ ...draft, duration: event.target.value })}
            />
          </div>
        </label>
        <label className="grid gap-[5px]">
          <span className="text-[12px] font-semibold text-[#475569]">Maintenance Number</span>
          <div className="flex items-center min-h-[36px] px-[10px] rounded-[9px] border border-border bg-[#f8f9fc] transition-colors focus-within:border-[rgba(215,25,32,0.4)] focus-within:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus-within:bg-white">
            <input
              className="border-0 outline-none bg-transparent text-[13px] text-text w-full"
              value={draft.maintenanceNumber}
              onChange={(event) =>
                setDraft({ ...draft, maintenanceNumber: event.target.value })
              }
              placeholder="e.g. 9229-972-7704"
            />
          </div>
        </label>
        <label className="grid gap-[5px]">
          <span className="text-[12px] font-semibold text-[#475569]">Maintenance Hotline</span>
          <div className="flex items-center min-h-[36px] px-[10px] rounded-[9px] border border-border bg-[#f8f9fc] transition-colors focus-within:border-[rgba(215,25,32,0.4)] focus-within:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus-within:bg-white">
            <input
              className="border-0 outline-none bg-transparent text-[13px] text-text w-full"
              value={draft.maintenancePhone}
              onChange={(event) =>
                setDraft({ ...draft, maintenancePhone: event.target.value })
              }
            />
          </div>
        </label>
        <label className="grid gap-[5px]">
          <span className="text-[12px] font-semibold text-[#475569]">Maintenance Center Location</span>
          <div className="flex items-center min-h-[36px] px-[10px] rounded-[9px] border border-border bg-[#f8f9fc] transition-colors focus-within:border-[rgba(215,25,32,0.4)] focus-within:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus-within:bg-white">
            <input
              className="border-0 outline-none bg-transparent text-[13px] text-text w-full"
              value={draft.location}
              onChange={(event) => setDraft({ ...draft, location: event.target.value })}
            />
          </div>
        </label>
      </div>
      <label className="grid gap-[5px]">
        <span className="text-[12px] font-semibold text-[#475569]">Terms and Conditions</span>
        <div className="flex items-start min-h-[80px] px-[10px] py-[8px] rounded-[9px] border border-border bg-[#f8f9fc] transition-colors focus-within:border-[rgba(215,25,32,0.4)] focus-within:shadow-[0_0_0_3px_rgba(215,25,32,0.09)] focus-within:bg-white">
          <textarea
            className="border-0 outline-none bg-transparent text-[13px] text-text w-full resize-y"
            value={draft.terms}
            onChange={(event) => setDraft({ ...draft, terms: event.target.value })}
          />
        </div>
      </label>
      <button
        className="modal-toggle"
        type="button"
        aria-pressed={draft.active}
        onClick={() => setDraft({ ...draft, active: !draft.active })}
      >
        <span className={`toggle-switch${draft.active ? " is-enabled" : ""}`} />
        <strong>{draft.active ? "Active Warranty" : "Inactive Warranty"}</strong>
      </button>
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          className="inline-flex items-center justify-center gap-2 px-[14px] min-h-[34px] rounded-lg border border-border bg-white text-[13px] font-medium text-muted cursor-pointer transition-colors hover:bg-[#f0f4ff] hover:border-[rgba(61,95,182,0.25)]"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="save-warranty-button"
          type="button"
          onClick={() => {
            setSubmitted(true);
            if (!hasError) onSave(draft);
          }}
        >
          <Save aria-hidden="true" size={18} strokeWidth={2.4} />
          <span>Save Warranty</span>
        </button>
      </div>
    </section>
  );
}

export function WarrantyContent() {
  const [warranty, setWarranty] = useState<Warranty | null>(initialWarranty);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const { t } = useLang();

  useEffect(() => {
    if (!savedMsg) return;
    const timer = setTimeout(() => setSavedMsg(""), 4000);
    return () => clearTimeout(timer);
  }, [savedMsg]);

  return (
    <div className="grid gap-[18px] p-[22px_24px_48px]">
      {savedMsg ? (
        <div className="flex items-center gap-[9px] px-[14px] py-[11px] rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534] text-[13px]">
          {savedMsg}
        </div>
      ) : null}
      <header className="flex items-start justify-between gap-[18px]">
        <div>
          <h1 className="m-0">{t("warrantyTitle")}</h1>
          <p className="mt-[7px] text-muted text-[13px] leading-[1.5]">{t("warrantySub")}</p>
        </div>
        {!editing ? (
          <button
            className="discount-create-button"
            type="button"
            onClick={() => setEditing(true)}
          >
            <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
            <span>{warranty ? "Edit Warranty" : "Add Warranty"}</span>
          </button>
        ) : null}
      </header>

      {editing ? (
        <WarrantyForm
          warranty={
            warranty ?? {
              id: "war-new",
              title: "",
              duration: "",
              maintenanceNumber: "",
              maintenancePhone: "",
              location: "",
              terms: "",
              active: true,
            }
          }
          onCancel={() => setEditing(false)}
          onSave={(next) => {
            setWarranty(next);
            setEditing(false);
            setSavedMsg(t("warrantySaved"));
          }}
        />
      ) : (
        <section className="dashboard-panel grid gap-4 p-[22px_24px]">
          {warranty ? (
            <>
              <div className="flex items-center gap-3">
                <ShieldCheck aria-hidden="true" size={28} strokeWidth={2.3} />
                <div>
                  <h2 className="text-[16px] font-bold text-[#0f172a] m-0">{warranty.title}</h2>
                  <span
                    className={`approved-status-badge ${
                      warranty.active ? "is-active" : "is-completed"
                    }`}
                  >
                    {warranty.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <article className="grid gap-[3px] p-[12px_14px] rounded-[10px] border border-border bg-[#fafbfe]">
                  <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.4px]">Warranty Duration</span>
                  <strong className="text-[14px] font-bold text-[#0f172a]">{warranty.duration}</strong>
                </article>
                <article className="grid gap-[3px] p-[12px_14px] rounded-[10px] border border-border bg-[#fafbfe]">
                  <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.4px]">Maintenance Number</span>
                  <strong className="text-[14px] font-bold text-[#0f172a]">{warranty.maintenanceNumber}</strong>
                </article>
                <article className="grid gap-[3px] p-[12px_14px] rounded-[10px] border border-border bg-[#fafbfe]">
                  <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.4px]">Maintenance Hotline</span>
                  <strong className="text-[14px] font-bold text-[#0f172a]">{warranty.maintenancePhone}</strong>
                </article>
                <article className="grid gap-[3px] p-[12px_14px] rounded-[10px] border border-border bg-[#fafbfe]">
                  <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.4px]">Maintenance Center</span>
                  <strong className="text-[14px] font-bold text-[#0f172a]">{warranty.location}</strong>
                </article>
              </div>
              <div className="p-[14px_16px] rounded-[10px] border border-border bg-[#fafbfe] grid gap-2">
                <strong className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.4px]">Terms</strong>
                <p className="text-[13px] text-[#334155] m-0 leading-[1.6]">{warranty.terms}</p>
                <div className="flex gap-[6px] flex-wrap mt-2">
                  <span className="inline-flex items-center px-[9px] py-[3px] rounded-full border border-border bg-[#f8f9fc] text-[11.5px] text-[#475569]">Manufacturing Defects</span>
                  <span className="inline-flex items-center px-[9px] py-[3px] rounded-full border border-border bg-[#f8f9fc] text-[11.5px] text-[#475569]">Authorized Service</span>
                  <span className="inline-flex items-center px-[9px] py-[3px] rounded-full border border-border bg-[#f8f9fc] text-[11.5px] text-[#475569]">Visible to Customer</span>
                </div>
              </div>
              <div className="flex items-center gap-[6px] flex-wrap rtl:flex-row-reverse">
                <button className="row-action-btn" type="button" onClick={() => setPreview(true)}>
                  <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                  Preview
                </button>
                <button className="row-action-btn" type="button" onClick={() => setEditing(true)}>
                  <Pencil aria-hidden="true" size={14} strokeWidth={2.4} />
                  Edit
                </button>
                <button className="row-action-btn border-[#fecaca] text-[#b91c1c]" type="button" onClick={() => setWarranty(null)}>
                  <Trash2 aria-hidden="true" size={14} strokeWidth={2.4} />
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-[48px_24px] gap-2">
              <h2 className="text-[16px] font-bold text-[#0f172a] m-0">No warranty data found</h2>
              <p className="text-[13px] text-[#64748b] m-0 text-center">Add warranty duration, maintenance number, hotline, and center location to display to the customer.</p>
            </div>
          )}
        </section>
      )}

      {preview && warranty ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.35)] backdrop-blur-[4px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[480px] rounded-[16px] border border-border bg-white shadow-lg overflow-hidden">
            <header className="flex items-start justify-between gap-3 p-[18px_20px] border-b border-border rtl:flex-row-reverse">
              <div className="rtl:text-right">
                <h3 className="text-[15px] font-bold text-[#0f172a] m-0">Preview What Customer Sees</h3>
                <p className="text-[12px] text-[#64748b] mt-[3px] mb-0">{warranty.title}</p>
              </div>
              <button
                className="inline-grid place-items-center w-7 h-7 rounded-[7px] border border-border bg-[#f8f9fc] text-muted cursor-pointer shrink-0 transition-colors hover:bg-[#fee2e2] hover:border-[#fca5a5] hover:text-brand"
                type="button"
                onClick={() => setPreview(false)}
              >
                ×
              </button>
            </header>
            <div className="p-[18px_20px] grid gap-[14px]">
              <p>Warranty Duration: {warranty.duration}</p>
              <p>Maintenance Number: {warranty.maintenanceNumber}</p>
              <p>Maintenance Hotline: {warranty.maintenancePhone}</p>
              <p>Maintenance Center: {warranty.location}</p>
              <p>{warranty.terms}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
