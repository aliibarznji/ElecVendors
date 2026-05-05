"use client";

import {
  ArrowRight,
  Barcode,
  Boxes,
  ChevronDown,
  CheckCircle2,
  FileSpreadsheet,
  ImagePlus,
  PackageSearch,
  PenLine,
  Plus,
  Save,
  Search,
  Tag,
  ToggleRight,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import { formatIqd, totalProductQty, type ApiProduct } from "./lib/utils";

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

type StartMode = "existing" | "manual" | null;

const categories = [
  ["Beauty", "Hair Care", "Hair Devices", "Curling Irons"],
  ["Electronics", "Audio", "Headphones", "Wireless"],
  ["Electronics", "Personal Care", "Shaving", "Trimmers"],
];

const addProductEntryCopy = {
  title: "How would you like to add this product?",
  subtitle: "Choose the path that matches the product status before entering details.",
  existingTitle: "Add product by existing product",
  existingSub: "Use a product already in your catalog, then update only price and stock.",
  manualTitle: "Add product manually",
  manualSub: "Create a completely new product with full details, images, colors, and sizes.",
  bulkTitle: "Update inventory from bulk operations",
  bulkSub: "Open the CSV/XLSX upload workflow for stock updates across many products.",
  choose: "Choose",
  openBulk: "Open bulk upload",
  existingHeading: "Find an existing product",
  existingDescription: "Search your current catalog, select the product, then update price and inventory.",
  existingPlaceholder: "Search by product name, SKU, barcode, code, or brand",
  productNotFound: "Product not found? Add it manually",
  bulkShortcut: "Use CSV inventory upload",
  selectProduct: "Select product",
  selectedProduct: "Selected existing product",
  updateExistingSub: "Product identity stays the same. Update the selling price, cost price, and stock quantities.",
  updateExisting: "Update price and stock",
  existingSaved: "Existing product price and stock were updated.",
  noExistingProducts: "No products match this search.",
  loadingProducts: "Loading existing products...",
  backToOptions: "Back to options",
};

function createDefaultColors(): ColorRow[] {
  return [
    {
      id: "color-1",
      code: "#c7ccd4",
      name: "Silver",
      sizes: [{ id: "size-1", size: "Standard", quantity: 1 }],
    },
  ];
}

function colorRowsFromProduct(product: ApiProduct): ColorRow[] {
  if (product.colors.length === 0) return createDefaultColors();

  return product.colors.map((color, colorIndex) => ({
    id: color.id || `color-${colorIndex}`,
    code: color.code,
    name: color.nameEn || color.nameAr,
    sizes: color.sizes.map((size, sizeIndex) => ({
      id: size.id || `size-${colorIndex}-${sizeIndex}`,
      size: size.size,
      quantity: size.quantity,
    })),
  }));
}

function colorsToPayload(rows: ColorRow[]) {
  return rows.map((color) => ({
    code: color.code,
    nameAr: color.name,
    nameEn: color.name,
    sizes: color.sizes.map((size) => ({ size: size.size, quantity: size.quantity })),
  }));
}

function ProductThumb({ product }: { product: ApiProduct }) {
  const initials = product.brand.slice(0, 2).toUpperCase() || "PR";

  return (
    <span
      className="sample-product-thumb existing-product-thumb"
      style={{ background: product.imageTone || "#3d5fb6" }}
      aria-label={product.nameEn}
    >
      <span>{initials}</span>
    </span>
  );
}

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
  const [startMode, setStartMode] = useState<StartMode>(editId ? "manual" : null);
  const [ep, setEp] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(!!editId);
  const [existingProducts, setExistingProducts] = useState<ApiProduct[]>([]);
  const [existingQuery, setExistingQuery] = useState("");
  const [existingLoading, setExistingLoading] = useState(false);
  const [existingError, setExistingError] = useState("");
  const [selectedExisting, setSelectedExisting] = useState<ApiProduct | null>(null);
  const [existingSubmitted, setExistingSubmitted] = useState(false);
  const [existingSaved, setExistingSaved] = useState(false);

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
  const [colors, setColors] = useState<ColorRow[]>(createDefaultColors);
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
        setColors(colorRowsFromProduct(p));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [editId]);

  useEffect(() => {
    if (editId || startMode !== "existing" || existingProducts.length > 0) return;
    let active = true;
    setExistingLoading(true);
    setExistingError("");
    api.products
      .list({ limit: 100 })
      .then((res) => {
        if (active) setExistingProducts(res.items);
      })
      .catch((err) => {
        if (active) setExistingError(err instanceof Error ? err.message : "Failed to load products");
      })
      .finally(() => {
        if (active) setExistingLoading(false);
      });
    return () => {
      active = false;
    };
  }, [editId, existingProducts.length, startMode]);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 5000);
    return () => clearTimeout(timer);
  }, [saved]);

  useEffect(() => {
    if (!existingSaved) return;
    const timer = setTimeout(() => setExistingSaved(false), 5000);
    return () => clearTimeout(timer);
  }, [existingSaved]);

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

  const existingErrors = useMemo(() => {
    const next: Record<string, string> = {};
    const selling = Number(sellingPrice);
    const cost = Number(costPrice);
    if (!selling || selling <= 0) next.sellingPrice = t("errSellingPrice");
    if (!cost || cost <= 0) next.costPrice = t("errCostPrice");
    if (selling && cost && selling < cost) {
      next.sellingPrice = t("errPriceOrder");
    }
    if (colors.some((color) => color.sizes.some((size) => !size.size || size.quantity < 0))) {
      next.sizes = t("errSizes");
    }
    return next;
  }, [colors, costPrice, sellingPrice, t]);

  const filteredExistingProducts = useMemo(() => {
    const query = existingQuery.trim().toLowerCase();
    if (!query) return existingProducts;
    return existingProducts.filter((product) =>
      [
        product.nameAr,
        product.nameEn,
        product.sku,
        product.barcode,
        product.vendorCode,
        product.brand,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [existingProducts, existingQuery]);

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

  const loadExistingProduct = (product: ApiProduct) => {
    setSelectedExisting(product);
    setExistingSubmitted(false);
    setExistingSaved(false);
    setSaveError("");
    setNameAr(product.nameAr);
    setNameEn(product.nameEn);
    setHighlights(product.highlights);
    setDescription(product.description);
    setKeywords(product.keywords.join(", "));
    setMaterialCode(product.materialCode);
    setSellingPrice(String(product.sellingPrice));
    setCostPrice(String(product.costPrice));
    setLargeProduct(product.largeProduct);
    setCategory([product.categoryLevel1, product.categoryLevel2, product.categoryLevel3, product.categoryLevel4]);
    setBrand(product.brand);
    setBarcode(product.barcode);
    setVendorCode(product.vendorCode);
    setColors(colorRowsFromProduct(product));
  };

  const saveExistingProduct = async () => {
    if (!selectedExisting) return;
    setExistingSubmitted(true);
    setSaveError("");
    if (Object.keys(existingErrors).length > 0) return;

    try {
      const updated = await api.products.update(selectedExisting.id, {
        sellingPrice: Number(sellingPrice),
        costPrice: Number(costPrice),
        colors: colorsToPayload(colors),
      });
      setSelectedExisting(updated);
      setExistingProducts((current) =>
        current.map((product) => (product.id === updated.id ? updated : product)),
      );
      setExistingSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update product");
    }
  };

  if (!editId && startMode === null) {
    return (
      <div className="add-product-content">
        <header className="page-title-row">
          <div>
            <h1>{t("addProductTitle")}</h1>
            <p className="dashboard-sub">{addProductEntryCopy.subtitle}</p>
          </div>
        </header>

        <section className="add-product-choice-card" aria-labelledby="add-product-choice-title">
          <div className="add-product-choice-copy">
            <span>{t("productManagement")}</span>
            <h2 id="add-product-choice-title">{addProductEntryCopy.title}</h2>
            <p>{addProductEntryCopy.existingDescription}</p>
          </div>

          <div className="add-product-choice-grid">
            <button
              className="product-choice-option is-primary"
              type="button"
              onClick={() => setStartMode("existing")}
            >
              <span className="product-choice-icon">
                <PackageSearch aria-hidden="true" size={22} strokeWidth={2.2} />
              </span>
              <span className="product-choice-text">
                <strong>{addProductEntryCopy.existingTitle}</strong>
                <span>{addProductEntryCopy.existingSub}</span>
              </span>
              <span className="product-choice-action">
                {addProductEntryCopy.choose}
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
              </span>
            </button>

            <button
              className="product-choice-option"
              type="button"
              onClick={() => setStartMode("manual")}
            >
              <span className="product-choice-icon">
                <PenLine aria-hidden="true" size={22} strokeWidth={2.2} />
              </span>
              <span className="product-choice-text">
                <strong>{addProductEntryCopy.manualTitle}</strong>
                <span>{addProductEntryCopy.manualSub}</span>
              </span>
              <span className="product-choice-action">
                {addProductEntryCopy.choose}
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
              </span>
            </button>

            <Link className="product-choice-option" href="/products/bulk?mode=stock">
              <span className="product-choice-icon">
                <FileSpreadsheet aria-hidden="true" size={22} strokeWidth={2.2} />
              </span>
              <span className="product-choice-text">
                <strong>{addProductEntryCopy.bulkTitle}</strong>
                <span>{addProductEntryCopy.bulkSub}</span>
              </span>
              <span className="product-choice-action">
                {addProductEntryCopy.openBulk}
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
              </span>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (!editId && startMode === "existing") {
    return (
      <div className="add-product-content">
        <header className="page-title-row">
          <div>
            <h1>{addProductEntryCopy.existingTitle}</h1>
            <p className="dashboard-sub">{addProductEntryCopy.existingDescription}</p>
          </div>
          <button className="small-outline-button product-back-button" type="button" onClick={() => setStartMode(null)}>
            {addProductEntryCopy.backToOptions}
          </button>
        </header>

        <section className="existing-product-workflow">
          <div className="existing-product-search-header">
            <div>
              <h2>{addProductEntryCopy.existingHeading}</h2>
              <p>{addProductEntryCopy.existingDescription}</p>
            </div>
            <Boxes aria-hidden="true" size={24} strokeWidth={2.1} />
          </div>

          <label className="existing-product-search">
            <Search aria-hidden="true" size={17} strokeWidth={2.3} />
            <input
              value={existingQuery}
              placeholder={addProductEntryCopy.existingPlaceholder}
              onChange={(event) => setExistingQuery(event.target.value)}
            />
          </label>

          {existingLoading ? (
            <div className="existing-product-empty">{addProductEntryCopy.loadingProducts}</div>
          ) : existingError ? (
            <div className="warning-banner">{existingError}</div>
          ) : filteredExistingProducts.length === 0 ? (
            <div className="existing-product-empty">{addProductEntryCopy.noExistingProducts}</div>
          ) : (
            <div className="existing-product-results" role="list">
              {filteredExistingProducts.map((product) => (
                <button
                  className={`existing-product-row${selectedExisting?.id === product.id ? " is-selected" : ""}`}
                  key={product.id}
                  type="button"
                  onClick={() => loadExistingProduct(product)}
                >
                  <ProductThumb product={product} />
                  <span className="existing-product-main">
                    <strong>{product.nameEn}</strong>
                    <span>{product.nameAr}</span>
                  </span>
                  <span className="existing-product-meta">
                    <span>{t("skuLabel")}: {product.sku}</span>
                    <span>{t("stockColumn")}: {totalProductQty(product.colors)}</span>
                  </span>
                  <span className="existing-product-price">{formatIqd(product.sellingPrice)}</span>
                  <span className="existing-product-select">{addProductEntryCopy.selectProduct}</span>
                </button>
              ))}
            </div>
          )}

          <div className="existing-product-footer">
            <button className="small-outline-button" type="button" onClick={() => setStartMode("manual")}>
              {addProductEntryCopy.productNotFound}
            </button>
            <Link className="small-outline-button product-link-button" href="/products/bulk?mode=stock">
              {addProductEntryCopy.bulkShortcut}
            </Link>
          </div>
        </section>

        {selectedExisting ? (
          <section className="product-section existing-product-update-section">
            <div className="section-copy">
              <h2>{addProductEntryCopy.selectedProduct}</h2>
              <p>{addProductEntryCopy.updateExistingSub}</p>
            </div>

            <div className="existing-selected-summary">
              <ProductThumb product={selectedExisting} />
              <div>
                <strong>{selectedExisting.nameEn}</strong>
                <span>{selectedExisting.brand} / {selectedExisting.sku}</span>
              </div>
              <b>{formatIqd(selectedExisting.sellingPrice)}</b>
            </div>

            <div className="product-details-grid">
              <Field
                label={t("sellingPriceIqd")}
                type="number"
                value={sellingPrice}
                onChange={setSellingPrice}
                placeholder="49000"
                error={existingSubmitted ? existingErrors.sellingPrice : undefined}
              />
              <Field
                label={t("costPriceIqd")}
                type="number"
                value={costPrice}
                onChange={setCostPrice}
                placeholder="45085"
                error={existingSubmitted ? existingErrors.costPrice : undefined}
              />
            </div>

            <div className="existing-inventory-editor">
              {colors.map((color) => (
                <article className="existing-inventory-color" key={color.id}>
                  <div className="existing-inventory-color-head">
                    <span style={{ backgroundColor: color.code }} />
                    <strong>{color.name}</strong>
                  </div>
                  <div className="existing-size-grid">
                    {color.sizes.map((size) => (
                      <label className="existing-size-field" key={size.id}>
                        <span>{size.size}</span>
                        <input
                          type="number"
                          min="0"
                          value={size.quantity}
                          onChange={(event) =>
                            updateSize(color.id, size.id, { quantity: Number(event.target.value) })
                          }
                        />
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {existingSubmitted && existingErrors.sizes ? (
              <em className="form-error">{existingErrors.sizes}</em>
            ) : null}

            {saveError ? <div className="warning-banner">{saveError}</div> : null}

            {existingSaved ? (
              <div className="success-banner">
                <CheckCircle2 aria-hidden="true" size={18} strokeWidth={2.4} />
                {addProductEntryCopy.existingSaved}
              </div>
            ) : null}

            <button className="discount-create-button existing-save-button" type="button" onClick={saveExistingProduct}>
              <Save aria-hidden="true" size={16} strokeWidth={2.4} />
              <span>{addProductEntryCopy.updateExisting}</span>
            </button>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="add-product-content">
      <header className="page-title-row">
        <div>
          <h1>{ep ? `${t("editProductTitle")}: ${ep.nameEn}` : t("addProductTitle")}</h1>
          <p className="dashboard-sub">
            {ep ? t("editProductSub") : t("addProductSub")}
          </p>
        </div>
        <div className="product-header-actions">
          {!editId ? (
            <button className="small-outline-button product-back-button" type="button" onClick={() => setStartMode(null)}>
              {addProductEntryCopy.backToOptions}
            </button>
          ) : null}
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
                  colors: colorsToPayload(colors),
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
                    setColors(createDefaultColors());
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
        </div>
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
