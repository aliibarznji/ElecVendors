import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  // --- Marketing packages ---
  const packages = await Promise.all([
    db.marketingPackage.upsert({
      where: { id: "pkg-starter" },
      create: {
        id: "pkg-starter",
        name: "Starter Package",
        price: 250,
        durationDays: 5,
        channels: ["Facebook", "Instagram"],
        details: ["1 Post", "2 Stories", "Campaign Materials Design"],
      },
      update: {},
    }),
    db.marketingPackage.upsert({
      where: { id: "pkg-bronze" },
      create: {
        id: "pkg-bronze",
        name: "Bronze Package",
        price: 500,
        durationDays: 7,
        channels: ["Facebook", "Instagram", "Push"],
        details: ["1 Week Campaign", "2 Posts", "2 Stories", "App Notification"],
      },
      update: {},
    }),
    db.marketingPackage.upsert({
      where: { id: "pkg-silver" },
      create: {
        id: "pkg-silver",
        name: "Silver Package",
        price: 1000,
        durationDays: 14,
        channels: ["Facebook", "Instagram", "Ads", "Push"],
        details: ["2 Weeks", "Paid Ads", "Notifications", "Performance Report"],
      },
      update: {},
    }),
    db.marketingPackage.upsert({
      where: { id: "pkg-gold" },
      create: {
        id: "pkg-gold",
        name: "Gold Package",
        price: 2000,
        durationDays: 30,
        channels: ["Facebook", "Instagram", "Ads", "Push", "Banner"],
        details: ["Full Month", "Main Banner", "Paid Ads", "Detailed Report"],
      },
      update: {},
    }),
  ]);

  console.log(`Seeded ${packages.length} marketing packages`);

  // --- Delivery prices ---
  const deliveryRows = [
    { province: "Baghdad", small: 3000, large: 7000, freeRule: "Free for orders over 150,000 IQD" },
    { province: "Basra", small: 4000, large: 8500, freeRule: "" },
    { province: "Erbil", small: 3500, large: 7500, freeRule: "Free for Gold Marketing Packages" },
    { province: "Najaf", small: 3500, large: 8000, freeRule: "" },
    { province: "Karbala", small: 3500, large: 8000, freeRule: "" },
    { province: "Sulaymaniyah", small: 4000, large: 8500, freeRule: "" },
    { province: "Nineveh", small: 4500, large: 9500, freeRule: "" },
    { province: "Duhok", small: 4500, large: 9500, freeRule: "" },
  ];

  for (const row of deliveryRows) {
    await db.deliveryPrice.upsert({
      where: { province: row.province },
      create: row,
      update: row,
    });
  }

  console.log(`Seeded ${deliveryRows.length} delivery prices`);

  // --- Vendor ---
  const passwordHash = await bcrypt.hash("Vendor@12345", 12);

  const vendor = await db.vendor.upsert({
    where: { email: "beautifulgril2294@gmail.com" },
    create: {
      id: "vendor-1",
      reference: "VEN-2024-00068",
      name: "Shex jaffar",
      email: "beautifulgril2294@gmail.com",
      phone: "+964 750 493 0644",
      companyLocation: "Erbil, Kurdistan Region, Iraq",
      joinedAt: new Date("2024-03-12"),
      accountManager: "Sarah Muhammad",
      deliveryMechanism: "company",
      passwordHash,
      pointsEarned: 1240,
      pointsRedeemed: 320,
      processingSpeedHours: 4.2,
      cancellationRate: 1.8,
      customerRating: 4.6,
      uploadActivity: 32,
      warehouses: {
        create: [
          {
            name: "Erbil Main Warehouse",
            address: "52R4+8H2, Erbil, Erbil Governorate, Iraq",
            phone: "+964 750 493 0644",
            openingDays: "Saturday - Thursday",
            openingTime: "10:00",
            closingTime: "17:00",
          },
          {
            name: "Baghdad Backup Warehouse",
            address: "Al-Mansur, Baghdad",
            phone: "+964 770 145 8800",
            openingDays: "Sunday - Thursday",
            openingTime: "09:00",
            closingTime: "16:00",
          },
        ],
      },
    },
    update: {},
  });

  console.log(`Seeded vendor: ${vendor.email}`);

  // --- Products ---
  const prod1 = await db.product.upsert({
    where: { sku: "sv2411203071322707" },
    create: {
      id: "prod-1",
      vendorId: vendor.id,
      nameAr: "مكواة تجعيل شيكس جعفر 400 واط - فضي",
      nameEn: "Shex jaffar It-Curl One Curling Iron - 400 W - Silver",
      highlights: "Quick heating, ceramic coating, auto shut-off",
      description: "Lightweight curling iron suitable for daily use with steady heat control.",
      keywords: ["sheglam", "curling iron", "beauty", "hair iron"],
      materialCode: "MAT-SG-CURL-400",
      sku: "sv2411203071322707",
      barcode: "8901234567891",
      vendorCode: "SG-CRL-400-SL",
      brand: "Sheglam",
      categoryLevel1: "Beauty",
      categoryLevel2: "Hair Care",
      categoryLevel3: "Hair Appliances",
      categoryLevel4: "Curling Irons",
      sellingPrice: 49000,
      costPrice: 45085,
      commissionPct: 8,
      discountPlanStatus: "active",
      largeProduct: false,
      status: "published",
      imageTone: "#d7dce6",
      colors: {
        create: [{
          code: "#c7ccd4",
          nameAr: "فضي",
          nameEn: "Silver",
          sizes: { create: [{ size: "Standard", quantity: 12 }] },
        }],
      },
    },
    update: {},
  });

  const prod2 = await db.product.upsert({
    where: { sku: "em-dry-90-bk" },
    create: {
      id: "prod-2",
      vendorId: vendor.id,
      nameAr: "مجفف شعر إيليكترومول 2000 واط - أسود",
      nameEn: "Electromall Hair Dryer 2000W - Black",
      highlights: "High power, cool air, three speeds",
      description: "Practical hair dryer for salons and home use with concentrating nozzle.",
      keywords: ["dryer", "hair", "salon"],
      materialCode: "MAT-EM-DRY-2000",
      sku: "em-dry-90-bk",
      barcode: "8901234567892",
      vendorCode: "EM-DRY-2000",
      brand: "Electromall",
      categoryLevel1: "Beauty",
      categoryLevel2: "Hair Care",
      categoryLevel3: "Hair Appliances",
      categoryLevel4: "Hair Dryers",
      sellingPrice: 65000,
      costPrice: 56000,
      commissionPct: 10,
      discountPlanStatus: "none",
      largeProduct: false,
      status: "review",
      imageTone: "#222831",
      lockedCommission: true,
      colors: {
        create: [{
          code: "#222831",
          nameAr: "أسود",
          nameEn: "Black",
          sizes: { create: [{ size: "Standard", quantity: 0 }] },
        }],
      },
    },
    update: {},
  });

  const prod3 = await db.product.upsert({
    where: { sku: "br-trim-09-rd" },
    create: {
      id: "prod-3",
      vendorId: vendor.id,
      nameAr: "ماكينة حلاقة براون ميني - أحمر",
      nameEn: "Braun Mini Trimmer - Red",
      highlights: "Rechargeable battery, precision head, compact case",
      description: "Compact trimmer for travel and daily grooming.",
      keywords: ["braun", "trimmer", "grooming"],
      materialCode: "MAT-BR-TRIM-09",
      sku: "br-trim-09-rd",
      barcode: "8901234567893",
      vendorCode: "BR-TR-09-R",
      brand: "Braun",
      categoryLevel1: "Electronics",
      categoryLevel2: "Personal Care",
      categoryLevel3: "Shaving",
      categoryLevel4: "Trimming Machines",
      sellingPrice: 21000,
      costPrice: 18000,
      commissionPct: 8,
      discountPlanStatus: "scheduled",
      largeProduct: false,
      status: "published",
      imageTone: "#d94b4b",
      colors: {
        create: [{
          code: "#d94b4b",
          nameAr: "أحمر",
          nameEn: "Red",
          sizes: { create: [{ size: "Standard", quantity: 5 }] },
        }],
      },
    },
    update: {},
  });

  const prod4 = await db.product.upsert({
    where: { sku: "or-buds-12-wh" },
    create: {
      id: "prod-4",
      vendorId: vendor.id,
      nameAr: "سماعات أورايمو لاسلكية - أبيض",
      nameEn: "Oraimo Wireless Buds - White",
      highlights: "Bluetooth 5.3, charging case, splash resistant",
      description: "Lightweight wireless earbuds with clear sound for daily use.",
      keywords: ["oraimo", "buds", "audio", "earbuds"],
      materialCode: "MAT-OR-BUD-12",
      sku: "or-buds-12-wh",
      barcode: "8901234567894",
      vendorCode: "OR-BUD-12-W",
      brand: "Oraimo",
      categoryLevel1: "Electronics",
      categoryLevel2: "Audio",
      categoryLevel3: "Earbuds",
      categoryLevel4: "Wireless",
      sellingPrice: 38000,
      costPrice: 32000,
      commissionPct: 9,
      discountPlanStatus: "none",
      largeProduct: false,
      status: "unpublished",
      imageTone: "#eef2f6",
      colors: {
        create: [{
          code: "#f4f6f8",
          nameAr: "أبيض",
          nameEn: "White",
          sizes: { create: [{ size: "Standard", quantity: 24 }] },
        }],
      },
    },
    update: {},
  });

  console.log("Seeded 4 products");

  // --- Orders ---
  const orderData = [
    {
      id: "ord-1",
      orderNumber: "ORD-100214",
      dateTime: new Date("2026-05-02T09:14:00"),
      productId: prod1.id,
      quantity: 1,
      color: "Silver",
      size: "Standard",
      priceWithoutCommission: 49000,
      priceWithCommission: 52920,
      status: "new" as const,
      city: "Karrada",
      province: "Baghdad",
      customerName: "Mariam K.",
      customerPhone: "+964 770 145 8800",
      customerAddress: "Karrada, Baghdad",
      deliveryStatus: "Awaiting Customer Confirmation",
      paymentMethod: "Cash on Delivery",
      deliveryAgent: "Baghdad Agent 1",
    },
    {
      id: "ord-2",
      orderNumber: "ORD-100221",
      dateTime: new Date("2026-05-02T11:42:00"),
      productId: prod4.id,
      quantity: 2,
      color: "White",
      size: "Standard",
      priceWithoutCommission: 38000,
      priceWithCommission: 41420,
      status: "ready" as const,
      city: "Ankawa",
      province: "Erbil",
      customerName: "Hassan A.",
      customerPhone: "+964 750 332 1140",
      customerAddress: "Ankawa, Erbil",
      deliveryStatus: "Ready for Delivery Agent",
      paymentMethod: "FastPay Wallet",
      deliveryAgent: "Erbil Agent",
    },
    {
      id: "ord-3",
      orderNumber: "ORD-100222",
      dateTime: new Date("2026-05-03T08:01:00"),
      productId: prod3.id,
      quantity: 1,
      color: "Red",
      size: "Standard",
      priceWithoutCommission: 21000,
      priceWithCommission: 22680,
      status: "shipped" as const,
      city: "Al-Hommra",
      province: "Basra",
      customerName: "Ali R.",
      customerPhone: "+964 780 998 7321",
      customerAddress: "Al-Hommra, Basra",
      deliveryStatus: "Shipped",
      paymentMethod: "Card",
      deliveryAgent: "Basra Agent",
    },
    {
      id: "ord-4",
      orderNumber: "ORD-100190",
      dateTime: new Date("2026-04-28T16:25:00"),
      productId: prod1.id,
      quantity: 3,
      color: "Silver",
      size: "Standard",
      priceWithoutCommission: 49000,
      priceWithCommission: 52920,
      status: "delivered" as const,
      city: "Al-Mansur",
      province: "Baghdad",
      customerName: "Nour S.",
      customerPhone: "+964 771 220 4441",
      customerAddress: "Al-Mansur, Baghdad",
      deliveryStatus: "Delivered",
      paymentMethod: "Cash on Delivery",
      deliveryAgent: "Baghdad Agent 2",
    },
    {
      id: "ord-5",
      orderNumber: "ORD-100151",
      dateTime: new Date("2026-04-14T12:10:00"),
      productId: prod2.id,
      quantity: 1,
      color: "Black",
      size: "Standard",
      priceWithoutCommission: 65000,
      priceWithCommission: 71500,
      status: "cancelled" as const,
      city: "Najaf",
      province: "Najaf",
      customerName: "Sajjad M.",
      customerPhone: "+964 772 445 1000",
      customerAddress: "Al-Rowan Street, Najaf",
      deliveryStatus: "Cancelled by Customer",
      paymentMethod: "Cash on Delivery",
      deliveryAgent: "Najaf Agent",
    },
    {
      id: "ord-6",
      orderNumber: "ORD-099944",
      dateTime: new Date("2026-03-21T15:40:00"),
      productId: prod4.id,
      quantity: 4,
      color: "White",
      size: "Standard",
      priceWithoutCommission: 38000,
      priceWithCommission: 41420,
      status: "delivered" as const,
      city: "Sulaymaniyah",
      province: "Sulaymaniyah",
      customerName: "Dana K.",
      customerPhone: "+964 770 212 3000",
      customerAddress: "Salim, Sulaymaniyah",
      deliveryStatus: "Delivered",
      paymentMethod: "Zain Cash",
      deliveryAgent: "Sulaymaniyah Agent",
    },
  ];

  for (const order of orderData) {
    await db.order.upsert({
      where: { orderNumber: order.orderNumber },
      create: { ...order, vendorId: vendor.id },
      update: {},
    });
  }

  console.log(`Seeded ${orderData.length} orders`);

  // --- Discount plans ---
  await db.discountPlan.upsert({
    where: { id: "disc-1" },
    create: {
      id: "disc-1",
      vendorId: vendor.id,
      name: "Beauty Month May Discount",
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-05-15"),
      productIds: [prod1.id, prod3.id],
      sales: 322300,
      itemsSold: { [prod1.id]: 4, [prod3.id]: 1 },
    },
    update: {},
  });

  await db.discountPlan.upsert({
    where: { id: "disc-2" },
    create: {
      id: "disc-2",
      vendorId: vendor.id,
      name: "Eid Offers",
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-06-10"),
      productIds: [prod4.id],
      sales: 0,
      itemsSold: { [prod4.id]: 0 },
    },
    update: {},
  });

  console.log("Seeded 2 discount plans");

  // --- Settlements ---
  await db.settlement.upsert({
    where: { settlementNumber: "SET-2026-00041" },
    create: {
      id: "set-1",
      settlementNumber: "SET-2026-00041",
      vendorId: vendor.id,
      date: new Date("2026-04-30"),
      paymentMethod: "Bank Transfer",
      status: "paid",
      itemIds: ["ord-4"],
    },
    update: {},
  });

  await db.settlement.upsert({
    where: { settlementNumber: "SET-2026-00042" },
    create: {
      id: "set-2",
      settlementNumber: "SET-2026-00042",
      vendorId: vendor.id,
      date: new Date("2026-05-05"),
      paymentMethod: "Cash",
      status: "remaining",
      itemIds: ["ord-1", "ord-2", "ord-3"],
    },
    update: {},
  });

  console.log("Seeded 2 settlements");

  // --- Marketing campaigns ---
  await db.marketingCampaign.upsert({
    where: { code: "EM-SIL-2401" },
    create: {
      id: "camp-1",
      packageId: "pkg-silver",
      vendorId: vendor.id,
      code: "EM-SIL-2401",
      status: "active",
      purchasedAt: new Date("2026-05-01"),
      startsAt: new Date("2026-05-02"),
      endsAt: new Date("2026-05-16"),
      views: 184210,
      clicks: 9842,
      sales: 312,
      reach: 521300,
    },
    update: {},
  });

  await db.marketingCampaign.upsert({
    where: { code: "EM-BRZ-2290" },
    create: {
      id: "camp-2",
      packageId: "pkg-bronze",
      vendorId: vendor.id,
      code: "EM-BRZ-2290",
      status: "pending",
      purchasedAt: new Date("2026-05-03"),
    },
    update: {},
  });

  await db.marketingCampaign.upsert({
    where: { code: "EM-STR-1108" },
    create: {
      id: "camp-3",
      packageId: "pkg-starter",
      vendorId: vendor.id,
      code: "EM-STR-1108",
      status: "completed",
      purchasedAt: new Date("2026-04-01"),
      startsAt: new Date("2026-04-02"),
      endsAt: new Date("2026-04-07"),
      views: 64210,
      clicks: 2842,
      sales: 84,
      reach: 142300,
    },
    update: {},
  });

  console.log("Seeded 3 marketing campaigns");

  // --- Notifications ---
  const notifData = [
    {
      id: "ntf-1",
      kind: "order" as const,
      title: "New order received",
      body: "Order ORD-100214 from Mariam K. is awaiting confirmation.",
      createdAt: new Date("2026-05-04T09:20:00"),
      read: false,
      href: "/orders/ORD-100214",
    },
    {
      id: "ntf-2",
      kind: "campaign" as const,
      title: "Marketing campaign approved",
      body: "Silver Package campaign EM-SIL-2401 is now active.",
      createdAt: new Date("2026-05-02T14:05:00"),
      read: false,
      href: "/marketing/campaigns",
    },
    {
      id: "ntf-3",
      kind: "stock" as const,
      title: "Low stock warning",
      body: "Braun Mini Trimmer - Red is down to 5 units.",
      createdAt: new Date("2026-05-02T08:11:00"),
      read: false,
      href: "/inventory",
    },
    {
      id: "ntf-4",
      kind: "settlement" as const,
      title: "Settlement scheduled",
      body: "Settlement SET-2026-00042 of 113,540 IQD is queued for May 5.",
      createdAt: new Date("2026-05-01T17:30:00"),
      read: true,
      href: "/settlements",
    },
    {
      id: "ntf-5",
      kind: "system" as const,
      title: "Profile update reminder",
      body: "Add a backup warehouse to keep delivery cover during peak season.",
      createdAt: new Date("2026-04-29T11:00:00"),
      read: true,
      href: "/profile",
    },
  ];

  for (const n of notifData) {
    await db.notification.upsert({
      where: { id: n.id },
      create: { ...n, vendorId: vendor.id },
      update: {},
    });
  }

  console.log(`Seeded ${notifData.length} notifications`);
  console.log("\nSeed complete.");
  console.log("Login credentials:");
  console.log("  Email:    beautifulgril2294@gmail.com");
  console.log("  Password: Vendor@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
