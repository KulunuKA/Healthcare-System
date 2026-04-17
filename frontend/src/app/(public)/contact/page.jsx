import Link from "next/link";

export const metadata = {
  title: "Contact | Smart Healthcare Platform",
  description: "Contact Smart Healthcare Platform support and administration.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 text-[#2f2d6b]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Contact us
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Have a question about appointments or telemedicine? Reach out and our
          team will get back to you.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Support</h2>
            <div className="mt-3 space-y-2 text-slate-700">
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a
                  className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                  href="mailto:support@smarthealthcare.local"
                >
                  support@smarthealthcare.local
                </a>
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                <a
                  className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                  href="tel:+94000000000"
                >
                  +94 00 000 0000
                </a>
              </p>
              <p>
                <span className="font-medium">Hours:</span> Mon–Fri, 9:00–17:00
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Quick links</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                className="w-fit underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                href="/"
              >
                Home
              </Link>
              <Link
                className="w-fit underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                href="/doctors"
              >
                Find doctors
              </Link>
              <Link
                className="w-fit underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                href="/about"
              >
                About
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Address</h2>
          <p className="mt-2 text-slate-700">
            Smart Healthcare Platform, Colombo, Sri Lanka
          </p>
        </div>
      </div>
    </div>
  );
}
