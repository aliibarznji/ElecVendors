"use client";

import {
  BarChart3,
  Box,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileClock,
  FileText,
  History,
  Home,
  Layers,
  List,
  MapPin,
  Megaphone,
  PackageCheck,
  Percent,
  PlusSquare,
  Receipt,
  RotateCcw,
  Send,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const sidebarSections = [
  {
    title: "MY ACCOUNT",
    links: [
      { label: "Dashboard", href: "/", icon: Home },
      { label: "Profile", href: "/profile", icon: User },
      { label: "Warranty", href: "/warranty", icon: ShieldCheck },
      { label: "Commissions", href: "/commissions", icon: Percent },
      { label: "Seller Report", href: "/seller-report", icon: BarChart3 },
      { label: "Delivery Prices", href: "/delivery-prices", icon: Truck },
    ],
  },
  {
    title: "PRODUCTS",
    links: [
      { label: "Add Product", href: "/products/add", icon: PlusSquare },
      { label: "Product List", href: "/products", icon: List },
      { label: "Bulk Operations", href: "/products/bulk", icon: Layers },
      { label: "Discount Plans", href: "/products/discounts", icon: Tag },
    ],
  },
  {
    title: "TRANSACTIONS",
    links: [
      { label: "Order Items", href: "/orders", icon: ShoppingBag },
      { label: "Purchase Orders", href: "/purchase-orders", icon: Box },
      {
        label: "Purchase Requisitions",
        href: "/purchase-requisitions",
        icon: ClipboardList,
      },
      { label: "Returns", href: "/returns", icon: RotateCcw },
      { label: "Payments", href: "/payments", icon: CreditCard },
      { label: "Account Statement", href: "/account-statement", icon: FileText },
      { label: "Settlements", href: "/settlements", icon: Receipt },
    ],
  },
  {
    title: "PAID SERVICES",
    links: [
      { label: "Logistics", href: "/services/logistics", icon: Truck },
      {
        label: "New Marketing Campaign",
        href: "/marketing/new",
        icon: Megaphone,
      },
      {
        label: "Existing Marketing Campaigns",
        href: "/marketing/campaigns",
        icon: PackageCheck,
      },
    ],
  },
  {
    title: "DELIVERY SERVICES",
    links: [
      { label: "Track My Shipment", href: "/shipments/track", icon: MapPin },
      { label: "Create a Shipment", href: "/shipments/create", icon: Send },
    ],
  },
  {
    title: "SYSTEM LOGS",
    links: [
      { label: "Product Logs", href: "/logs/products", icon: FileClock },
      {
        label: "Purchase Order Logs",
        href: "/logs/purchase-orders",
        icon: FileText,
      },
      {
        label: "Purchase Requisition Logs",
        href: "/logs/purchase-requisitions",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "ACCOUNT MANAGER",
    links: [
      { label: "Vendor Orders", href: "/account-manager/orders", icon: Users },
      {
        label: "Pending Products",
        href: "/account-manager/pending-products",
        icon: ClipboardCheck,
      },
      { label: "Operations Log", href: "/account-manager/log", icon: History },
    ],
  },
];

const SIDEBAR_SCROLL_KEY = "sidebar-scroll-position";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const saved = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
    if (saved) {
      node.scrollTop = Number(saved) || 0;
    }

    const handleScroll = () => {
      sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(node.scrollTop));
    };
    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      className={`sidebar${isCollapsed ? " sidebar-collapsed" : ""}`}
      aria-label="Dashboard sidebar"
    >
      <button
        className="sidebar-toggle"
        type="button"
        aria-label={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
        aria-expanded={!isCollapsed}
        onClick={() => setIsCollapsed((current) => !current)}
      >
        {isCollapsed ? (
          <ChevronRight aria-hidden="true" size={20} strokeWidth={2.2} />
        ) : (
          <ChevronLeft aria-hidden="true" size={20} strokeWidth={2.2} />
        )}
      </button>

      <nav
        className="sidebar-scroll"
        aria-label="Primary dashboard navigation"
        ref={scrollRef}
      >
        {sidebarSections.map((section) => (
          <div className="sidebar-section" key={section.title}>
            <p className="sidebar-section-title">{section.title}</p>
            <div className="sidebar-links">
              {section.links.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      (link.href !== "/products" &&
                        pathname.startsWith(`${link.href}/`));

                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`sidebar-link${isActive ? " is-active" : ""}`}
                    href={link.href}
                    key={link.label}
                    title={isCollapsed ? link.label : undefined}
                  >
                    <Icon aria-hidden="true" size={21} strokeWidth={1.9} />
                    <span className="sidebar-link-label">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
