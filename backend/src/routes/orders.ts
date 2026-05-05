import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { orderStatusSchema } from "../schemas/index.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const {
      status,
      search,
      dateFrom,
      dateTo,
      sort = "newest",
      page = "1",
      limit = "50",
    } = req.query as Record<string, string>;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: Record<string, unknown> = { vendorId: req.vendorId };

    if (status && status !== "all") where.status = status;
    if (dateFrom || dateTo) {
      where.dateTime = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(`${dateTo}T23:59:59`) } : {}),
      };
    }
    if (search) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q, mode: "insensitive" } },
        { province: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { product: { sku: { contains: q, mode: "insensitive" } } },
        { product: { nameAr: { contains: q, mode: "insensitive" } } },
        { product: { nameEn: { contains: q, mode: "insensitive" } } },
      ];
    }

    const orderBy =
      sort === "oldest"
        ? { dateTime: "asc" as const }
        : sort === "amount"
          ? { priceWithCommission: "desc" as const }
          : { dateTime: "desc" as const };

    const [items, total] = await Promise.all([
      db.order.findMany({
        where,
        include: { product: { include: { colors: { include: { sizes: true } } } } },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      db.order.count({ where }),
    ]);

    res.json({ items, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
});

router.get("/:orderNumber", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { orderNumber } = req.params as { orderNumber: string };
    const order = await db.order.findFirst({
      where: { orderNumber, vendorId: req.vendorId },
      include: { product: { include: { colors: { include: { sizes: true } } } } },
    });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.patch("/:orderNumber/status", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { orderNumber } = req.params as { orderNumber: string };
    const existing = await db.order.findFirst({
      where: { orderNumber, vendorId: req.vendorId },
    });
    if (!existing) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const { status } = orderStatusSchema.parse(req.body);
    const updated = await db.order.update({
      where: { id: existing.id },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
