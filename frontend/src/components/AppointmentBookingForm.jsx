"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Card,
  Alert,
  Spin,
  message,
} from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function AppointmentBookingForm({
  doctorId,
  doctorName,
  specialty,
  telemedicine = false,
  onSubmit,
  loading = false,
}) {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState("");

  const handleTelemedicineSubmit = async (values) => {
    const trimmedReason = (values.reason || "").trim();
    if (!trimmedReason) {
      message.error("Please enter a reason for telemedicine.");
      return;
    }

    const appointmentData = {
      doctorId,
      reason: trimmedReason,
      notes: (values.notes || "").trim(),
    };

    try {
      await onSubmit(appointmentData);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting telemedicine request:", error);
      message.error(error.message || "Failed to submit request");
    }
  };

  const handleStandardSubmit = async (values) => {
    if (!selectedDate || !selectedTime) {
      message.error("Please select both date and time");
      return;
    }

    const appointmentDateTime = selectedDate
      .hour(selectedTime.hour())
      .minute(selectedTime.minute());

    const appointmentData = {
      doctorId,
      startAt: appointmentDateTime.toISOString(),
      reason: reason || "General consultation",
      notes: values.notes || "",
    };

    try {
      await onSubmit(appointmentData);
      form.resetFields();
      setSelectedDate(null);
      setSelectedTime(null);
      setReason("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      message.error(error.message || "Failed to book appointment");
    }
  };

  return (
    <Card style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2
        style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}
      >
        {telemedicine ? "Telemedicine request" : "Book appointment"} — Dr.{" "}
        {doctorName}
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" description="Loading..." />
        </div>
      ) : telemedicine ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTelemedicineSubmit}
          autoComplete="off"
        >
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 14px",
              background: "#f0f5ff",
              borderRadius: "8px",
              border: "1px solid #adc6ff",
            }}
          >
            <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>
              Doctor specialty
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#1d39c4" }}>
              {specialty || "—"}
            </div>
          </div>

          <Form.Item
            name="reason"
            label="Reason for telemedicine"
            rules={[
              { required: true, message: "Please describe your reason" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describe why you are requesting a remote consultation"
            />
          </Form.Item>

          <Form.Item name="notes" label="Additional notes (optional)">
            <Input.TextArea
              rows={3}
              placeholder="Symptoms, preferred contact method, or other context for the doctor"
            />
          </Form.Item>

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: "24px" }}
            message="What happens next"
            description="The doctor will review your request and schedule a time. After approval, you will pay a session fee to unlock your video link when it becomes available."
          />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Submit telemedicine request
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleStandardSubmit}
          autoComplete="off"
        >
          <Alert
            message={`Specialty: ${specialty}`}
            type="info"
            style={{ marginBottom: "20px" }}
            showIcon
          />

          <Form.Item
            label="Reason for Visit"
            required
            tooltip="Brief description of why you're booking this appointment"
          >
            <Input.TextArea
              placeholder="e.g., Annual checkup, Follow-up, Consultation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label={
              <>
                <CalendarOutlined /> Select Date
              </>
            }
            required
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) => {
                return current && current.isBefore(dayjs().startOf("day"));
              }}
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </Form.Item>

          <Form.Item
            label={
              <>
                <ClockCircleOutlined /> Select Time
              </>
            }
            required
          >
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              value={selectedTime}
              onChange={setSelectedTime}
              minuteStep={15}
            />
          </Form.Item>

          <Form.Item label="Additional Notes (Optional)" name="notes">
            <Input.TextArea
              placeholder="Any additional information for the doctor"
              rows={3}
            />
          </Form.Item>

          {selectedDate && selectedTime && (
            <Card
              style={{
                backgroundColor: "#f0f5ff",
                marginBottom: "20px",
                border: "1px solid #b6e1ff",
              }}
            >
              <p style={{ margin: "5px 0" }}>
                <strong>Date:</strong>{" "}
                {selectedDate.format("dddd, MMMM DD, YYYY")}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Time:</strong> {selectedTime.format("HH:mm")}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Reason:</strong> {reason || "Not specified"}
              </p>
            </Card>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Confirm Appointment
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
}
