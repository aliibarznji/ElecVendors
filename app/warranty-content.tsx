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
  title: "ضمان أجهزة العناية بالشعر",
  duration: "12 شهر",
  phone: "+964 750 493 0644",
  location: "مركز صيانة أربيل - شارع 100",
  terms: "يشمل عيوب التصنيع ولا يشمل الكسر أو سوء الاستخدام أو السوائل.",
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
    <section className="warranty-form-card" aria-label="نموذج الضمان">
      <div className="warranty-form-header">
        <h2>بيانات الضمان</h2>
        <button className="warranty-cancel-outline" type="button" onClick={onCancel}>
          <X aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>إلغاء</span>
        </button>
      </div>
      {submitted && hasError ? (
        <div className="warning-banner">مدة الضمان، الهاتف، وموقع مركز الصيانة حقول مطلوبة.</div>
      ) : null}
      <div className="warranty-main-grid">
        <label className="warranty-field">
          <span>عنوان الضمان</span>
          <div className="warranty-field-box">
            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>مدة الضمان</span>
          <div className="warranty-field-box">
            <input
              value={draft.duration}
              onChange={(event) => setDraft({ ...draft, duration: event.target.value })}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>رقم الصيانة</span>
          <div className="warranty-field-box">
            <input
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
            />
          </div>
        </label>
        <label className="warranty-field">
          <span>موقع مركز الصيانة</span>
          <div className="warranty-field-box">
            <input
              value={draft.location}
              onChange={(event) => setDraft({ ...draft, location: event.target.value })}
            />
          </div>
        </label>
      </div>
      <label className="warranty-field">
        <span>الشروط والأحكام</span>
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
        <strong>{draft.active ? "ضمان نشط" : "ضمان غير نشط"}</strong>
      </button>
      <div className="warranty-actions">
        <button className="warranty-cancel-button" type="button" onClick={onCancel}>
          إلغاء
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
          <span>حفظ الضمان</span>
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
                    {warranty.active ? "نشط" : "غير نشط"}
                  </span>
                </div>
              </div>
              <div className="warranty-detail-grid">
                <article>
                  <span>مدة الضمان</span>
                  <strong>{warranty.duration}</strong>
                </article>
                <article>
                  <span>رقم الصيانة</span>
                  <strong>{warranty.phone}</strong>
                </article>
                <article>
                  <span>مركز الصيانة</span>
                  <strong>{warranty.location}</strong>
                </article>
              </div>
              <div className="warranty-terms-box">
                <strong>الشروط</strong>
                <p>{warranty.terms}</p>
                <div className="discount-chip-row">
                  <span className="discount-chip">عيوب التصنيع</span>
                  <span className="discount-chip">صيانة معتمدة</span>
                  <span className="discount-chip">يظهر للعميل</span>
                </div>
              </div>
              <div className="row-actions warranty-card-actions">
                <button className="row-action-btn" type="button" onClick={() => setPreview(true)}>
                  <Eye aria-hidden="true" size={14} strokeWidth={2.4} />
                  عرض
                </button>
                <button className="row-action-btn" type="button" onClick={() => setEditing(true)}>
                  <Pencil aria-hidden="true" size={14} strokeWidth={2.4} />
                  تعديل
                </button>
                <button className="row-action-btn reject-btn" type="button" onClick={() => setWarranty(null)}>
                  <Trash2 aria-hidden="true" size={14} strokeWidth={2.4} />
                  حذف
                </button>
              </div>
            </>
          ) : (
            <div className="warranty-empty-state">
              <h2>لا توجد بيانات ضمان</h2>
              <p>أضف مدة الضمان ورقم الصيانة وموقع المركز ليظهر للعميل.</p>
            </div>
          )}
        </section>
      )}

      {preview && warranty ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <header className="modal-header">
              <div>
                <h3>معاينة ما يظهر للعميل</h3>
                <p className="modal-sub">{warranty.title}</p>
              </div>
              <button className="modal-close" type="button" onClick={() => setPreview(false)}>
                ×
              </button>
            </header>
            <div className="modal-body">
              <p>مدة الضمان: {warranty.duration}</p>
              <p>اتصل بالصيانة: {warranty.phone}</p>
              <p>المركز: {warranty.location}</p>
              <p>{warranty.terms}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
