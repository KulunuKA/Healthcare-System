import Button from "@/components/ui/Button";

export const metadata = {
  title: "Home | Smart Healthcare Platform",
  description: "Smart healthcare appointment booking and telemedicine platform.",
};

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 text-[#2f2d6b]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome to MediConnect
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Book appointments, find specialists, and manage your care journey in one
          place.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/doctors">Find doctors</Button>
          <Button href="/login" variant="outline">
            Sign in
          </Button>
          <Button href="/register/patient" variant="outline">
            Register as patient
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Appointments", body: "Schedule consultations with ease." },
            { title: "Telemedicine", body: "Join remote consultations securely." },
            { title: "Admin tools", body: "Manage doctors, patients, and payments." },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-slate-700">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

