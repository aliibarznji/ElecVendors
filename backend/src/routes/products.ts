import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { productCreateSchema, productUpdateSchema } from "../schemas/index.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { status, search, page = "1", limit = "50" } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: Record<string, unknown> = { vendorId: req.vendorId };
    if (status && status !== "all") where.status = status;
    if (search) {
      const q = search.trim();
      where.OR = [
        { nameAr: { contains: q, mode: "insensitive" } },
        { nameEn: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { barcode: { contains: q, mode: "insensitive" } },
        { vendorCode: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { colors: { include: { sizes: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      db.product.count({ where }),
    ]);

    res.json({ items, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = productCreateSchema.parse(req.body);
    const { colors, ...productData } = data;

    const product = await db.product.create({
      data: {
        ...productData,
        vendorId: req.vendorId!,
        colors: {
          create: colors.map((c) => ({
            code: c.code,
            nameAr: c.nameAr,
            nameEn: c.nameEn,
            sizes: { create: c.sizes },
          })),
        },
      },
      include: { colors: { include: { sizes: true } } },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const product = await db.product.findFirst({
      where: { id, vendorId: req.vendorId },
      include: { colors: { include: { sizes: true } } },
    });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const existing = await db.product.findFirst({
      where: { id, vendorId: req.vendorId },
    });
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const data = productUpdateSchema.parse(req.body);
    const { colors, ...productData } = data;

    const product = await db.$transaction(async (tx) => {
      if (colors !== undefined) {
        const colorIds = await tx.productColor.findMany({
          where: { productId: id },
          select: { id: true },
        });
        await tx.productSize.deleteMany({
          where: { colorId: { in: colorIds.map((c) => c.id) } },
        });
        await tx.productColor.deleteMany({ where: { productId: id } });
        await tx.productColor.createMany({
          data: colors.map((c) => ({
            productId: id,
            code: c.code,
            nameAr: c.nameAr,
            nameEn: c.nameEn,
          })),
        });
        for (const c of colors) {
          const created = await tx.productColor.findFirst({
            where: { productId: id, code: c.code },
          });
          if (created) {
            await tx.productSize.createMany({
              data: c.sizes.map((s) => ({ colorId: created.id, size: s.size, quantity: s.quantity })),
            });
          }
        }
      }
      return tx.product.update({
        where: { id },
        data: productData,
        include: { colors: { include: { sizes: true } } },
      });
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const existing = await db.product.findFirst({
      where: { id, vendorId: req.vendorId },
    });
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const orderCount = await db.order.count({ where: { productId: id } });
    if (orderCount > 0) {
      res.status(409).json({ error: "Cannot delete a product that has orders" });
      return;
    }
    await db.product.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
