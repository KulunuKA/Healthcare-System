"use client";

import Navbar from "@/components/shared/navbar/navbar";
import Footer from "@/components/shared/footer/footer";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  const hideNavbar = ["/login", "/register/patient"];
  const isDoctorDashboard = pathname.startsWith("/doctor");
  const isAdminDashboard = pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      {!isDoctorDashboard && !isAdminDashboard && <Navbar />}

      <main className="flex-1">{children}</main>

      {!hideNavbar.includes(pathname) &&
        !isDoctorDashboard &&
        !isAdminDashboard && <Footer />}
    </div>
  );
}
