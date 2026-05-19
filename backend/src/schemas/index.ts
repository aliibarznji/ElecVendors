import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

export const signupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  phone: z.string().trim().min(3).max(40),
  companyLocation: z.string().trim().min(1).max(200),
});

export const productCreateSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  nameKu: z.string().default(""),
  highlights: z.string().default(""),
  description: z.string().default(""),
  descriptionAr: z.string().default(""),
  descriptionKu: z.string().default(""),
  warrantyEn: z.string().default(""),
  warrantyAr: z.string().default(""),
  warrantyKu: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  materialCode: z.string().default(""),
  sku: z.string().min(1),
  barcode: z.string().default(""),
  vendorCode: z.string().default(""),
  brand: z.string().default(""),
  categoryLevel1: z.string().default(""),
  categoryLevel2: z.string().default(""),
  categoryLevel3: z.string().default(""),
  categoryLevel4: z.string().default(""),
  giniCategory: z.string().default(""),
  marketingCategory: z.string().default(""),
  shippingCategory: z.string().default(""),
  giftType: z.string().default(""),
  purchaseLimitEnabled: z.boolean().default(false),
  purchaseLimitQty: z.number().int().min(0).default(0),
  mainImage: z.string().default(""),
  galleryImages: z.array(z.string()).default([]),
  sellingPrice: z.number().positive(),
  costPrice: z.number().positive(),
  commissionPct: z.number().min(0).max(40),
  largeProduct: z.boolean().default(false),
  imageTone: z.string().default(""),
  colors: z
    .array(
      z.object({
        code: z.string(),
        nameAr: z.string(),
        nameEn: z.string(),
        sizes: z.array(z.object({ size: z.string(), quantity: z.number().int().min(0) })),
      }),
    )
    .default([]),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  status: z.enum(["published", "unpublished", "review"]).optional(),
  discountPlanStatus: z.string().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(["new", "ready", "shipped", "delivered", "cancelled"]),
});

export const discountPlanCreateSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  productIds: z.array(z.string()).default([]),
  discountPct: z.number().min(0).max(100).default(0),
});

export const campaignCreateSchema = z.object({
  packageId: z.string().min(1),
});

export const notificationReadSchema = z.object({
  read: z.boolean(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  companyLocation: z.string().optional(),
  deliveryMechanism: z.string().optional(),
  warehouses: z
    .array(
      z.object({
        name: z.string(),
        address: z.string(),
        phone: z.string(),
        openingDays: z.string(),
        openingTime: z.string(),
        closingTime: z.string(),
      }),
    )
    .optional(),
});
