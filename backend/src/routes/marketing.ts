import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { campaignCreateSchema } from "../schemas/index.js";

const router = Router();

router.get("/packages", async (_req, res, next) => {
  try {
    const packages = await db.marketingPackage.findMany({ orderBy: { price: "asc" } });
    res.json(packages);
  } catch (err) {
    next(err);
  }
});

router.get("/campaigns", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const campaigns = await db.marketingCampaign.findMany({
      where: { vendorId: req.vendorId },
      include: { package: true },
      orderBy: { purchasedAt: "desc" },
    });
    res.json(campaigns);
  } catch (err) {
    next(err);
  }
});

router.post("/campaigns", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { packageId } = campaignCreateSchema.parse(req.body);

    const pkg = await db.marketingPackage.findUnique({ where: { id: packageId } });
    if (!pkg) {
      res.status(404).json({ error: "Package not found" });
      return;
    }

    const vendor = await db.vendor.findUnique({
      where: { id: req.vendorId },
      select: { reference: true },
    });

    const code = `EM-${pkg.name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const campaign = await db.marketingCampaign.create({
      data: {
        packageId,
        vendorId: req.vendorId!,
        code,
        status: "pending",
      },
      include: { package: true },
    });

    res.status(201).json(campaign);
  } catch (err) {
    next(err);
  }
});

export default router;
