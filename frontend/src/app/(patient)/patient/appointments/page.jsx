"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Tag,
  Empty,
  Spin,
  Modal,
  message,
  Tooltip,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { usePatient } from "@/context/PatientProvider";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const statusColors = {
  scheduled: "processing",
  accepted: "success",
  rejected: "error",
  cancelled: "default",
  completed: "cyan",
};

const statusLabels = {
  scheduled: "Pending",
  accepted: "Confirmed",
  rejected: "Rejected",
  cancelled: "Cancelled",
  completed: "Completed",
};

export default function AppointmentsPage() {
  const {
    fetchPatientAppointments,
    cancelAppointment,
    appointments,
    loadingAppointments,
  } = usePatient();
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchPatientAppointments();
    } catch (error) {
      console.error("Error loading appointments:", error);
      setError("Failed to load appointments");
      message.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    Modal.confirm({
      title: "Cancel Appointment",
      content: "Are you sure you want to cancel this appointment?",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk: async () => {
        setCancelingId(appointmentId);
        try {
          await cancelAppointment(appointmentId);
          message.success("Appointment cancelled successfully");
          await loadAppointments();
        } catch (error) {
          console.error("Error cancelling appointment:", error);
          message.error(error.message || "Failed to cancel appointment");
        } finally {
          setCancelingId(null);
        }
      },
    });
  };

  const canCancel = (appointment) => {
    return (
      appointment.status !== "cancelled" && appointment.status !== "completed"
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" description="Loading appointments..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
          <CalendarOutlined style={{ marginRight: "10px" }} />
          My Appointments
        </h1>
        <Link href="/patient/doctors">
          <Button type="primary" size="large">
            Book New Appointment
          </Button>
        </Link>
      </div>

      {(Array.isArray(appointments) ? appointments : []).length === 0 ? (
        <Empty
          description={error || "No appointments found"}
          style={{ marginTop: "50px" }}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {(Array.isArray(appointments) ? appointments : []).map(
            (appointment) => (
              <Card
                key={appointment._id || appointment.id}
                hoverable
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderLeft: `4px solid ${statusColors[appointment.status] || "default"}`,
                }}
              >
                {/* Header */}
                <div style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "10px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        margin: 0,
                      }}
                    >
                      {appointment.doctor?.fullName || "Unknown"}
                    </h3>
                    <Tag color={statusColors[appointment.status]}>
                      {statusLabels[appointment.status]}
                    </Tag>
                  </div>
                  <p
                    style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}
                  >
                    {appointment.doctor?.specialty || "General Practice"}
                  </p>
                </div>

                {/* Details */}
                <div style={{ marginBottom: "15px", flex: 1 }}>
                  <p
                    style={{
                      margin: "8px 0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CalendarOutlined
                      style={{ marginRight: "8px", color: "#1890ff" }}
                    />
                    <strong>Date:</strong>{" "}
                    {dayjs(appointment.startAt).format("MMM DD, YYYY")}
                  </p>
                  <p
                    style={{
                      margin: "8px 0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ClockCircleOutlined
                      style={{ marginRight: "8px", color: "#1890ff" }}
                    />
                    <strong>Time:</strong>{" "}
                    {dayjs(appointment.startAt).format("HH:mm")}
                  </p>
                  {appointment.reason && (
                    <p
                      style={{
                        margin: "8px 0",
                        color: "#666",
                        fontSize: "14px",
                      }}
                    >
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                  )}
                  <p
                    style={{ margin: "8px 0", color: "#999", fontSize: "12px" }}
                  >
                    <strong>Booked:</strong>{" "}
                    {dayjs(appointment.createdAt).fromNow()}
                  </p>
                </div>

                {/* Status Message */}
                {appointment.status === "rejected" && (
                  <Card
                    style={{
                      backgroundColor: "#fff2f0",
                      marginBottom: "15px",
                      border: "1px solid #ffccc7",
                      padding: "8px 12px",
                    }}
                  >
                    <p
                      style={{ margin: 0, color: "#cf1322", fontSize: "13px" }}
                    >
                      This appointment request was declined by the doctor.
                    </p>
                  </Card>
                )}

                {appointment.status === "accepted" && (
                  <Card
                    style={{
                      backgroundColor: "#f6ffed",
                      marginBottom: "15px",
                      border: "1px solid #b7eb8f",
                      padding: "8px 12px",
                    }}
                  >
                    <p
                      style={{ margin: 0, color: "#274e0f", fontSize: "13px" }}
                    >
                      ✓ This appointment is confirmed. Doctor will see you on
                      the scheduled date/time.
                    </p>
                  </Card>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <Tooltip title="View Details">
                    <Button
                      icon={<EyeOutlined />}
                      type="default"
                      block
                      disabled={appointment.status === "cancelled"}
                    />
                  </Tooltip>
                  {canCancel(appointment) && (
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      block
                      loading={
                        cancelingId === (appointment._id || appointment.id)
                      }
                      onClick={() =>
                        handleCancelAppointment(
                          appointment._id || appointment.id,
                        )
                      }
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            ),
          )}
        </div>
      )}
    </div>
  );
}
