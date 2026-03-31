import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "/doctors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--hero-bg)",
        borderTop: "1px solid var(--soft-blue)",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold text-white"
              style={{ background: "var(--primary-blue)" }}
            >
              M
            </span>
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--dark-navy)" }}
            >
              Medi<span style={{ color: "var(--primary-blue)" }}>Connect</span>
            </h3>
          </div>
          <p
            className="mt-3 text-sm leading-6"
            style={{ color: "var(--text-gray)" }}
          >
            Smart healthcare appointment booking and telemedicine platform for
            patients, doctors, and admins.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            className="text-sm font-semibold"
            style={{ color: "var(--dark-navy)" }}
          >
            Quick Links
          </h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="w-fit text-[var(--text-gray)] transition-colors duration-200 hover:text-[var(--primary-blue)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4
            className="text-sm font-semibold"
            style={{ color: "var(--dark-navy)" }}
          >
            Contact
          </h4>
          <div
            className="mt-3 space-y-2 text-sm"
            style={{ color: "var(--text-gray)" }}
          >
            <p>📧 support@mediconnect.com</p>
            <p>📞 +94 71 234 5678</p>
            <p>📍 Colombo, Sri Lanka</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-4 text-center text-sm"
        style={{ borderColor: "var(--soft-blue)", color: "var(--text-gray)" }}
      >
        © 2026{" "}
        <span style={{ color: "var(--primary-blue)" }} className="font-medium">
          MediConnect
        </span>
        . All rights reserved.
      </div>
    </footer>
  );
}
