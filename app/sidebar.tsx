"use client";

import {
  BarChart3,
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
    title: "لوحة التحكم",
    links: [
      { label: "الرئيسية", href: "/", icon: Home },
    ],
  },
  {
    title: "إدارة المنتجات",
    links: [
      { label: "إضافة منتج", href: "/products/add", icon: PlusSquare },
      { label: "قائمة المنتجات", href: "/products", icon: List },
      { label: "التسعير السريع", href: "/pricing", icon: CreditCard },
      { label: "إدارة المخزون", href: "/inventory", icon: Package },
      { label: "تحديثات المنتجات", href: "/products/bulk", icon: Layers },
      { label: "خطط الخصم", href: "/products/discounts", icon: Tag },
    ],
  },
  {
    title: "الطلبات",
    links: [
      { label: "عناصر الطلبات", href: "/orders", icon: ShoppingBag },
    ],
  },
  {
    title: "معلومات البائع",
    links: [
      { label: "ملف المورد", href: "/profile", icon: User },
      { label: "الضمان", href: "/warranty", icon: ShieldCheck },
      { label: "تقرير المبيعات", href: "/seller-report", icon: BarChart3 },
      { label: "أسعار التوصيل", href: "/delivery-prices", icon: Truck },
    ],
  },
  {
    title: "مدير الحساب",
    links: [
      { label: "طلبات الموردين", href: "/account-manager/orders", icon: Users },
      {
        label: "منتجات قيد المراجعة",
        href: "/account-manager/pending-products",
        icon: ClipboardCheck,
      },
      { label: "سجل العمليات", href: "/account-manager/log", icon: History },
    ],
  },
  {
    title: "التسويات",
    links: [
      { label: "التسويات", href: "/settlements", icon: Receipt },
    ],
  },
  {
    title: "الحملات التسويقية",
    links: [
      { label: "حملة جديدة",
        href: "/marketing/new",
        icon: Megaphone,
      },
      {
        label: "الحملات الحالية",
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
        aria-label={isCollapsed ? "فتح القائمة الجانبية" : "طي القائمة الجانبية"}
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
