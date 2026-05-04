import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const prices = await db.deliveryPrice.findMany({ orderBy: { province: "asc" } });
    res.json(prices);
  } catch (err) {
    next(err);
  }
});

export default router;
