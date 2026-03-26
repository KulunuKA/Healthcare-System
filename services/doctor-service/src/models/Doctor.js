const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, default: "" },
    specialty: { type: String, default: "" , index: true},
    role: { type: String, enum: ["doctor"], default: "doctor", index: true },
    verified: { type: Boolean, default: false, index: true },
    availability: [
      {
        startAt: { type: Date, required: true },
        endAt: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);

