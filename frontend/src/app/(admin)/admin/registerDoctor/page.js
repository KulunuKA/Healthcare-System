"use client";

import { Button, Input } from "@/components/ui";
import { Mail, Lock, User, Stethoscope } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useDoctor } from "@/context/DoctorProvider";
import { message } from "antd";

const SPECIALTIES = [
  "General Physician",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  // "Ophthalmology",
  // "ENT",
  "Psychiatry",
  // "Oncology",
  // "Urology",
  // "Radiology",
  // "Pathology",
  // "Other",
];

export default function AdminRegisterDoctorPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);
  const { registerDoctor } = useDoctor();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !specialty) {
      message.warning("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      message.warning("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerDoctor({ email, password, fullName, specialty });
      message.success("Registration successful!");
    } catch (err) {
      const msg = err?.message || err?.error || "Registration failed";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold" style={{ color: "var(--dark-navy)" }}>
          Doctor Registration
        </h1>
        <p className="text-sm" style={{ color: "var(--text-gray)" }}>
          Create a professional account to manage patients
        </p>
      </div>

      <form
        onSubmit={handleRegister}
        className="mt-6 flex w-full flex-col gap-4"
        style={{ maxWidth: "480px" }}
      >
        <Input
          type="text"
          placeholder="Dr. John Smith"
          value={fullName}
          onChange={setFullName}
          icon={User}
          label="Full Name"
          required
        />

        <Input
          type="email"
          placeholder="doctor@example.com"
          value={email}
          onChange={setEmail}
          icon={Mail}
          label="Email"
          required
        />

        <div className="flex flex-col gap-2">
          <label className="pl-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Specialty <span style={{ color: "var(--primary-blue)", marginLeft: "3px" }}>*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 transform items-center text-gray-500">
              <Stethoscope size={15} />
            </span>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white p-3 pl-10 text-sm font-normal text-gray-900"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option value="" disabled>
                Select your specialty
              </option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={setPassword}
          icon={Lock}
          label="Password"
          required
        />

        <Input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          icon={Lock}
          label="Confirm Password"
          required
        />

        <div style={{ marginTop: "8px" }}>
          <Button type="submit" loading={loading}>
            Create Account
          </Button>
        </div>
      </form>

      <p className="mt-6 text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "var(--primary-blue)" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
