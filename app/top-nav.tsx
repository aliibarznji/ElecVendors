import { Globe2, LogOut } from "lucide-react";
import Link from "next/link";

export function TopNav() {
  return (
    <header className="top-nav">
      <Link className="brand" href="/" aria-label="Electromall Vendors dashboard">
       
        <span className="brand-text">electromall Vendors</span>
      </Link>

      <nav className="nav-actions" aria-label="Mr . Ahmed navigation">
        <span className="user-name">Sumaya</span>
        <button className="nav-action" type="button" aria-label="Change language">
          <Globe2 aria-hidden="true" size={24} strokeWidth={2.1} />
          <span>English</span>
        </button>
        <button className="nav-action" type="button">
          <LogOut aria-hidden="true" size={24} strokeWidth={2.1} />
          <span>Logout</span>
        </button>
      </nav>
    </header>
  );
}
