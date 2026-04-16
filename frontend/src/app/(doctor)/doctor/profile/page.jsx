"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useDoctor } from "@/context/DoctorProvider";
import { ShieldCheck, Mail, Stethoscope, Edit3, Save, X } from "lucide-react";
import { message } from "antd";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, fetchProfile, updateProfile, loadingProfile } = useDoctor();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setSpecialty(profile.specialty || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      message.warning("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ fullName: fullName.trim(), specialty: specialty.trim() });
      message.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      message.error(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile?.fullName || "");
    setSpecialty(profile?.specialty || "");
    setEditing(false);
  };

  const initials = (profile?.fullName || user?.fullName || "DR")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      {/* Profile Header */}
      <div className="profile-header animate-fade-in">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <h2>{profile?.fullName || user?.fullName || "Doctor"}</h2>
          <p>{profile?.specialty || user?.specialty || "Medical Professional"}</p>
          <div style={{ marginTop: "8px" }}>
            <span
              className={`badge ${profile?.verified ? "verified" : "pending"}`}
            >
              <ShieldCheck size={12} />
              {profile?.verified ? "Verified" : "Pending Verification"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="content-card animate-fade-in animate-delay-1">
        <div className="content-card-header">
          <h3>Profile Details</h3>
          {!editing ? (
            <button
              className="action-btn primary"
              onClick={() => setEditing(true)}
            >
              <Edit3 size={14} /> Edit
            </button>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="action-btn primary"
                onClick={handleSave}
                disabled={saving}
                style={{ opacity: saving ? 0.6 : 1 }}
              >
                <Save size={14} /> {saving ? "Saving…" : "Save"}
              </button>
              <button className="action-btn reject" onClick={handleCancel}>
                <X size={14} /> Cancel
              </button>
            </div>
          )}
        </div>
        <div className="content-card-body">
          {loadingProfile ? (
            <p style={{ color: "#94a3b8", textAlign: "center" }}>Loading…</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* Full Name */}
              <div className="form-group">
                <label>Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                ) : (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid #e8edf5",
                      fontSize: "14px",
                      color: "#1e293b",
                      fontWeight: 500,
                    }}
                  >
                    {profile?.fullName || "—"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label>
                  <Mail
                    size={12}
                    style={{
                      display: "inline",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  />
                  Email
                </label>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    border: "1px solid #e8edf5",
                    fontSize: "14px",
                    color: "#64748b",
                  }}
                >
                  {profile?.email || user?.email || "—"}
                </div>
              </div>

              {/* Specialty */}
              <div className="form-group">
                <label>
                  <Stethoscope
                    size={12}
                    style={{
                      display: "inline",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  />
                  Specialty
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  />
                ) : (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid #e8edf5",
                      fontSize: "14px",
                      color: "#1e293b",
                      fontWeight: 500,
                    }}
                  >
                    {profile?.specialty || "—"}
                  </div>
                )}
              </div>

              {/* Verified */}
              <div className="form-group">
                <label>
                  <ShieldCheck
                    size={12}
                    style={{
                      display: "inline",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  />
                  Verification
                </label>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    border: "1px solid #e8edf5",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: profile?.verified ? "#10b981" : "#f59e0b",
                    }}
                  />
                  <span
                    style={{
                      color: profile?.verified ? "#059669" : "#d97706",
                      fontWeight: 600,
                    }}
                  >
                    {profile?.verified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Availability Summary */}
      <div className="content-card animate-fade-in animate-delay-2">
        <div className="content-card-header">
          <h3>Availability Summary</h3>
          <span className="badge verified">
            {profile?.availability?.length || 0} slot(s)
          </span>
        </div>
        <div className="content-card-body">
          {!profile?.availability?.length ? (
            <div className="empty-state">
              <h4>No availability set</h4>
              <p>Go to Availability page to set your schedule</p>
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
    </div>
  );
}
