const rows = [
  { id: "A-7781", patient: "Kasun Perera", doctor: "Dr. Amila Fernando", date: "2026-04-20", status: "Confirmed" },
  { id: "A-7782", patient: "Nimali Silva", doctor: "Dr. Sachini Gunasekara", date: "2026-04-21", status: "Pending" },
  { id: "A-7783", patient: "Tharindu Jay", doctor: "Dr. Ishan Perera", date: "2026-04-22", status: "Completed" },
];

export const metadata = {
  title: "Appointment Management | Admin",
};

export default function AppointmentManagementPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--dark-navy)" }}>
            Appointment Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-gray)" }}>
            Monitor appointment requests and status changes.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <input
            className="w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400 sm:w-80"
            style={{ borderColor: "var(--soft-blue)" }}
            placeholder="Search appointments…"
          />
          <button
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: "var(--primary-blue)" }}
            type="button"
          >
            Export
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ borderColor: "var(--soft-blue)" }}>
        <div className="grid grid-cols-12 gap-3 border-b px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ borderColor: "var(--soft-blue)", color: "var(--text-gray)" }}>
          <div className="col-span-2">Appt ID</div>
          <div className="col-span-3">Patient</div>
          <div className="col-span-3">Doctor</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--soft-blue)" }}>
          {rows.map((r) => (
            <div key={r.id} className="grid grid-cols-12 gap-3 px-5 py-4 text-sm">
              <div className="col-span-2 font-medium" style={{ color: "var(--dark-navy)" }}>
                {r.id}
              </div>
              <div className="col-span-3" style={{ color: "var(--dark-navy)" }}>
                {r.patient}
              </div>
              <div className="col-span-3" style={{ color: "var(--dark-navy)" }}>
                {r.doctor}
              </div>
              <div className="col-span-2" style={{ color: "var(--text-gray)" }}>
                {r.date}
              </div>
              <div className="col-span-2 text-right">
                <span
                  className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
                  style={{
                    borderColor: "var(--soft-blue)",
                    color:
                      r.status === "Confirmed"
                        ? "var(--primary-blue)"
                        : r.status === "Completed"
                          ? "var(--dark-navy)"
                          : "var(--text-gray)",
                    backgroundColor: "rgba(238,247,255,0.7)",
                  }}
                >
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

