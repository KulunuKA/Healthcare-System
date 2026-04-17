"use client";

import SidePanel from "@/components/Sidepanel";
import { GoogleIcon } from "@/components/svgIcons";
import { Button, Input } from "@/components/ui";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const [error, setError] = useState(null);

  const validateInputs = () => {
    let newError = {};
    if (!email) {
      newError.email = "Email is required";
    }
    if (!password) {
      newError.password = "Password is required";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await login(email, password);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      setError({ main: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <SidePanel />
      <div className="w-full h-full flex flex-col items-start gap-8 px-10 py-15 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-gray-500">
            Sign in to access your health dashboard
          </p>
        </div>

        {error && <div className="text-red-500 text-sm">{error.main}</div>}

        <div className="w-full flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            icon={Mail}
            label="Email"
            error={error?.email}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            icon={Lock}
            label="Password"
            error={error?.password}
          />

          <div className="flex flex-col gap-2 mb-2">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Forgot Password?
            </Link>
          </div>
          <Button type="button" onClick={handleLogin} loading={loading}>
            Sign In
          </Button>
        </div>

        <div className="divider">or continue with</div>

        <button className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 flex items-center justify-center gap-2 transition-colors duration-200 hover:border-gray-400">
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-sm text-gray-400 mt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/register/patient"
            className="font-semibold"
            style={{ color: "var(--primary-blue)" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
