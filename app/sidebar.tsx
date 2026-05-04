"use client";

import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  History,
  Home,
  Layers,
  List,
  Megaphone,
  Package,
  PackageCheck,
  PlusSquare,
  Receipt,
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
    title: "Dashboard",
    links: [
      { label: "Home", href: "/", icon: Home },
      { label: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    title: "Store",
    links: [
      { label: "Order Items", href: "/orders", icon: ShoppingBag },
      { label: "Inventory Management", href: "/inventory", icon: Package },
      { label: "Instant Pricing", href: "/pricing", icon: CreditCard },
      { label: "Product List", href: "/products", icon: List },
      { label: "Add Product", href: "/products/add", icon: PlusSquare },
      { label: "Bulk Updates", href: "/products/bulk", icon: Layers },
    ],
  },
  {
    title: "Discounts & Offers",
    links: [
      { label: "Discount Plans", href: "/products/discounts", icon: Tag },
      { label: "Delivery Prices", href: "/delivery-prices", icon: Truck },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "Sales Report", href: "/seller-report", icon: BarChart3 },
      { label: "Settlements", href: "/settlements", icon: Receipt },
    ],
  },
  {
    title: "Marketing",
    links: [
      { label: "New Campaign", href: "/marketing/new", icon: Megaphone },
      {
        label: "Active Campaigns",
        href: "/marketing/campaigns",
        icon: PackageCheck,
      },
    ],
  },
  {
    title: "Vendor Profile",
    links: [
      { label: "Vendor Profile", href: "/profile", icon: User },
      { label: "Warranty", href: "/warranty", icon: ShieldCheck },
    ],
  },
  {
    title: "Account Manager",
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
        aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
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
