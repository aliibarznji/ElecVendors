export function formatIqd(value: number) {
  return `${Math.round(value).toLocaleString("en-US")} IQD`;
}

export function totalProductQty(colors: { sizes: { quantity: number }[] }[]): number {
  return colors.flatMap((c) => c.sizes).reduce((sum, s) => sum + s.quantity, 0);
}

export function salesByProvince(orders: ApiOrder[]) {
  const map = new Map<string, { province: string; orders: number; sales: number }>();
  orders
    .filter((o) => o.status !== "cancelled")
    .forEach((o) => {
      const cur = map.get(o.province) ?? { province: o.province, orders: 0, sales: 0 };
      cur.orders += 1;
      cur.sales += o.priceWithCommission * o.quantity;
      map.set(o.province, cur);
    });
  return [...map.values()].sort((a, b) => b.sales - a.sales);
}

export function bestSellingProducts(orders: ApiOrder[]) {
  const map = new Map<string, { product: ApiProduct; sold: number }>();
  orders
    .filter((o) => o.status !== "cancelled" && o.product)
    .forEach((o) => {
      const cur = map.get(o.productId) ?? { product: o.product!, sold: 0 };
      cur.sold += o.quantity;
      map.set(o.productId, cur);
    });
  return [...map.values()].sort((a, b) => b.sold - a.sold);
}

export function getDiscountStatus(startDate: string, endDate: string, now = new Date().toISOString().slice(0, 10)) {
  if (now < startDate.slice(0, 10)) return "scheduled";
  if (now > endDate.slice(0, 10)) return "inactive";
  return "active";
}

export type ApiProductColor = {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  sizes: { id: string; size: string; quantity: number }[];
};

export type ApiProduct = {
  id: string;
  vendorId: string;
  nameAr: string;
  nameEn: string;
  nameKu: string;
  highlights: string;
  description: string;
  descriptionAr: string;
  descriptionKu: string;
  warrantyEn: string;
  warrantyAr: string;
  warrantyKu: string;
  keywords: string[];
  materialCode: string;
  sku: string;
  barcode: string;
  vendorCode: string;
  brand: string;
  categoryLevel1: string;
  categoryLevel2: string;
  categoryLevel3: string;
  categoryLevel4: string;
  giniCategory: string;
  marketingCategory: string;
  shippingCategory: string;
  giftType: string;
  purchaseLimitEnabled: boolean;
  purchaseLimitQty: number;
  mainImage: string;
  galleryImages: string[];
  sellingPrice: number;
  costPrice: number;
  commissionPct: number;
  lockedCommission: boolean;
  discountPlanStatus: string;
  largeProduct: boolean;
  status: "published" | "unpublished" | "review";
  imageTone: string;
  createdAt: string;
  updatedAt: string;
  colors: ApiProductColor[];
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  dateTime: string;
  productId: string;
  product?: ApiProduct;
  vendorId: string;
  quantity: number;
  color: string;
  size: string;
  priceWithoutCommission: number;
  priceWithCommission: number;
  status: "new" | "ready" | "shipped" | "delivered" | "cancelled";
  city: string;
  province: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryStatus: string;
  paymentMethod: string;
  deliveryAgent: string;
};

export type ApiSettlement = {
  id: string;
  settlementNumber: string;
  vendorId: string;
  date: string;
  paymentMethod: string;
  status: "paid" | "remaining";
  itemIds: string[];
  amount: number;
};

export type ApiNotification = {
  id: string;
  vendorId: string;
  kind: "order" | "campaign" | "settlement" | "stock" | "system";
  title: string;
  body: string;
  read: boolean;
  href?: string;
  createdAt: string;
};

export type ApiDiscountPlan = {
  id: string;
  vendorId: string;
  name: string;
  startDate: string;
  endDate: string;
  productIds: string[];
  sales: number;
  itemsSold: Record<string, number>;
  createdAt: string;
};

export type ApiDeliveryPrice = {
  id: string;
  province: string;
  small: number;
  large: number;
  freeRule: string;
};

export type ApiMarketingPackage = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  channels: string[];
  details: string[];
};

export type ApiMarketingCampaign = {
  id: string;
  packageId: string;
  vendorId: string;
  code: string;
  status: "pending" | "active" | "completed" | "rejected";
  purchasedAt: string;
  startsAt?: string;
  endsAt?: string;
  views: number;
  clicks: number;
  sales: number;
  reach: number;
  package: ApiMarketingPackage;
};

export type ApiVendor = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  companyLocation: string;
  joinedAt: string;
  accountManager: string;
  deliveryMechanism: string;
  pointsEarned: number;
  pointsRedeemed: number;
  processingSpeedHours: number;
  cancellationRate: number;
  customerRating: number;
  uploadActivity: number;
  warehouses: ApiWarehouse[];
};

export type ApiWarehouse = {
  id: string;
  vendorId: string;
  name: string;
  address: string;
  phone: string;
  openingDays: string;
  openingTime: string;
  closingTime: string;
};
