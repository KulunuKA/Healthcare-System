const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", unique: true, required: true, index: true },
    documents: [
      {
        originalName: { type: String, required: true },
        filename: { type: String, required: true },
        path: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    medicalHistory: [
      {
        date: { type: Date, required: true },
        diagnosis: { type: String, default: "" },
        notes: { type: String, default: "" },
      },
    ],
    prescriptions: [
      {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
        issuedAt: { type: Date, default: Date.now },
        medications: [
          {
            name: { type: String, required: true },
            dosage: { type: String, default: "" },
          },
        ],
        notes: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);

