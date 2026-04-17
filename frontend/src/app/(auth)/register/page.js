"use client";

import SidePanel from "@/components/Sidepanel";
import { Button } from "@/components/ui";
import Link from "next/link";
import { Stethoscope, User } from "lucide-react";

export default function RegisterChoicePage() {
  return (
    <div className="w-full h-screen flex">
      <SidePanel />
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 px-10 py-16">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-gray-500">
            Choose your role to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Patient Registration Card */}
          <Link href="/register/patient">
            <div className="h-full p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer bg-white">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">I'm a Patient</h2>
                <p className="text-sm text-gray-600">
                  Book appointments with doctors, manage your health records
                </p>
                <Button className="mt-4 w-full" type="button">
                  Register as Patient
                </Button>
              </div>
            </div>
          </Link>

          {/* Doctor Registration Card */}
          <Link href="/register/doctor">
            <div className="h-full p-6 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-lg transition-all cursor-pointer bg-white">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">I'm a Doctor</h2>
                <p className="text-sm text-gray-600">
                  Manage your appointments and patient consultations
                </p>
                <Button className="mt-4 w-full" type="button">
                  Register as Doctor
                </Button>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold"
            style={{ color: "var(--primary-blue)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
