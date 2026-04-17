"use client";

import { useEffect, useState } from "react";
import { useDoctor } from "@/context/DoctorProvider";
import { Clock, Plus, Trash2, Save } from "lucide-react";
import { message } from "antd";

export default function AvailabilityPage() {
  const { profile, fetchProfile, updateAvailability, loadingProfile } =
    useDoctor();
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then((p) => {
        if (p?.availability?.length) {
          setSlots(
            p.availability.map((s) => ({
              startAt: formatDatetimeLocal(s.startAt),
              endAt: formatDatetimeLocal(s.endAt),
            })),
          );
        }
      })
      .catch(() => {});
  }, [fetchProfile]);

  function formatDatetimeLocal(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const addSlot = () => {
    setSlots([...slots, { startAt: "", endAt: "" }]);
  };

  const removeSlot = (idx) => {
    setSlots(slots.filter((_, i) => i !== idx));
  };

  const updateSlot = (idx, field, value) => {
    setSlots(slots.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const handleSave = async () => {
    // Validate
    for (let i = 0; i < slots.length; i++) {
      if (!slots[i].startAt || !slots[i].endAt) {
        message.warning(`Slot ${i + 1}: Please fill in both start and end times`);
        return;
      }
      if (new Date(slots[i].startAt) >= new Date(slots[i].endAt)) {
        message.warning(`Slot ${i + 1}: Start time must be before end time`);
        return;
      }
    }

    if (slots.length === 0) {
      message.warning("Add at least one availability slot");
      return;
    }

    setSaving(true);
    try {
      await updateAvailability(
        slots.map((s) => ({
          startAt: new Date(s.startAt).toISOString(),
          endAt: new Date(s.endAt).toISOString(),
        })),
      );
      message.success("Availability updated successfully");
    } catch (err) {
      message.error(err?.message || "Failed to update availability");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Current Slots */}
      <div className="content-card animate-fade-in">
        <div className="content-card-header">
          <h3>
            <Clock
              size={18}
              style={{
                display: "inline",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            Current Availability
          </h3>
          <span className="badge verified">
            {profile?.availability?.length || 0} slot(s)
          </span>
        </div>
        <div className="content-card-body">
          {loadingProfile ? (
            <p style={{ color: "#94a3b8", textAlign: "center" }}>Loading…</p>
          ) : !profile?.availability?.length ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Clock size={28} />
              </div>
              <h4>No availability set</h4>
              <p>Add your available time slots below</p>
            </div>
          ) : (
            <div className="slot-grid">
              {profile.availability.map((slot, i) => (
                <div className="slot-card" key={i}>
                  <div className="slot-time">
                    <span className="slot-time-label">Start</span>
                    <span className="slot-time-value">
                      {new Date(slot.startAt).toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "1px",
                      height: "32px",
                      background: "#e8edf5",
                      margin: "0 12px",
                    }}
                  />
                  <div className="slot-time">
                    <span className="slot-time-label">End</span>
                    <span className="slot-time-value">
                      {new Date(slot.endAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Slots */}
      <div className="content-card animate-fade-in animate-delay-2">
        <div className="content-card-header">
          <h3>Edit Availability</h3>
          <button className="action-btn primary" onClick={addSlot}>
            <Plus size={16} /> Add Slot
          </button>
        </div>
        <div className="content-card-body">
          {slots.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Plus size={28} />
              </div>
              <h4>No slots added</h4>
              <p>Click &quot;Add Slot&quot; to create availability windows</p>
            </div>
          ) : (
            <>
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 40px",
                    gap: "12px",
                    alignItems: "end",
                    marginBottom: "12px",
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Start Time</label>
                    <input
                      type="datetime-local"
                      value={slot.startAt}
                      onChange={(e) =>
                        updateSlot(idx, "startAt", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>End Time</label>
                    <input
                      type="datetime-local"
                      value={slot.endAt}
                      onChange={(e) =>
                        updateSlot(idx, "endAt", e.target.value)
                      }
                    />
                  </div>
                  <button
                    className="med-remove-btn"
                    onClick={() => removeSlot(idx)}
                    title="Remove slot"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <div style={{ marginTop: "20px" }}>
                <button
                  className="action-btn primary"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ opacity: saving ? 0.6 : 1 }}
                >
                  <Save size={16} /> {saving ? "Saving…" : "Save Availability"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
