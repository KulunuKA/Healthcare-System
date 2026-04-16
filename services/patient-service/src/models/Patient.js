const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["patient", "admin"], default: "patient", index: true },
    profile: {
      fullName: { type: String, default: "" },
      phone: { type: String, default: "" },
      gender: { type: String, default: "" },
      dateOfBirth: { type: Date },
      address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zip: { type: String, default: "" },
      },
    },
    verifiedDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);

