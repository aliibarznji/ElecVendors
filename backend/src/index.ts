import "dotenv/config";
import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { db } from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import settlementRoutes from "./routes/settlements.js";
import marketingRoutes from "./routes/marketing.js";
import discountPlanRoutes from "./routes/discountPlans.js";
import deliveryPriceRoutes from "./routes/deliveryPrices.js";
import notificationRoutes from "./routes/notifications.js";

const app = express();

app.set("trust proxy", 1);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
  setHeaders: (res) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));

app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later" },
});

app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settlements", settlementRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/discount-plans", discountPlanRoutes);
app.use("/api/delivery-prices", deliveryPriceRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(`API running on http://localhost:${config.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received — shutting down`);
  server.close(async () => {
    await db.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;
