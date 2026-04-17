"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Spin, message, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { listDoctorsAPI } from "@/services/doctor.service";

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await listDoctorsAPI();

      const doctorsList = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setDoctors(doctorsList);
      setFilteredDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      message.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = doctors.filter(
      (doc) =>
        doc.fullName?.toLowerCase().includes(value.toLowerCase()) ||
        doc.specialty?.toLowerCase().includes(value.toLowerCase()) ||
        doc.email?.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredDoctors(filtered);
  };

  const getStatusBadge = (doctor) => {
    const isVerified = doctor.verified;
    const status = isVerified ? "Approved" : "Pending";
    return status;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" tip="Loading doctors..." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: "var(--dark-navy)" }}
          >
            Doctor Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-gray)" }}>
            Approve doctors and manage doctor profiles. Total: {doctors.length}
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <Input
            placeholder="Search doctors…"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ borderRadius: "8px", borderColor: "var(--soft-blue)" }}
          />
          <Link href="/admin/registerDoctor">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ backgroundColor: "var(--primary-blue)" }}
            >
              Add a doctor
            </Button>
          </Link>
        </div>
      </div>

      <div
        className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm"
        style={{ borderColor: "var(--soft-blue)" }}
      >
        <div
          className="grid grid-cols-12 gap-3 border-b px-5 py-3 text-xs font-semibold uppercase tracking-wide"
          style={{ borderColor: "var(--soft-blue)", color: "var(--text-gray)" }}
        >
          <div className="col-span-3">Full Name</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-3">Specialty</div>
          <div className="col-span-2">Telemedicine</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--soft-blue)" }}>
          {filteredDoctors.length === 0 ? (
            <div
              className="px-5 py-8 text-center"
              style={{ color: "var(--text-gray)" }}
            >
              {doctors.length === 0
                ? "No doctors found"
                : "No doctors match your search"}
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id || doctor._id}
                className="grid grid-cols-12 gap-3 px-5 py-4 text-sm"
              >
                <div
                  className="col-span-3 font-medium"
                  style={{ color: "var(--dark-navy)" }}
                >
                  {doctor.fullName || "—"}
                </div>
                <div
                  className="col-span-2 truncate"
                  style={{ color: "var(--text-gray)" }}
                >
                  {doctor.email}
                </div>
                <div
                  className="col-span-3"
                  style={{ color: "var(--text-gray)" }}
                >
                  {doctor.specialty || "—"}
                </div>
                <div
                  className="col-span-2"
                  style={{ color: "var(--text-gray)" }}
                >
                  {doctor.offerTelemedicine ? "✓ Yes" : "✗ No"}
                </div>
                <div className="col-span-2 text-right">
                  <span
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
                    style={{
                      borderColor: "var(--soft-blue)",
                      color:
                        getStatusBadge(doctor) === "Approved"
                          ? "var(--primary-blue)"
                          : "var(--text-gray)",
                      backgroundColor: "rgba(238,247,255,0.7)",
                    }}
                  >
                    {getStatusBadge(doctor)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
