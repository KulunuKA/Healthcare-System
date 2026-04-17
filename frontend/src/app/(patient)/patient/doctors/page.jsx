"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Button, Select, Input, Spin, Empty, Badge, Tag } from "antd";
import { SearchOutlined, TeamOutlined } from "@ant-design/icons";
import { usePatient } from "@/context/PatientProvider";
import Link from "next/link";

const specialties = [
  "General Physician",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "General Practice",
  "Dentistry",
];

export default function DoctorsPage() {
  const searchParams = useSearchParams();
  const { fetchDoctorsBySpecialty, doctors, loadingDoctors } = usePatient();
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    const fromUrl = searchParams.get("specialty");
    if (fromUrl) {
      setSelectedSpecialty(fromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedSpecialty) {
      loadDoctors();
    }
  }, [selectedSpecialty]);

  const loadDoctors = async () => {
    try {
      await fetchDoctorsBySpecialty(selectedSpecialty);
    } catch (error) {
      console.error("Error loading doctors:", error);
    }
  };

  useEffect(() => {
    const filtered = doctors.filter(
      (doctor) =>
        doctor.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredDoctors(filtered);
  }, [doctors, searchText]);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1
        style={{ marginBottom: "30px", fontSize: "32px", fontWeight: "bold" }}
      >
        <TeamOutlined style={{ marginRight: "10px" }} />
        Find a Doctor
      </h1>

      {/* Specialty Filter */}
      <Card style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            Select Specialty
          </label>
          <Select
            placeholder="Choose a specialty"
            value={selectedSpecialty}
            onChange={setSelectedSpecialty}
            style={{ width: "100%", maxWidth: "400px" }}
            options={specialties.map((s) => ({ label: s, value: s }))}
          />
        </div>

        {selectedSpecialty && (
          <>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
              }}
            >
              Search Doctor
            </label>
            <Input
              placeholder="Search by name or email"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
          </>
        )}
      </Card>

      {/* Doctors Grid */}
      {!selectedSpecialty ? (
        <Empty description="Select a specialty to view available doctors" />
      ) : loadingDoctors ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" tip="Loading doctors..." />
        </div>
      ) : filteredDoctors.length === 0 ? (
        <Empty description="No doctors found in this specialty" />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor._id || doctor.id}
              hoverable
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "15px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    margin: "0 0 10px 0",
                  }}
                >
                  {doctor.fullName || "Dr. N/A"}
                </h3>
                <Tag color="blue">{doctor.specialty}</Tag>
                {doctor.verified && (
                  <Tag color="green" style={{ marginLeft: "5px" }}>
                    Verified
                  </Tag>
                )}
              </div>

              <div style={{ marginBottom: "15px", flex: 1 }}>
                <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                  <strong>Email:</strong> {doctor.email}
                </p>
                {doctor.experience && (
                  <p
                    style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}
                  >
                    <strong>Experience:</strong> {doctor.experience} years
                  </p>
                )}
                {doctor.consultationFee && (
                  <p
                    style={{
                      margin: "5px 0",
                      color: "#1890ff",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Consultation: ${doctor.consultationFee}
                  </p>
                )}
              </div>

              <Link
                href={`/patient/appointments/new?doctorId=${doctor._id || doctor.id}`}
              >
                <Button type="primary" block>
                  Book Appointment
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
