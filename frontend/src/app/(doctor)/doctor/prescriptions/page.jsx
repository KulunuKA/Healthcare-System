"use client";

import { useState } from "react";
import { useDoctor } from "@/context/DoctorProvider";
import { FileText, Plus, Trash2, Send, Inbox } from "lucide-react";
import { message } from "antd";

export default function PrescriptionsPage() {
  const { issuePrescription } = useDoctor();
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState([]);

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "" }]);
  };

  const removeMedication = (idx) => {
    if (medications.length <= 1) return;
    setMedications(medications.filter((_, i) => i !== idx));
  };

  const updateMedication = (idx, field, value) => {
    setMedications(
      medications.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    );
  };

  const handleSubmit = async () => {
    if (!patientId.trim()) {
      message.warning("Enter a patient ID");
      return;
    }

    const validMeds = medications.filter((m) => m.name.trim());
    if (validMeds.length === 0) {
      message.warning("Add at least one medication");
      return;
    }

    setLoading(true);
    try {
      await issuePrescription({
        patientId: patientId.trim(),
        medications: validMeds,
        notes: notes.trim(),
      });
      message.success("Prescription issued successfully");
      setIssued((prev) => [
        {
          patientId: patientId.trim(),
          medications: validMeds,
          notes: notes.trim(),
          time: new Date().toLocaleString(),
        },
        ...prev,
      ]);
      // Reset form
      setPatientId("");
      setNotes("");
      setMedications([{ name: "", dosage: "", frequency: "" }]);
    } catch (err) {
      message.error(err?.message || "Failed to issue prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Issue Form */}
      <div className="content-card animate-fade-in">
        <div className="content-card-header">
          <h3>
            <FileText
              size={18}
              style={{
                display: "inline",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            Issue Prescription
          </h3>
        </div>
        <div className="content-card-body">
          <div className="form-group">
            <label>Patient ID</label>
            <input
              type="text"
              placeholder="e.g. 6625a3f..."
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>

          {/* Medications */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Medications
              </label>
              <button
                className="action-btn primary"
                onClick={addMedication}
                style={{ padding: "6px 12px", fontSize: "12px" }}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {medications.map((med, idx) => (
              <div className="med-row" key={idx}>
                <input
                  type="text"
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) =>
                    updateMedication(idx, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) =>
                    updateMedication(idx, "dosage", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) =>
                    updateMedication(idx, "frequency", e.target.value)
                  }
                />
                <button
                  className="med-remove-btn"
                  onClick={() => removeMedication(idx)}
                  disabled={medications.length <= 1}
                  style={{
                    opacity: medications.length <= 1 ? 0.4 : 1,
                    cursor:
                      medications.length <= 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              placeholder="Any additional instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            className="action-btn primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, marginTop: "8px" }}
          >
            <Send size={16} /> {loading ? "Issuing…" : "Issue Prescription"}
          </button>
        </div>
      </div>

      {/* Recently Issued */}
      <div className="content-card animate-fade-in animate-delay-2">
        <div className="content-card-header">
          <h3>Recently Issued</h3>
        </div>
        <div className="content-card-body">
          {issued.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Inbox size={28} />
              </div>
              <h4>No prescriptions issued</h4>
              <p>Issued prescriptions will appear here</p>
            </div>
          ) : (
            issued.map((rx, i) => (
              <div className="data-row" key={i}>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    Patient: {rx.patientId}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {rx.medications.map((m) => m.name).join(", ")} — {rx.time}
                  </div>
                </div>
                <span className="badge verified">Issued</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
