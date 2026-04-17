"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  FileText,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import "./doctor-layout.css";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Appointments",
    href: "/doctor/appointments",
    icon: Calendar,
  },
  {
    label: "Availability",
    href: "/doctor/availability",
    icon: Clock,
  },
  {
    label: "Prescriptions",
    href: "/doctor/prescriptions",
    icon: FileText,
  },
  {
    label: "Profile",
    href: "/doctor/profile",
    icon: UserCircle,
  },
];

const PAGE_TITLES = {
  "/doctor/dashboard": "Dashboard",
  "/doctor/appointments": "Appointments",
  "/doctor/availability": "Availability",
  "/doctor/prescriptions": "Prescriptions",
  "/doctor/profile": "My Profile",
};

export default function DoctorLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "DR";

  const pageTitle = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <div className="doctor-shell">
      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className={`doctor-sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">M</div>
          <div className="sidebar-brand-text">
            <h2>MediConnect</h2>
            <p>Doctor Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-nav-item ${pathname === href ? "active" : ""}`}
            >
              <span className="nav-icon-wrap">
                <Icon size={18} />
              </span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={logout}>
            <span className="nav-icon-wrap">
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────── */}
      <div className={`doctor-main ${collapsed ? "collapsed" : ""}`}>
        {/* Top bar */}
        <header className="doctor-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </button>
            <span className="topbar-title">{pageTitle}</span>
          </div>

          <div className="topbar-right">
            <div className="topbar-user-info">
              <span className="topbar-user-name">
                {user?.fullName || "Doctor"}
              </span>
              <span className="topbar-user-role">
                {user?.specialty || "Doctor"}
              </span>
            </div>
            <div className="topbar-avatar">{initials}</div>
          </div>
        </header>

        {/* Page content */}
        <div className="doctor-page-content">{children}</div>
      </div>
    </div>
  );
}
