import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const iraqiNames = [
  "Ahmed Al-Rashidi", "Fatima Al-Mosawi", "Ali Hassan", "Zainab Karimi",
  "Omar Al-Jubouri", "Nour Al-Saadi", "Mustafa Ibrahim", "Hana Al-Bayati",
  "Karrar Al-Hakim", "Sara Al-Tamimi", "Hussein Al-Askari", "Mariam Fadhel",
  "Youssef Al-Ubaidi", "Layla Al-Dulaimi", "Bilal Najm", "Rana Al-Najafi",
  "Jassim Al-Shammari", "Dalya Al-Zubaidi", "Mahdi Saleh", "Tara Ahmad",
];

const provinces = [
  "Baghdad", "Basra", "Erbil", "Najaf", "Karbala",
  "Sulaymaniyah", "Nineveh", "Duhok",
];

const cities: Record<string, string[]> = {
  Baghdad:       ["Baghdad", "Sadr City", "Mansour", "Karrada", "Kadhimiya"],
  Basra:         ["Basra", "Zubair", "Hartha"],
  Erbil:         ["Erbil", "Ankawa", "Shaqlawa"],
  Najaf:         ["Najaf", "Kufa"],
  Karbala:       ["Karbala", "Hindiya"],
  Sulaymaniyah:  ["Sulaymaniyah", "Halabja"],
  Nineveh:       ["Mosul", "Tel Afar"],
  Duhok:         ["Duhok", "Zakho"],
};

async function main() {
  // ── Vendor ──────────────────────────────────────────────────────────────────
  const vendor = await db.vendor.update({
    where: { email: "mcenter@mobile.iq" },
    data: {
      processingSpeedHours: 3.2,
      cancellationRate:     4.1,
      customerRating:       4.7,
      uploadActivity:       17,
      accountManager:       "Reem Al-Hashimi",
    },
  });
  console.log("Vendor stats updated");

  // ── Warehouse ────────────────────────────────────────────────────────────────
  await db.warehouse.deleteMany({ where: { vendorId: vendor.id } });
  await db.warehouse.createMany({
    data: [
      {
        vendorId:    vendor.id,
        name:        "M Center Main Warehouse",
        address:     "Karrada, Baghdad, Iraq",
        phone:       "+9647701234567",
        openingDays: "Sunday - Thursday",
        openingTime: "09:00",
        closingTime: "18:00",
      },
      {
        vendorId:    vendor.id,
        name:        "Erbil Branch",
        address:     "Ankawa Road, Erbil, Iraq",
        phone:       "+9647501234567",
        openingDays: "Sunday - Friday",
        openingTime: "10:00",
        closingTime: "19:00",
      },
    ],
  });
  console.log("Warehouses created");

  // ── Product colors + stock ───────────────────────────────────────────────────
  const products = await db.product.findMany({ where: { vendorId: vendor.id } });
  const productMap = Object.fromEntries(products.map((p) => [p.sku, p]));

  const phoneColors = [
    { code: "#1C1C1E", nameAr: "أسود", nameEn: "Black",    sizes: [{ size: "128GB", quantity: 12 }, { size: "256GB", quantity: 8 }, { size: "512GB", quantity: 4 }] },
    { code: "#F5F5F0", nameAr: "أبيض", nameEn: "White",    sizes: [{ size: "128GB", quantity: 10 }, { size: "256GB", quantity: 6 }, { size: "512GB", quantity: 3 }] },
    { code: "#2D5BE3", nameAr: "أزرق", nameEn: "Ultramarine", sizes: [{ size: "128GB", quantity: 8 }, { size: "256GB", quantity: 5 }, { size: "512GB", quantity: 2 }] },
    { code: "#C9A96E", nameAr: "تيتانيوم صحراوي", nameEn: "Desert Titanium", sizes: [{ size: "256GB", quantity: 7 }, { size: "512GB", quantity: 4 }, { size: "1TB", quantity: 2 }] },
  ];
  const macColors = [
    { code: "#87CEEB", nameAr: "أزرق سماوي", nameEn: "Sky Blue", sizes: [{ size: "256GB SSD / 16GB RAM", quantity: 6 }, { size: "512GB SSD / 24GB RAM", quantity: 3 }] },
    { code: "#C0C0C0", nameAr: "فضي",         nameEn: "Silver",   sizes: [{ size: "256GB SSD / 16GB RAM", quantity: 5 }, { size: "512GB SSD / 24GB RAM", quantity: 2 }] },
  ];
  const watchColors = [
    { code: "#1C1C1E", nameAr: "أسود منتصف الليل", nameEn: "Midnight", sizes: [{ size: "40mm", quantity: 5 }, { size: "44mm", quantity: 4 }] },
    { code: "#C0C0C0", nameAr: "فضي",               nameEn: "Silver",   sizes: [{ size: "40mm", quantity: 4 }, { size: "44mm", quantity: 3 }] },
  ];
  const airpodsColors = [
    { code: "#F5F5F0", nameAr: "أبيض", nameEn: "White", sizes: [{ size: "Standard", quantity: 20 }] },
  ];
  const ipadColors = [
    { code: "#87CEEB", nameAr: "أزرق", nameEn: "Blue",  sizes: [{ size: "64GB Wi-Fi", quantity: 8 }, { size: "256GB Wi-Fi", quantity: 5 }] },
    { code: "#C0C0C0", nameAr: "فضي",  nameEn: "Silver", sizes: [{ size: "64GB Wi-Fi", quantity: 6 }, { size: "256GB Wi-Fi", quantity: 4 }] },
  ];

  const colorMap: Record<string, typeof phoneColors> = {
    "MC-IPH16E":       phoneColors,
    "MC-IPH16":        phoneColors,
    "MC-IPH16PLUS":    phoneColors,
    "MC-IPH16PRO":     phoneColors,
    "MC-IPH16PROMAX":  phoneColors,
    "MC-IPAD10":       ipadColors,
    "MC-IPADA16":      ipadColors,
    "MC-IPADMINI7":    ipadColors,
    "MC-IPADAIRM3-11": ipadColors,
    "MC-IPADAIRM3-13": ipadColors,
    "MC-MBAM4-13":     macColors,
    "MC-MBAM4-15":     macColors,
    "MC-AIRPODS4":     airpodsColors,
    "MC-AIRPODS4ANC":  airpodsColors,
    "MC-AIRPODSMAX":   airpodsColors,
    "MC-WATCHSE2":     watchColors,
    "MC-WATCHULTRA2":  watchColors,
  };

  for (const [sku, colors] of Object.entries(colorMap)) {
    const product = productMap[sku];
    if (!product) continue;
    await db.productColor.deleteMany({ where: { productId: product.id } });
    for (const c of colors) {
      const color = await db.productColor.create({
        data: { productId: product.id, code: c.code, nameAr: c.nameAr, nameEn: c.nameEn },
      });
      await db.productSize.createMany({
        data: c.sizes.map((s) => ({ colorId: color.id, size: s.size, quantity: s.quantity })),
      });
    }
  }
  console.log("Colors + stock created");

  // ── Orders ───────────────────────────────────────────────────────────────────
  // Delete previous demo orders
  await db.order.deleteMany({ where: { vendorId: vendor.id } });

  const orderDefs: Array<{
    sku: string; qty: number; color: string; size: string;
    daysBack: number; status: "new"|"ready"|"shipped"|"delivered"|"cancelled";
    province: string; payment: string;
  }> = [
    // delivered — spread over last 60 days
    { sku:"MC-IPH16PRO",    qty:1, color:"Desert Titanium", size:"256GB",                    daysBack:60, status:"delivered", province:"Baghdad",      payment:"Cash on Delivery" },
    { sku:"MC-MBAM4-13",    qty:1, color:"Sky Blue",        size:"256GB SSD / 16GB RAM",      daysBack:57, status:"delivered", province:"Erbil",        payment:"Card" },
    { sku:"MC-AIRPODS4",    qty:2, color:"White",           size:"Standard",                  daysBack:55, status:"delivered", province:"Basra",        payment:"Cash on Delivery" },
    { sku:"MC-IPH16",       qty:1, color:"Ultramarine",     size:"128GB",                     daysBack:52, status:"delivered", province:"Najaf",        payment:"Cash on Delivery" },
    { sku:"MC-WATCHSE2",    qty:1, color:"Midnight",        size:"44mm",                      daysBack:50, status:"delivered", province:"Karbala",      payment:"Card" },
    { sku:"MC-IPADAIRM3-11",qty:1, color:"Blue",            size:"64GB Wi-Fi",                daysBack:48, status:"delivered", province:"Baghdad",      payment:"Cash on Delivery" },
    { sku:"MC-IPH16PROMAX", qty:1, color:"Desert Titanium", size:"512GB",                     daysBack:45, status:"delivered", province:"Sulaymaniyah", payment:"Card" },
    { sku:"MC-AIRPODS4ANC", qty:1, color:"White",           size:"Standard",                  daysBack:43, status:"delivered", province:"Duhok",        payment:"Cash on Delivery" },
    { sku:"MC-IPH16PLUS",   qty:1, color:"White",           size:"256GB",                     daysBack:40, status:"delivered", province:"Baghdad",      payment:"Cash on Delivery" },
    { sku:"MC-MBAM4-15",    qty:1, color:"Silver",          size:"512GB SSD / 24GB RAM",      daysBack:38, status:"delivered", province:"Erbil",        payment:"Card" },
    { sku:"MC-IPAD10",      qty:2, color:"Silver",          size:"64GB Wi-Fi",                daysBack:36, status:"delivered", province:"Nineveh",      payment:"Cash on Delivery" },
    { sku:"MC-IPH16E",      qty:1, color:"Black",           size:"128GB",                     daysBack:34, status:"delivered", province:"Baghdad",      payment:"Cash on Delivery" },
    { sku:"MC-AIRPODSMAX",  qty:1, color:"White",           size:"Standard",                  daysBack:32, status:"delivered", province:"Basra",        payment:"Card" },
    { sku:"MC-WATCHULTRA2", qty:1, color:"Silver",          size:"44mm",                      daysBack:30, status:"delivered", province:"Baghdad",      payment:"Card" },
    { sku:"MC-IPADMINI7",   qty:1, color:"Blue",            size:"256GB Wi-Fi",               daysBack:28, status:"delivered", province:"Sulaymaniyah", payment:"Cash on Delivery" },
    { sku:"MC-IPH16PRO",    qty:1, color:"Black",           size:"512GB",                     daysBack:26, status:"delivered", province:"Baghdad",      payment:"Card" },
    { sku:"MC-IPADA16",     qty:2, color:"Blue",            size:"64GB Wi-Fi",                daysBack:24, status:"delivered", province:"Karbala",      payment:"Cash on Delivery" },
    { sku:"MC-IPH16",       qty:2, color:"Black",           size:"256GB",                     daysBack:22, status:"delivered", province:"Najaf",        payment:"Cash on Delivery" },
    { sku:"MC-IPADAIRM3-13",qty:1, color:"Silver",          size:"256GB Wi-Fi",               daysBack:20, status:"delivered", province:"Baghdad",      payment:"Card" },
    { sku:"MC-AIRPODS4",    qty:3, color:"White",           size:"Standard",                  daysBack:18, status:"delivered", province:"Erbil",        payment:"Cash on Delivery" },
    // shipped
    { sku:"MC-IPH16PROMAX", qty:1, color:"Black",           size:"256GB",                     daysBack:5,  status:"shipped",  province:"Baghdad",      payment:"Cash on Delivery" },
    { sku:"MC-MBAM4-13",    qty:1, color:"Silver",          size:"256GB SSD / 16GB RAM",      daysBack:4,  status:"shipped",  province:"Basra",        payment:"Card" },
    { sku:"MC-WATCHSE2",    qty:2, color:"Silver",          size:"40mm",                      daysBack:4,  status:"shipped",  province:"Erbil",        payment:"Cash on Delivery" },
    { sku:"MC-AIRPODS4ANC", qty:2, color:"White",           size:"Standard",                  daysBack:3,  status:"shipped",  province:"Sulaymaniyah", payment:"Cash on Delivery" },
    { sku:"MC-IPH16PRO",    qty:1, color:"Desert Titanium", size:"1TB",                       daysBack:3,  status:"shipped",  province:"Baghdad",      payment:"Card" },
    // ready
    { sku:"MC-IPH16",       qty:1, color:"Ultramarine",     size:"256GB",                     daysBack:2,  status:"ready",   province:"Baghdad",      payment:"Cash on Delivery" },
    { sku:"MC-IPADMINI7",   qty:1, color:"Silver",          size:"64GB Wi-Fi",                daysBack:2,  status:"ready",   province:"Nineveh",      payment:"Cash on Delivery" },
    { sku:"MC-AIRPODSMAX",  qty:1, color:"White",           size:"Standard",                  daysBack:1,  status:"ready",   province:"Karbala",      payment:"Card" },
    // new
    { sku:"MC-IPH16PROMAX", qty:1, color:"Desert Titanium", size:"1TB",                       daysBack:0,  status:"new",     province:"Baghdad",      payment:"Cash on Delivery" },
    { sku:"MC-MBAM4-15",    qty:1, color:"Sky Blue",        size:"256GB SSD / 16GB RAM",      daysBack:0,  status:"new",     province:"Erbil",        payment:"Card" },
    { sku:"MC-AIRPODS4",    qty:2, color:"White",           size:"Standard",                  daysBack:0,  status:"new",     province:"Basra",        payment:"Cash on Delivery" },
    // cancelled
    { sku:"MC-IPH16E",      qty:1, color:"White",           size:"256GB",                     daysBack:15, status:"cancelled", province:"Baghdad",   payment:"Cash on Delivery" },
    { sku:"MC-IPAD10",      qty:1, color:"Blue",            size:"64GB Wi-Fi",                daysBack:10, status:"cancelled", province:"Najaf",     payment:"Cash on Delivery" },
  ];

  let orderNum = 10001;
  for (const def of orderDefs) {
    const product = productMap[def.sku];
    if (!product) continue;
    const province = def.province;
    const cityList = cities[province] || [province];
    const city     = cityList[randInt(0, cityList.length - 1)];
    const customer = iraqiNames[randInt(0, iraqiNames.length - 1)];
    const priceWithCommission    = product.sellingPrice * def.qty;
    const priceWithoutCommission = priceWithCommission * (1 - product.commissionPct / 100);

    await db.order.create({
      data: {
        orderNumber:             `ORD-${orderNum++}`,
        vendorId:                vendor.id,
        productId:               product.id,
        dateTime:                daysAgo(def.daysBack),
        quantity:                def.qty,
        color:                   def.color,
        size:                    def.size,
        priceWithCommission,
        priceWithoutCommission,
        status:                  def.status,
        city,
        province,
        customerName:            customer,
        customerPhone:           `+9647${randInt(70, 79)}${randInt(1000000, 9999999)}`,
        customerAddress:         `${randInt(1, 99)} Al-${["Rashid", "Nidal", "Karrada", "Mansour"][randInt(0, 3)]} Street, ${city}`,
        deliveryStatus:          def.status === "shipped" ? "In Transit" : def.status === "delivered" ? "Delivered" : "",
        paymentMethod:           def.payment,
        deliveryAgent:           def.status === "shipped" || def.status === "delivered" ? "Electromall Delivery" : "",
      },
    });
  }
  console.log(`${orderDefs.length} orders created`);

  // ── Settlements ──────────────────────────────────────────────────────────────
  await db.settlement.deleteMany({ where: { vendorId: vendor.id } });
  await db.settlement.createMany({
    data: [
      { settlementNumber:"SET-2024-001", vendorId:vendor.id, date:daysAgo(45), paymentMethod:"Bank Transfer", status:"paid",    itemIds:[] },
      { settlementNumber:"SET-2024-002", vendorId:vendor.id, date:daysAgo(15), paymentMethod:"Bank Transfer", status:"paid",    itemIds:[] },
      { settlementNumber:"SET-2024-003", vendorId:vendor.id, date:daysAgo(2),  paymentMethod:"Bank Transfer", status:"pending", itemIds:[] },
    ],
  });
  console.log("Settlements created");

  // ── Marketing campaigns ──────────────────────────────────────────────────────
  await db.marketingCampaign.deleteMany({ where: { vendorId: vendor.id } });
  const pkgGold   = await db.marketingPackage.findFirst({ where: { id: "pkg-gold" } });
  const pkgSilver = await db.marketingPackage.findFirst({ where: { id: "pkg-silver" } });
  const pkgBronze = await db.marketingPackage.findFirst({ where: { id: "pkg-bronze" } });

  if (pkgGold) {
    await db.marketingCampaign.create({
      data: {
        packageId:   pkgGold.id,
        vendorId:    vendor.id,
        code:        "CAMP-MC-001",
        status:      "completed",
        purchasedAt: daysAgo(40),
        startsAt:    daysAgo(38),
        endsAt:      daysAgo(8),
        views:       84200,
        clicks:      3100,
        sales:       12500000,
        reach:       61000,
      },
    });
  }
  if (pkgSilver) {
    await db.marketingCampaign.create({
      data: {
        packageId:   pkgSilver.id,
        vendorId:    vendor.id,
        code:        "CAMP-MC-002",
        status:      "active",
        purchasedAt: daysAgo(10),
        startsAt:    daysAgo(8),
        endsAt:      daysAgo(-6),
        views:       31400,
        clicks:      1240,
        sales:       4800000,
        reach:       24000,
      },
    });
  }
  if (pkgBronze) {
    await db.marketingCampaign.create({
      data: {
        packageId:   pkgBronze.id,
        vendorId:    vendor.id,
        code:        "CAMP-MC-003",
        status:      "pending",
        purchasedAt: daysAgo(1),
        views:       0,
        clicks:      0,
        sales:       0,
        reach:       0,
      },
    });
  }
  console.log("Marketing campaigns created");

  // ── Discount plans ───────────────────────────────────────────────────────────
  await db.discountPlan.deleteMany({ where: { vendorId: vendor.id } });
  const phoneProductIds = ["MC-IPH16E","MC-IPH16","MC-IPH16PLUS"].map((s) => productMap[s]?.id).filter(Boolean) as string[];
  const audioProductIds = ["MC-AIRPODS4","MC-AIRPODS4ANC"].map((s) => productMap[s]?.id).filter(Boolean) as string[];
  await db.discountPlan.createMany({
    data: [
      {
        vendorId:   vendor.id,
        name:       "Ramadan iPhone Sale",
        startDate:  daysAgo(10),
        endDate:    daysAgo(-20),
        productIds: phoneProductIds,
        sales:      8750000,
        itemsSold:  { "MC-IPH16E": 4, "MC-IPH16": 6, "MC-IPH16PLUS": 3 },
      },
      {
        vendorId:   vendor.id,
        name:       "AirPods Summer Deal",
        startDate:  daysAgo(5),
        endDate:    daysAgo(-25),
        productIds: audioProductIds,
        sales:      1330000,
        itemsSold:  { "MC-AIRPODS4": 5, "MC-AIRPODS4ANC": 2 },
      },
    ],
  });
  console.log("Discount plans created");

  // ── Notifications ────────────────────────────────────────────────────────────
  await db.notification.deleteMany({ where: { vendorId: vendor.id } });
  await db.notification.createMany({
    data: [
      { vendorId:vendor.id, kind:"order",      title:"New Order Received",          body:"Order ORD-10029 placed for iPhone 16 Pro Max — Desert Titanium 1TB from Baghdad.",    read:false, href:"/orders",              createdAt:daysAgo(0)  },
      { vendorId:vendor.id, kind:"order",      title:"New Order Received",          body:"Order ORD-10030 placed for MacBook Air 15\" M4 from Erbil.",                          read:false, href:"/orders",              createdAt:daysAgo(0)  },
      { vendorId:vendor.id, kind:"order",      title:"Order Shipped",               body:"Order ORD-10021 for iPhone 16 Pro Max is now in transit to Baghdad.",                 read:false, href:"/orders",              createdAt:daysAgo(5)  },
      { vendorId:vendor.id, kind:"campaign",   title:"Campaign Started",            body:"Your Silver Package campaign CAMP-MC-002 is now live. Track performance in Marketing.",read:false, href:"/marketing/campaigns", createdAt:daysAgo(8)  },
      { vendorId:vendor.id, kind:"settlement", title:"Settlement Paid",             body:"Settlement SET-2024-002 of IQD 18,450,000 has been transferred to your account.",     read:true,  href:"/settlements",         createdAt:daysAgo(15) },
      { vendorId:vendor.id, kind:"stock",      title:"Low Stock Alert",             body:"iPhone 16 Pro (Desert Titanium 1TB) has only 2 units remaining.",                    read:true,  href:"/inventory",           createdAt:daysAgo(16) },
      { vendorId:vendor.id, kind:"campaign",   title:"Campaign Completed",          body:"Gold Package campaign CAMP-MC-001 ended. Total reach: 61,000 — Sales: 12.5M IQD.",   read:true,  href:"/marketing/campaigns", createdAt:daysAgo(8)  },
      { vendorId:vendor.id, kind:"settlement", title:"Settlement Paid",             body:"Settlement SET-2024-001 of IQD 22,100,000 has been transferred to your account.",     read:true,  href:"/settlements",         createdAt:daysAgo(45) },
      { vendorId:vendor.id, kind:"system",     title:"Welcome to Electromall!",     body:"Your vendor account is verified. Start adding products and manage your store.",       read:true,  href:"/profile",             createdAt:daysAgo(60) },
      { vendorId:vendor.id, kind:"order",      title:"Order Delivered",             body:"Order ORD-10014 for Apple Watch Ultra 2 has been delivered to Baghdad.",              read:true,  href:"/orders",              createdAt:daysAgo(30) },
    ],
  });
  console.log("Notifications created");

  console.log("\n✓ Demo data complete. Login: mcenter@mobile.iq / mcenter17");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
