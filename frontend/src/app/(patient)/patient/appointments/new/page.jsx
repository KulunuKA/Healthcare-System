"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spin, Empty, message } from "antd";
import AppointmentBookingForm from "@/components/AppointmentBookingForm";
import { usePatient } from "@/context/PatientProvider";

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookAppointment, doctors } = usePatient();

  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  const doctorId = searchParams.get("doctorId");

  useEffect(() => {
    if (doctorId && doctors.length > 0) {
      const selectedDoctor = doctors.find((d) => (d._id || d.id) === doctorId);
      setDoctor(selectedDoctor);
    }
    setLoadingDoctor(false);
  }, [doctorId, doctors]);

  const handleBookAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      await bookAppointment(appointmentData);
      message.success("Appointment booked successfully!");
      setTimeout(() => {
        router.push("/patient/appointments");
      }, 1500);
    } catch (error) {
      console.error("Booking failed:", error);
      message.error("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (loadingDoctor) return <div style={{ textAlign: "center", padding: "100px" }}><Spin size="large" /></div>;
  if (!doctor) return <div style={{ padding: "20px" }}><Empty description="Doctor not found" /></div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px", textAlign: "center", fontSize: "32px", fontWeight: "bold" }}>
        Schedule Your Appointment
      </h1>
      <AppointmentBookingForm
        doctorId={doctor._id || doctor.id}
        doctorName={doctor.name} // FIXED: Changed from fullName to name
        specialty={doctor.specialty}
        onSubmit={handleBookAppointment}
        loading={loading}
      />
    </div>
  );
}