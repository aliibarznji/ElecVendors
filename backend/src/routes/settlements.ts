import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { status, date, paymentMethod } = req.query as Record<string, string>;

    const where: Record<string, unknown> = { vendorId: req.vendorId };
    if (status && status !== "all") where.status = status;
    if (paymentMethod && paymentMethod !== "all") where.paymentMethod = paymentMethod;
    if (date) {
      where.date = {
        gte: new Date(date),
        lte: new Date(`${date}T23:59:59`),
      };
    }

    const items = await db.settlement.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const itemsWithAmount = await Promise.all(
      items.map(async (settlement) => {
        const orders = await db.order.findMany({
          where: { id: { in: settlement.itemIds } },
          select: { id: true, priceWithoutCommission: true, quantity: true },
        });
        const amount = orders.reduce(
          (sum, o) => sum + o.priceWithoutCommission * o.quantity,
          0,
        );
        return { ...settlement, amount };
      }),
    );

    res.json(itemsWithAmount);
  } catch (err) {
    next(err);
  }
});

export default router;
