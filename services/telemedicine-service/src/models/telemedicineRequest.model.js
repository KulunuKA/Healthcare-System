const mongoose = require("mongoose");

const STATUS = ["pending", "accepted", "rejected", "cancelled", "completed"];

const TelemedicineRequestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reason: { type: String, required: true, trim: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: STATUS,
      default: "pending",
      index: true,
    },
    /** Set when doctor accepts — session wall-clock time (UTC stored). */
    scheduledAt: { type: Date, default: null },
    /** Jitsi (or other) URL; generated on accept. */
    meetingLink: { type: String, default: "" },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

TelemedicineRequestSchema.index({ patientId: 1, createdAt: -1 });
TelemedicineRequestSchema.index({ doctorId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("TelemedicineRequest", TelemedicineRequestSchema);
