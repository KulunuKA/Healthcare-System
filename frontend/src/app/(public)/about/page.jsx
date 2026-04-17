import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "About | Smart Healthcare Platform",
  description: "Learn about the Smart Healthcare Platform.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 text-[#2f2d6b]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          About
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Smart Healthcare Platform is an appointment booking and telemedicine
          experience designed to make it easier for patients and doctors to
          connect.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Appointments",
              body: "Book consultations with specialists and manage schedules.",
            },
            {
              title: "Telemedicine",
              body: "Join remote consultations securely from anywhere.",
            },
            {
              title: "Care journey",
              body: "Keep everything organized in one place as the product grows.",
            },
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

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/doctors">
            Find doctors
          </Button>
          <Button href="/contact" variant="outline">
            Contact us
          </Button>
        </div>
      </div>
    </div>
  );
}
