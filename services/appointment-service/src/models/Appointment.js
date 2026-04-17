const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    startAt: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["scheduled", "accepted", "rejected", "cancelled", "completed"],
      default: "scheduled",
      index: true,
    },
    statusUpdatedAt: { type: Date, default: Date.now },
    reason: { type: String, default: "" },
    notes: { type: String, default: "" },
    // Basic audit trail for debugging and monitoring
    events: [
      {
        at: { type: Date, default: Date.now },
        type: { type: String, required: true },
        detail: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);

