import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { discountPlanCreateSchema } from "../schemas/index.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const plans = await db.discountPlan.findMany({
      where: { vendorId: req.vendorId },
      orderBy: { startDate: "desc" },
    });
    res.json(plans);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = discountPlanCreateSchema.parse(req.body);

    const productsExist = await db.product.count({
      where: { id: { in: data.productIds }, vendorId: req.vendorId },
    });
    if (productsExist !== data.productIds.length) {
      res.status(400).json({ error: "One or more product IDs are invalid" });
      return;
    }

    const plan = await db.discountPlan.create({
      data: {
        vendorId: req.vendorId!,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        productIds: data.productIds,
      },
    });

    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const existing = await db.discountPlan.findFirst({
      where: { id, vendorId: req.vendorId },
    });
    if (!existing) {
      res.status(404).json({ error: "Discount plan not found" });
      return;
    }
    await db.discountPlan.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
