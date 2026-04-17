import AdminSidebar from "@/components/shared/adminSidebar/adminSidebar";

export const metadata = {
  title: "Admin | Smart Healthcare Platform",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed sidebar (desktop) */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block md:w-[280px]">
        <AdminSidebar />
      </div>

      {/* Content area (scrolls) */}
      <div className="min-h-screen md:pl-[280px]">
        <div className="flex min-h-screen min-w-0 flex-col">
          <header
            className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur"
            style={{ borderColor: "var(--soft-blue)" }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--dark-navy)" }}
                >
                  Admin Dashboard
                </div>
                <div className="text-xs" style={{ color: "var(--text-gray)" }}>
                  Manage users, appointments, and payments
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

