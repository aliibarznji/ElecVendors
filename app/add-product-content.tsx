"use client";

import {
  Bold,
  Calculator,
  ChevronDown,
  Code2,
  Copy,
  ExternalLink,
  Gift,
  Info,
  Italic,
  List,
  ListOrdered,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Search,
  Strikethrough,
  Tag,
  Underline,
  UploadCloud,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

function TextField({
  label,
  placeholder,
  value,
  disabled = false,
  icon,
}: {
  label: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  return (
    <label className="product-form-field">
      <span>{label}</span>
      <div className={`product-input-box${disabled ? " is-disabled" : ""}`}>
        <input disabled={disabled} placeholder={placeholder} defaultValue={value} />
        {icon ? <span className="product-field-icon">{icon}</span> : null}
      </div>
    </label>
  );
}

function SelectField({
  label,
  placeholder = "",
  withAdd = false,
}: {
  label: string;
  placeholder?: string;
  withAdd?: boolean;
}) {
  return (
    <div className="product-form-field">
      <span>{label}</span>
      <div className="product-inline-control">
        <div className="product-input-box">
          <input readOnly placeholder={placeholder} />
          <ChevronDown aria-hidden="true" size={18} strokeWidth={2.1} />
        </div>
        {withAdd ? (
          <button className="square-add-button" type="button" aria-label={`Add ${label}`}>
            <Plus aria-hidden="true" size={16} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MoneyField({
  label,
  placeholder,
  icon,
  error,
}: {
  label: string;
  placeholder: string;
  icon: ReactNode;
  error?: string;
}) {
  return (
    <label className="money-field">
      <span>{label}</span>
      <div className="money-input">
        <span>IQD</span>
        <input placeholder={placeholder} />
        {icon}
      </div>
      {error ? <em>{error}</em> : null}
    </label>
  );
}

function ProductEditor() {
  const editorIcons = [
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code2,
    ListOrdered,
    List,
  ];

  return (
    <section className="product-section product-description-section">
      <h2>Product Description</h2>
      <div className="product-editor">
        <div className="editor-toolbar" aria-label="Product description toolbar">
          {editorIcons.map((Icon, index) => (
            <button key={index} type="button" aria-label={`Format option ${index + 1}`}>
              <Icon aria-hidden="true" size={16} strokeWidth={2.4} />
            </button>
          ))}
          <button className="editor-style-button" type="button">
            Normal
            <ChevronDown aria-hidden="true" size={14} strokeWidth={2.1} />
          </button>
        </div>
        <textarea placeholder="Enter product description" />
      </div>
    </section>
  );
}

function ProductRegistrationForm() {
  return (
    <div className="product-registration">
      <div className="product-form-topbar">
        <nav className="product-navigation" aria-label="Product navigation">
          {["Product Details", "Pricing and Stock", "Warranty", "Delivery"].map(
            (item) => (
              <button key={item} type="button">
                {item}
                <Info aria-hidden="true" size={14} strokeWidth={2.5} />
              </button>
            ),
          )}
          <button className="is-active" type="button">
            Product Logs
          </button>
        </nav>

        <div className="product-save-actions">
          <button className="new-status-button" type="button">
            New
          </button>
          <button className="link-action-button" type="button">
            <Save aria-hidden="true" size={15} strokeWidth={2.2} />
            Save
          </button>
          <button className="duplicate-action-button" type="button">
            <Copy aria-hidden="true" size={15} strokeWidth={2.2} />
            Save and Duplicate
          </button>
        </div>
      </div>

      <section className="product-section">
        <h2>Product Details</h2>
        <div className="product-details-grid">
          <div className="product-field-stack">
            <SelectField label="Product Category" placeholder="Select" withAdd />
            <SelectField label="Brand" withAdd />
            <TextField label="SKU:" placeholder="Write the SKU or model number here" />
            <TextField label="Barcode:" placeholder="Write the barcode here" />
            <TextField
              label="Minimum Quantity Allowed in Shopping Cart"
              value="1"
              icon={<Info aria-hidden="true" size={20} strokeWidth={2.4} />}
            />
          </div>

          <div className="product-field-stack">
            <TextField
              disabled
              label="Product Name"
              value="This will be auto generated"
            />
            <TextField
              label="Product Title (English)"
              placeholder="Write a short description of the product in English"
            />
            <TextField
              label="Product Title (Arabic)"
              placeholder="Write a short description of the product in Arabic"
            />
            <SelectField label="Color" withAdd />
            <div className="product-form-field">
              <span>Packaging Dimensions</span>
              <div className="dimension-grid">
                <input placeholder="Width (cm)" />
                <input placeholder="Depth (cm)" />
                <input placeholder="Height (cm)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductEditor />

      <section className="product-section gift-product-section">
        <div className="section-copy">
          <h2>Gift Product</h2>
          <p>Assign a free gift product to be included with this item</p>
        </div>
        <div className="gift-search">
          <input placeholder="Search Gift Product by SKU or Name" />
          <Search aria-hidden="true" size={22} strokeWidth={2.2} />
        </div>
        <div className="gift-empty-state">
          <Gift aria-hidden="true" size={48} strokeWidth={2} />
          <span>No gift products assigned yet</span>
        </div>
      </section>

      <section className="product-section product-images-section">
        <div className="section-copy">
          <h2>Product Images</h2>
          <p>Drag images to reorder. First image is the main product image</p>
        </div>
        <div className="image-dropzone">
          <UploadCloud aria-hidden="true" size={48} strokeWidth={2.2} />
          <strong>Drop images here or click to browse</strong>
          <span>Up to 10 images - Max 5MB each - JPEG or PNG</span>
        </div>
        <div className="image-guidelines">
          <Info aria-hidden="true" size={22} strokeWidth={2.4} />
          <p>
            Please note that at least one image must be on a white background,
            and individual images should not exceed 500kb. For our full
            guidelines on images, please visit the following link:
            <a href="#"> Image Guidelines PDF</a>
          </p>
          <ExternalLink aria-hidden="true" size={17} strokeWidth={2.2} />
        </div>
      </section>

      <section className="product-section pricing-section">
        <h2>Pricing and Stock</h2>
        <div className="stock-grid">
          <SelectField label="Stock Status" />
          <TextField label="Quantity Available" />
        </div>

        <div className="pricing-grid">
          <div className="price-column">
            <div className="currency-row">
              <span>Currency</span>
              <label>
                <input type="radio" defaultChecked name="currency" />
                Iraqi Dinar
              </label>
              <label>
                <input type="radio" name="currency" />
                US Dollar
              </label>
            </div>

            <h3>Price in IQD</h3>
            <div className="price-panel">
              <MoneyField
                label="Your selling price"
                placeholder="Your price to the customer"
                icon={<Tag aria-hidden="true" size={22} strokeWidth={2.3} />}
                error="Price is required."
              />
              <p>You will receive payment in Iraqi Dinars.</p>
              <div className="prices-linked">
                <Lock aria-hidden="true" size={20} strokeWidth={2.3} />
                <strong>Prices are linked</strong>
              </div>
              <MoneyField
                label="Your cost price"
                placeholder="Your net price from selling this product"
                icon={<Tag aria-hidden="true" size={22} strokeWidth={2.3} />}
                error="Cost price is required."
              />
              <p>You will receive payment in Iraqi Dinars.</p>
            </div>

            <div className="tier-pricing">
              <h3>
                Tier Pricing <span>(Optional - Set different prices for bulk quantities)</span>
              </h3>
              <div>
                <button type="button">
                  <Plus aria-hidden="true" size={20} strokeWidth={2.4} />
                  Add Tier
                </button>
                <span>Maximum 4 tiers allowed</span>
              </div>
            </div>
          </div>

          <div className="price-column">
            <div className="section-copy">
              <h3>Promotional Price</h3>
              <p>
                Items with special or promotional prices are listed in our
                special offers section and generally attract a higher level of
                demand
              </p>
            </div>
            <MoneyField
              label=""
              placeholder="Promotional Price"
              icon={<Tag aria-hidden="true" size={21} strokeWidth={2.3} />}
            />
            <MoneyField
              label="Promotional Cost Price"
              placeholder="Amount you want to receive"
              icon={<Calculator aria-hidden="true" size={21} strokeWidth={2.3} />}
            />
          </div>
        </div>
      </section>

      <section className="product-section warranty-picker-section">
        <h2>Warranty Details</h2>
        <h3>Select Warranty</h3>
        <div className="warranty-option-row">
          <SelectField label="Warranty Option *:" />
          <button className="small-outline-button is-green" type="button">
            <Plus aria-hidden="true" size={18} strokeWidth={2.5} />
          </button>
          <button className="small-outline-button" type="button">
            <RefreshCw aria-hidden="true" size={17} strokeWidth={2.4} />
          </button>
        </div>
      </section>

      <section className="product-section delivery-section">
        <h2>Delivery Details</h2>
        <div className="delivery-copy">
          <h3>Ready for pick-up within</h3>
          <p>
            The amount of time required to prepare the item for collection if
            ordered. If the items are available for immediate pick-up, please
            enter 0.
          </p>
        </div>
        <div className="days-input">
          <input defaultValue="0" />
          <span>days</span>
        </div>
        <em>Pick Up Time is required.</em>
      </section>

      <section className="product-section product-logs-section">
        <h2>Product Logs</h2>
        <p>Below is a list of all product log actions.</p>
        <div className="product-log-table-wrap">
          <table className="product-log-table">
            <thead>
              <tr>
                <th>Created Time</th>
                <th>User</th>
                <th>Action Type</th>
                <th>Details</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="log-pagination">
          <span>Items per page:</span>
          <button type="button">
            20
            <ChevronDown aria-hidden="true" size={16} strokeWidth={2.1} />
          </button>
          <span>0 of 0</span>
          <button type="button" aria-label="Previous page" disabled>
            &lt;
          </button>
          <button type="button" aria-label="Next page" disabled>
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
}

function ProductSearchStart({
  onRegisterNewProduct,
}: {
  onRegisterNewProduct: () => void;
}) {
  return (
    <section className="add-product-card" aria-label="Add product">
      <p>
        Simply select an existing product from our store to start selling, or,
        if the product does not exist, register the product.
      </p>

      <div className="product-search-area">
        <label className="product-search-field">
          <span>Search for an existing product</span>
          <input
            type="search"
            placeholder="Enter product name or description"
            aria-label="Search for an existing product"
          />
        </label>

        <div className="product-action-row">
          <button className="seller-register-button" type="button">
            Product found, let me register as a seller for this item
          </button>
          <button
            className="new-product-button"
            type="button"
            onClick={onRegisterNewProduct}
          >
            Product not found? Click here to register a new product
          </button>
        </div>
      </div>
    </section>
  );
}

export function AddProductContent() {
  const [isRegisteringNewProduct, setIsRegisteringNewProduct] = useState(false);

  return (
    <div className="add-product-content">
      <h1>Add Product</h1>

      {isRegisteringNewProduct ? (
        <>
          <p className="add-product-intro">
            Simply select an existing product from our store to start selling, or,
            if the product does not exist, register the product.
          </p>
          <ProductRegistrationForm />
        </>
      ) : (
        <ProductSearchStart
          onRegisterNewProduct={() => setIsRegisteringNewProduct(true)}
        />
      )}
    </div>
  );
}
