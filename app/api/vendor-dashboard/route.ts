import { NextResponse } from "next/server";
import {
  deliveryPrices,
  discountPlans,
  marketingCampaigns,
  marketingPackages,
  orders,
  products,
  settlements,
  vendorProfile,
} from "../../vendor-dashboard-data";

export function GET() {
  return NextResponse.json({
    vendor: vendorProfile,
    products,
    orders,
    discountPlans,
    deliveryPrices,
    settlements,
    marketingPackages,
    marketingCampaigns,
  });
}
