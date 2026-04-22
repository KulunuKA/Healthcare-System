"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Spin,
  Empty,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import DoctorTmRequestCard from "@/components/telemedicine/DoctorTmRequestCard";
import { getSessionValue } from "@/utils/session";
import {
  getDoctorTelemedicineRequestsAPI,
  acceptTelemedicineRequestAPI,
  rejectTelemedicineRequestAPI,
} from "@/services/doctor.service";

export default function TelemedicineRequestsSection() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = getSessionValue("accessToken");
      const res = await getDoctorTelemedicineRequestsAPI(token);
      const list = res.data?.data?.requests;
      setRequests(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      message.error("Failed to load telemedicine requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openReview = (req) => {
    setSelected(req);
    form.resetFields();
    setModalOpen(true);
  };

  const handleAccept = async () => {
    try {
      const values = await form.validateFields();
      const date = values.date;
      const time = values.time;
      if (!date || !time) {
        message.error("Pick both date and time");
        return;
      }
      const scheduledAt = date
        .hour(time.hour())
        .minute(time.minute())
        .second(0)
        .toISOString();

      setSubmitting(true);
      const token = getSessionValue("accessToken");
      await acceptTelemedicineRequestAPI(token, selected.id, { scheduledAt });
      message.success("Request accepted — patient will see the schedule.");
      setModalOpen(false);
      setSelected(null);
      await load();
    } catch (e) {
      if (e?.errorFields) return;
      console.error(e);
      message.error(
        e?.response?.data?.message || "Could not accept request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = (req) => {
    Modal.confirm({
      title: "Reject telemedicine request?",
      content: "The patient will be notified that this request was declined.",
      okType: "danger",
      onOk: async () => {
        try {
          const token = getSessionValue("accessToken");
          await rejectTelemedicineRequestAPI(token, req.id);
          message.success("Request rejected");
          await load();
        } catch (err) {
          message.error(err?.response?.data?.message || "Failed to reject");
        }
      },
    });
  };

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="content-card animate-fade-in animate-delay-4">
      <div className="content-card-header">
        <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <VideoCameraOutlined style={{ color: "#6366f1" }} />
          Received telemedicine requests
        </h3>
        <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#64748b" }}>
          Review patient reasons and propose a session time. Accepting generates
          a meeting link for the patient (visible before the session per policy).
        </p>
      </div>
      <div className="content-card-body">
        {loading ? (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <Spin />
          </div>
        ) : requests.length === 0 ? (
          <Empty description="No telemedicine requests yet" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {requests.map((req) => (
              <DoctorTmRequestCard
                key={req.id}
                req={req}
                onReview={openReview}
                onReject={handleReject}
              />
            ))}
          </div>
        )}

        {!loading && pending.length > 0 && (
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#94a3b8" }}>
            {pending.length} pending request{pending.length !== 1 ? "s" : ""}{" "}
            need review.
          </p>
        )}
      </div>

      <Modal
        title="Schedule telemedicine session"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onOk={handleAccept}
        confirmLoading={submitting}
        okText="Accept & schedule"
        destroyOnClose
      >
        {selected && (
          <div style={{ marginBottom: "16px" }}>
            <p>
              <strong>Patient:</strong>{" "}
              {selected.patient?.displayName || selected.patient?.email}
            </p>
            <p style={{ fontSize: "13px", color: "#666" }}>{selected.reason}</p>
          </div>
        )}
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Session date"
            rules={[{ required: true, message: "Select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="time"
            label="Session time"
            rules={[{ required: true, message: "Select a time" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" minuteStep={15} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
