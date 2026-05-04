"use client";

import {
  Barcode,
  ChevronDown,
  ImagePlus,
  Plus,
  Save,
  Tag,
  ToggleRight,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SizeRow = {
  id: string;
  size: string;
  quantity: number;
};

type ColorRow = {
  id: string;
  code: string;
  name: string;
  sizes: SizeRow[];
};

const categories = [
  ["Beauty", "Hair Care", "Hair Devices", "Curling Irons"],
  ["Electronics", "Audio", "Headphones", "Wireless"],
  ["Electronics", "Personal Care", "Shaving", "Trimmers"],
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="product-form-field">
      <span>{label}</span>
      <div className={`product-input-box${error ? " has-error" : ""}`}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {error ? <em className="form-error">{error}</em> : null}
    </label>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="product-form-field">
      <span>{label}</span>
      <div className="product-input-box">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" size={18} strokeWidth={2.1} />
      </div>
    </label>
  );
}

export function AddProductContent() {
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [highlights, setHighlights] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [materialCode, setMaterialCode] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [largeProduct, setLargeProduct] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [brand, setBrand] = useState("");
  const [barcode, setBarcode] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [colors, setColors] = useState<ColorRow[]>([
    {
      id: "color-1",
      code: "#c7ccd4",
      name: "Silver",
      sizes: [{ id: "size-1", size: "Standard", quantity: 1 }],
    },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 5000);
    return () => clearTimeout(t);
  }, [saved]);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!nameAr.trim()) next.nameAr = "Arabic Product Name is required.";
    if (!nameEn.trim()) next.nameEn = "English Product Name is required.";
    if (!materialCode.trim()) next.materialCode = "Product or Material Code is required.";
    if (!brand.trim()) next.brand = "Brand is required.";
    if (!barcode.trim()) next.barcode = "Barcode is required.";
    if (!vendorCode.trim()) next.vendorCode = "Vendor Product Code is required.";
    const selling = Number(sellingPrice);
    const cost = Number(costPrice);
    if (!selling || selling <= 0) next.sellingPrice = "Selling Price is required.";
    if (!cost || cost <= 0) next.costPrice = "Cost Price is required.";
    if (selling && cost && selling < cost) {
      next.sellingPrice = "Selling Price must be higher than the Cost Price.";
    }
    if (colors.some((color) => !color.code || !color.name)) {
      next.colors = "Every color needs a color code and a color name.";
    }
    if (colors.some((color) => color.sizes.some((size) => !size.size || size.quantity < 0))) {
      next.sizes = "Every size row needs a size name and a valid quantity.";
    }
    return next;
  }, [
    barcode,
    brand,
    colors,
    costPrice,
    materialCode,
    nameAr,
    nameEn,
    sellingPrice,
    vendorCode,
  ]);

  const updateColor = (id: string, patch: Partial<ColorRow>) => {
    setColors((current) =>
      current.map((color) => (color.id === id ? { ...color, ...patch } : color)),
    );
  };

  const updateSize = (colorId: string, sizeId: string, patch: Partial<SizeRow>) => {
    setColors((current) =>
      current.map((color) =>
        color.id === colorId
          ? {
              ...color,
              sizes: color.sizes.map((size) =>
                size.id === sizeId ? { ...size, ...patch } : size,
              ),
            }
          : color,
      ),
    );
  };

  return (
    <div className="add-product-content">
      <header className="page-title-row">
        <div>
          <h1>Add / Edit Product</h1>
          <p className="dashboard-sub">
            A single form covering product data, pricing, categories, images, colors, and sizes.
          </p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={() => {
            setSubmitted(true);
            if (Object.keys(errors).length === 0) {
              setNameAr("");
              setNameEn("");
              setHighlights("");
              setDescription("");
              setKeywords("");
              setMaterialCode("");
              setSellingPrice("");
              setCostPrice("");
              setBrand("");
              setBarcode("");
              setVendorCode("");
              setColors([{ id: "color-1", code: "#c7ccd4", name: "Silver", sizes: [{ id: "size-1", size: "Standard", quantity: 1 }] }]);
              setLargeProduct(false);
              setSubmitted(false);
              setSaved(true);
            }
          }}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>Save Product</span>
        </button>
      </header>

      {saved ? (
        <div className="success-banner">
          Product submitted for review. The data team will publish it after verification.
        </div>
      ) : null}

      {submitted && Object.keys(errors).length > 0 ? (
        <div className="warning-banner">
          Please complete required fields and fix errors before saving the product.
        </div>
      ) : null}

      <section className="product-section">
        <h2>Basic Information</h2>
        <div className="product-details-grid">
          <div className="product-field-stack">
            <Field
              label="Product Name in Arabic"
              value={nameAr}
              onChange={setNameAr}
              placeholder="Example: Hair Curling Iron"
              error={submitted ? errors.nameAr : undefined}
            />
            <Field
              label="Product Name in English"
              value={nameEn}
              onChange={setNameEn}
              placeholder="Product English name"
              error={submitted ? errors.nameEn : undefined}
            />
            <Field
              label="Highlights"
              value={highlights}
              onChange={setHighlights}
              placeholder="Fast heating, 1-year warranty, Silver color"
            />
            <Field
              label="Keywords"
              value={keywords}
              onChange={setKeywords}
              placeholder="sheglam, beauty, hair iron"
            />
          </div>
          <div className="product-field-stack">
            <Field
              label="Product / Material Code"
              value={materialCode}
              onChange={setMaterialCode}
              placeholder="MAT-SG-CURL-400"
              error={submitted ? errors.materialCode : undefined}
            />
            <Field
              label="Brand"
              value={brand}
              onChange={setBrand}
              placeholder="Sheglam"
              error={submitted ? errors.brand : undefined}
            />
            <Field
              label="Barcode"
              value={barcode}
              onChange={setBarcode}
              placeholder="8901234567891"
              error={submitted ? errors.barcode : undefined}
            />
            <Field
              label="Vendor Product Code"
              value={vendorCode}
              onChange={setVendorCode}
              placeholder="SG-CRL-400-SL"
              error={submitted ? errors.vendorCode : undefined}
            />
          </div>
        </div>
        <label className="product-form-field">
          <span>Description</span>
          <textarea
            className="product-textarea"
            value={description}
            placeholder="Write the product description and important usage terms."
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </section>

      <section className="product-section">
        <h2>Classification and Pricing</h2>
        <div className="product-details-grid">
          <div className="product-field-stack">
            {[0, 1, 2, 3].map((level) => (
              <SelectBox
                key={level}
                label={`Category Level ${level + 1}`}
                value={category[level]}
                onChange={(value) =>
                  setCategory((current) =>
                    current.map((item, index) => (index === level ? value : item)),
                  )
                }
                options={[...new Set(categories.map((item) => item[level]))]}
              />
            ))}
          </div>
          <div className="product-field-stack">
            <Field
              label="Selling Price IQD"
              type="number"
              value={sellingPrice}
              onChange={setSellingPrice}
              placeholder="49000"
              error={submitted ? errors.sellingPrice : undefined}
            />
            <Field
              label="Cost Price IQD"
              type="number"
              value={costPrice}
              onChange={setCostPrice}
              placeholder="45085"
              error={submitted ? errors.costPrice : undefined}
            />
            <button
              className="modal-toggle product-large-toggle"
              type="button"
              aria-pressed={largeProduct}
              onClick={() => setLargeProduct((value) => !value)}
            >
              <span className={`toggle-switch${largeProduct ? " is-enabled" : ""}`} />
              <ToggleRight aria-hidden="true" size={18} strokeWidth={2.3} />
              <strong>{largeProduct ? "Large Product" : "Small/Regular Product"}</strong>
            </button>
          </div>
        </div>
      </section>

      <section className="product-section product-images-section">
        <div className="section-copy">
          <h2>Product Images</h2>
          <p>The first image is the main image. It is preferable to upload clear images with a white background.</p>
        </div>
        <div className="image-dropzone">
          <UploadCloud aria-hidden="true" size={48} strokeWidth={2.2} />
          <strong>Drag images here or click to upload</strong>
          <span>PNG or JPG - up to 10 images</span>
        </div>
      </section>

      <section className="product-section">
        <div className="section-copy">
          <h2>Colors, Sizes, and Quantities</h2>
          <p>More than one color can be added, and each color contains size and quantity rows.</p>
        </div>
        {submitted && (errors.colors || errors.sizes) ? (
          <em className="form-error">{errors.colors || errors.sizes}</em>
        ) : null}
        <div className="color-variant-stack">
          {colors.map((color) => (
            <article className="color-variant-card" key={color.id}>
              <div className="color-variant-header">
                <label>
                  <span>Color Code</span>
                  <input
                    type="color"
                    value={color.code}
                    onChange={(event) => updateColor(color.id, { code: event.target.value })}
                  />
                </label>
                <label>
                  <span>Color Name</span>
                  <input
                    value={color.name}
                    onChange={(event) => updateColor(color.id, { name: event.target.value })}
                  />
                </label>
                <button
                  className="row-action-btn reject-btn"
                  type="button"
                  aria-label="Delete Color"
                  onClick={() =>
                    setColors((current) => current.filter((item) => item.id !== color.id))
                  }
                >
                  <Trash2 aria-hidden="true" size={14} strokeWidth={2.4} />
                </button>
              </div>
              <div className="size-row-grid">
                {color.sizes.map((size) => (
                  <div className="size-row" key={size.id}>
                    <label>
                      <span>Size</span>
                      <input
                        value={size.size}
                        onChange={(event) =>
                          updateSize(color.id, size.id, { size: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      <span>Quantity</span>
                      <input
                        type="number"
                        value={size.quantity}
                        onChange={(event) =>
                          updateSize(color.id, size.id, {
                            quantity: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
              <button
                className="small-outline-button"
                type="button"
                onClick={() =>
                  updateColor(color.id, {
                    sizes: [
                      ...color.sizes,
                      { id: `size-${Date.now()}`, size: "", quantity: 0 },
                    ],
                  })
                }
              >
                <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
                Add Size
              </button>
            </article>
          ))}
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={() =>
            setColors((current) => [
              ...current,
              {
                id: `color-${Date.now()}`,
                code: "#000000",
                name: "",
                sizes: [{ id: `size-${Date.now()}`, size: "", quantity: 0 }],
              },
            ])
          }
        >
          <ImagePlus aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>Add Color</span>
        </button>
      </section>

      <section className="product-section">
        <h2>Review before Saving</h2>
        <div className="review-grid">
          <span><Tag aria-hidden="true" size={15} /> {nameAr || "Product Name"}</span>
          <span><Barcode aria-hidden="true" size={15} /> {barcode || "Barcode"}</span>
          <span>{category.filter(Boolean).join(" / ")}</span>
          <span>{colors.length} Colors / {colors.reduce((sum, color) => sum + color.sizes.length, 0)} Sizes</span>
        </div>
      </section>
    </div>
  );
}
