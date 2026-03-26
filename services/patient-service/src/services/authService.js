const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppError } = require("@hc/shared");
const config = require("../config");
const Patient = require("../models/Patient");
const MedicalRecord = require("../models/MedicalRecord");

function signToken({ userId, role, email }) {
  return jwt.sign({ sub: String(userId), role, email }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function register({ email, password, profile, role }) {
  if (!email || !password) throw new AppError("Email and password are required", 400);

  const existing = await Patient.findOne({ email }).lean();
  if (existing) throw new AppError("Email already in use", 409);

  const passwordHash = await bcrypt.hash(password, 12);

  const finalRole =
    role === "admin" && config.ALLOW_ADMIN_REGISTER ? "admin" : "patient";

  const patient = await Patient.create({
    email,
    passwordHash,
    role: finalRole,
    profile: profile || {},
  });

  await MedicalRecord.create({ patientId: patient._id });

  return {
    patient,
    token: signToken({ userId: patient._id, role: patient.role, email: patient.email }),
  };
}

async function login({ email, password }) {
  if (!email || !password) throw new AppError("Email and password are required", 400);
  const patient = await Patient.findOne({ email });
  if (!patient) throw new AppError("Invalid credentials", 401);

  const ok = await bcrypt.compare(password, patient.passwordHash);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const token = signToken({ userId: patient._id, role: patient.role, email: patient.email });
  return {
    patient: { id: patient._id, email: patient.email, role: patient.role, profile: patient.profile },
    token,
  };
}

async function seedAdminIfNeeded() {
  if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) return;

  const existing = await Patient.findOne({ email: config.ADMIN_EMAIL, role: "admin" });
  if (existing) return;

  const passwordHash = await bcrypt.hash(config.ADMIN_PASSWORD, 12);
  const patient = await Patient.create({
    email: config.ADMIN_EMAIL,
    passwordHash,
    role: "admin",
    profile: { fullName: "Admin" },
  });

  await MedicalRecord.create({ patientId: patient._id }).catch(() => {});
}

module.exports = { register, login, signToken, seedAdminIfNeeded };

