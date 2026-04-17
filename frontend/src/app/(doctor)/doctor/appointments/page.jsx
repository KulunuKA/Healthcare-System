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
  Tabs,
  Badge,
  Space,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useDoctor } from "@/context/DoctorProvider";
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

export default function DoctorAppointmentsPage() {
  const {
    fetchDoctorAppointments,
    decideAppointment,
    appointments,
    loadingAppointments,
  } = useDoctor();
  const [loading, setLoading] = useState(true);
  const [decidingId, setDecidingId] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      await fetchDoctorAppointments();
    } catch (error) {
      console.error("Error loading appointments:", error);
      message.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleDecideAppointment = (appointmentId, decision) => {
    const title =
      decision === "accepted" ? "Accept Appointment" : "Reject Appointment";
    const content =
      decision === "accepted"
        ? "Are you sure you want to accept this appointment?"
        : "Are you sure you want to reject this appointment?";

    Modal.confirm({
      title,
      content,
      okText: "Yes",
      cancelText: "No",
      okType: decision === "accepted" ? "primary" : "danger",
      onOk: async () => {
        setDecidingId(appointmentId);
        try {
          await decideAppointment(appointmentId, decision);
          message.success(`Appointment ${decision} successfully`);
          await loadAppointments();
        } catch (error) {
          console.error("Error deciding appointment:", error);
          message.error(error.message || "Failed to process appointment");
        } finally {
          setDecidingId(null);
        }
      },
    });
  };

  const getPendingAppointments = () =>
    (Array.isArray(appointments) ? appointments : []).filter(
      (a) => a.status === "scheduled",
    );

  const getAcceptedAppointments = () =>
    (Array.isArray(appointments) ? appointments : []).filter(
      (a) => a.status === "accepted",
    );

  const getRejectedAppointments = () =>
    (Array.isArray(appointments) ? appointments : []).filter(
      (a) => a.status === "rejected",
    );

  const getCancelledAppointments = () =>
    (Array.isArray(appointments) ? appointments : []).filter(
      (a) => a.status === "cancelled",
    );

  const getCompletedAppointments = () =>
    (Array.isArray(appointments) ? appointments : []).filter(
      (a) => a.status === "completed",
    );

  const AppointmentCard = ({ appointment, showActions = false }) => (
    <Card
      style={{
        marginBottom: "15px",
        borderLeft: `4px solid ${statusColors[appointment.status] || "default"}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "15px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              margin: "0 0 5px 0",
            }}
          >
            {appointment.patientId?.fullName || "Unknown Patient"}
          </h3>
          <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
            {appointment.patientId?.email}
          </p>
        </div>
        <Tag color={statusColors[appointment.status]}>
          {statusLabels[appointment.status]}
        </Tag>
      </div>

      {/* Details */}
      <div
        style={{
          marginBottom: "15px",
          paddingBottom: "15px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <p style={{ margin: "8px 0", display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
          <strong>Date:</strong>{" "}
          {dayjs(appointment.startAt).format("dddd, MMM DD, YYYY")}
        </p>
        <p style={{ margin: "8px 0", display: "flex", alignItems: "center" }}>
          <ClockCircleOutlined
            style={{ marginRight: "8px", color: "#1890ff" }}
          />
          <strong>Time:</strong> {dayjs(appointment.startAt).format("HH:mm")}
        </p>
        {appointment.reason && (
          <p style={{ margin: "8px 0", color: "#666", fontSize: "14px" }}>
            <strong>Reason:</strong> {appointment.reason}
          </p>
        )}
        {appointment.notes && (
          <p style={{ margin: "8px 0", color: "#666", fontSize: "14px" }}>
            <strong>Notes:</strong> {appointment.notes}
          </p>
        )}
        <p style={{ margin: "8px 0", color: "#999", fontSize: "12px" }}>
          <strong>Requested:</strong> {dayjs(appointment.createdAt).fromNow()}
        </p>
      </div>

      {/* Contact Info */}
      {appointment.patientId?.phone && (
        <p style={{ margin: "8px 0", display: "flex", alignItems: "center" }}>
          <PhoneOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
          <strong>Phone:</strong> {appointment.patientId.phone}
        </p>
      )}

      {/* Actions */}
      {showActions && appointment.status === "scheduled" && (
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            block
            loading={decidingId === (appointment._id || appointment.id)}
            onClick={() =>
              handleDecideAppointment(
                appointment._id || appointment.id,
                "accepted",
              )
            }
          >
            Accept
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            block
            loading={decidingId === (appointment._id || appointment.id)}
            onClick={() =>
              handleDecideAppointment(
                appointment._id || appointment.id,
                "rejected",
              )
            }
          >
            Reject
          </Button>
        </div>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" tip="Loading appointments..." />
      </div>
    );
  }

  const tabItems = [
    {
      key: "pending",
      label: (
        <span>
          Pending{" "}
          <Badge
            count={getPendingAppointments().length}
            style={{ backgroundColor: "#faad14" }}
          />
        </span>
      ),
      children:
        getPendingAppointments().length === 0 ? (
          <Empty description="No pending appointments" />
        ) : (
          getPendingAppointments().map((apt) => (
            <AppointmentCard
              key={apt._id || apt.id}
              appointment={apt}
              showActions={true}
            />
          ))
        ),
    },
    {
      key: "accepted",
      label: (
        <span>
          Confirmed{" "}
          <Badge
            count={getAcceptedAppointments().length}
            style={{ backgroundColor: "#52c41a" }}
          />
        </span>
      ),
      children:
        getAcceptedAppointments().length === 0 ? (
          <Empty description="No confirmed appointments" />
        ) : (
          getAcceptedAppointments().map((apt) => (
            <AppointmentCard key={apt._id || apt.id} appointment={apt} />
          ))
        ),
    },
    {
      key: "rejected",
      label: (
        <span>
          Rejected{" "}
          <Badge
            count={getRejectedAppointments().length}
            style={{ backgroundColor: "#f5222d" }}
          />
        </span>
      ),
      children:
        getRejectedAppointments().length === 0 ? (
          <Empty description="No rejected appointments" />
        ) : (
          getRejectedAppointments().map((apt) => (
            <AppointmentCard key={apt._id || apt.id} appointment={apt} />
          ))
        ),
    },
    {
      key: "cancelled",
      label: (
        <span>
          Cancelled{" "}
          <Badge
            count={getCancelledAppointments().length}
            style={{ backgroundColor: "#d9d9d9" }}
          />
        </span>
      ),
      children:
        getCancelledAppointments().length === 0 ? (
          <Empty description="No cancelled appointments" />
        ) : (
          getCancelledAppointments().map((apt) => (
            <AppointmentCard key={apt._id || apt.id} appointment={apt} />
          ))
        ),
    },
    {
      key: "completed",
      label: (
        <span>
          Completed{" "}
          <Badge
            count={getCompletedAppointments().length}
            style={{ backgroundColor: "#13c2c2" }}
          />
        </span>
      ),
      children:
        getCompletedAppointments().length === 0 ? (
          <Empty description="No completed appointments" />
        ) : (
          getCompletedAppointments().map((apt) => (
            <AppointmentCard key={apt._id || apt.id} appointment={apt} />
          ))
        ),
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1
        style={{ marginBottom: "30px", fontSize: "32px", fontWeight: "bold" }}
      >
        <CalendarOutlined style={{ marginRight: "10px" }} />
        Appointments Management
      </h1>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <Space size="large">
          <div>
            <span style={{ fontSize: "14px", color: "#666" }}>
              Total Appointments:
            </span>
            <Badge
              count={appointments.length}
              style={{ backgroundColor: "#1890ff" }}
            />
          </div>
          <div>
            <span style={{ fontSize: "14px", color: "#666" }}>Pending:</span>
            <Badge
              count={getPendingAppointments().length}
              style={{ backgroundColor: "#faad14" }}
            />
          </div>
          <div>
            <span style={{ fontSize: "14px", color: "#666" }}>Confirmed:</span>
            <Badge
              count={getAcceptedAppointments().length}
              style={{ backgroundColor: "#52c41a" }}
            />
          </div>
        </Space>
      </div>

      <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
    </div>
  );
}
