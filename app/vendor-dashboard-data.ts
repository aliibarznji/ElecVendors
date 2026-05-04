export type ProductStatus = "published" | "unpublished" | "review";
export type OrderStatus = "new" | "ready" | "shipped" | "delivered" | "cancelled";
export type DiscountStatus = "active" | "scheduled" | "inactive";
export type CampaignStatus = "pending" | "active" | "completed" | "rejected";

export const todayIso = "2026-05-04";

export type ProductColorVariant = {
  code: string;
  nameAr: string;
  nameEn: string;
  sizes: { size: string; quantity: number }[];
};

export type VendorProduct = {
  id: string;
  vendorId: string;
  nameAr: string;
  nameEn: string;
  highlights: string;
  description: string;
  keywords: string[];
  materialCode: string;
  sku: string;
  barcode: string;
  vendorCode: string;
  brand: string;
  categoryLevels: [string, string, string, string];
  sellingPrice: number;
  costPrice: number;
  commissionPct: number;
  discountPlanStatus: "none" | "active" | "scheduled";
  largeProduct: boolean;
  status: ProductStatus;
  quantity: number;
  colors: ProductColorVariant[];
  imageTone: string;
  createdAt: string;
  lockedCommission?: boolean;
};

export type VendorOrder = {
  id: string;
  orderNumber: string;
  dateTime: string;
  productId: string;
  quantity: number;
  color: string;
  size: string;
  priceWithoutCommission: number;
  priceWithCommission: number;
  status: OrderStatus;
  city: string;
  province: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryStatus: string;
  paymentMethod: string;
  deliveryAgent: string;
};

export type DiscountPlan = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  productIds: string[];
  sales: number;
  itemsSold: Record<string, number>;
};

export type SettlementBatch = {
  id: string;
  settlementNumber: string;
  date: string;
  paymentMethod: string;
  status: "paid" | "remaining";
  itemIds: string[];
};

export type MarketingPackage = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  channels: string[];
  details: string[];
};

export type MarketingCampaign = {
  id: string;
  packageId: string;
  vendorId: string;
  code: string;
  status: CampaignStatus;
  purchasedAt: string;
  startsAt?: string;
  endsAt?: string;
  views: number;
  clicks: number;
  sales: number;
  reach: number;
};

export const vendorProfile = {
  id: "68c7c5e47bd93a0041cfb75b",
  reference: "VEN-2024-00068",
  name: "Sheglam Iraq",
  accountManager: "سارة محمد",
  joinedAt: "2024-03-12",
  email: "beautifulgril2294@gmail.com",
  phone: "+964 750 493 0644",
  companyLocation: "أربيل، إقليم كردستان، العراق",
  warehouses: [
    {
      name: "مخزن أربيل الرئيسي",
      address: "52R4+8H2, Erbil, Erbil Governorate, Iraq",
      phone: "+964 750 493 0644",
      openingDays: "السبت - الخميس",
      openingTime: "10:00",
      closingTime: "17:00",
    },
    {
      name: "مخزن بغداد الاحتياطي",
      address: "المنصور، بغداد",
      phone: "+964 770 145 8800",
      openingDays: "الأحد - الخميس",
      openingTime: "09:00",
      closingTime: "16:00",
    },
  ],
  deliveryMechanism: "company" as const,
  points: { earned: 1240, redeemed: 320, balance: 920 },
  performance: {
    processingSpeedHours: 4.2,
    cancellationRate: 1.8,
    customerRating: 4.6,
    uploadActivity: 32,
  },
};

export const products: VendorProduct[] = [
  {
    id: "prod-1",
    vendorId: vendorProfile.reference,
    nameAr: "مكواة تجعيد الشعر شيجلام 400 واط - فضي",
    nameEn: "Sheglam It-Curl One Curling Iron - 400 W - Silver",
    highlights: "تسخين سريع، طبقة سيراميك، إيقاف تلقائي",
    description: "مكواة تجعيد خفيفة مناسبة للاستخدام اليومي مع تحكم ثابت بالحرارة.",
    keywords: ["sheglam", "curling iron", "beauty", "مكواة شعر"],
    materialCode: "MAT-SG-CURL-400",
    sku: "sv2411203071322707",
    barcode: "8901234567891",
    vendorCode: "SG-CRL-400-SL",
    brand: "Sheglam",
    categoryLevels: ["الجمال", "العناية بالشعر", "أجهزة الشعر", "مكاوي التجعيد"],
    sellingPrice: 49000,
    costPrice: 45085,
    commissionPct: 8,
    discountPlanStatus: "active",
    largeProduct: false,
    status: "published",
    quantity: 12,
    colors: [
      {
        code: "#c7ccd4",
        nameAr: "فضي",
        nameEn: "Silver",
        sizes: [{ size: "قياسي", quantity: 12 }],
      },
    ],
    imageTone: "#d7dce6",
    createdAt: "2026-04-20",
  },
  {
    id: "prod-2",
    vendorId: vendorProfile.reference,
    nameAr: "مجفف شعر الكترومول 2000 واط - أسود",
    nameEn: "Electromall Hair Dryer 2000W - Black",
    highlights: "قوة عالية، هواء بارد، ثلاث سرعات",
    description: "مجفف شعر عملي للصالونات والاستخدام المنزلي مع فوهة تركيز.",
    keywords: ["dryer", "hair", "salon", "مجفف"],
    materialCode: "MAT-EM-DRY-2000",
    sku: "em-dry-90-bk",
    barcode: "8901234567892",
    vendorCode: "EM-DRY-2000",
    brand: "Electromall",
    categoryLevels: ["الجمال", "العناية بالشعر", "أجهزة الشعر", "مجففات"],
    sellingPrice: 65000,
    costPrice: 56000,
    commissionPct: 10,
    discountPlanStatus: "none",
    largeProduct: false,
    status: "review",
    quantity: 0,
    colors: [
      {
        code: "#222831",
        nameAr: "أسود",
        nameEn: "Black",
        sizes: [{ size: "قياسي", quantity: 0 }],
      },
    ],
    imageTone: "#222831",
    createdAt: "2026-05-01",
    lockedCommission: true,
  },
  {
    id: "prod-3",
    vendorId: vendorProfile.reference,
    nameAr: "ماكينة تهذيب براون صغيرة - أحمر",
    nameEn: "Braun Mini Trimmer - Red",
    highlights: "بطارية قابلة للشحن، رأس دقيق، حقيبة صغيرة",
    description: "ماكينة تهذيب صغيرة للسفر والعناية اليومية.",
    keywords: ["braun", "trimmer", "grooming", "ماكينة"],
    materialCode: "MAT-BR-TRIM-09",
    sku: "br-trim-09-rd",
    barcode: "8901234567893",
    vendorCode: "BR-TR-09-R",
    brand: "Braun",
    categoryLevels: ["الإلكترونيات", "العناية الشخصية", "حلاقة", "ماكينات تهذيب"],
    sellingPrice: 21000,
    costPrice: 18000,
    commissionPct: 8,
    discountPlanStatus: "scheduled",
    largeProduct: false,
    status: "published",
    quantity: 5,
    colors: [
      {
        code: "#d94b4b",
        nameAr: "أحمر",
        nameEn: "Red",
        sizes: [{ size: "قياسي", quantity: 5 }],
      },
    ],
    imageTone: "#d94b4b",
    createdAt: "2026-04-18",
  },
  {
    id: "prod-4",
    vendorId: vendorProfile.reference,
    nameAr: "سماعات اورايمو لاسلكية - أبيض",
    nameEn: "Oraimo Wireless Buds - White",
    highlights: "بلوتوث 5.3، علبة شحن، مقاومة رذاذ",
    description: "سماعات لاسلكية خفيفة بصوت واضح للاستخدام اليومي.",
    keywords: ["oraimo", "buds", "audio", "سماعات"],
    materialCode: "MAT-OR-BUD-12",
    sku: "or-buds-12-wh",
    barcode: "8901234567894",
    vendorCode: "OR-BUD-12-W",
    brand: "Oraimo",
    categoryLevels: ["الإلكترونيات", "الصوت", "سماعات", "لاسلكية"],
    sellingPrice: 38000,
    costPrice: 32000,
    commissionPct: 9,
    discountPlanStatus: "none",
    largeProduct: false,
    status: "unpublished",
    quantity: 24,
    colors: [
      {
        code: "#f4f6f8",
        nameAr: "أبيض",
        nameEn: "White",
        sizes: [{ size: "قياسي", quantity: 24 }],
      },
    ],
    imageTone: "#eef2f6",
    createdAt: "2026-04-25",
  },
];

export const orders: VendorOrder[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-100214",
    dateTime: "2026-05-02 09:14",
    productId: "prod-1",
    quantity: 1,
    color: "فضي",
    size: "قياسي",
    priceWithoutCommission: 49000,
    priceWithCommission: 52920,
    status: "new",
    city: "الكرادة",
    province: "بغداد",
    customerName: "مريم ك.",
    customerPhone: "+964 770 145 8800",
    customerAddress: "الكرادة، بغداد",
    deliveryStatus: "بانتظار تأكيد العميل",
    paymentMethod: "الدفع عند الاستلام",
    deliveryAgent: "مندوب بغداد 1",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-100221",
    dateTime: "2026-05-02 11:42",
    productId: "prod-4",
    quantity: 2,
    color: "أبيض",
    size: "قياسي",
    priceWithoutCommission: 38000,
    priceWithCommission: 41420,
    status: "ready",
    city: "عنكاوا",
    province: "أربيل",
    customerName: "حسن أ.",
    customerPhone: "+964 750 332 1140",
    customerAddress: "عنكاوا، أربيل",
    deliveryStatus: "جاهز للتسليم للمندوب",
    paymentMethod: "محفظة فاست باي",
    deliveryAgent: "مندوب أربيل",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-100222",
    dateTime: "2026-05-03 08:01",
    productId: "prod-3",
    quantity: 1,
    color: "أحمر",
    size: "قياسي",
    priceWithoutCommission: 21000,
    priceWithCommission: 22680,
    status: "shipped",
    city: "الحمراء",
    province: "البصرة",
    customerName: "علي ر.",
    customerPhone: "+964 780 998 7321",
    customerAddress: "الحمراء، البصرة",
    deliveryStatus: "تم الشحن",
    paymentMethod: "بطاقة",
    deliveryAgent: "مندوب البصرة",
  },
  {
    id: "ord-4",
    orderNumber: "ORD-100190",
    dateTime: "2026-04-28 16:25",
    productId: "prod-1",
    quantity: 3,
    color: "فضي",
    size: "قياسي",
    priceWithoutCommission: 49000,
    priceWithCommission: 52920,
    status: "delivered",
    city: "المنصور",
    province: "بغداد",
    customerName: "نور س.",
    customerPhone: "+964 771 220 4441",
    customerAddress: "المنصور، بغداد",
    deliveryStatus: "تم التسليم",
    paymentMethod: "الدفع عند الاستلام",
    deliveryAgent: "مندوب بغداد 2",
  },
  {
    id: "ord-5",
    orderNumber: "ORD-100151",
    dateTime: "2026-04-14 12:10",
    productId: "prod-2",
    quantity: 1,
    color: "أسود",
    size: "قياسي",
    priceWithoutCommission: 65000,
    priceWithCommission: 71500,
    status: "cancelled",
    city: "النجف",
    province: "النجف",
    customerName: "سجاد م.",
    customerPhone: "+964 772 445 1000",
    customerAddress: "شارع الروان، النجف",
    deliveryStatus: "ملغي من العميل",
    paymentMethod: "الدفع عند الاستلام",
    deliveryAgent: "مندوب النجف",
  },
  {
    id: "ord-6",
    orderNumber: "ORD-099944",
    dateTime: "2026-03-21 15:40",
    productId: "prod-4",
    quantity: 4,
    color: "أبيض",
    size: "قياسي",
    priceWithoutCommission: 38000,
    priceWithCommission: 41420,
    status: "delivered",
    city: "السليمانية",
    province: "السليمانية",
    customerName: "دانا ك.",
    customerPhone: "+964 770 212 3000",
    customerAddress: "سالم، السليمانية",
    deliveryStatus: "تم التسليم",
    paymentMethod: "زين كاش",
    deliveryAgent: "مندوب السليمانية",
  },
];

export const discountPlans: DiscountPlan[] = [
  {
    id: "disc-1",
    name: "خصم الجمال لشهر أيار",
    startDate: "2026-05-01",
    endDate: "2026-05-15",
    productIds: ["prod-1", "prod-3"],
    sales: 322300,
    itemsSold: { "prod-1": 4, "prod-3": 1 },
  },
  {
    id: "disc-2",
    name: "عروض العيد",
    startDate: "2026-06-01",
    endDate: "2026-06-10",
    productIds: ["prod-4"],
    sales: 0,
    itemsSold: { "prod-4": 0 },
  },
];

export const settlements: SettlementBatch[] = [
  {
    id: "set-1",
    settlementNumber: "SET-2026-00041",
    date: "2026-04-30",
    paymentMethod: "تحويل مصرفي",
    status: "paid",
    itemIds: ["ord-4"],
  },
  {
    id: "set-2",
    settlementNumber: "SET-2026-00042",
    date: "2026-05-05",
    paymentMethod: "نقدي",
    status: "remaining",
    itemIds: ["ord-1", "ord-2", "ord-3"],
  },
];

export const marketingPackages: MarketingPackage[] = [
  {
    id: "pkg-starter",
    name: "باقة البداية",
    price: 250,
    durationDays: 5,
    channels: ["Facebook", "Instagram"],
    details: ["منشور واحد", "قصتان", "تصميم مواد الحملة"],
  },
  {
    id: "pkg-bronze",
    name: "الباقة البرونزية",
    price: 500,
    durationDays: 7,
    channels: ["Facebook", "Instagram", "Push"],
    details: ["أسبوع حملة", "منشوران", "قصتان", "إشعار تطبيق"],
  },
  {
    id: "pkg-silver",
    name: "الباقة الفضية",
    price: 1000,
    durationDays: 14,
    channels: ["Facebook", "Instagram", "Ads", "Push"],
    details: ["أسبوعان", "إعلانات ممولة", "إشعارات", "تقرير أداء"],
  },
  {
    id: "pkg-gold",
    name: "الباقة الذهبية",
    price: 2000,
    durationDays: 30,
    channels: ["Facebook", "Instagram", "Ads", "Push", "Banner"],
    details: ["شهر كامل", "بانر رئيسي", "إعلانات ممولة", "تقرير تفصيلي"],
  },
];

export const marketingCampaigns: MarketingCampaign[] = [
  {
    id: "camp-1",
    packageId: "pkg-silver",
    vendorId: vendorProfile.reference,
    code: "EM-SIL-2401",
    status: "active",
    purchasedAt: "2026-05-01",
    startsAt: "2026-05-02",
    endsAt: "2026-05-16",
    views: 184210,
    clicks: 9842,
    sales: 312,
    reach: 521300,
  },
  {
    id: "camp-2",
    packageId: "pkg-bronze",
    vendorId: vendorProfile.reference,
    code: "EM-BRZ-2290",
    status: "pending",
    purchasedAt: "2026-05-03",
    views: 0,
    clicks: 0,
    sales: 0,
    reach: 0,
  },
  {
    id: "camp-3",
    packageId: "pkg-starter",
    vendorId: vendorProfile.reference,
    code: "EM-STR-1108",
    status: "completed",
    purchasedAt: "2026-04-01",
    startsAt: "2026-04-02",
    endsAt: "2026-04-07",
    views: 64210,
    clicks: 2842,
    sales: 84,
    reach: 142300,
  },
];

export const deliveryPrices = [
  { province: "بغداد", small: 3000, large: 7000, freeRule: "مجاني للطلبات فوق 150,000 د.ع" },
  { province: "البصرة", small: 4000, large: 8500, freeRule: "" },
  { province: "أربيل", small: 3500, large: 7500, freeRule: "مجاني للباقات التسويقية الذهبية" },
  { province: "النجف", small: 3500, large: 8000, freeRule: "" },
  { province: "كربلاء", small: 3500, large: 8000, freeRule: "" },
  { province: "السليمانية", small: 4000, large: 8500, freeRule: "" },
  { province: "نينوى", small: 4500, large: 9500, freeRule: "" },
  { province: "دهوك", small: 4500, large: 9500, freeRule: "" },
];

export function formatIqd(value: number) {
  return `${Math.round(value).toLocaleString("en-US")} د.ع`;
}

export function getProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

export function getMonthlyOrders(month = "2026-05", source = orders) {
  return source.filter((order) => order.dateTime.startsWith(month)).length;
}

export function getMonthlySales(month = "2026-05", source = orders) {
  return source
    .filter((order) => order.dateTime.startsWith(month) && order.status !== "cancelled")
    .reduce((sum, order) => sum + order.priceWithCommission * order.quantity, 0);
}

export function getNetSales(source = orders) {
  return source
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.priceWithoutCommission * order.quantity, 0);
}

export function getPendingOrders(source = orders) {
  return source.filter((order) => order.status === "new").length;
}

export function getCancelledOrders(month = "2026-05", source = orders) {
  return source.filter(
    (order) => order.dateTime.startsWith(month) && order.status === "cancelled",
  ).length;
}

export function ordersByMonth(source = orders) {
  const labels = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05"];
  const names = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار"];
  return labels.map((month, index) => ({
    label: names[index],
    value: source.filter((order) => order.dateTime.startsWith(month)).length,
  }));
}

export function salesByMonth(source = orders) {
  return ordersByMonth(source).map((bucket) => {
    const monthIndex = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار"].indexOf(
      bucket.label,
    );
    const key = `2026-${String(monthIndex + 1).padStart(2, "0")}`;
    return {
      label: bucket.label,
      value: getMonthlySales(key, source),
    };
  });
}

export function salesByProvince(source = orders) {
  const map = new Map<string, { province: string; orders: number; sales: number }>();
  source
    .filter((order) => order.status !== "cancelled")
    .forEach((order) => {
      const current = map.get(order.province) ?? {
        province: order.province,
        orders: 0,
        sales: 0,
      };
      current.orders += 1;
      current.sales += order.priceWithCommission * order.quantity;
      map.set(order.province, current);
    });
  return [...map.values()].sort((a, b) => b.sales - a.sales);
}

export function bestSellingProducts(source = orders) {
  const map = new Map<string, number>();
  source
    .filter((order) => order.status !== "cancelled")
    .forEach((order) => {
      map.set(order.productId, (map.get(order.productId) ?? 0) + order.quantity);
    });
  return [...map.entries()]
    .map(([productId, sold]) => ({ product: getProduct(productId), sold }))
    .filter((item): item is { product: VendorProduct; sold: number } => Boolean(item.product))
    .sort((a, b) => b.sold - a.sold);
}

export function filterProducts(
  source: VendorProduct[],
  status: ProductStatus | "all",
  query: string,
) {
  const normalized = query.trim().toLowerCase();
  return source.filter((product) => {
    if (status !== "all" && product.status !== status) return false;
    if (!normalized) return true;
    return [
      product.nameAr,
      product.nameEn,
      product.sku,
      product.barcode,
      product.vendorCode,
      product.brand,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized);
  });
}

export function filterOrders(
  source: VendorOrder[],
  status: OrderStatus | "all",
  query: string,
  from?: string,
  to?: string,
  sort: "newest" | "oldest" | "amount" = "newest",
) {
  const normalized = query.trim().toLowerCase();
  const filtered = source.filter((order) => {
    const product = getProduct(order.productId);
    if (status !== "all" && order.status !== status) return false;
    if (from && order.dateTime.slice(0, 10) < from) return false;
    if (to && order.dateTime.slice(0, 10) > to) return false;
    if (!normalized) return true;
    return [
      order.orderNumber,
      order.customerName,
      order.customerPhone,
      order.province,
      order.city,
      product?.sku,
      product?.nameAr,
      product?.nameEn,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized);
  });

  return filtered.sort((a, b) => {
    if (sort === "oldest") return a.dateTime.localeCompare(b.dateTime);
    if (sort === "amount") {
      return b.priceWithCommission * b.quantity - a.priceWithCommission * a.quantity;
    }
    return b.dateTime.localeCompare(a.dateTime);
  });
}

export function validatePricing(
  product: Pick<VendorProduct, "costPrice" | "sellingPrice" | "commissionPct" | "lockedCommission">,
  next: { costPrice: number; sellingPrice: number; commissionPct: number },
) {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Number.isFinite(next.costPrice) || next.costPrice <= 0) {
    errors.push("سعر الكلفة مطلوب ويجب أن يكون أكبر من صفر.");
  }
  if (!Number.isFinite(next.sellingPrice) || next.sellingPrice <= 0) {
    errors.push("سعر البيع مطلوب ويجب أن يكون أكبر من صفر.");
  }
  if (next.sellingPrice < next.costPrice) {
    errors.push("سعر البيع لا يمكن أن يكون أقل من سعر الكلفة.");
  }
  if (next.commissionPct < 0 || next.commissionPct > 40) {
    errors.push("نسبة العمولة يجب أن تكون بين 0% و 40%.");
  }
  if (product.lockedCommission && next.commissionPct !== product.commissionPct) {
    warnings.push("هذا المنتج مرتبط باتفاق عمولة خاص ولا يمكن تغيير النسبة مباشرة.");
  }
  if (product.lockedCommission && next.sellingPrice !== product.sellingPrice) {
    warnings.push("تغيير السعر يحتاج موافقة مدير الحساب بسبب العمولة المثبتة.");
  }

  return { valid: errors.length === 0 && warnings.length === 0, errors, warnings };
}

export function validateStockUpdate(quantity: number) {
  const errors: string[] = [];
  if (!Number.isInteger(quantity)) errors.push("الكمية يجب أن تكون رقما صحيحا.");
  if (quantity < 0) errors.push("الكمية لا يمكن أن تكون سالبة.");
  return {
    valid: errors.length === 0,
    errors,
    status: quantity > 0 ? "available" : "out-of-stock",
  };
}

export function validateBulkUpdateRow(
  row: {
    sku?: string;
    nameChanged?: boolean;
    codeChanged?: boolean;
    sellingPrice?: number;
    costPrice?: number;
    quantity?: number;
  },
  mode: "prices" | "stock",
) {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!row.sku) errors.push("SKU مطلوب في كل صف.");
  if (row.nameChanged || row.codeChanged) {
    errors.push("لا يسمح بتغيير اسم المنتج أو كوده من بوابة التحديثات.");
  }
  if (mode === "prices") {
    if (row.sellingPrice === undefined || row.costPrice === undefined) {
      errors.push("ملفات الأسعار يجب أن تحتوي سعر البيع وسعر الكلفة.");
    } else if (row.sellingPrice < row.costPrice) {
      errors.push("سعر البيع في الملف أقل من سعر الكلفة.");
    }
  }
  if (mode === "stock") {
    const stock = validateStockUpdate(row.quantity ?? Number.NaN);
    errors.push(...stock.errors);
  }
  if (row.sku && !products.some((product) => product.sku === row.sku)) {
    warnings.push("الصف يشير إلى SKU غير موجود؛ لن يتم إنشاء منتجات جديدة هنا.");
  }
  return { valid: errors.length === 0, errors, warnings };
}

export function getDiscountStatus(plan: Pick<DiscountPlan, "startDate" | "endDate">, now = todayIso): DiscountStatus {
  if (now < plan.startDate) return "scheduled";
  if (now > plan.endDate) return "inactive";
  return "active";
}

export function filterSettlements(
  source: SettlementBatch[],
  date: string,
  paymentMethod: string,
) {
  return source.filter((settlement) => {
    if (date && settlement.date !== date) return false;
    if (paymentMethod && paymentMethod !== "all" && settlement.paymentMethod !== paymentMethod) {
      return false;
    }
    return true;
  });
}

export function settlementAmount(settlement: SettlementBatch) {
  return settlement.itemIds.reduce((sum, orderId) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return sum;
    return sum + order.priceWithoutCommission * order.quantity;
  }, 0);
}

export function generateVendorReference(rawId: string, existing: string[] = []) {
  const digits = rawId.replace(/\D/g, "").slice(0, 5).padStart(5, "0");
  let candidate = `VEN-2026-${digits}`;
  let counter = 1;
  while (existing.includes(candidate)) {
    candidate = `VEN-2026-${digits}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export function getCampaignRemaining(
  campaign: Pick<MarketingCampaign, "endsAt" | "status">,
  now = `${todayIso}T12:00:00.000Z`,
) {
  if (campaign.status !== "active" || !campaign.endsAt) return null;
  const remaining = new Date(`${campaign.endsAt}T23:59:59.000Z`).getTime() - new Date(now).getTime();
  if (remaining <= 0) return { days: 0, hours: 0 };
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
  };
}
