import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "لوحة موردي الكترومول",
  description: "لوحة تحكم الموردين في الكترومول",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
