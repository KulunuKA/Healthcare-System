"use client";

import SidePanel from "@/components/Sidepanel";
import { GoogleIcon } from "@/components/svgIcons";
import { Button, Input } from "@/components/ui";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useDoctor } from "@/context/DoctorProvider";
import { useAuth } from "@/context/AuthProvider";
import { setSession } from "@/utils/session";
import axiosInstance from "@/services/axiosInstance";
import { message } from "antd";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const { loginDoctor } = useDoctor();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      if (role === "doctor") {
        await loginDoctor({ email, password });
        message.success("Welcome back, Doctor!");
      } else {
        // Patient login
        const response = await axiosInstance.post("/api/patients/auth/login", {
          email,
          password,
        });
        const result = response.data.data;
        await setSession("accessToken", result.token);
        const userObj = {
          id: result.patient?.id || result.patient?._id,
          email: result.patient?.email,
          fullName: result.patient?.fullName,
          role: "patient",
        };
        await setSession("user", JSON.stringify(userObj));
        setUser(userObj);
        message.success("Welcome back!");
        window.location.href = "/patient";
      }
    } catch (err) {
      const msg =
        err?.message || err?.error || "Login failed. Please try again.";
      message.error(msg);
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

        {/* Role Toggle */}
        <div
          style={{
            display: "flex",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid #e8edf5",
            width: "100%",
            maxWidth: "360px",
          }}
        >
          {["patient", "doctor"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background:
                  role === r ? "var(--primary-blue)" : "transparent",
                color: role === r ? "#fff" : "var(--text-gray)",
                transition: "all 0.2s ease",
                letterSpacing: "0.3px",
                textTransform: "capitalize",
              }}
            >
              {r === "patient" ? "🧑 Patient" : "🩺 Doctor"}
            </button>
          ))}
        </div>

        <div className="w-full flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            icon={Mail}
            label="Email"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            icon={Lock}
            label="Password"
          />

          <div className="flex flex-col gap-2 mb-2">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Forgot Password?
            </Link>
          </div>
          <Button onClick={handleLogin} loading={loading}>
            Sign In as {role === "patient" ? "Patient" : "Doctor"}
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
            href={role === "doctor" ? "/register/doctor" : "/register/patient"}
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