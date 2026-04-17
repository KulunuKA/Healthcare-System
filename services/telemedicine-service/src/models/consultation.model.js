const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true
    },
    patientId: {
      type: String,
      required: true
    },
    doctorId: {
      type: String,
      required: true
    },
    meetingLink: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed"],
      default: "scheduled"
    },
    prescription: {
      type: String,
      default: ""
    },
    notes: {
      type: String,
      default: ""
    },
    startedAt: {
      type: Date,
      default: null
    },
    endedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Consultation", consultationSchema);