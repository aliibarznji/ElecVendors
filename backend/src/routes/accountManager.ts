import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

type LogEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  reference: string;
  details: string;
};

const sessionLog: LogEntry[] = [];
let seq = 1;

function pushLog(action: string, reference: string, details: string) {
  sessionLog.unshift({
    id: `log-${seq++}`,
    timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    user: "Account Manager",
    action,
    reference,
    details,
  });
  if (sessionLog.length > 300) sessionLog.pop();
}

// GET /api/am/orders
router.get("/orders", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { vendor, status, dateFrom, dateTo } = req.query as Record<string, string>;

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (dateFrom || dateTo) {
      where.dateTime = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(`${dateTo}T23:59:59`) } : {}),
      };
    }
    if (vendor) {
      where.vendor = { name: { contains: vendor, mode: "insensitive" } };
    }

    const orders = await db.order.findMany({
      where,
      include: {
        product: true,
        vendor: { select: { id: true, name: true, reference: true } },
      },
      orderBy: { dateTime: "desc" },
      take: 200,
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/am/orders/:orderNumber/status
router.patch("/orders/:orderNumber/status", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { orderNumber } = req.params as { orderNumber: string };
    const { status } = req.body as { status: string };

    const order = await db.order.findFirst({ where: { orderNumber } });
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    const updated = await db.order.update({
      where: { id: order.id },
      data: { status: status as never },
      include: { product: true, vendor: { select: { id: true, name: true, reference: true } } },
    });

    pushLog("Status Update", orderNumber, `Status → ${status}`);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/am/orders/:orderNumber/agent
router.patch("/orders/:orderNumber/agent", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { orderNumber } = req.params as { orderNumber: string };
    const { agent, fulfillment } = req.body as { agent?: string; fulfillment?: string };

    const order = await db.order.findFirst({ where: { orderNumber } });
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    const updated = await db.order.update({
      where: { id: order.id },
      data: {
        ...(agent !== undefined ? { deliveryAgent: agent } : {}),
        ...(fulfillment !== undefined ? { deliveryStatus: `fulfillment:${fulfillment}` } : {}),
      },
      include: { product: true, vendor: { select: { id: true, name: true, reference: true } } },
    });

    if (agent !== undefined) pushLog("Agent Assignment", orderNumber, `Agent → ${agent}`);
    if (fulfillment !== undefined) pushLog("Fulfillment Change", orderNumber, `Fulfillment → ${fulfillment}`);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// GET /api/am/pending-products
router.get("/pending-products", requireAuth, async (_req, res, next) => {
  try {
    const products = await db.product.findMany({
      where: { status: "review" },
      include: {
        vendor: { select: { id: true, name: true, reference: true } },
        colors: { include: { sizes: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/am/pending-products/:id/approve
router.patch("/pending-products/:id/approve", requireAuth, async (_req, res, next) => {
  try {
    const { id } = _req.params as { id: string };
    const product = await db.product.findUnique({ where: { id } });
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }

    const updated = await db.product.update({
      where: { id },
      data: { status: "published" },
      include: { vendor: { select: { id: true, name: true } }, colors: { include: { sizes: true } } },
    });

    pushLog("Approval", product.sku, `Approved: ${product.nameEn || product.nameAr}`);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/am/pending-products/:id/reject
router.patch("/pending-products/:id/reject", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const { reason } = req.body as { reason?: string };

    const product = await db.product.findUnique({ where: { id } });
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }

    const updated = await db.product.update({
      where: { id },
      data: { status: "unpublished" },
      include: { vendor: { select: { id: true, name: true } }, colors: { include: { sizes: true } } },
    });

    pushLog("Rejection", product.sku, reason || `Rejected: ${product.nameEn || product.nameAr}`);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// GET /api/am/campaigns
router.get("/campaigns", requireAuth, async (_req, res, next) => {
  try {
    const campaigns = await db.marketingCampaign.findMany({
      include: {
        package: true,
        vendor: { select: { id: true, name: true, reference: true } },
      },
      orderBy: { purchasedAt: "desc" },
    });
    res.json(campaigns);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/am/campaigns/:id/approve
router.patch("/campaigns/:id/approve", requireAuth, async (_req, res, next) => {
  try {
    const { id } = _req.params as { id: string };
    const campaign = await db.marketingCampaign.findUnique({ where: { id }, include: { package: true } });
    if (!campaign) { res.status(404).json({ error: "Campaign not found" }); return; }

    const today = new Date();
    const durationDays = campaign.package?.durationDays ?? 14;
    const endsAt = new Date(today.getTime() + durationDays * 86_400_000);

    const updated = await db.marketingCampaign.update({
      where: { id },
      data: { status: "active", startsAt: today, endsAt },
      include: { package: true, vendor: { select: { id: true, name: true, reference: true } } },
    });

    pushLog("Campaign Approval", campaign.code, `Approved & activated: ${campaign.code}`);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// GET /api/am/log
router.get("/log", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { action, dateFrom, dateTo, search } = req.query as Record<string, string>;

    let log = [...sessionLog];
    if (action && action !== "All") log = log.filter((e) => e.action === action);
    if (search) log = log.filter((e) =>
      e.reference.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase())
    );
    if (dateFrom) log = log.filter((e) => e.timestamp.slice(0, 10) >= dateFrom);
    if (dateTo) log = log.filter((e) => e.timestamp.slice(0, 10) <= dateTo);

    res.json(log);
  } catch (err) {
    next(err);
  }
});

export default router;
