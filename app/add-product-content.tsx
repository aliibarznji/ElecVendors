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
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import type { ApiProduct } from "./lib/utils";

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

export function AddProductContent({ editId }: { editId?: string }) {
  const { t } = useLang();
  const [ep, setEp] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(!!editId);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [highlights, setHighlights] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [materialCode, setMaterialCode] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [largeProduct, setLargeProduct] = useState(false);
  const [category, setCategory] = useState<string[]>(categories[0]);
  const [brand, setBrand] = useState("");
  const [barcode, setBarcode] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [colors, setColors] = useState<ColorRow[]>([
    { id: "color-1", code: "#c7ccd4", name: "Silver", sizes: [{ id: "size-1", size: "Standard", quantity: 1 }] },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    api.products
      .get(editId)
      .then((p) => {
        setEp(p);
        setNameAr(p.nameAr);
        setNameEn(p.nameEn);
        setHighlights(p.highlights);
        setDescription(p.description);
        setKeywords(p.keywords.join(", "));
        setMaterialCode(p.materialCode);
        setSellingPrice(String(p.sellingPrice));
        setCostPrice(String(p.costPrice));
        setLargeProduct(p.largeProduct);
        setCategory([p.categoryLevel1, p.categoryLevel2, p.categoryLevel3, p.categoryLevel4]);
        setBrand(p.brand);
        setBarcode(p.barcode);
        setVendorCode(p.vendorCode);
        setColors(
          p.colors.map((c, ci) => ({
            id: `color-${ci}`,
            code: c.code,
            name: c.nameEn,
            sizes: c.sizes.map((s, si) => ({ id: `size-${ci}-${si}`, size: s.size, quantity: s.quantity })),
          })),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [editId]);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 5000);
    return () => clearTimeout(timer);
  }, [saved]);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!nameAr.trim()) next.nameAr = t("errNameAr");
    if (!nameEn.trim()) next.nameEn = t("errNameEn");
    if (!materialCode.trim()) next.materialCode = t("errMaterialCode");
    if (!brand.trim()) next.brand = t("errBrand");
    if (!barcode.trim()) next.barcode = t("errBarcode");
    if (!vendorCode.trim()) next.vendorCode = t("errVendorCode");
    const selling = Number(sellingPrice);
    const cost = Number(costPrice);
    if (!selling || selling <= 0) next.sellingPrice = t("errSellingPrice");
    if (!cost || cost <= 0) next.costPrice = t("errCostPrice");
    if (selling && cost && selling < cost) {
      next.sellingPrice = t("errPriceOrder");
    }
    if (colors.some((color) => !color.code || !color.name)) {
      next.colors = t("errColors");
    }
    if (colors.some((color) => color.sizes.some((size) => !size.size || size.quantity < 0))) {
      next.sizes = t("errSizes");
    }
    return next;
  }, [barcode, brand, colors, costPrice, materialCode, nameAr, nameEn, sellingPrice, vendorCode, t]);

  if (loading) return <div className="dashboard-stage-loading">{t("loading")}</div>;

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
          <h1>{ep ? `${t("editProductTitle")}: ${ep.nameEn}` : t("addProductTitle")}</h1>
          <p className="dashboard-sub">
            {ep ? t("editProductSub") : t("addProductSub")}
          </p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={async () => {
            setSubmitted(true);
            setSaveError("");
            if (Object.keys(errors).length === 0) {
              const payload = {
                nameAr,
                nameEn,
                highlights,
                description,
                keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
                materialCode,
                sku: vendorCode,
                barcode,
                vendorCode,
                brand,
                categoryLevel1: category[0] ?? "",
                categoryLevel2: category[1] ?? "",
                categoryLevel3: category[2] ?? "",
                categoryLevel4: category[3] ?? "",
                sellingPrice: Number(sellingPrice),
                costPrice: Number(costPrice),
                commissionPct: 0,
                largeProduct,
                imageTone: "",
                colors: colors.map((c) => ({
                  code: c.code,
                  nameAr: c.name,
                  nameEn: c.name,
                  sizes: c.sizes.map((s) => ({ size: s.size, quantity: s.quantity })),
                })),
              };
              try {
                if (editId && ep) {
                  await api.products.update(ep.id, payload);
                } else {
                  await api.products.create(payload);
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
                }
                setSaved(true);
              } catch (err) {
                setSaveError(err instanceof Error ? err.message : "Failed to save");
              }
            }
          }}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>{ep ? t("updateProduct") : t("saveProduct")}</span>
        </button>
      </header>

      {saved ? (
        <div className="success-banner">
          {ep ? t("productUpdated") : t("productSaved")}
        </div>
      ) : null}

      {submitted && Object.keys(errors).length > 0 ? (
        <div className="warning-banner">{t("formErrors")}</div>
      ) : null}

      {saveError ? (
        <div className="warning-banner">{saveError}</div>
      ) : null}

      <section className="product-section">
        <h2>{t("basicInfo")}</h2>
        <div className="product-details-grid">
          <div className="product-field-stack">
            <Field
              label={t("productNameAr")}
              value={nameAr}
              onChange={setNameAr}
              placeholder="Example: Hair Curling Iron"
              error={submitted ? errors.nameAr : undefined}
            />
            <Field
              label={t("productNameEn")}
              value={nameEn}
              onChange={setNameEn}
              placeholder="Product English name"
              error={submitted ? errors.nameEn : undefined}
            />
            <Field
              label={t("highlights")}
              value={highlights}
              onChange={setHighlights}
              placeholder="Fast heating, 1-year warranty, Silver color"
            />
            <Field
              label={t("keywordsLabel")}
              value={keywords}
              onChange={setKeywords}
              placeholder="sheglam, beauty, hair iron"
            />
          </div>
          <div className="product-field-stack">
            <Field
              label={t("materialCode")}
              value={materialCode}
              onChange={setMaterialCode}
              placeholder="MAT-SG-CURL-400"
              error={submitted ? errors.materialCode : undefined}
            />
            <Field
              label={t("brandLabel")}
              value={brand}
              onChange={setBrand}
              placeholder="Sheglam"
              error={submitted ? errors.brand : undefined}
            />
            <Field
              label={t("barcodeField")}
              value={barcode}
              onChange={setBarcode}
              placeholder="8901234567891"
              error={submitted ? errors.barcode : undefined}
            />
            <Field
              label={t("vendorCodeField")}
              value={vendorCode}
              onChange={setVendorCode}
              placeholder="SG-CRL-400-SL"
              error={submitted ? errors.vendorCode : undefined}
            />
          </div>
        </div>
        <label className="product-form-field">
          <span>{t("descriptionLabel")}</span>
          <textarea
            className="product-textarea"
            value={description}
            placeholder="Write the product description and important usage terms."
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </section>

      <section className="product-section">
        <h2>{t("classificationPricing")}</h2>
        <div className="product-details-grid">
          <div className="product-field-stack">
            {[0, 1, 2, 3].map((level) => (
              <SelectBox
                key={level}
                label={`${t("categoryLevel")} ${level + 1}`}
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
              label={t("sellingPriceIqd")}
              type="number"
              value={sellingPrice}
              onChange={setSellingPrice}
              placeholder="49000"
              error={submitted ? errors.sellingPrice : undefined}
            />
            <Field
              label={t("costPriceIqd")}
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
              <strong>{largeProduct ? t("largeProductLabel") : t("smallProductLabel")}</strong>
            </button>
          </div>
        </div>
      </section>

      <section className="product-section product-images-section">
        <div className="section-copy">
          <h2>{t("productImages")}</h2>
          <p>{t("productImagesSub")}</p>
        </div>
        <div className="image-dropzone">
          <UploadCloud aria-hidden="true" size={48} strokeWidth={2.2} />
          <strong>{t("dragImages")}</strong>
          <span>{t("imageFormats")}</span>
        </div>
      </section>

      <section className="product-section">
        <div className="section-copy">
          <h2>{t("colorsSizesQty")}</h2>
          <p>{t("colorsSizesSub")}</p>
        </div>
        {submitted && (errors.colors || errors.sizes) ? (
          <em className="form-error">{errors.colors || errors.sizes}</em>
        ) : null}
        <div className="color-variant-stack">
          {colors.map((color) => (
            <article className="color-variant-card" key={color.id}>
              <div className="color-variant-header">
                <label>
                  <span>{t("colorCode")}</span>
                  <input
                    type="color"
                    value={color.code}
                    onChange={(event) => updateColor(color.id, { code: event.target.value })}
                  />
                </label>
                <label>
                  <span>{t("colorName")}</span>
                  <input
                    value={color.name}
                    onChange={(event) => updateColor(color.id, { name: event.target.value })}
                  />
                </label>
                <button
                  className="row-action-btn reject-btn"
                  type="button"
                  aria-label={t("deleteColor")}
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
                      <span>{t("sizeLabel")}</span>
                      <input
                        value={size.size}
                        onChange={(event) =>
                          updateSize(color.id, size.id, { size: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      <span>{t("quantityLabel")}</span>
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
                {t("addSize")}
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
          <span>{t("addColor")}</span>
        </button>
      </section>

      <section className="product-section">
        <h2>{t("reviewBeforeSave")}</h2>
        <div className="review-grid">
          <span><Tag aria-hidden="true" size={15} /> {nameAr || t("productNameAr")}</span>
          <span><Barcode aria-hidden="true" size={15} /> {barcode || t("barcodeField")}</span>
          <span>{category.filter(Boolean).join(" / ")}</span>
          <span>{colors.length} {t("colorsCount")} / {colors.reduce((sum, color) => sum + color.sizes.length, 0)} {t("sizesCount")}</span>
        </div>
      </section>
    </div>
  );
}
