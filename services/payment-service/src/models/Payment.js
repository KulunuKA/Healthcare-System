const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    // NEW: Links the payment to the patient who made it
    patientId: { type: String, required: true, index: true }, 
    provider: { type: String, required: true, enum: ["payhere", "stripe"], index: true },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["initiated", "pending", "succeeded", "failed"],
      default: "initiated",
      index: true,
    },
    providerReference: { type: String, default: "" },
    webhookReceivedAt: { type: Date },
    webhookPayload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Payment", PaymentSchema);