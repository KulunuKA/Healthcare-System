"use client";

import Navbar from "@/components/shared/navbar/navbar";
import Footer from "@/components/shared/footer/footer";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  const hideNavbar = ["/login", "/register/doctor", "/register/patient"];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">{children}</main>

      {!hideNavbar.includes(pathname) && <Footer />}
    </div>
  );
}