import assert from "node:assert/strict";
import test from "node:test";
import {
  discountPlans,
  filterOrders,
  filterProducts,
  filterSettlements,
  generateVendorReference,
  getCampaignRemaining,
  getDiscountStatus,
  orders,
  products,
  settlements,
  validateBulkUpdateRow,
  validatePricing,
  validateStockUpdate,
} from "../app/vendor-dashboard-data.ts";

test("filters products by status and search fields", () => {
  const published = filterProducts(products, "published", "sheglam");
  assert.equal(published.length, 1);
  assert.equal(published[0].sku, "sv2411203071322707");

  const review = filterProducts(products, "review", "8901234567892");
  assert.equal(review.length, 1);
  assert.equal(review[0].status, "review");
});

test("filters orders by status, date, query, and sort", () => {
  const ready = filterOrders(orders, "ready", "Erbil", "2026-05-01", "2026-05-04");
  assert.equal(ready.length, 1);
  assert.equal(ready[0].status, "ready");

  const amountSorted = filterOrders(orders, "all", "", "2026-05-01", "2026-05-04", "amount");
  assert.ok(amountSorted[0].priceWithCommission * amountSorted[0].quantity >= amountSorted[1].priceWithCommission);
});

test("validates pricing and locked commission agreements", () => {
  const locked = products.find((product) => product.lockedCommission);
  assert.ok(locked);
  const result = validatePricing(locked, {
    costPrice: locked.costPrice,
    sellingPrice: locked.sellingPrice + 1000,
    commissionPct: locked.commissionPct + 1,
  });
  assert.equal(result.valid, false);
  assert.equal(result.warnings.length, 2);

  const invalid = validatePricing(products[0], {
    costPrice: 50000,
    sellingPrice: 40000,
    commissionPct: 8,
  });
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors.join(" "), /less than cost price/);
});

test("validates stock updates", () => {
  assert.equal(validateStockUpdate(4).valid, true);
  assert.equal(validateStockUpdate(0).status, "out-of-stock");
  assert.equal(validateStockUpdate(-1).valid, false);
});

test("validates bulk price and stock update rows", () => {
  const protectedColumn = validateBulkUpdateRow(
    { sku: products[0].sku, sellingPrice: 20000, costPrice: 10000, nameChanged: true },
    "prices",
  );
  assert.equal(protectedColumn.valid, false);

  const stock = validateBulkUpdateRow({ sku: products[0].sku, quantity: 3 }, "stock");
  assert.equal(stock.valid, true);
});

test("derives discount plan lifecycle", () => {
  assert.equal(getDiscountStatus(discountPlans[0], "2026-05-04"), "active");
  assert.equal(getDiscountStatus(discountPlans[1], "2026-05-04"), "scheduled");
  assert.equal(getDiscountStatus(discountPlans[0], "2026-06-01"), "inactive");
});

test("filters settlements by payment and date", () => {
  const byDate = filterSettlements(settlements, "2026-04-30", "all");
  assert.equal(byDate.length, 1);

  const byMethod = filterSettlements(settlements, "", "Cash");
  assert.equal(byMethod.length, 1);
});

test("generates unique vendor references", () => {
  const first = generateVendorReference("68c7c5e47bd93a0041cfb75b");
  const second = generateVendorReference("68c7c5e47bd93a0041cfb75b", [first]);
  assert.match(first, /^VEN-2026-/);
  assert.notEqual(first, second);
});

test("calculates campaign countdown for active campaigns", () => {
  const remaining = getCampaignRemaining(
    { status: "active", endsAt: "2026-05-16" },
    "2026-05-04T12:00:00.000Z",
  );
  assert.deepEqual(remaining, { days: 12, hours: 11 });
  assert.equal(getCampaignRemaining({ status: "pending" }), null);
});
