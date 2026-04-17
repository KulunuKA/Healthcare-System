import Link from "next/link";

const cards = [
  {
    title: "Patient Management",
    description: "View, search, and manage patient accounts.",
    href: "/admin/patients",
  },
  {
    title: "Doctor Management",
    description: "Approve doctors and maintain doctor profiles.",
    href: "/admin/doctors",
  },
  {
    title: "Appointment Management",
    description: "Track bookings, status, and schedules.",
    href: "/admin/appointments",
  },
  {
    title: "Payment Management",
    description: "Review payments, refunds, and invoices.",
    href: "/admin/payments",
  },
];

export const metadata = {
  title: "Admin Dashboard | Smart Healthcare Platform",
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8" style={{ borderColor: "var(--soft-blue)" }}>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--dark-navy)" }}>
          Overview
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-gray)" }}>
          This is a scaffolded admin dashboard UI. Connect each section to your backend APIs when ready.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border bg-white p-5 transition-colors hover:bg-[var(--hero-bg)]"
              style={{ borderColor: "var(--soft-blue)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--dark-navy)" }}>
                    {card.title}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "var(--text-gray)" }}>
                    {card.description}
                  </div>
                </div>
                <span
                  className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl border bg-white text-sm transition-colors group-hover:border-[var(--primary-blue)]"
                  style={{ borderColor: "var(--soft-blue)", color: "var(--primary-blue)" }}
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

