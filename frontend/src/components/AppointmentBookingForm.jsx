"use client";

import { useState } from "react";
import { Form, Input, Button, DatePicker, TimePicker, Card, Alert, Spin, message } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function AppointmentBookingForm({ 
  doctorId, 
  doctorName, 
  specialty, 
  onSubmit, 
  loading = false 
}) {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState("");

  const handleSubmit = async (values) => {
    if (!selectedDate || !selectedTime) {
      message.error("Please select both date and time");
      return;
    }

    // Combine date and time
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
      message.success("Appointment booked successfully!");
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
      <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
        Book Appointment with Dr. {doctorName}
      </h2>

      <Alert
        message={`Specialty: ${specialty}`}
        type="info"
        style={{ marginBottom: "20px" }}
        showIcon
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" tip="Booking appointment..." />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* Reason for Visit */}
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

          {/* Date Selection */}
          <Form.Item
            label={<><CalendarOutlined /> Select Date</>}
            required
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) => {
                // Disable past dates
                return current && current.isBefore(dayjs().startOf("day"));
              }}
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </Form.Item>

          {/* Time Selection */}
          <Form.Item
            label={<><ClockCircleOutlined /> Select Time</>}
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

          {/* Additional Notes */}
          <Form.Item
            label="Additional Notes (Optional)"
            name="notes"
          >
            <Input.TextArea
              placeholder="Any additional information for the doctor"
              rows={3}
            />
          </Form.Item>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <Card
              style={{
                backgroundColor: "#f0f5ff",
                marginBottom: "20px",
                border: "1px solid #b6e1ff",
              }}
            >
              <p style={{ margin: "5px 0" }}>
                <strong>Date:</strong> {selectedDate.format("dddd, MMMM DD, YYYY")}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Time:</strong> {selectedTime.format("HH:mm")}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Reason:</strong> {reason || "Not specified"}
              </p>
            </Card>
          )}

          {/* Submit Button */}
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
