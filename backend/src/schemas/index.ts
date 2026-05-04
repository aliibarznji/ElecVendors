import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const productCreateSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  highlights: z.string().default(""),
  description: z.string().default(""),
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
  productIds: z.array(z.string()).min(1),
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
