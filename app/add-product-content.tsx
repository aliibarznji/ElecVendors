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
import { useMemo, useState } from "react";

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
  ["الجمال", "العناية بالشعر", "أجهزة الشعر", "مكاوي التجعيد"],
  ["الإلكترونيات", "الصوت", "سماعات", "لاسلكية"],
  ["الإلكترونيات", "العناية الشخصية", "حلاقة", "ماكينات تهذيب"],
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
          <option value="">اختر</option>
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
      name: "فضي",
      sizes: [{ id: "size-1", size: "قياسي", quantity: 1 }],
    },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!nameAr.trim()) next.nameAr = "اسم المنتج بالعربية مطلوب.";
    if (!nameEn.trim()) next.nameEn = "اسم المنتج بالإنجليزية مطلوب.";
    if (!materialCode.trim()) next.materialCode = "كود المنتج أو المادة مطلوب.";
    if (!brand.trim()) next.brand = "العلامة التجارية مطلوبة.";
    if (!barcode.trim()) next.barcode = "الباركود مطلوب.";
    if (!vendorCode.trim()) next.vendorCode = "كود المنتج لدى التاجر مطلوب.";
    const selling = Number(sellingPrice);
    const cost = Number(costPrice);
    if (!selling || selling <= 0) next.sellingPrice = "سعر البيع مطلوب.";
    if (!cost || cost <= 0) next.costPrice = "سعر الكلفة مطلوب.";
    if (selling && cost && selling < cost) {
      next.sellingPrice = "سعر البيع يجب أن يكون أعلى من الكلفة.";
    }
    if (colors.some((color) => !color.code || !color.name)) {
      next.colors = "كل لون يحتاج كود لون واسم لون.";
    }
    if (colors.some((color) => color.sizes.some((size) => !size.size || size.quantity < 0))) {
      next.sizes = "كل صف حجم يحتاج اسم حجم وكمية صحيحة.";
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
          <h1>إضافة / تعديل منتج</h1>
          <p className="dashboard-sub">
            نموذج واحد يغطي بيانات المنتج، التسعير، التصنيفات، الصور، الألوان، والأحجام.
          </p>
        </div>
        <button
          className="discount-create-button"
          type="button"
          onClick={() => setSubmitted(true)}
        >
          <Save aria-hidden="true" size={16} strokeWidth={2.4} />
          <span>حفظ المنتج</span>
        </button>
      </header>

      {submitted && Object.keys(errors).length === 0 ? (
        <div className="success-banner">
          تم التحقق من البيانات. في التطبيق الحقيقي يتم إرسال المنتج للمراجعة أو النشر.
        </div>
      ) : null}

      {submitted && Object.keys(errors).length > 0 ? (
        <div className="warning-banner">
          يرجى إكمال الحقول المطلوبة وتصحيح الأخطاء قبل حفظ المنتج.
        </div>
      ) : null}

      <section className="product-section">
        <h2>المعلومات الأساسية</h2>
        <div className="product-details-grid">
          <div className="product-field-stack">
            <Field
              label="اسم المنتج بالعربية"
              value={nameAr}
              onChange={setNameAr}
              placeholder="مثال: مكواة تجعيد الشعر"
              error={submitted ? errors.nameAr : undefined}
            />
            <Field
              label="اسم المنتج بالإنجليزية"
              value={nameEn}
              onChange={setNameEn}
              placeholder="Product English name"
              error={submitted ? errors.nameEn : undefined}
            />
            <Field
              label="النقاط البارزة"
              value={highlights}
              onChange={setHighlights}
              placeholder="سريع التسخين، ضمان سنة، لون فضي"
            />
            <Field
              label="الكلمات المفتاحية"
              value={keywords}
              onChange={setKeywords}
              placeholder="sheglam, beauty, مكواة شعر"
            />
          </div>
          <div className="product-field-stack">
            <Field
              label="كود المنتج / المادة"
              value={materialCode}
              onChange={setMaterialCode}
              placeholder="MAT-SG-CURL-400"
              error={submitted ? errors.materialCode : undefined}
            />
            <Field
              label="العلامة التجارية"
              value={brand}
              onChange={setBrand}
              placeholder="Sheglam"
              error={submitted ? errors.brand : undefined}
            />
            <Field
              label="الباركود"
              value={barcode}
              onChange={setBarcode}
              placeholder="8901234567891"
              error={submitted ? errors.barcode : undefined}
            />
            <Field
              label="كود المنتج لدى التاجر"
              value={vendorCode}
              onChange={setVendorCode}
              placeholder="SG-CRL-400-SL"
              error={submitted ? errors.vendorCode : undefined}
            />
          </div>
        </div>
        <label className="product-form-field">
          <span>الوصف</span>
          <textarea
            className="product-textarea"
            value={description}
            placeholder="اكتب وصف المنتج وشروط الاستخدام المهمة."
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </section>

      <section className="product-section">
        <h2>التصنيف والسعر</h2>
        <div className="product-details-grid">
          <div className="product-field-stack">
            {[0, 1, 2, 3].map((level) => (
              <SelectBox
                key={level}
                label={`مستوى التصنيف ${level + 1}`}
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
              label="سعر البيع IQD"
              type="number"
              value={sellingPrice}
              onChange={setSellingPrice}
              placeholder="49000"
              error={submitted ? errors.sellingPrice : undefined}
            />
            <Field
              label="سعر الكلفة IQD"
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
              <strong>{largeProduct ? "منتج كبير" : "منتج صغير/عادي"}</strong>
            </button>
          </div>
        </div>
      </section>

      <section className="product-section product-images-section">
        <div className="section-copy">
          <h2>صور المنتج</h2>
          <p>الصورة الأولى هي الصورة الرئيسية. يفضل رفع صور واضحة بخلفية بيضاء.</p>
        </div>
        <div className="image-dropzone">
          <UploadCloud aria-hidden="true" size={48} strokeWidth={2.2} />
          <strong>اسحب الصور هنا أو اضغط للرفع</strong>
          <span>PNG أو JPG - حتى 10 صور</span>
        </div>
      </section>

      <section className="product-section">
        <div className="section-copy">
          <h2>الألوان والأحجام والكميات</h2>
          <p>يمكن إضافة أكثر من لون، وكل لون يحتوي صفوف حجم وكمية.</p>
        </div>
        {submitted && (errors.colors || errors.sizes) ? (
          <em className="form-error">{errors.colors || errors.sizes}</em>
        ) : null}
        <div className="color-variant-stack">
          {colors.map((color) => (
            <article className="color-variant-card" key={color.id}>
              <div className="color-variant-header">
                <label>
                  <span>كود اللون</span>
                  <input
                    type="color"
                    value={color.code}
                    onChange={(event) => updateColor(color.id, { code: event.target.value })}
                  />
                </label>
                <label>
                  <span>اسم اللون</span>
                  <input
                    value={color.name}
                    onChange={(event) => updateColor(color.id, { name: event.target.value })}
                  />
                </label>
                <button
                  className="row-action-btn reject-btn"
                  type="button"
                  aria-label="حذف اللون"
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
                      <span>الحجم</span>
                      <input
                        value={size.size}
                        onChange={(event) =>
                          updateSize(color.id, size.id, { size: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      <span>الكمية</span>
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
                إضافة حجم
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
          <span>إضافة لون</span>
        </button>
      </section>

      <section className="product-section">
        <h2>مراجعة قبل الحفظ</h2>
        <div className="review-grid">
          <span><Tag aria-hidden="true" size={15} /> {nameAr || "اسم المنتج"}</span>
          <span><Barcode aria-hidden="true" size={15} /> {barcode || "باركود"}</span>
          <span>{category.filter(Boolean).join(" / ")}</span>
          <span>{colors.length} لون / {colors.reduce((sum, color) => sum + color.sizes.length, 0)} حجم</span>
        </div>
      </section>
    </div>
  );
}
