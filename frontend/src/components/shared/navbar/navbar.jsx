import { useEffect, useState } from "react";
import RegisterModal from "@/components/RegisterModal";
import Link from "next/link";
import { getSessionValue } from "@/utils/session";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "/doctors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = getSessionValue("user");
    if (user) {
      setIsLoggedIn(true);
      setUser(user);
    }
  }, []);

  // helper to compute initial
  const getFirstChar = (user) => {
    const fullName = user?.profile?.fullName;
    console.log(fullName);
    if (typeof fullName === "string" && fullName.trim().length > 0) {
      return fullName.trim().charAt(0).toUpperCase();
    }
    if (fullName && typeof fullName === "object") {
      const first = fullName.firstName || fullName.firstname || fullName.name;
      if (first) return String(first).trim().charAt(0).toUpperCase();
    }
    if (user?.role) return String(user.role).trim().charAt(0).toUpperCase();
    return "?";
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          borderColor: "var(--soft-blue)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
            style={{ color: "var(--dark-navy)" }}
          >
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold text-white"
              style={{ background: "var(--primary-blue)" }}
            >
              M
            </span>
            Medi<span style={{ color: "var(--primary-blue)" }}>Connect</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[var(--text-gray)] transition-colors duration-200 hover:text-[var(--primary-blue)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              // show circular initial when logged in
              <Link
                href={user?.role === "patient" ? "/patient" : "/"}
                className="flex items-center"
              >
                <div
                  title={
                    typeof user?.profile?.fullName === "string"
                      ? user.profile.fullName
                      : user?.role
                  }
                  className="h-9 w-9 rounded-full flex items-center justify-center bg-[var(--primary-blue)] text-white font-semibold"
                >
                  {getFirstChar(user)}
                </div>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-[var(--primary-blue)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--primary-blue)] transition-colors duration-200 hover:bg-[var(--hero-bg)]"
                >
                  Login
                </Link>
                <p
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity duration-200 hover:opacity-90"
                  style={{ backgroundColor: "var(--primary-blue)" }}
                >
                  Get Started
                </p>
              </>
            )}
          </div>
        </div>
      </header>

      {/* register modal */}
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
