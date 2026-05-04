import { ChevronDown, Info, Tag } from "lucide-react";

const shipmentSteps = [
  "Primary Information",
  "Pickup Details",
  "Delivery Details",
  "Review & Confirm",
];

function FieldInfo({ label }: { label: string }) {
  return (
    <Info
      aria-label={`${label} information`}
      className="create-shipment-info-icon"
      size={13}
      strokeWidth={2}
    />
  );
}

export function CreateShipmentContent() {
  return (
    <div className="create-shipment-content">
      <h1>Create Shipment</h1>

      <section className="create-shipment-panel" aria-label="Create shipment">
        <div className="create-shipment-card">
          <div className="create-shipment-tabs" role="tablist" aria-label="Shipment steps">
            {shipmentSteps.map((step, index) => (
              <button
                aria-selected={index === 0}
                className={`create-shipment-tab${index === 0 ? " is-active" : ""}`}
                key={step}
                role="tab"
                type="button"
              >
                {step}
              </button>
            ))}
          </div>

          <form className="create-shipment-form">
            <div className="create-shipment-row create-shipment-row-top">
              <fieldset className="create-shipment-radio-group">
                <legend>Service</legend>
                <label>
                  <input defaultChecked name="service" type="radio" value="standard" />
                  <span>Standard</span>
                </label>
                <label>
                  <input name="service" type="radio" value="express" />
                  <span>Express (point to point)</span>
                </label>
              </fieldset>

              <fieldset className="create-shipment-radio-group">
                <legend>Currency</legend>
                <label>
                  <input defaultChecked name="currency" type="radio" value="iqd" />
                  <span>Iraqi Dinar</span>
                </label>
                <label>
                  <input name="currency" type="radio" value="usd" />
                  <span>US Dollar</span>
                </label>
              </fieldset>
            </div>

            <div className="create-shipment-grid">
              <label className="create-shipment-field">
                <span className="create-shipment-label">
                  Reference No.
                  <FieldInfo label="Reference number" />
                </span>
                <input aria-label="Reference number" />
              </label>

              <label className="create-shipment-field">
                <span className="create-shipment-label">
                  Item Value
                  <FieldInfo label="Item value" />
                </span>
                <span className="create-shipment-input-icon">
                  <input aria-label="Item value" placeholder="IQD" />
                  <Tag aria-hidden="true" size={17} strokeWidth={2.4} />
                </span>
              </label>

              <label className="create-shipment-field">
                <span className="create-shipment-label">
                  Item Description
                  <FieldInfo label="Item description" />
                </span>
                <input aria-label="Item description" />
              </label>

              <label className="create-shipment-field">
                <span className="create-shipment-label">
                  Amount to collect (if any)
                  <FieldInfo label="Amount to collect" />
                </span>
                <span className="create-shipment-input-icon">
                  <input aria-label="Amount to collect" placeholder="IQD" />
                  <Tag aria-hidden="true" size={17} strokeWidth={2.4} />
                </span>
              </label>

              <label className="create-shipment-field create-shipment-size-field">
                <span className="create-shipment-label">
                  Item Size
                  <FieldInfo label="Item size" />
                </span>
                <span className="create-shipment-select-wrap">
                  <select aria-label="Item size" defaultValue="">
                    <option value="" />
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                  <ChevronDown aria-hidden="true" size={15} strokeWidth={2.4} />
                </span>
              </label>

              <div className="create-shipment-fees">
                <span className="create-shipment-label">
                  Fees
                  <FieldInfo label="Fees" />
                </span>
                <span>0.00 USD</span>
              </div>
            </div>

            <div className="create-shipment-actions">
              <button className="create-shipment-button create-shipment-button-secondary" type="button">
                Previous
              </button>
              <button className="create-shipment-button create-shipment-button-primary" type="button">
                Next
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
