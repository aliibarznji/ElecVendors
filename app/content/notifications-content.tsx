"use client";

import {
  Bell,
  Megaphone,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "../lib/lang-context";
import type { Translations } from "../lib/translations";
import { api } from "../lib/api";
import type { ApiNotification } from "../lib/utils";

type NotificationKind = ApiNotification["kind"];

const kindMeta: Record<NotificationKind, { labelKey: keyof Translations; icon: LucideIcon; tone: string }> = {
  order: { labelKey: "kindOrder", icon: ShoppingBag, tone: "blue" },
  campaign: { labelKey: "kindCampaign", icon: Megaphone, tone: "green" },
  settlement: { labelKey: "kindSettlement", icon: Receipt, tone: "cyan" },
  stock: { labelKey: "kindStock", icon: Package, tone: "amber" },
  system: { labelKey: "kindSystem", icon: Settings, tone: "gray" },
};

const toneClasses: Record<string, string> = {
  blue:  "bg-[#eef2fd] text-[#2a4a9f]",
  green: "bg-[#e7f4ea] text-[#1d6b3a]",
  cyan:  "bg-[#e0f2fe] text-[#075985]",
  amber: "bg-[#fef3c7] text-[#92400e]",
  gray:  "bg-[#f1f5f9] text-[#475569]",
};

export function NotificationsContent() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    api.notifications
      .list()
      .then((res) => {
        setNotifications(res.items);
        setUnread(res.unread);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...notifications].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  const handleMarkAll = () => {
    api.notifications.readAll().catch(() => {});
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  const handleRead = (id: string) => {
    api.notifications.read(id).catch(() => {});
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnread((current) => Math.max(0, current - 1));
  };

  return (
    <div className="dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>{t("notifications")}</h1>
          <p className="dashboard-sub">{t("notificationsSub")}</p>
        </div>
        <div className="inline-flex items-center gap-[14px] text-muted text-[13px]">
          <span className="inline-flex items-center gap-[6px] px-[10px] py-[5px] rounded-full bg-brand-soft text-brand-dark font-semibold text-[12.5px]">
            <Bell aria-hidden="true" size={16} strokeWidth={2.2} />
            {unread} {t("unread")}
          </span>
          <span>{sorted.length} {t("total")}</span>
          {unread > 0 ? (
            <button className="row-action-btn" type="button" onClick={handleMarkAll}>
              Mark all read
            </button>
          ) : null}
        </div>
      </header>

      {loading ? (
        <div className="empty-cell">Loading…</div>
      ) : (
        <section className="grid gap-[10px] mt-[6px]" aria-label="Notifications feed">
          {sorted.map((notification) => {
            const meta = kindMeta[notification.kind];
            const Icon = meta.icon;
            const Wrapper = notification.href ? Link : "div";
            return (
              <Wrapper
                key={notification.id}
                href={notification.href ?? "#"}
                className={`notification-row${notification.read ? "" : " is-unread"}`}
                onClick={() => {
                  if (!notification.read) handleRead(notification.id);
                }}
              >
                <span className={`w-9 h-9 rounded-[10px] inline-grid place-items-center self-start ${toneClasses[meta.tone]}`}>
                  <Icon aria-hidden="true" size={18} strokeWidth={2.2} />
                </span>
                <div className="grid gap-1">
                  <div className="flex items-center gap-[10px] flex-wrap">
                    <strong className="text-[14px] text-text">{notification.title}</strong>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">{t(meta.labelKey)}</span>
                  </div>
                  <p className="m-0 text-[13px] text-muted leading-relaxed">{notification.body}</p>
                  <small className="text-subtle text-[12px]">{notification.createdAt.slice(0, 16).replace("T", " ")}</small>
                </div>
                {notification.read ? null : (
                  <span className="w-[9px] h-[9px] rounded-full bg-brand self-start" aria-label="Unread" />
                )}
              </Wrapper>
            );
          })}
        </section>
      )}
    </div>
  );
}
