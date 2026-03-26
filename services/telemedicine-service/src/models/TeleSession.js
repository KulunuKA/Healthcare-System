const mongoose = require("mongoose");

const TeleSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ["active", "ended"], default: "active", index: true },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeleSession", TeleSessionSchema);

