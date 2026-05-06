import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const images: Record<string, string> = {
  "MC-IPH16E":       "https://www.icenter-iraq.com/wp-content/uploads/2025/02/iPhone_16e_White_PDP_Image_Position_1__en-ME-scaled.jpg",
  "MC-IPH16":        "https://www.icenter-iraq.com/wp-content/uploads/2024/09/iPhone_16_Ultramarine_PDP_Image_Position_1__en-ME-scaled.jpg",
  "MC-IPH16PLUS":    "https://www.icenter-iraq.com/wp-content/uploads/2024/09/iPhone_16_Plus_Ultramarine_PDP_Image_Position_1__en-ME-scaled.jpg",
  "MC-IPH16PRO":     "https://www.icenter-iraq.com/wp-content/uploads/2024/09/iPhone_16_Pro_Desert_Titanium_PDP_Image_Position_1__en-ME-scaled.jpg",
  "MC-IPH16PROMAX":  "https://www.icenter-iraq.com/wp-content/uploads/2024/09/iPhone_16_Pro_Max_Desert_Titanium_PDP_Image_Position_1__en-ME-scaled.jpg",
  "MC-IPAD10":       "https://www.icenter-iraq.com/wp-content/uploads/2023/09/iPad_10.9_inch_Wi-Fi_Silver_PDP_Image_Position-1b_EN-scaled.jpg",
  "MC-IPADA16":      "https://www.icenter-iraq.com/wp-content/uploads/2025/03/iPad_A16_WiFi_Blue_PDP_Image_Position_1__ar-SA-scaled.jpg",
  "MC-IPADMINI7":    "https://www.icenter-iraq.com/wp-content/uploads/2025/03/iPad_mini_Space_Gray_PDP_Image_Position_2_WiFi__en-ME-scaled.jpg",
  "MC-IPADAIRM3-11": "https://www.icenter-iraq.com/wp-content/uploads/2025/03/iPad_Air_11-inch_M3_WiFi_Purple_PDP_Image_Position_1__ar-SA-600x600.jpg",
  "MC-IPADAIRM3-13": "https://www.icenter-iraq.com/wp-content/uploads/2025/03/iPad_Air_13-inch_M3_WiFi_Purple_PDP_Image_Position_1__ar-SA-600x600.jpg",
  "MC-MBAM4-13":     "https://www.icenter-iraq.com/wp-content/uploads/2025/03/MacBook_Air_13-inch_M4_Sky_Blue_PDP_Image_Position_1__ar-SA-scaled.jpg",
  "MC-MBAM4-15":     "https://www.icenter-iraq.com/wp-content/uploads/2025/03/MacBook_Air_15-inch_M4_Sky_Blue_PDP_Image_Position_1__ar-SA-scaled.jpg",
  "MC-AIRPODS4":     "https://www.icenter-iraq.com/wp-content/uploads/2024/09/AirPods_4_PDP_Image_Position_1__en-ME-scaled.jpg",
  "MC-AIRPODS4ANC":  "https://www.icenter-iraq.com/wp-content/uploads/2024/09/AirPods_4_with_Active_Noise_Cancellation_PDP_Image_Position_1__en-ME-scaled.jpg",
  "MC-AIRPODSMAX":   "https://www.icenter-iraq.com/wp-content/uploads/2024/09/AirPods_Max_2024_Starlight_PDP_Image_Position_1__en-ME-600x600.jpg",
  "MC-WATCHSE2":     "https://www.icenter-iraq.com/wp-content/uploads/2023/09/AppleWatch_SE_GPS_Midnight_Aluminum_Midnight_Sport_Band_PDP_Image_Position-01_EN-scaled.jpg",
  "MC-WATCHULTRA2":  "https://www.icenter-iraq.com/wp-content/uploads/2024/09/APPLE_1-38-scaled.jpg",
};

async function main() {
  for (const [sku, mainImage] of Object.entries(images)) {
    const updated = await db.product.updateMany({ where: { sku }, data: { mainImage } });
    console.log(`${sku}: ${updated.count ? "✓" : "not found"}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
