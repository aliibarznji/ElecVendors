"use client";

import { Bell, Globe2, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";

export function TopNav() {
  const [unread, setUnread] = useState(0);
  const [vendorName, setVendorName] = useState("");
  const router = useRouter();
  const { t, lang, setLang } = useLang();

  useEffect(() => {
    api.notifications.list().then((res) => {
      setUnread(res.unread);
    }).catch(() => {});
    api.profile.get().then((vendor) => {
      setVendorName(vendor.name);
    }).catch(() => {});
  }, []);

  return (

<header className="top-nav">
      <Link className="brand" href="/" aria-label={t("brandName")}>
        <span className="brand-text">{t("brandName")}</span>
      </Link>

      <nav className="nav-actions" aria-label="User navigation">
        {vendorName ? <span className="user-name">{vendorName}</span> : null}
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
          onClick={async () => {
            if (!window.confirm(t("logoutConfirm"))) return;
            try {
              await api.auth.logout();
            } catch {
              // ignore — still force client redirect
            }
            window.location.replace("/login");
          }}
        >
          <LogOut aria-hidden="true" size={24} strokeWidth={2.1} />
          <span>{t("logout")}</span>
        </button>
      </nav>
    </header>
  );
}
