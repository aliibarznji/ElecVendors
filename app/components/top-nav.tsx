"use client";

import { Bell, Globe2, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "../lib/lang-context";
import { api } from "../lib/api";

export function TopNav() {
  const [unread, setUnread] = useState(0);
  const [vendorName, setVendorName] = useState("");
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
    <header className="sticky top-0 z-20 flex items-center justify-between w-full min-h-[68px] px-8 bg-white/92 backdrop-saturate-200 backdrop-blur-[20px] border-b border-[rgba(226,230,240,0.8)] shadow-[0_1px_0_rgba(15,23,42,0.04),0_4px_16px_rgba(15,23,42,0.04)]">
      <Link className="inline-flex items-center gap-2 no-underline whitespace-nowrap" href="/" aria-label={t("brandName")}>
        <span className="text-[20px] font-extrabold tracking-[-0.5px] bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dark)] bg-clip-text text-transparent">{t("brandName")}</span>
      </Link>

      <nav className="flex items-center gap-1" aria-label="User navigation">
        {vendorName ? (
          <span className="text-[var(--color-brand)] text-[13px] font-bold whitespace-nowrap px-[14px] py-[6px] bg-[var(--color-brand-soft)] border border-[rgba(215,25,32,0.12)] rounded-full transition-[transform,box-shadow,background] duration-[160ms]">
            {vendorName}
          </span>
        ) : null}
        <Link
          className="nav-action nav-bell relative"
          href="/notifications"
          aria-label={
            unread > 0
              ? `${t("notifications")}, ${unread} ${t("unread")}`
              : t("notifications")
          }
        >
          <Bell aria-hidden="true" size={22} strokeWidth={2.1} />
          {unread > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--color-brand)] text-white text-[10px] font-bold px-1" aria-hidden="true">
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
