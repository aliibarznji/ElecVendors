import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Electromall Vendors Dashboard",
  description: "Electromall Vendors Control Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
