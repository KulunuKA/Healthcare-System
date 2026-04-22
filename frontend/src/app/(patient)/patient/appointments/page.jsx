"use client";

import { useState, useEffect } from "react";
import { Card, Button, Tag, Empty, Spin, Modal, message, Tooltip } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  VideoCameraOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import PatientTmRequestCard from "@/components/telemedicine/PatientTmRequestCard";
import { usePatient } from "@/context/PatientProvider";
import { useRouter } from "next/navigation";
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
    fetchTelemedicineRequests,
    cancelAppointment,
    cancelTelemedicineRequest,
    payTelemedicineRequest,
    appointments,
    telemedicineRequests,
  } = usePatient();
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [cancelingTmId, setCancelingTmId] = useState(null);
  const [payingTmId, setPayingTmId] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchPatientAppointments(),
        fetchTelemedicineRequests(),
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
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
          await loadAll();
        } catch (err) {
          console.error("Error cancelling appointment:", err);
          message.error(err.message || "Failed to cancel appointment");
        } finally {
          setCancelingId(null);
        }
      },
    });
  };

  const handleCancelTmRequest = (requestId) => {
    Modal.confirm({
      title: "Cancel telemedicine request",
      content:
        "Are you sure you want to cancel this request? The doctor has not scheduled a session yet.",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk: async () => {
        setCancelingTmId(requestId);
        try {
          await cancelTelemedicineRequest(requestId);
          message.success("Request cancelled");
          await loadAll();
        } catch (err) {
          console.error(err);
          message.error(
            err?.message || "Failed to cancel telemedicine request",
          );
        } finally {
          setCancelingTmId(null);
        }
      },
    });
  };

  const handlePayTmRequest = (requestId) => {
    Modal.confirm({
      title: "Pay for telemedicine session",
      content:
        "Complete payment to unlock your video session link when it becomes available",
      okText: "Pay now",
      cancelText: "Not now",
      onOk: async () => {
        setPayingTmId(requestId);
        try {
          await payTelemedicineRequest(requestId);
          message.success(
            "Payment successful. You can join when the link unlocks.",
          );
          await loadAll();
        } catch (err) {
          console.error(err);
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Payment could not be completed";
          message.error(typeof msg === "string" ? msg : "Payment failed");
        } finally {
          setPayingTmId(null);
        }
      },
    });
  };

  const canCancelAppointment = (appointment) => {
    return (
      appointment.status !== "cancelled" && appointment.status !== "completed"
    );
  };

  const apptList = Array.isArray(appointments) ? appointments : [];
  const tmList = Array.isArray(telemedicineRequests)
    ? telemedicineRequests
    : [];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" description="Loading appointments..." />
      </div>
    );
  }

  const emptyAll = apptList.length === 0 && tmList.length === 0;

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
        <Link href="/ourdoctors">
          <Button type="primary" size="large">
            Book New Appointment
          </Button>
        </Link>
      </div>

      {emptyAll ? (
        <Empty
          description={error || "No appointments or telemedicine requests yet"}
          style={{ marginTop: "50px" }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {/* Telemedicine requests */}
          <section>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <VideoCameraOutlined style={{ color: "#722ed1" }} />
              Telemedicine requests
            </h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "20px",
                fontSize: "14px",
                maxWidth: "640px",
                lineHeight: 1.6,
              }}
            >
              After your doctor approves and sets a time, pay the session fee to
              unlock your video link. The join button appears within two days of
              the scheduled start.
            </p>
            {tmList.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No telemedicine requests yet"
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "14px",
                }}
              >
                {tmList.map((req) => (
                  <PatientTmRequestCard
                    key={req.id || req._id}
                    req={req}
                    cancelingTmId={cancelingTmId}
                    payingTmId={payingTmId}
                    onCancelRequest={handleCancelTmRequest}
                    onPayRequest={handlePayTmRequest}
                  />
                ))}
              </div>
            )}
          </section>

          {/* In-person appointments */}
          <section>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <CalendarOutlined style={{ color: "#1890ff" }} />
              Clinic appointments
            </h2>
            {apptList.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No in-person appointments yet"
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px",
                }}
              >
                {apptList.map((appointment) => (
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
                        style={{
                          margin: "5px 0",
                          color: "#666",
                          fontSize: "14px",
                        }}
                      >
                        {appointment.doctor?.specialty || "General Practice"}
                      </p>
                    </div>

                    <div style={{ marginBottom: "15px", flex: 1 }}>
                      {appointment.startAt ? (
                        <>
                          <p
                            style={{
                              margin: "8px 0",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <CalendarOutlined
                              style={{
                                marginRight: "8px",
                                color: "#1890ff",
                              }}
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
                              style={{
                                marginRight: "8px",
                                color: "#1890ff",
                              }}
                            />
                            <strong>Time:</strong>{" "}
                            {dayjs(appointment.startAt).format("HH:mm")}
                          </p>
                        </>
                      ) : (
                        <p
                          style={{
                            margin: "8px 0",
                            color: "#531dab",
                            fontSize: "14px",
                          }}
                        >
                          <CalendarOutlined
                            style={{
                              marginRight: "8px",
                              color: "#722ed1",
                            }}
                          />
                          <strong>Date & time:</strong> Pending
                        </p>
                      )}
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
                        style={{
                          margin: "8px 0",
                          color: "#999",
                          fontSize: "12px",
                        }}
                      >
                        <strong>Booked:</strong>{" "}
                        {appointment.createdAt
                          ? dayjs(appointment.createdAt).fromNow()
                          : "—"}
                      </p>
                    </div>

                    {appointment.status === "rejected" && (
                      <Card
                        size="small"
                        style={{
                          backgroundColor: "#fff2f0",
                          marginBottom: "15px",
                          border: "1px solid #ffccc7",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            color: "#cf1322",
                            fontSize: "13px",
                          }}
                        >
                          This appointment request was declined by the doctor.
                        </p>
                      </Card>
                    )}

                    {appointment.status === "accepted" && (
                      <Card
                        size="small"
                        style={{
                          backgroundColor: "#f6ffed",
                          marginBottom: "15px",
                          border: "1px solid #b7eb8f",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            color: "#274e0f",
                            fontSize: "13px",
                          }}
                        >
                          ✓ Confirmed — see you at the scheduled time.
                        </p>
                      </Card>
                    )}

                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        type="primary"
                        icon={<WalletOutlined />}
                        style={{
                          backgroundColor: "#52c41a",
                          borderColor: "#52c41a",
                        }}
                        onClick={() => {
                          const fee =
                            appointment.consultationFee ||
                            appointment.fee ||
                            2500;
                          const appId = appointment._id || appointment.id;
                          router.push(
                            `/payment?appointmentId=${appId}&amount=${fee}`,
                          );
                        }}
                      >
                        Pay Now
                      </Button>
                      {canCancelAppointment(appointment) && (
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
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
