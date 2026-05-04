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
  Megaphone,
  Package,
  PackageCheck,
  Percent,
  PlusSquare,
  Receipt,
  RotateCcw,
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
    title: "DASHBOARD",
    links: [
      { label: "Dashboard", href: "/", icon: Home },
    ],
  },
  {
    title: "PRODUCT MANAGEMENT",
    links: [
      { label: "Add Product", href: "/products/add", icon: PlusSquare },
      { label: "Product List", href: "/products", icon: List },
      { label: "Express Pricing", href: "/pricing", icon: CreditCard },
      { label: "Stock Management", href: "/inventory", icon: Package },
      { label: "Items Updates", href: "/products/bulk", icon: Layers },
      { label: "Discount Plan", href: "/products/discounts", icon: Tag },
    ],
  },
  {
    title: "ORDER ITEMS PAGE",
    links: [
      { label: "Order Items", href: "/orders", icon: ShoppingBag },
    ],
  },
  {
    title: "SELLER INFORMATION",
    links: [
      { label: "Vendor Profile", href: "/profile", icon: User },
      { label: "Warranty", href: "/warranty", icon: ShieldCheck },
      { label: "Seller Report", href: "/seller-report", icon: BarChart3 },
      { label: "Seller Delivery Prices", href: "/delivery-prices", icon: Truck },
    ],
  },
  {
    title: "ACCOUNT MANAGER PAGE",
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
  {
    title: "SETTLEMENTS",
    links: [
      { label: "Settlements", href: "/settlements", icon: Receipt },
    ],
  },
  {
    title: "MARKETING CAMPAIGNS PAGE",
    links: [
      { label: "New Marketing Campaign",
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
