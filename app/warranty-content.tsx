"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUp,
  Building2,
  CalendarRange,
  Clock,
  ClipboardCheck,
  Link as LinkIcon,
  MapPin,
  Phone,
  Plus,
  Save,
  Tag,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const warrantyMapSrc =
  "https://www.google.com/maps?q=Saint%20Raphael%20Hospital%20Baghdad&output=embed";

function WarrantyField({
  label,
  placeholder,
  icon: Icon,
  as = "input",
}: {
  label: string;
  placeholder: string;
  icon: LucideIcon;
  as?: "input" | "textarea";
}) {
  return (
    <label className="warranty-field">
      <span>{label}</span>
      <div className={`warranty-field-box${as === "textarea" ? " is-textarea" : ""}`}>
        {as === "textarea" ? (
          <textarea placeholder={placeholder} />
        ) : (
          <input placeholder={placeholder} />
        )}
        <Icon aria-hidden="true" size={21} strokeWidth={2.1} />
      </div>
    </label>
  );
}

function WarrantyForm({ onCancel }: { onCancel: () => void }) {
  return (
    <section className="warranty-form-card" aria-label="Add new warranty">
      <div className="warranty-form-header">
        <h2>Add New Warranty</h2>
        <button className="warranty-cancel-outline" type="button" onClick={onCancel}>
          <X aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>Cancel</span>
        </button>
      </div>

      <div className="warranty-provided-box">
        <div>
          <strong>Warranty Provided</strong>
          <span>Full warranty details will be required</span>
        </div>
        <span className="toggle-switch is-enabled" aria-hidden="true" />
      </div>

      <div className="warranty-language-panel">
        <div className="warranty-tabs" role="tablist" aria-label="Warranty language">
          <button className="is-active" type="button" role="tab" aria-selected="true">
            English
          </button>
          <button type="button" role="tab" aria-selected="false">
            العربية
          </button>
        </div>

        <div className="warranty-language-grid">
          <div className="warranty-field-stack">
            <WarrantyField
              icon={User}
              label="Warranty Provider (English):"
              placeholder="Enter warranty provider in English"
            />
            <WarrantyField
              icon={LinkIcon}
              label="Warranty Details URL (English):"
              placeholder="Enter warranty details URL in English"
            />
          </div>
          <WarrantyField
            as="textarea"
            icon={Tag}
            label="Description (English):"
            placeholder="Enter the warranty description in English"
          />
        </div>
      </div>

      <div className="warranty-main-grid">
        <WarrantyField
          icon={Tag}
          label="Warranty Name:"
          placeholder="Enter warranty name"
        />
        <WarrantyField
          icon={ClipboardCheck}
          label="Return Policy:"
          placeholder="Select return policy"
        />
        <WarrantyField
          icon={Clock}
          label="Warranty Period:"
          placeholder="Enter warranty period"
        />
        <div />
        <WarrantyField
          icon={CalendarRange}
          label="Warranty Period Type:"
          placeholder="Months"
        />
      </div>

      <div className="warranty-locations-header">
        <h3>Locations</h3>
        <button className="add-location-button" type="button">
          <MapPin aria-hidden="true" size={16} strokeWidth={2.5} />
          <span>Add Location</span>
        </button>
      </div>

      <section className="warranty-location-card" aria-label="Location 1">
        <h4>Location 1</h4>
        <div className="location-grid">
          <div className="location-left">
            <WarrantyField icon={MapPin} label="" placeholder="Address" />
            <WarrantyField icon={Building2} label="" placeholder="City" />
          </div>
          <div className="location-right">
            <WarrantyField icon={Phone} label="" placeholder="Telephone" />
            <div className="location-coordinate-grid">
              <WarrantyField icon={ArrowUp} label="" placeholder="Latitude" />
              <WarrantyField icon={ArrowRight} label="" placeholder="Longitude" />
            </div>
            <div className="warranty-map-frame">
              <iframe
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={warrantyMapSrc}
                title="Warranty location map"
              />
            </div>
            <p className="map-helper">Click on map or drag marker to set location</p>
            <div className="current-location-row">
              <button className="current-location-button" type="button">
                <MapPin aria-hidden="true" size={15} strokeWidth={2.4} />
                <span>Use Current Location</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="warranty-actions">
        <button className="warranty-cancel-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="save-warranty-button" type="button">
          <Save aria-hidden="true" size={18} strokeWidth={2.4} />
          <span>Save Warranty</span>
        </button>
      </div>
    </section>
  );
}

export function WarrantyContent() {
  const [isAddingWarranty, setIsAddingWarranty] = useState(false);

  return (
    <div className="warranty-content">
      <h1>Warranty Details</h1>

      {isAddingWarranty ? (
        <WarrantyForm onCancel={() => setIsAddingWarranty(false)} />
      ) : (
        <section className="warranty-card" aria-label="Warranty details">
          <button
            className="add-warranty-button"
            type="button"
            onClick={() => setIsAddingWarranty(true)}
          >
            <Plus aria-hidden="true" size={18} strokeWidth={2.4} />
            <span>Add New Warranty</span>
          </button>

          <div className="warranty-empty-state">
            <h2>No warranties found</h2>
            <p>Add your first warranty to get started</p>
          </div>
        </section>
      )}
    </div>
  );
}
