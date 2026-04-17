const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppError } = require("@hc/shared");
const config = require("../config");
const Doctor = require("../models/Doctor");

function signToken({ doctorId, email }) {
  return jwt.sign({ sub: String(doctorId), role: "doctor", email }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function register({ email, password, fullName, specialty, offerTelemedicine }) {
  if (!email || !password) throw new AppError("Email and password are required", 400);

  const existing = await Doctor.findOne({ email }).lean();
  if (existing) throw new AppError("Email already in use", 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const doctor = await Doctor.create({
    email,
    passwordHash,
    fullName: fullName || "",
    specialty: specialty || "",
    offerTelemedicine: offerTelemedicine || false,
  });

  return { doctor, token: signToken({ doctorId: doctor._id, email: doctor.email }) };
}

async function login({ email, password }) {
  if (!email || !password) throw new AppError("Email and password are required", 400);
  const doctor = await Doctor.findOne({ email });
  if (!doctor) throw new AppError("Invalid credentials", 401);
  const ok = await bcrypt.compare(password, doctor.passwordHash);
  if (!ok) throw new AppError("Invalid credentials", 401);

  return {
    doctor: { id: doctor._id, email: doctor.email, fullName: doctor.fullName, specialty: doctor.specialty, offerTelemedicine: doctor.offerTelemedicine, verified: doctor.verified },
    token: signToken({ doctorId: doctor._id, email: doctor.email }),
  };
}

module.exports = { register, login };

