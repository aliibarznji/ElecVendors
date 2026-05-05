import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  // Marketing packages — required for the campaigns feature to work
  await Promise.all([
    db.marketingPackage.upsert({
      where: { id: "pkg-starter" },
      create: { id: "pkg-starter", name: "Starter Package", price: 250, durationDays: 5, channels: ["Facebook", "Instagram"], details: ["1 Post", "2 Stories", "Campaign Materials Design"] },
      update: {},
    }),
    db.marketingPackage.upsert({
      where: { id: "pkg-bronze" },
      create: { id: "pkg-bronze", name: "Bronze Package", price: 500, durationDays: 7, channels: ["Facebook", "Instagram", "Push"], details: ["1 Week Campaign", "2 Posts", "2 Stories", "App Notification"] },
      update: {},
    }),
    db.marketingPackage.upsert({
      where: { id: "pkg-silver" },
      create: { id: "pkg-silver", name: "Silver Package", price: 1000, durationDays: 14, channels: ["Facebook", "Instagram", "Ads", "Push"], details: ["2 Weeks", "Paid Ads", "Notifications", "Performance Report"] },
      update: {},
    }),
    db.marketingPackage.upsert({
      where: { id: "pkg-gold" },
      create: { id: "pkg-gold", name: "Gold Package", price: 2000, durationDays: 30, channels: ["Facebook", "Instagram", "Ads", "Push", "Banner"], details: ["Full Month", "Main Banner", "Paid Ads", "Detailed Report"] },
      update: {},
    }),
  ]);
  console.log("Seeded marketing packages");

  // Delivery prices — required for the delivery pricing page
  const deliveryRows = [
    { province: "Baghdad",      small: 3000, large: 7000, freeRule: "Free for orders over 150,000 IQD" },
    { province: "Basra",        small: 4000, large: 8500, freeRule: "" },
    { province: "Erbil",        small: 3500, large: 7500, freeRule: "" },
    { province: "Najaf",        small: 3500, large: 8000, freeRule: "" },
    { province: "Karbala",      small: 3500, large: 8000, freeRule: "" },
    { province: "Sulaymaniyah", small: 4000, large: 8500, freeRule: "" },
    { province: "Nineveh",      small: 4500, large: 9500, freeRule: "" },
    { province: "Duhok",        small: 4500, large: 9500, freeRule: "" },
  ];
  for (const row of deliveryRows) {
    await db.deliveryPrice.upsert({ where: { province: row.province }, create: row, update: row });
  }
  console.log("Seeded delivery prices");

  // Vendor account — credentials from env, falls back to values below
  const email    = process.env.VENDOR_EMAIL    ?? "admin@electromall.com";
  const password = process.env.VENDOR_PASSWORD ?? "ChangeMe@123";
  const name     = process.env.VENDOR_NAME     ?? "Admin";

  const passwordHash = await bcrypt.hash(password, 12);
  await db.vendor.upsert({
    where: { email },
    create: {
      reference:         "VEN-0001",
      name,
      email,
      passwordHash,
      phone:             "",
      companyLocation:   "",
      joinedAt:          new Date(),
      accountManager:    "",
      deliveryMechanism: "company",
    },
    update: { passwordHash },
  });
  console.log(`Vendor account ready: ${email}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
