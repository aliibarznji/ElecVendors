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
import {
  getUnreadNotifications,
  notifications,
  type NotificationKind,
} from "./vendor-dashboard-data";

const kindMeta: Record<NotificationKind, { label: string; icon: LucideIcon; tone: string }> = {
  order: { label: "Order", icon: ShoppingBag, tone: "blue" },
  campaign: { label: "Campaign", icon: Megaphone, tone: "green" },
  settlement: { label: "Settlement", icon: Receipt, tone: "cyan" },
  stock: { label: "Stock", icon: Package, tone: "amber" },
  system: { label: "System", icon: Settings, tone: "gray" },
};

export function NotificationsContent() {
  const unread = getUnreadNotifications();
  const sorted = [...notifications].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="dashboard-content">
      <header className="page-title-row">
        <div>
          <h1>Notifications</h1>
          <p className="dashboard-sub">
            Orders, campaigns, settlements and stock alerts in one feed.
          </p>
        </div>
        <div className="notifications-summary">
          <span className="notifications-summary-pill">
            <Bell aria-hidden="true" size={16} strokeWidth={2.2} />
            {unread} unread
          </span>
          <span>{sorted.length} total</span>
        </div>
      </header>

      <section className="notifications-list" aria-label="Notifications feed">
        {sorted.map((notification) => {
          const meta = kindMeta[notification.kind];
          const Icon = meta.icon;
          const Wrapper = notification.href ? Link : "div";
          return (
            <Wrapper
              key={notification.id}
              href={notification.href ?? "#"}
              className={`notification-row${notification.read ? "" : " is-unread"}`}
            >
              <span className={`notification-icon notification-${meta.tone}`}>
                <Icon aria-hidden="true" size={18} strokeWidth={2.2} />
              </span>
              <div className="notification-body">
                <div className="notification-row-top">
                  <strong>{notification.title}</strong>
                  <span className="notification-kind">{meta.label}</span>
                </div>
                <p>{notification.body}</p>
                <small>{notification.createdAt}</small>
              </div>
              {notification.read ? null : (
                <span className="notification-dot" aria-label="Unread" />
              )}
            </Wrapper>
          );
        })}
      </section>
    </div>
  );
}
