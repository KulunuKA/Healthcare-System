"use client";

import { useState } from "react";
import { useDoctor } from "@/context/DoctorProvider";
import { Check, X, Calendar, Inbox } from "lucide-react";
import { message } from "antd";

export default function AppointmentsPage() {
  const { decideAppointment } = useDoctor();
  const [appointmentId, setAppointmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [decisions, setDecisions] = useState([]);

  const handleDecision = async (status) => {
    if (!appointmentId.trim()) {
      message.warning("Enter an appointment ID");
      return;
    }

    setLoading(true);
    try {
      await decideAppointment(appointmentId.trim(), status);
      message.success(`Appointment ${status} successfully`);
      setDecisions((prev) => [
        { id: appointmentId.trim(), status, time: new Date().toLocaleString() },
        ...prev,
      ]);
      setAppointmentId("");
    } catch (err) {
      message.error(err?.message || `Failed to ${status} appointment`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Decision Form */}
      <div className="content-card animate-fade-in">
        <div className="content-card-header">
          <h3>
            <Calendar
              size={18}
              style={{
                display: "inline",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            Appointment Decision
          </h3>
        </div>
        <div className="content-card-body">
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              marginBottom: "20px",
            }}
          >
            Enter the appointment ID to accept or reject the request.
          </p>

          <div className="form-group">
            <label>Appointment ID</label>
            <input
              type="text"
              placeholder="e.g. 6625a3f..."
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              className="action-btn accept"
              onClick={() => handleDecision("accepted")}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              <Check size={16} /> Accept
            </button>
            <button
              className="action-btn reject"
              onClick={() => handleDecision("rejected")}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              <X size={16} /> Reject
            </button>
          </div>
        </div>
      </div>

      {/* Recent Decisions */}
      <div className="content-card animate-fade-in animate-delay-2">
        <div className="content-card-header">
          <h3>Recent Decisions</h3>
        </div>
        <div className="content-card-body">
          {decisions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Inbox size={28} />
              </div>
              <h4>No decisions yet</h4>
              <p>Accept or reject appointments and they will appear here</p>
            </div>
          ) : (
            decisions.map((d, i) => (
              <div className="data-row" key={i}>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {d.id}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {d.time}
                  </div>
                </div>
                <span className={`badge ${d.status}`}>{d.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
