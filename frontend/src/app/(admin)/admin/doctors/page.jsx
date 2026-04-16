const rows = [
  { id: "D-2101", name: "Dr. Amila Fernando", specialty: "Cardiology", status: "Approved" },
  { id: "D-2102", name: "Dr. Sachini Gunasekara", specialty: "Dermatology", status: "Pending" },
  { id: "D-2103", name: "Dr. Ishan Perera", specialty: "Neurology", status: "Approved" },
];

export const metadata = {
  title: "Doctor Management | Admin",
};

export default function DoctorManagementPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--dark-navy)" }}>
            Doctor Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-gray)" }}>
            Approve doctors and manage doctor profiles.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <input
            className="w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400 sm:w-80"
            style={{ borderColor: "var(--soft-blue)" }}
            placeholder="Search doctors…"
          />
          <button
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: "var(--primary-blue)" }}
            type="button"
          >
            Invite
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ borderColor: "var(--soft-blue)" }}>
        <div className="grid grid-cols-12 gap-3 border-b px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ borderColor: "var(--soft-blue)", color: "var(--text-gray)" }}>
          <div className="col-span-3">Doctor ID</div>
          <div className="col-span-5">Name</div>
          <div className="col-span-3">Specialty</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--soft-blue)" }}>
          {rows.map((r) => (
            <div key={r.id} className="grid grid-cols-12 gap-3 px-5 py-4 text-sm">
              <div className="col-span-3 font-medium" style={{ color: "var(--dark-navy)" }}>
                {r.id}
              </div>
              <div className="col-span-5" style={{ color: "var(--dark-navy)" }}>
                {r.name}
              </div>
              <div className="col-span-3" style={{ color: "var(--text-gray)" }}>
                {r.specialty}
              </div>
              <div className="col-span-1 text-right">
                <span
                  className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
                  style={{
                    borderColor: "var(--soft-blue)",
                    color: r.status === "Approved" ? "var(--primary-blue)" : "var(--text-gray)",
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

