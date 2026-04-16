"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "/doctors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isNavActive(href, pathname) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        borderColor: "var(--soft-blue)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = isNavActive(link.href, pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors duration-200 ${
                  active
                    ? "font-semibold text-[var(--primary-blue)]"
                    : "font-medium text-[var(--text-gray)] hover:text-[var(--primary-blue)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button href="/login" variant="outline">
            Login
          </Button>
          <Button href="/register/patient">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
