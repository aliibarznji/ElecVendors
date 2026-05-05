import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const notifications = await db.notification.findMany({
      where: { vendorId: req.vendorId },
      orderBy: { createdAt: "desc" },
    });
    const unread = notifications.filter((n) => !n.read).length;
    res.json({ items: notifications, unread });
  } catch (err) {
    next(err);
  }
});

router.patch("/read-all", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    await db.notification.updateMany({
      where: { vendorId: req.vendorId, read: false },
      data: { read: true },
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/read", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const existing = await db.notification.findFirst({
      where: { id, vendorId: req.vendorId },
    });
    if (!existing) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    const updated = await db.notification.update({
      where: { id },
      data: { read: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
