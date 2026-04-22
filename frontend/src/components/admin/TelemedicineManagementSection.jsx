"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, Tag, Spin, Empty, message, Typography } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getSessionValue } from "@/utils/session";
import { getAdminTelemedicineRequestsAPI } from "@/services/admin.service";

const { Text } = Typography;

const statusColor = {
  pending: "orange",
  accepted: "green",
  rejected: "red",
  cancelled: "default",
  completed: "cyan",
};

export default function TelemedicineManagementSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = getSessionValue("accessToken");
      const res = await getAdminTelemedicineRequestsAPI(token);
      const list = res.data?.data?.requests;
      setRows(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      message.error("Failed to load telemedicine requests");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      width: 110,
      render: (s) => <Tag color={statusColor[s] || "default"}>{s}</Tag>,
    },
    {
      title: "Patient",
      key: "patient",
      render: (_, r) =>
        r.patient?.displayName ||
        r.patient?.email ||
        String(r.patientId).slice(0, 8) + "…",
    },
    {
      title: "Doctor",
      key: "doctor",
      render: (_, r) =>
        r.doctor?.fullName ? `Dr. ${r.doctor.fullName}` : String(r.doctorId),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      ellipsis: true,
    },
    {
      title: "Scheduled",
      key: "scheduledAt",
      width: 160,
      render: (_, r) =>
        r.scheduledAt
          ? dayjs(r.scheduledAt).format("YYYY-MM-DD HH:mm")
          : "—",
    },
    {
      title: "Paid",
      key: "paid",
      width: 72,
      render: (_, r) =>
        r.paid ? (
          <Tag color="green">Yes</Tag>
        ) : (
          <Tag>No</Tag>
        ),
    },
    {
      title: "Meeting link",
      key: "link",
      ellipsis: true,
      render: (_, r) =>
        r.meetingLink ? (
          <Text copyable={{ text: r.meetingLink }} style={{ fontSize: "12px" }}>
            {r.meetingLink}
          </Text>
        ) : (
          "—"
        ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 120,
      render: (d) => (d ? dayjs(d).format("YYYY-MM-DD") : "—"),
    },
  ];

  return (
    <div
      className="mt-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8"
      style={{ borderColor: "var(--soft-blue)" }}
    >
      <h2
        className="text-lg font-semibold tracking-tight"
        style={{ color: "var(--dark-navy)" }}
      >
        <VideoCameraOutlined style={{ marginRight: "8px", color: "#722ed1" }} />
        Telemedicine management
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--text-gray)" }}>
        All telemedicine requests across the platform (read-only overview).
      </p>

      <div className="mt-4">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : rows.length === 0 ? (
          <Empty description="No telemedicine requests" />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={rows}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 900 }}
            size="middle"
          />
        )}
      </div>
    </div>
  );
}
