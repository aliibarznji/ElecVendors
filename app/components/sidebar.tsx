"use client";

import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  Layers,
  List,
  Megaphone,
  Package,
  PlusSquare,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/lang-context";
import type { Translations } from "../lib/translations";

type SidebarLink = { labelKey: keyof Translations; href: string; icon: React.ComponentType<{ "aria-hidden"?: boolean | "true"; size?: number; strokeWidth?: number }> };
type SidebarSection = { titleKey: keyof Translations; links: SidebarLink[] };

const sidebarSections: SidebarSection[] = [
  {
    titleKey: "sectionDashboard",
    links: [
      { labelKey: "navHome", href: "/", icon: Home },
      { labelKey: "navNotifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    titleKey: "sectionStore",
    links: [
      { labelKey: "navOrderItems", href: "/orders", icon: ShoppingBag },
      { labelKey: "navInventory", href: "/inventory", icon: Package },
      { labelKey: "navPricing", href: "/pricing", icon: CreditCard },
      { labelKey: "navProductList", href: "/products", icon: List },
      { labelKey: "navAddProduct", href: "/products/add", icon: PlusSquare },
      { labelKey: "navBulkUpdates", href: "/products/bulk", icon: Layers },
    ],
  },
  {
    titleKey: "sectionDiscounts",
    links: [
      { labelKey: "navDiscountPlans", href: "/products/discounts", icon: Tag },
      { labelKey: "navDeliveryPrices", href: "/delivery-prices", icon: Truck },
    ],
  },
  {
    titleKey: "sectionReports",
    links: [
      { labelKey: "navSalesReport", href: "/seller-report", icon: BarChart3 },
      { labelKey: "navSettlements", href: "/settlements", icon: Receipt },
    ],
  },
  {
    titleKey: "sectionMarketing",
    links: [
      { labelKey: "navNewCampaign", href: "/marketing/new", icon: Megaphone },
    ],
  },
  {
    titleKey: "sectionProfile",
    links: [
      { labelKey: "navVendorProfile", href: "/profile", icon: User },
      { labelKey: "navWarranty", href: "/warranty", icon: ShieldCheck },
    ],
  },
];

const SIDEBAR_SCROLL_KEY = "sidebar-scroll-position";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLElement | null>(null);
  const { t } = useLang();

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
        aria-label={isCollapsed ? t("expandMenu") : t("collapseMenu")}
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
          <div className="sidebar-section" key={section.titleKey}>
            <p className="sidebar-section-title">{t(section.titleKey)}</p>
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
                    key={link.labelKey}
                    title={isCollapsed ? t(link.labelKey) : undefined}
                  >
                    <Icon aria-hidden="true" size={21} strokeWidth={1.9} />
                    <span className="sidebar-link-label">{t(link.labelKey)}</span>
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
