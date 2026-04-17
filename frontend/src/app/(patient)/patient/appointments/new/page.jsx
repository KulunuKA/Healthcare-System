"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Spin, Empty, message } from "antd";
import AppointmentBookingForm from "@/components/AppointmentBookingForm";
import { usePatient } from "@/context/PatientProvider";
import { getDoctorByIdAPI } from "@/services/patient.service";
import { getSessionValue } from "@/utils/session";

function doctorMatchesId(d, id) {
  if (id == null || id === "") return false;
  const sid = String(id);
  return String(d._id ?? d.id) === sid;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookAppointment, submitTelemedicineRequest, doctors } = usePatient();

  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  const doctorId = searchParams.get("doctorId");
  const telemedicineParam = searchParams.get("telemedicine");
  const wantsTelemedicine =
    telemedicineParam === "true" || telemedicineParam === "1";

  const telemedicineBooking =
    wantsTelemedicine && Boolean(doctor?.offerTelemedicine);

  useEffect(() => {
    let cancelled = false;

    async function resolveDoctor() {
      if (!doctorId) {
        setDoctor(null);
        setLoadingDoctor(false);
        return;
      }

      const fromList = (Array.isArray(doctors) ? doctors : []).find((d) =>
        doctorMatchesId(d, doctorId),
      );
      if (fromList) {
        setDoctor(fromList);
        setLoadingDoctor(false);
        return;
      }

      setLoadingDoctor(true);
      try {
        const token = getSessionValue("accessToken");
        const res = await getDoctorByIdAPI(token, doctorId);
        const payload = res.data?.data;
        if (!cancelled) setDoctor(payload ?? null);
      } catch (err) {
        console.error("Failed to load doctor:", err);
        if (!cancelled) setDoctor(null);
      } finally {
        if (!cancelled) setLoadingDoctor(false);
      }
    }

    resolveDoctor();
    return () => {
      cancelled = true;
    };
  }, [doctorId, doctors]);

  const handleBookAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      if (telemedicineBooking) {
        await submitTelemedicineRequest(appointmentData);
        message.success(
          "Your telemedicine request was submitted. The doctor will review it and send a date, time, and meeting link.",
        );
      } else {
        await bookAppointment(appointmentData);
        message.success("Appointment booked successfully!");
      }
      setTimeout(() => {
        router.push("/patient/appointments");
      }, 1500);
    } catch (error) {
      console.error("Booking failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" description="Loading..." />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Empty
          description={
            doctorId
              ? "Doctor not found"
              : "Choose a doctor from the list to book an appointment"
          }
          style={{ marginTop: "50px" }}
        >
          <Link href="/ourdoctors" style={{ color: "#1890ff" }}>
            Browse doctors
          </Link>
        </Empty>
      </div>
    );
  }

  if (wantsTelemedicine && !doctor.offerTelemedicine) {
    return (
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Empty
          description="This doctor is not available for telemedicine"
          style={{ marginTop: "50px" }}
        >
          <Link href="/ourdoctors" style={{ color: "#1890ff" }}>
            Back to doctors
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1
        style={{
          marginBottom: "30px",
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        Schedule Your Appointment
      </h1>

      <AppointmentBookingForm
        doctorId={doctor._id || doctor.id}
        doctorName={doctor.fullName}
        specialty={doctor.specialty}
        telemedicine={Boolean(telemedicineBooking)}
        onSubmit={handleBookAppointment}
        loading={loading}
      />
    </div>
  );
}
