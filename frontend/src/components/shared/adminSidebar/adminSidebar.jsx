import Link from "next/link";
import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Stethoscope,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Patients", href: "/admin/patients", icon: Users },
  { label: "Doctors", href: "/admin/doctors", icon: Stethoscope },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
];

export default function AdminSidebar() {
  return (
    <aside
      className="flex h-screen w-full flex-col overflow-hidden border-r"
      style={{
        backgroundColor: "var(--hero-bg)",
        borderColor: "var(--soft-blue)",
      }}
    >
      <div className="border-b px-5 py-5" style={{ borderColor: "var(--soft-blue)" }}>
        <Link href="/" className="flex items-center gap-2">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold text-white"
            style={{ background: "var(--primary-blue)" }}
          >
            M
          </span>
          <div className="leading-tight">
            <div className="text-sm font-bold" style={{ color: "var(--dark-navy)" }}>
              Medi<span style={{ color: "var(--primary-blue)" }}>Connect</span>
            </div>
            <div className="text-xs" style={{ color: "var(--text-gray)" }}>
              Admin Console
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-white/60"
              style={{ color: "var(--dark-navy)" }}
            >
              <Icon size={18} style={{ color: "var(--primary-blue)" }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 text-xs" style={{ color: "var(--text-gray)" }}>
        © 2026 MediConnect
      </div>
    </aside>
  );
}

