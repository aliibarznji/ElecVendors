"use client";

import { Eye, Pencil, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { useState } from "react";

type Warranty = {
  id: string;
  title: string;
  duration: string;
  phone: string;
  location: string;
  terms: string;
  active: boolean;
};

const initialWarranty: Warranty = {
  id: "war-1",
  title: "Hair Care Devices Warranty",
  duration: "12 months",
  phone: "+964 750 493 0644",
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
  const hasError = !draft.duration.trim() || !draft.phone.trim() || !draft.location.trim();

  return (
    <section className="warranty-form-card" aria-label="Warranty Form">
      <div className="warranty-form-header">
        <h2>Warranty Details</h2>
        <button className="warranty-cancel-outline" type="button" onClick={onCancel}>
          <X aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>Cancel</span>
        </button>
      </div>
      {submitted && hasError ? (
        <div className="warning-banner">Warranty duration, phone, and service center location are required.</div>
      ) : null}
      <div className="warranty-main-grid">
        <label className="warranty-field">
          <span>Warranty Title</span>
          <div className="warranty-field-box">
            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>Warranty Duration</span>
          <div className="warranty-field-box">
            <input
              value={draft.duration}
              onChange={(event) => setDraft({ ...draft, duration: event.target.value })}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>Service Phone</span>
          <div className="warranty-field-box">
            <input
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>Service Center Location</span>
          <div className="warranty-field-box">
            <input
              value={draft.location}
              onChange={(event) => setDraft({ ...draft, location: event.target.value })}
            />
          </div>
        </label>
      </div>
      <label className="warranty-field">
        <span>Terms and Conditions</span>
        <div className="warranty-field-box warranty-textarea-box">
          <textarea
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
      <div className="warranty-actions">
        <button className="warranty-cancel-button" type="button" onClick={onCancel}>
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

  return (
    <div className="warranty-content">
      <header className="page-title-row">
        <div>
          <h1>Warranty</h1>
          <p className="dashboard-sub">
            Warranty details displayed to the customer on the ElecMall website.
          </p>
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
              phone: "",
              location: "",
              terms: "",
              active: true,
            }
          }
          onCancel={() => setEditing(false)}
          onSave={(next) => {
            setWarranty(next);
            setEditing(false);
          }}
        />
      ) : (
        <section className="warranty-card warranty-info-card">
          {warranty ? (
            <>
              <div className="warranty-card-heading">
                <ShieldCheck aria-hidden="true" size={28} strokeWidth={2.3} />
                <div>
                  <h2>{warranty.title}</h2>
                  <span
                    className={`approved-status-badge ${
                      warranty.active ? "is-active" : "is-completed"
                    }`}
                  >
                    {warranty.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="warranty-detail-grid">
                <article>
                  <span>Warranty Duration</span>
                  <strong>{warranty.duration}</strong>
                </article>
                <article>
                  <span>Service Phone</span>
                  <strong>{warranty.phone}</strong>
                </article>
                <article>
                  <span>Service Center</span>
                  <strong>{warranty.location}</strong>
                </article>
              </div>
              <div className="warranty-terms-box">
                <strong>Terms</strong>
                <p>{warranty.terms}</p>
                <div className="discount-chip-row">
                  <span className="discount-chip">Manufacturing Defects</span>
                  <span className="discount-chip">Authorized Service</span>
                  <span className="discount-chip">Visible to Customer</span>
                </div>
              </div>
              <div className="row-actions warranty-card-actions">
                <button className="row-action-btn" type="button" onClick={() => setPreview(true)}>
                  <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                  Preview
                </button>
                <button className="row-action-btn" type="button" onClick={() => setEditing(true)}>
                  <Pencil aria-hidden="true" size={14} strokeWidth={2.4} />
                  Edit
                </button>
                <button className="row-action-btn reject-btn" type="button" onClick={() => setWarranty(null)}>
                  <Trash2 aria-hidden="true" size={14} strokeWidth={2.4} />
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="warranty-empty-state">
              <h2>No warranty data found</h2>
              <p>Add warranty duration, service phone, and center location to display to the customer.</p>
            </div>
          )}
        </section>
      )}

      {preview && warranty ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <header className="modal-header">
              <div>
                <h3>Preview What Customer Sees</h3>
                <p className="modal-sub">{warranty.title}</p>
              </div>
              <button className="modal-close" type="button" onClick={() => setPreview(false)}>
                ×
              </button>
            </header>
            <div className="modal-body">
              <p>Warranty Duration: {warranty.duration}</p>
              <p>Contact Service: {warranty.phone}</p>
              <p>Center: {warranty.location}</p>
              <p>{warranty.terms}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
