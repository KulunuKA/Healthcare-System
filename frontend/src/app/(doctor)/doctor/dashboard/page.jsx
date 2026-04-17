"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useDoctor } from "@/context/DoctorProvider";
import {
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  Activity,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import TelemedicineRequestsSection from "@/components/doctor/TelemedicineRequestsSection";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { profile, fetchProfile, loadingProfile } = useDoctor();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  if (!mounted) return null;

  const availabilityCount = profile?.availability?.length || 0;
  const isVerified = profile?.verified || user?.verified || false;

  const stats = [
    {
      label: "Availability Slots",
      value: availabilityCount,
      color: "blue",
      icon: Clock,
    },
    {
      label: "Verification Status",
      value: isVerified ? "Verified" : "Pending",
      color: isVerified ? "green" : "orange",
      icon: ShieldCheck,
    },
    {
      label: "Specialty",
      value: profile?.specialty || user?.specialty || "—",
      color: "rose",
      icon: Activity,
    },
  ];

  const quickActions = [
    {
      label: "Manage Appointments",
      href: "/doctor/appointments",
      icon: Calendar,
      desc: "Review and respond to patient appointments",
    },
    {
      label: "Set Availability",
      href: "/doctor/availability",
      icon: Clock,
      desc: "Update your available time slots",
    },
    {
      label: "Issue Prescription",
      href: "/doctor/prescriptions",
      icon: FileText,
      desc: "Write and send prescriptions to patients",
    },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner animate-fade-in">
        <h2>
          Welcome back, Dr. {user?.fullName?.split(" ").slice(-1)[0] || "Doctor"}{" "}
          👋
        </h2>
        <p>
          Here&apos;s an overview of your practice. Stay on top of your
          schedule and patient care.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`stat-card ${stat.color} animate-fade-in animate-delay-${i + 1}`}
            >
              <div className="stat-card-icon">
                <Icon size={22} />
              </div>
              <div className="stat-card-value">
                {loadingProfile ? "…" : stat.value}
              </div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="content-card animate-fade-in animate-delay-4">
        <div className="content-card-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="content-card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {quickActions.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "18px 20px",
                  borderRadius: "14px",
                  border: "1px solid #e8edf5",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "all 0.2s ease",
                  background: "#fafbff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#c7d2fe";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(99,102,241,.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8edf5";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6366f1",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e293b",
                      marginBottom: "2px",
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {desc}
                  </div>
                </div>
                <ArrowRight size={16} color="#cbd5e1" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <TelemedicineRequestsSection />
    </div>
  );
}
