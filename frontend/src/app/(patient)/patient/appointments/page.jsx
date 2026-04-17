"use client";

import { useState, useEffect } from "react";
import { Card, Button, Tag, Empty, Spin, Modal, message, Tooltip } from "antd";
import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined, EyeOutlined, WalletOutlined } from "@ant-design/icons";
import { usePatient } from "@/context/PatientProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const statusColors = { scheduled: "processing", accepted: "success", rejected: "error", cancelled: "default", completed: "cyan" };
const statusLabels = { scheduled: "Pending", accepted: "Confirmed", rejected: "Rejected", cancelled: "Cancelled", completed: "Completed" };

export default function AppointmentsPage() {
  const router = useRouter();
  const { fetchPatientAppointments, cancelAppointment, appointments } = usePatient();
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      await fetchPatientAppointments();
    } catch (error) {
      message.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>My Appointments</h1>
        <Link href="/patient/doctors"><Button type="primary">Book New</Button></Link>
      </div>

      {(Array.isArray(appointments) ? appointments : []).map((appointment) => (
        <Card key={appointment._id || appointment.id} style={{ marginBottom: "20px", borderLeft: `4px solid ${statusColors[appointment.status]}` }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{appointment.doctorName || appointment.doctor?.name || "Dr. Kamal Perera"}</h3>
            <Tag color={statusColors[appointment.status]}>{statusLabels[appointment.status]}</Tag>
          </div>
          <div style={{ margin: "15px 0" }}>
            <p><CalendarOutlined /> {dayjs(appointment.date).format("MMM DD, YYYY")}</p>
            <p><ClockCircleOutlined /> {appointment.time || "12:00"}</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button icon={<EyeOutlined />} />
            {appointment.status === "scheduled" && !appointment.isPaid && (
              <Button 
                type="primary" 
                icon={<WalletOutlined />} 
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={() => {
                  const fee = appointment.consultationFee || appointment.fee || 2500;
                  const appId = appointment._id || appointment.id;
                  router.push(`/payment?appointmentId=${appId}&amount=${fee}`);
                }}
              >
                Pay Now
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}