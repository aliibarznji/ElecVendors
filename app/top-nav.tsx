import { Globe2, LogOut } from "lucide-react";
import Link from "next/link";
import { vendorProfile } from "./vendor-dashboard-data";

export function TopNav() {
  return (
    <header className="top-nav">
      <Link className="brand" href="/" aria-label="لوحة موردي الكترومول">
        <span className="brand-mark">EM</span>
        <span className="brand-text">الكترومول الموردين</span>
      </Link>

      <nav className="nav-actions" aria-label="تنقل المستخدم">
        <span className="user-name">{vendorProfile.name}</span>
        <button className="nav-action" type="button" aria-label="Change language">
          <Globe2 aria-hidden="true" size={24} strokeWidth={2.1} />
          <span>العربية</span>
        </button>
        <button className="nav-action" type="button">
          <LogOut aria-hidden="true" size={24} strokeWidth={2.1} />
          <span>تسجيل الخروج</span>
        </button>
      </nav>
    </header>
  );
}
