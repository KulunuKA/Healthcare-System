"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PatientProvider } from "@/context/PatientProvider";
import { useAuth } from "@/context/AuthProvider";
import { User, CreditCard, Calendar, MessageSquare, Settings, LogOut } from "lucide-react";
import { Modal } from "antd";

export default function PatientLayout({ children }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { confirm } = Modal;

  const nav = [
    { label: "Profile", href: "/patient/me", icon: User },
    { label: "Payments", href: "/patient/payments", icon: CreditCard },
    { label: "My Appointments", href: "/patient/appointments", icon: Calendar },
    { label: "Messages", href: "/patient/messages", icon: MessageSquare },
    { label: "Settings", href: "/patient/settings", icon: Settings },
  ];

  return (
    <PatientProvider>
      <div className="min-h-screen flex bg-gray-50">
        <aside className="w-64 bg-white border-r flex flex-col">
          <div className="px-6 py-6">
            <div className="text-xl font-bold">MediConnect</div>
            <div className="text-sm text-gray-500 mt-1">Patient dashboard</div>
          </div>
          <nav className="px-4 py-3 flex-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center px-3 py-2 rounded-md mb-1 text-sm font-medium ${active ? 'bg-[var(--hero-bg)] text-[var(--primary-blue)]' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {Icon && <Icon className="h-4 w-4 mr-3" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t">
            <button
              onClick={() => {
                confirm({
                  title: "Confirm Logout",
                  content: "Are you sure you want to logout?",
                  onOk: () => logout(),
                });
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </PatientProvider>
  );
}
