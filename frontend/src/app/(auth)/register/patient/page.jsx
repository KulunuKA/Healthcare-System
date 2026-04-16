import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Register (Patient) | Smart Healthcare Platform",
};

export default function RegisterPatientPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Create a patient account
      </h1>
      <p className="mt-3 text-slate-600">
        Placeholder registration screen. Connect this to your backend when
        ready.
      </p>

      <form className="mt-8 grid gap-4 sm:max-w-xl sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">First name</span>
          <input
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-400"
            name="firstName"
            placeholder="Dilshan"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Last name</span>
          <input
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-400"
            name="lastName"
            placeholder="Perera"
          />
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-400"
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-400"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </label>

        <Button className="sm:col-span-2 mt-2 w-full" type="button">
          Create account
        </Button>
      </form>

      <p className="mt-8 text-sm text-slate-700">
        Already have an account?{" "}
        <Link
          className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
          href="/login"
        >
          Sign in
        </Link>
        .
      </p>
    </div>
  );
}
