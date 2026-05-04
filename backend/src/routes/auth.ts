import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { requireAuth, signToken, type AuthRequest } from "../middleware/auth.js";
import { loginSchema } from "../schemas/index.js";
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
