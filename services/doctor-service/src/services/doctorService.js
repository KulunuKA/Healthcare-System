const { AppError } = require("@hc/shared");
const Doctor = require("../models/Doctor");

async function getProfile(doctorId) {
  const doctor = await Doctor.findById(doctorId).select("_id email fullName specialty verified availability").lean();
  if (!doctor) throw new AppError("Doctor not found", 404);
  return { id: doctor._id, email: doctor.email, fullName: doctor.fullName, specialty: doctor.specialty, verified: doctor.verified, availability: doctor.availability };
}

async function updateProfile(doctorId, patch) {
  const doctor = await Doctor.findByIdAndUpdate(doctorId, { $set: patch }, { new: true });
  if (!doctor) throw new AppError("Doctor not found", 404);
  return getProfile(doctorId);
}

async function setAvailability(doctorId, { slots }) {
  if (!Array.isArray(slots) || slots.length === 0) throw new AppError("slots[] is required", 400);
  const parsedSlots = slots.map((s) => ({
    startAt: new Date(s.startAt),
    endAt: new Date(s.endAt),
  }));

  await Doctor.findByIdAndUpdate(doctorId, { $set: { availability: parsedSlots } }, { new: true });
  return getProfile(doctorId);
}

async function listDoctors({ specialty }) {
  const filter = {};
  if (specialty) filter.specialty = specialty;
  const doctors = await Doctor.find(filter).select("_id fullName specialty verified").lean();
  return doctors.map((d) => ({ id: d._id, fullName: d.fullName, specialty: d.specialty, verified: d.verified }));
}

async function verifyDoctor(doctorId) {
  const doctor = await Doctor.findByIdAndUpdate(doctorId, { $set: { verified: true } }, { new: true });
  if (!doctor) throw new AppError("Doctor not found", 404);
  return { id: doctor._id, verified: true };
}

module.exports = { getProfile, updateProfile, setAvailability, listDoctors, verifyDoctor };

