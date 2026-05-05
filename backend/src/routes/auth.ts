import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { requireAuth, signToken, type AuthRequest } from "../middleware/auth.js";
import { loginSchema, signupSchema } from "../schemas/index.js";
import { config } from "../config.js";

const router = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const vendor = await db.vendor.findUnique({ where: { email } });
    if (!vendor) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, vendor.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken(vendor.id);
    res.cookie("token", token, COOKIE_OPTS);
    res.json({
      id: vendor.id,
      reference: vendor.reference,
      name: vendor.name,
      email: vendor.email,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);

    const existing = await db.vendor.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const reference = `V-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const vendor = await db.vendor.create({
      data: {
        reference,
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyLocation: data.companyLocation,
        joinedAt: new Date(),
        accountManager: "",
        deliveryMechanism: "",
        passwordHash,
      },
    });

    const token = signToken(vendor.id);
    res.cookie("token", token, COOKIE_OPTS);
    res.status(201).json({
      id: vendor.id,
      reference: vendor.reference,
      name: vendor.name,
      email: vendor.email,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const vendor = await db.vendor.findUnique({
      where: { id: req.vendorId },
      select: { id: true, reference: true, name: true, email: true },
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

export default router;
