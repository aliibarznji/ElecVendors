"use client";

import { Bell, Globe2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUnreadNotifications, vendorProfile } from "./vendor-dashboard-data";

export function TopNav() {
  const unread = getUnreadNotifications();
  const router = useRouter();

  return (
    <header className="top-nav">
      <Link className="brand" href="/" aria-label="ElecMall Vendors Dashboard">
       
        <span className="brand-text">ElecMall Vendors</span>
      </Link>

      <nav className="nav-actions" aria-label="User navigation">
        <span className="user-name">{vendorProfile.name}</span>
        <Link
          className="nav-action nav-bell"
          href="/notifications"
          aria-label={
            unread > 0
              ? `Notifications, ${unread} unread`
              : "Notifications"
          }
        >
          <Bell aria-hidden="true" size={22} strokeWidth={2.1} />
          {unread > 0 ? (
            <span className="nav-bell-badge" aria-hidden="true">
              {unread}
            </span>
          ) : null}
        </Link>
        <button className="nav-action" type="button" aria-label="Change language">
          <Globe2 aria-hidden="true" size={24} strokeWidth={2.1} />
          <span>English</span>
        </button>
        <button
          className="nav-action"
          type="button"
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              router.push("/");
            }
          }}
        >
          <LogOut aria-hidden="true" size={24} strokeWidth={2.1} />
          <span>Logout</span>
        </button>
      </nav>
    </header>
  );
}
