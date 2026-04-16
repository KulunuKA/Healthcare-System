import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Login | Smart Healthcare Platform",
};

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Sign in
      </h1>
      <p className="mt-3 text-slate-600">
        This is a placeholder UI. Wire it to your auth API when ready.
      </p>

      <form className="mt-8 grid gap-4 sm:max-w-md">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none ring-0 focus:border-slate-400"
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none ring-0 focus:border-slate-400"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <Button className="mt-2 w-full" type="button">
          Sign in
        </Button>
      </form>

      <div className="mt-8 text-slate-700">
        <p className="text-sm">
          Don’t have an account?{" "}
          <Link
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
            href="/register/patient"
          >
            Register as patient
          </Link>{" "}
          or{" "}
          <Link
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
            href="/register/doctor"
          >
            register as doctor
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
