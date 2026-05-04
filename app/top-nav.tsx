"use client";

import { Bell, Globe2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "./lang-context";
import { getUnreadNotifications, vendorProfile } from "./vendor-dashboard-data";

export function TopNav() {
  const unread = getUnreadNotifications();
  const router = useRouter();
  const { t, lang, setLang } = useLang();

  return (
    <header className="top-nav">
      <Link className="brand" href="/" aria-label={t("brandName")}>
        <span className="brand-text">{t("brandName")}</span>
      </Link>

      <nav className="nav-actions" aria-label="User navigation">
        <span className="user-name">{vendorProfile.name}</span>
        <Link
          className="nav-action nav-bell"
          href="/notifications"
          aria-label={
            unread > 0
              ? `${t("notifications")}, ${unread} ${t("unread")}`
              : t("notifications")
          }
        >
          <Bell aria-hidden="true" size={22} strokeWidth={2.1} />
          {unread > 0 ? (
            <span className="nav-bell-badge" aria-hidden="true">
              {unread}
            </span>
          ) : null}
        </Link>
        <button
          className="nav-action"
          type="button"
          aria-label={t("changeLanguage")}
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
        >
          <Globe2 aria-hidden="true" size={24} strokeWidth={2.1} />
          <span>{t("changeLanguage")}</span>
        </button>
        <button
          className="nav-action"
          type="button"
          onClick={() => {
            if (window.confirm(t("logoutConfirm"))) {
              router.push("/");
            }
          }}
        >
          <LogOut aria-hidden="true" size={24} strokeWidth={2.1} />
          <span>{t("logout")}</span>
        </button>
      </nav>
    </header>
  );
}
