import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { profileUpdateSchema } from "../schemas/index.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const vendor = await db.vendor.findUnique({
      where: { id: req.vendorId },
      include: { warehouses: true },
      omit: { passwordHash: true },
    });
    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }
    res.json(vendor);
  } catch (err) {
    next(err);
  }
});

router.patch("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = profileUpdateSchema.parse(req.body);
    const { warehouses, ...vendorFields } = data;

    const vendor = await db.$transaction(async (tx) => {
      const updated = await tx.vendor.update({
        where: { id: req.vendorId },
        data: vendorFields,
      });

      if (warehouses !== undefined) {
        await tx.warehouse.deleteMany({ where: { vendorId: req.vendorId } });
        if (warehouses.length > 0) {
          await tx.warehouse.createMany({
            data: warehouses.map((w) => ({ ...w, vendorId: req.vendorId! })),
          });
        }
      }

      return tx.vendor.findUnique({
        where: { id: updated.id },
        include: { warehouses: true },
        omit: { passwordHash: true },
      });
    });

    res.json(vendor);
  } catch (err) {
    next(err);
  }
});

export default router;
