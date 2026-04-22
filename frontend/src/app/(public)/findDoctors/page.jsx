'use client';
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  Baby,
  Brain,
  HeartPulse,
  ShieldPlus,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

const specialties = [
  { name: "General Physician", Icon: Stethoscope },
  { name: "Cardiology", Icon: HeartPulse },
  { name: "Neurology", Icon: Brain },
  { name: "Pediatrics", Icon: Baby },
  { name: "Dermatology", Icon: ShieldPlus },
  { name: "Psychiatry", Icon: UserRound },
];

export default function DoctorsPage() {
  const router = useRouter();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 text-[#2f2d6b]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Find a Doctor
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Explore qualified healthcare professionals by specialty and choose the right doctor for your needs.
        </p>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Browse doctors, check availability, and schedule appointments online.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {specialties.map(({ name, Icon }) => (
            <Link
              key={name}
              href={`/ourdoctors?specialty=${encodeURIComponent(name)}`}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 cursor-pointer transition hover:border-slate-300 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f2d6b]"
            >
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Icon
                    className="h-5 w-5 text-[#2f2d6b]"
                    aria-hidden="true"
                  />
                  <span>{name}</span>
                </h2>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button onClick={() => router.push("/login")}>
            Sign in to book an appointment
          </Button>
          <Button onClick={() => router.push("/contact")} variant="outline">
            Contact support
          </Button>
        </div>
      </div>
    </div>
  );
}