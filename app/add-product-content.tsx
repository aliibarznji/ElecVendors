"use client";

import {
  ArrowRight,
  Barcode,
  Boxes,
  ChevronDown,
  CheckCircle2,
  FileSpreadsheet,
  Folder,
  Gift,
  ImagePlus,
  Layers,
  PackageSearch,
  PenLine,
  Plus,
  Save,
  Search,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "./lang-context";
import { api } from "./lib/api";
import { formatIqd, totalProductQty, type ApiProduct } from "./lib/utils";

type SizeRow = { id: string; size: string; quantity: number };
type ColorRow = { id: string; code: string; name: string; sizes: SizeRow[] };
type StartMode = "existing" | "manual" | null;
type LangTab = "en" | "ar" | "ku";
type FormTab = "general" | "seo";

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
  loadingProducts: "Loading existing products…",
  backToOptions: "Back to options",
};

function createDefaultColors(): ColorRow[] {
  return [{ id: "color-1", code: "#c7ccd4", name: "Silver", sizes: [{ id: "size-1", size: "Standard", quantity: 1 }] }];
}

function colorRowsFromProduct(product: ApiProduct): ColorRow[] {
  if (product.colors.length === 0) return createDefaultColors();
  return product.colors.map((color, ci) => ({
    id: color.id || `color-${ci}`,
    code: color.code,
    name: color.nameEn || color.nameAr,
    sizes: color.sizes.map((size, si) => ({ id: size.id || `size-${ci}-${si}`, size: size.size, quantity: size.quantity })),
  }));
}

function colorsToPayload(rows: ColorRow[]) {
  return rows.map((c) => ({ code: c.code, nameAr: c.name, nameEn: c.name, sizes: c.sizes.map((s) => ({ size: s.size, quantity: s.quantity })) }));
}

function ProductThumb({ product }: { product: ApiProduct }) {
  const initials = product.brand.slice(0, 2).toUpperCase() || "PR";
  return (
    <span className="sample-product-thumb existing-product-thumb" style={{ background: product.imageTone || "#3d5fb6" }} aria-label={product.nameEn}>
      <span>{initials}</span>
    </span>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", error, maxLength,
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string; maxLength?: number;
}) {
  return (
    <label className="product-form-field">
      <span>{label}</span>
      <div className={`product-input-box${error ? " has-error" : ""}`}>
        <input type={type} value={value} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} />
      </div>
      {error ? <em className="form-error">{error}</em> : null}
    </label>
  );
}

function SelectBox({ label, value, onChange, options, error, onAdd }: { label: string; value: string; onChange: (v: string) => void; options: string[]; error?: string; onAdd?: (v: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const confirmAdd = () => {
    const v = inputVal.trim();
    if (v) { onAdd!(v); onChange(v); }
    setInputVal("");
    setAdding(false);
  };

  return (
    <div className="product-form-field">
      <span className="product-field-label">{label}</span>
      <div className="select-box-row">
        <div className={`product-input-box${error ? " has-error" : ""}`}>
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Select...</option>
            {options.map((o) => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown aria-hidden="true" size={16} strokeWidth={2.1} />
        </div>
        {onAdd && (
          <button type="button" className="select-add-btn" onClick={() => { setAdding((v) => !v); setInputVal(""); }}>
            <Plus size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
      {adding && (
        <div className="select-add-row">
          <input
            autoFocus
            value={inputVal}
            placeholder={`Add ${label.toLowerCase()}…`}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmAdd(); } if (e.key === "Escape") { setAdding(false); setInputVal(""); } }}
            className="select-add-input"
          />
          <button type="button" className="select-add-confirm" onClick={confirmAdd}>Add</button>
        </div>
      )}
      {error ? <em className="form-error">{error}</em> : null}
    </div>
  );
}

function RichTextArea({ value, onChange, placeholder, showGenerate }: { value: string; onChange: (v: string) => void; placeholder?: string; showGenerate?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="pf-rich-editor">
      {showGenerate && (
        <div className="pf-toolbar">
          <button className="pf-generate-btn" type="button" disabled title="Coming soon">✨ Generate from URL</button>
        </div>
      )}
      <textarea ref={ref} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SectionHeader({ icon, title, sub }: { icon: ReactNode; title: string; sub?: string }) {
  return (
    <div className="pf-section-icon-header">
      {icon}
      <div className="pf-section-icon-header-text">
        <h3>{title}</h3>
        {sub ? <p>{sub}</p> : null}
      </div>
    </div>
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

  // Form tabs
  const [formTab, setFormTab] = useState<FormTab>("general");
  const [langTab, setLangTab] = useState<LangTab>("en");

  // Per-language name
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameKu, setNameKu] = useState("");

  // Per-language description
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionKu, setDescriptionKu] = useState("");

  // Per-language warranty
  const [warrantyEn, setWarrantyEn] = useState("");
  const [warrantyAr, setWarrantyAr] = useState("");
  const [warrantyKu, setWarrantyKu] = useState("");

  // Classification
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customBrands, setCustomBrands] = useState<string[]>([]);
  const [giniCategory, setGiniCategory] = useState("");
  const [marketingCategory, setMarketingCategory] = useState("");

  // Logistics
  const [shippingCategory, setShippingCategory] = useState("");
  const [largeProduct, setLargeProduct] = useState(false);

  // Pricing
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");

  // Codes (SEO tab)
  const [highlights, setHighlights] = useState("");
  const [keywords, setKeywords] = useState("");
  const [materialCode, setMaterialCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [vendorCode, setVendorCode] = useState("");

  // Gift & Purchase Limit
  const [giftType, setGiftType] = useState("");
  const [purchaseLimitEnabled, setPurchaseLimitEnabled] = useState(false);
  const [purchaseLimitQty, setPurchaseLimitQty] = useState("");

  // Colors / Attributes
  const [colors, setColors] = useState<ColorRow[]>(createDefaultColors);

  // Media
  const [mainImage, setMainImage] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [mainUploading, setMainUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Save state
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!editId) return;
    api.products
      .get(editId)
      .then((p) => {
        setEp(p);
        setNameEn(p.nameEn); setNameAr(p.nameAr); setNameKu(p.nameKu ?? "");
        setDescriptionEn(p.description); setDescriptionAr(p.descriptionAr ?? ""); setDescriptionKu(p.descriptionKu ?? "");
        setWarrantyEn(p.warrantyEn ?? ""); setWarrantyAr(p.warrantyAr ?? ""); setWarrantyKu(p.warrantyKu ?? "");
        setHighlights(p.highlights); setKeywords(p.keywords.join(", ")); setMaterialCode(p.materialCode);
        setSellingPrice(String(p.sellingPrice)); setCostPrice(String(p.costPrice)); setLargeProduct(p.largeProduct);
        setCategory(p.categoryLevel1 ?? "");
        setBrand(p.brand); setBarcode(p.barcode); setVendorCode(p.vendorCode);
        setGiniCategory(p.giniCategory ?? ""); setMarketingCategory(p.marketingCategory ?? "");
        setShippingCategory(p.shippingCategory ?? ""); setGiftType(p.giftType ?? "");
        setPurchaseLimitEnabled(p.purchaseLimitEnabled ?? false);
        setPurchaseLimitQty(p.purchaseLimitQty ? String(p.purchaseLimitQty) : "");
        setMainImage(p.mainImage ?? ""); if (p.mainImage) setMainImagePreview(p.mainImage);
        setGalleryImages(p.galleryImages ?? []); setGalleryPreviews(p.galleryImages ?? []);
        setColors(colorRowsFromProduct(p));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [editId]);

  useEffect(() => {
    if (editId || startMode !== "existing" || existingProducts.length > 0) return;
    let active = true;
    setExistingLoading(true);
    api.products
      .list({ limit: 100 })
      .then((res) => { if (active) setExistingProducts(res.items); })
      .catch((err) => { if (active) setExistingError(err instanceof Error ? err.message : "Failed to load products"); })
      .finally(() => { if (active) setExistingLoading(false); });
    return () => { active = false; };
  }, [editId, existingProducts.length, startMode]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 5000);
    return () => clearTimeout(t);
  }, [saved]);

  useEffect(() => {
    if (!existingSaved) return;
    const t = setTimeout(() => setExistingSaved(false), 5000);
    return () => clearTimeout(t);
  }, [existingSaved]);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!nameAr.trim()) next.nameAr = t("errNameAr");
    if (!nameEn.trim()) next.nameEn = t("errNameEn");
    if (!materialCode.trim()) next.materialCode = t("errMaterialCode");
    if (!brand.trim()) next.brand = t("errBrand");
    if (!barcode.trim()) next.barcode = t("errBarcode");
    if (!vendorCode.trim()) next.vendorCode = t("errVendorCode");
    const selling = Number(sellingPrice), cost = Number(costPrice);
    if (!selling || selling <= 0) next.sellingPrice = t("errSellingPrice");
    if (!cost || cost <= 0) next.costPrice = t("errCostPrice");
    if (selling && cost && selling < cost) next.sellingPrice = t("errPriceOrder");
    if (colors.some((c) => !c.code || !c.name)) next.colors = t("errColors");
    if (colors.some((c) => c.sizes.some((s) => !s.size || s.quantity < 0))) next.sizes = t("errSizes");
    return next;
  }, [nameAr, nameEn, materialCode, brand, barcode, vendorCode, sellingPrice, costPrice, colors, t]);

  const existingErrors = useMemo(() => {
    const next: Record<string, string> = {};
    const selling = Number(sellingPrice), cost = Number(costPrice);
    if (!selling || selling <= 0) next.sellingPrice = t("errSellingPrice");
    if (!cost || cost <= 0) next.costPrice = t("errCostPrice");
    if (selling && cost && selling < cost) next.sellingPrice = t("errPriceOrder");
    if (colors.some((c) => c.sizes.some((s) => !s.size || s.quantity < 0))) next.sizes = t("errSizes");
    return next;
  }, [colors, costPrice, sellingPrice, t]);

  const filteredExistingProducts = useMemo(() => {
    const q = existingQuery.trim().toLowerCase();
    if (!q) return existingProducts;
    return existingProducts.filter((p) =>
      [p.nameAr, p.nameEn, p.sku, p.barcode, p.vendorCode, p.brand].some((v) => v.toLowerCase().includes(q)),
    );
  }, [existingProducts, existingQuery]);

  if (loading) return <div className="dashboard-stage-loading">{t("loading")}</div>;

  const updateColor = (id: string, patch: Partial<ColorRow>) =>
    setColors((cur) => cur.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const updateSize = (colorId: string, sizeId: string, patch: Partial<SizeRow>) =>
    setColors((cur) =>
      cur.map((c) =>
        c.id === colorId
          ? { ...c, sizes: c.sizes.map((s) => (s.id === sizeId ? { ...s, ...patch } : s)) }
          : c,
      ),
    );

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImagePreview(URL.createObjectURL(file));
    setMainUploading(true);
    try {
      const url = await api.products.uploadImage(file);
      setMainImage(url);
      setMainImagePreview(url);
    } catch {
      setMainImagePreview("");
    } finally {
      setMainUploading(false);
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setGalleryPreviews((cur) => [...cur, ...previews]);
    setGalleryUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => api.products.uploadImage(f)));
      setGalleryImages((cur) => [...cur, ...urls]);
      setGalleryPreviews((cur) => {
        const withoutBlobs = cur.filter((p) => !p.startsWith("blob:"));
        return [...withoutBlobs, ...urls];
      });
    } catch {
      setGalleryPreviews((cur) => cur.filter((p) => !p.startsWith("blob:")));
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((cur) => cur.filter((_, i) => i !== index));
    setGalleryPreviews((cur) => cur.filter((_, i) => i !== index));
  };

  const loadExistingProduct = (product: ApiProduct) => {
    setSelectedExisting(product);
    setExistingSubmitted(false);
    setExistingSaved(false);
    setSaveError("");
    setSellingPrice(String(product.sellingPrice));
    setCostPrice(String(product.costPrice));
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
      setExistingProducts((cur) => cur.map((p) => (p.id === updated.id ? updated : p)));
      setExistingSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update product");
    }
  };

  const handleSave = async () => {
    setSubmitted(true);
    setSaveError("");
    if (Object.keys(errors).length > 0) return;
    const payload = {
      nameAr, nameEn, nameKu,
      highlights,
      description: descriptionEn,
      descriptionAr, descriptionKu,
      warrantyEn, warrantyAr, warrantyKu,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
      materialCode,
      sku: vendorCode,
      barcode, vendorCode, brand,
      categoryLevel1: category,
      categoryLevel2: "",
      categoryLevel3: "",
      categoryLevel4: "",
      giniCategory, marketingCategory, shippingCategory, giftType,
      purchaseLimitEnabled,
      purchaseLimitQty: purchaseLimitEnabled ? Number(purchaseLimitQty) || 0 : 0,
      mainImage, galleryImages,
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
        setNameEn(""); setNameAr(""); setNameKu("");
        setDescriptionEn(""); setDescriptionAr(""); setDescriptionKu("");
        setWarrantyEn(""); setWarrantyAr(""); setWarrantyKu("");
        setHighlights(""); setKeywords(""); setMaterialCode("");
        setSellingPrice(""); setCostPrice(""); setBrand(""); setBarcode(""); setVendorCode("");
        setGiniCategory(""); setMarketingCategory(""); setShippingCategory("");
        setGiftType(""); setPurchaseLimitEnabled(false); setPurchaseLimitQty("");
        setMainImage(""); setMainImagePreview(""); setGalleryImages([]); setGalleryPreviews([]);
        setColors(createDefaultColors());
        setLargeProduct(false);
        setSubmitted(false);
      }
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  // ── Choice screen ──────────────────────────────────────────────────────────
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
            <button className="product-choice-option is-primary" type="button"
              onClick={() => { setExistingLoading(existingProducts.length === 0); setExistingError(""); setStartMode("existing"); }}>
              <span className="product-choice-icon"><PackageSearch aria-hidden size={22} strokeWidth={2.2} /></span>
              <span className="product-choice-text"><strong>{addProductEntryCopy.existingTitle}</strong><span>{addProductEntryCopy.existingSub}</span></span>
              <span className="product-choice-action">{addProductEntryCopy.choose}<ArrowRight aria-hidden size={16} strokeWidth={2.4} /></span>
            </button>
            <button className="product-choice-option" type="button" onClick={() => setStartMode("manual")}>
              <span className="product-choice-icon"><PenLine aria-hidden size={22} strokeWidth={2.2} /></span>
              <span className="product-choice-text"><strong>{addProductEntryCopy.manualTitle}</strong><span>{addProductEntryCopy.manualSub}</span></span>
              <span className="product-choice-action">{addProductEntryCopy.choose}<ArrowRight aria-hidden size={16} strokeWidth={2.4} /></span>
            </button>
            <Link className="product-choice-option" href="/products/bulk?mode=stock">
              <span className="product-choice-icon"><FileSpreadsheet aria-hidden size={22} strokeWidth={2.2} /></span>
              <span className="product-choice-text"><strong>{addProductEntryCopy.bulkTitle}</strong><span>{addProductEntryCopy.bulkSub}</span></span>
              <span className="product-choice-action">{addProductEntryCopy.openBulk}<ArrowRight aria-hidden size={16} strokeWidth={2.4} /></span>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // ── Existing product screen ────────────────────────────────────────────────
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
            <div><h2>{addProductEntryCopy.existingHeading}</h2><p>{addProductEntryCopy.existingDescription}</p></div>
            <Boxes aria-hidden size={24} strokeWidth={2.1} />
          </div>
          <label className="existing-product-search">
            <Search aria-hidden size={17} strokeWidth={2.3} />
            <input value={existingQuery} placeholder={addProductEntryCopy.existingPlaceholder} onChange={(e) => setExistingQuery(e.target.value)} />
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
                <button className={`existing-product-row${selectedExisting?.id === product.id ? " is-selected" : ""}`} key={product.id} type="button" onClick={() => loadExistingProduct(product)}>
                  <ProductThumb product={product} />
                  <span className="existing-product-main"><strong>{product.nameEn}</strong><span>{product.nameAr}</span></span>
                  <span className="existing-product-meta"><span>{t("skuLabel")}: {product.sku}</span><span>{t("stockColumn")}: {totalProductQty(product.colors)}</span></span>
                  <span className="existing-product-price">{formatIqd(product.sellingPrice)}</span>
                  <span className="existing-product-select">{addProductEntryCopy.selectProduct}</span>
                </button>
              ))}
            </div>
          )}
          <div className="existing-product-footer">
            <button className="small-outline-button existing-footer-primary" type="button" onClick={() => setStartMode("manual")}>{addProductEntryCopy.productNotFound}</button>
            <span className="existing-footer-sep">or</span>
            <Link className="small-outline-button product-link-button" href="/products/bulk?mode=stock">{addProductEntryCopy.bulkShortcut}</Link>
          </div>
        </section>
        {selectedExisting ? (
          <section className="product-section existing-product-update-section">
            <div className="section-copy"><h2>{addProductEntryCopy.selectedProduct}</h2><p>{addProductEntryCopy.updateExistingSub}</p></div>
            <div className="existing-selected-summary">
              <ProductThumb product={selectedExisting} />
              <div><strong>{selectedExisting.nameEn}</strong><span>{selectedExisting.brand} / {selectedExisting.sku}</span></div>
              <b>{formatIqd(selectedExisting.sellingPrice)}</b>
            </div>
            <div className="product-details-grid">
              <Field label={t("sellingPriceIqd")} type="number" value={sellingPrice} onChange={setSellingPrice} placeholder="49000" error={existingSubmitted ? existingErrors.sellingPrice : undefined} />
              <Field label={t("costPriceIqd")} type="number" value={costPrice} onChange={setCostPrice} placeholder="45085" error={existingSubmitted ? existingErrors.costPrice : undefined} />
            </div>
            <div className="existing-inventory-editor">
              {colors.map((color) => (
                <article className="existing-inventory-color" key={color.id}>
                  <div className="existing-inventory-color-head"><span style={{ backgroundColor: color.code }} /><strong>{color.name}</strong></div>
                  <div className="existing-size-grid">
                    {color.sizes.map((size) => (
                      <label className="existing-size-field" key={size.id}>
                        <span>{size.size}</span>
                        <input type="number" min="0" value={size.quantity} onChange={(e) => updateSize(color.id, size.id, { quantity: Number(e.target.value) })} />
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            {existingSubmitted && existingErrors.sizes ? <em className="form-error">{existingErrors.sizes}</em> : null}
            {saveError ? <div className="warning-banner">{saveError}</div> : null}
            {existingSaved ? (
              <div className="success-banner"><CheckCircle2 aria-hidden size={18} strokeWidth={2.4} />{addProductEntryCopy.existingSaved}</div>
            ) : null}
            <button className="discount-create-button existing-save-button" type="button" onClick={saveExistingProduct}>
              <Save aria-hidden size={16} strokeWidth={2.4} /><span>{addProductEntryCopy.updateExisting}</span>
            </button>
          </section>
        ) : null}
      </div>
    );
  }

  // ── Current language helpers ───────────────────────────────────────────────
  const currentName = langTab === "en" ? nameEn : langTab === "ar" ? nameAr : nameKu;
  const setCurrentName = langTab === "en" ? setNameEn : langTab === "ar" ? setNameAr : setNameKu;
  const currentDesc = langTab === "en" ? descriptionEn : langTab === "ar" ? descriptionAr : descriptionKu;
  const setCurrentDesc = langTab === "en" ? setDescriptionEn : langTab === "ar" ? setDescriptionAr : setDescriptionKu;
  const currentWarranty = langTab === "en" ? warrantyEn : langTab === "ar" ? warrantyAr : warrantyKu;
  const setCurrentWarranty = langTab === "en" ? setWarrantyEn : langTab === "ar" ? setWarrantyAr : setWarrantyKu;

  // ── Manual form ────────────────────────────────────────────────────────────
  return (
    <div className="add-product-content">
      {/* Page header */}
      <header className="page-title-row">
        <div>
          <h1>{ep ? `${t("editProductTitle")}: ${ep.nameEn}` : t("addProductTitle")}</h1>
          <p className="dashboard-sub">{ep ? t("editProductSub") : t("addProductSub")}</p>
        </div>
        <div className="product-header-actions">
          {!editId ? (
            <button className="small-outline-button product-back-button" type="button" onClick={() => setStartMode(null)}>
              {addProductEntryCopy.backToOptions}
            </button>
          ) : null}
          <button className="discount-create-button" type="button" onClick={handleSave}>
            <Save aria-hidden size={16} strokeWidth={2.4} />
            <span>{ep ? t("updateProduct") : t("saveProduct")}</span>
          </button>
        </div>
      </header>

      {saved ? <div className="success-banner">{ep ? t("productUpdated") : t("productSaved")}</div> : null}
      {submitted && Object.keys(errors).length > 0 ? <div className="warning-banner">{t("formErrors")}</div> : null}
      {saveError ? <div className="warning-banner">{saveError}</div> : null}

      {/* Form-level tabs */}
      <div className="product-section" style={{ padding: "0 24px", gap: 0 }}>
        <div className="pf-tabs">
          <button className={`pf-tab${formTab === "general" ? " is-active" : ""}`} type="button" onClick={() => setFormTab("general")}>{t("tabGeneral")}</button>
          <button className={`pf-tab${formTab === "seo" ? " is-active" : ""}`} type="button" onClick={() => setFormTab("seo")}>{t("tabSeo")}</button>
        </div>
      </div>

      {/* ── GENERAL TAB ─────────────────────────────────────── */}
      {formTab === "general" && (
        <>
          {/* Name + Description + Warranty */}
          <section className="product-section">
            {/* Language tabs */}
            <div className="pf-lang-tabs">
              {(["en", "ar", "ku"] as LangTab[]).map((l) => (
                <button key={l} type="button" className={`pf-lang-tab${langTab === l ? " is-active" : ""}`} onClick={() => setLangTab(l)}>
                  <span>{l === "en" ? "🇺🇸" : l === "ar" ? "🇮🇶" : "🏴"}</span>
                  <span>{t(l === "en" ? "langEn" : l === "ar" ? "langAr" : "langKu")}</span>
                </button>
              ))}
            </div>

            {/* Name with char counter */}
            <label className="product-form-field">
              <span>{t(langTab === "en" ? "productNameEn" : langTab === "ar" ? "productNameAr" : "productNameEn")} ({langTab.toUpperCase()})</span>
              <div className={`product-input-box pf-name-wrapper${submitted && langTab === "en" && errors.nameEn ? " has-error" : submitted && langTab === "ar" && errors.nameAr ? " has-error" : ""}`}>
                <input
                  value={currentName}
                  maxLength={255}
                  placeholder={langTab === "en" ? "POCO X8 Pro Black 12G RAM 512GB ROM" : langTab === "ar" ? "POCO X8 برو أسود 12 جيجا رام" : "POCO X8 Pro Reş 12G RAM"}
                  onChange={(e) => setCurrentName(e.target.value)}
                />
                <span className="pf-char-counter">{currentName.length} / 255</span>
              </div>
              {submitted && langTab === "en" && errors.nameEn ? <em className="form-error">{errors.nameEn}</em> : null}
              {submitted && langTab === "ar" && errors.nameAr ? <em className="form-error">{errors.nameAr}</em> : null}
            </label>

            {/* Description */}
            <label className="product-form-field">
              <span>{t("descriptionLabel")} ({langTab.toUpperCase()})</span>
              <RichTextArea value={currentDesc} onChange={setCurrentDesc} placeholder={t("descriptionPlaceholder")} showGenerate />
            </label>

            {/* Warranty */}
            <label className="product-form-field">
              <span>{t("warrantyLabel")} ({langTab.toUpperCase()})</span>
              <RichTextArea value={currentWarranty} onChange={setCurrentWarranty} placeholder={t("warrantyPlaceholder")} />
            </label>
          </section>

          {/* Classification + Product Media */}
          <div className="pf-two-col">
            {/* Classification */}
            <section className="product-section">
              <SectionHeader icon={<Folder size={16} strokeWidth={2.2} />} title={t("classificationSection")} sub={t("classificationSub")} />
              <div className="pf-class-grid">
                <SelectBox label={t("categoriesLabel")} value={category}
                  onChange={setCategory}
                  options={[...new Set([...categories.map((c) => c[0]).filter(Boolean), ...customCategories])]}
                  onAdd={(v) => setCustomCategories((cur) => [...cur, v])}
                />
                <SelectBox label={t("brandLabel")} value={brand} onChange={setBrand}
                  options={customBrands}
                  onAdd={(v) => setCustomBrands((cur) => [...cur, v])}
                  error={submitted ? errors.brand : undefined}
                />
                <SelectBox label={t("giniCategoryLabel")} value={giniCategory} onChange={setGiniCategory} options={[]} />
                <SelectBox label={t("marketingCategoryLabel")} value={marketingCategory} onChange={setMarketingCategory} options={[]} />
              </div>
            </section>

            {/* Product Media */}
            <section className="product-section">
              <SectionHeader icon={<ImagePlus size={16} strokeWidth={2.2} />} title={t("productMediaSection")} sub={t("productMediaSub")} />

              {/* Main Image */}
              <div>
                <div className="pf-media-label">
                  {t("mainImageLabel")}
                  <span className="pf-alt-badge">{t("altTextEnabled")}</span>
                </div>
                {mainImagePreview ? (
                  <div>
                    <img src={mainImagePreview} alt="Main product" className="pf-upload-preview" />
                    <button className="small-outline-button" type="button" onClick={() => { setMainImage(""); setMainImagePreview(""); }}>
                      <Trash2 size={13} strokeWidth={2.4} /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="pf-upload-zone">
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleMainImageChange} disabled={mainUploading} />
                    <UploadCloud size={28} strokeWidth={1.8} />
                    <strong>Upload files</strong>
                    <span>Drag and drop or <span className="browse-link">browse</span></span>
                    <p className="pf-max-note">Max size: 10MB · PNG, JPG, WEBP</p>
                  </div>
                )}
                {mainUploading ? <p className="pf-media-uploading">{t("uploadingLabel")}</p> : null}
              </div>

              {/* Gallery Images */}
              <div>
                <div className="pf-media-label">
                  {t("galleryImagesLabel")}
                  <span className="pf-alt-badge">{t("altTextEnabled")}</span>
                </div>
                <div className="pf-upload-zone">
                  <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleGalleryChange} disabled={galleryUploading} />
                  <UploadCloud size={24} strokeWidth={1.8} />
                  <strong>Upload files</strong>
                  <span>Drag and drop or <span className="browse-link">browse</span></span>
                </div>
                {galleryPreviews.length > 0 ? (
                  <div className="pf-gallery-grid">
                    {galleryPreviews.map((src, i) => (
                      <div className="pf-gallery-thumb" key={i}>
                        <img src={src} alt={`Gallery ${i + 1}`} />
                        <button type="button" onClick={() => removeGalleryImage(i)} aria-label="Remove image">×</button>
                      </div>
                    ))}
                  </div>
                ) : null}
                {galleryUploading ? <p className="pf-media-uploading">{t("uploadingLabel")}</p> : null}
              </div>
            </section>
          </div>

          {/* Logistics + Pricing */}
          <section className="product-section">
            <SectionHeader icon={<Truck size={16} strokeWidth={2.2} />} title={t("logisticsSection")} sub={t("logisticsSub")} />
            <div className="product-details-grid">
              <div className="product-field-stack">
                <SelectBox label={t("shippingCategoryLabel")} value={shippingCategory} onChange={setShippingCategory} options={[]} />
                <button className="modal-toggle product-large-toggle" type="button" aria-pressed={largeProduct} onClick={() => setLargeProduct((v) => !v)}>
                  <span className={`toggle-switch${largeProduct ? " is-enabled" : ""}`} />
                  <strong>{largeProduct ? t("largeProductLabel") : t("smallProductLabel")}</strong>
                </button>
              </div>
              <div className="product-field-stack">
                <Field label={t("sellingPriceIqd")} type="number" value={sellingPrice} onChange={setSellingPrice} placeholder="49000" error={submitted ? errors.sellingPrice : undefined} />
                <Field label={t("costPriceIqd")} type="number" value={costPrice} onChange={setCostPrice} placeholder="45085" error={submitted ? errors.costPrice : undefined} />
              </div>
            </div>
          </section>

          {/* Gift Promotions */}
          <section className="product-section">
            <SectionHeader icon={<Gift size={16} strokeWidth={2.2} />} title={t("giftPromotionsSection")} sub={t("giftPromotionsSub")} />
            <div style={{ maxWidth: 340 }}>
              <label className="product-form-field">
                <span>{t("giftTypeLabel")}</span>
                <div className="product-input-box">
                  <select value={giftType} onChange={(e) => setGiftType(e.target.value)}>
                    <option value="">{t("giftTypeNone")}</option>
                    <option value="free">{t("giftTypeFree")}</option>
                    <option value="bundle">{t("giftTypeBundle")}</option>
                  </select>
                  <ChevronDown aria-hidden size={16} strokeWidth={2.1} />
                </div>
              </label>
            </div>
          </section>

          {/* Purchase Limit */}
          <section className="product-section">
            <SectionHeader icon={<ShoppingCart size={16} strokeWidth={2.2} />} title={t("purchaseLimitSection")} sub={t("purchaseLimitSub")} />
            <div className="pf-toggle-row">
              <button className="modal-toggle" type="button" aria-pressed={purchaseLimitEnabled} onClick={() => setPurchaseLimitEnabled((v) => !v)}>
                <span className={`toggle-switch${purchaseLimitEnabled ? " is-enabled" : ""}`} />
              </button>
              <span className="pf-toggle-label">{t("enablePurchaseLimit")}</span>
            </div>
            {purchaseLimitEnabled ? (
              <div className="pf-limit-qty" style={{ maxWidth: 240 }}>
                <Field label={t("purchaseLimitQtyLabel")} type="number" value={purchaseLimitQty} onChange={setPurchaseLimitQty} placeholder="5" />
              </div>
            ) : null}
          </section>

          {/* Attribute Set / Colors & Sizes */}
          <section className="product-section">
            <SectionHeader icon={<Layers size={16} strokeWidth={2.2} />} title={t("attributeSetSection")} />
            {submitted && (errors.colors || errors.sizes) ? <em className="form-error">{errors.colors || errors.sizes}</em> : null}

            {/* Header row */}
            <div className="pf-attr-header">
              <span>{t("colorCode")} / {t("colorName")}</span>
              <span>{t("sizeLabel")} / {t("quantityLabel")}</span>
              <span>{t("imagesCol")}</span>
              <span />
            </div>

            {colors.map((color) => (
              <div key={color.id}>
                <div className="pf-attr-row">
                  {/* Color swatch + name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="color" value={color.code} onChange={(e) => updateColor(color.id, { code: e.target.value })}
                      className="pf-color-swatch" title={t("colorCode")} />
                    <input className="pf-attr-input" value={color.name} placeholder={t("colorName")}
                      onChange={(e) => updateColor(color.id, { name: e.target.value })} />
                  </div>
                  {/* Sizes */}
                  <div style={{ display: "grid", gap: 4 }}>
                    {color.sizes.map((size) => (
                      <div className="pf-attr-size-row" key={size.id}>
                        <input className="pf-attr-input" value={size.size} placeholder={t("sizeLabel")}
                          onChange={(e) => updateSize(color.id, size.id, { size: e.target.value })} />
                        <input className="pf-attr-input" type="number" min="0" value={size.quantity} placeholder={t("quantityLabel")}
                          onChange={(e) => updateSize(color.id, size.id, { quantity: Number(e.target.value) })} />
                      </div>
                    ))}
                    <button className="small-outline-button" type="button"
                      onClick={() => updateColor(color.id, { sizes: [...color.sizes, { id: `size-${Date.now()}`, size: "", quantity: 0 }] })}>
                      <Plus size={13} strokeWidth={2.4} /> {t("addSize")}
                    </button>
                  </div>
                  {/* Images placeholder */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4 }}>
                    <ImagePlus size={20} strokeWidth={1.8} />
                  </div>
                  {/* Delete */}
                  <button className="row-action-btn reject-btn" type="button" aria-label={t("deleteColor")}
                    onClick={() => setColors((cur) => cur.filter((c) => c.id !== color.id))}>
                    <Trash2 size={14} strokeWidth={2.4} />
                  </button>
                </div>
              </div>
            ))}

            <div className="pf-attr-footer">
              <button className="small-outline-button" type="button"
                onClick={() => setColors((cur) => cur.filter((c) => c.name.trim() !== "" || c.sizes.some((s) => s.size.trim() !== "")))}>
                <Trash2 size={13} strokeWidth={2.4} /> {t("removeEmpty")}
              </button>
              <button className="discount-create-button" type="button"
                onClick={() => setColors((cur) => [...cur, { id: `color-${Date.now()}`, code: "#000000", name: "", sizes: [{ id: `size-${Date.now()}`, size: "", quantity: 0 }] }])}>
                <Plus size={15} strokeWidth={2.4} /><span>{t("addColor")}</span>
              </button>
            </div>
          </section>
        </>
      )}

      {/* ── SEO TAB ──────────────────────────────────────────── */}
      {formTab === "seo" && (
        <section className="product-section">
          <SectionHeader icon={<Tag size={16} strokeWidth={2.2} />} title={t("seoSection")} sub={t("seoSub")} />
          <div className="product-details-grid">
            <div className="product-field-stack">
              <Field label={t("highlights")} value={highlights} onChange={setHighlights} placeholder="Fast heating, 1-year warranty, Silver color" />
              <Field label={t("keywordsLabel")} value={keywords} onChange={setKeywords} placeholder="sheglam, beauty, hair iron" />
              <Field label={t("materialCode")} value={materialCode} onChange={setMaterialCode} placeholder="MAT-SG-CURL-400" error={submitted ? errors.materialCode : undefined} />
            </div>
            <div className="product-field-stack">
              <Field label={t("barcodeField")} value={barcode} onChange={setBarcode} placeholder="8901234567891" error={submitted ? errors.barcode : undefined} />
              <Field label={t("vendorCodeField")} value={vendorCode} onChange={setVendorCode} placeholder="SG-CRL-400-SL" error={submitted ? errors.vendorCode : undefined} />
              <Field label={t("skuFieldLabel")} value={vendorCode} onChange={setVendorCode} placeholder="SG-CRL-400-SL (same as vendor code)" />
            </div>
          </div>

          {/* Review summary */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t("reviewBeforeSave")}</h3>
            <div className="review-grid">
              <span><Tag aria-hidden size={15} /> {nameEn || t("productNameEn")}</span>
              <span><Barcode aria-hidden size={15} /> {barcode || t("barcodeField")}</span>
              <span>{category}</span>
              <span>{colors.length} {t("colorsCount")} / {colors.reduce((s, c) => s + c.sizes.length, 0)} {t("sizesCount")}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
