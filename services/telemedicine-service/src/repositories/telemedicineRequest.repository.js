const TelemedicineRequest = require("../models/telemedicineRequest.model");

async function create(data) {
  return TelemedicineRequest.create(data);
}

async function findById(id) {
  return TelemedicineRequest.findById(id).lean();
}

async function findByPatientId(patientId, { limit = 100 } = {}) {
  return TelemedicineRequest.find({ patientId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

async function findByDoctorId(doctorId, { status, limit = 100 } = {}) {
  const q = { doctorId };
  if (status) q.status = status;
  return TelemedicineRequest.find(q).sort({ createdAt: -1 }).limit(limit).lean();
}

async function findAll({ status, limit = 200 } = {}) {
  const q = {};
  if (status) q.status = status;
  return TelemedicineRequest.find(q).sort({ createdAt: -1 }).limit(limit).lean();
}

async function updateById(id, patch) {
  return TelemedicineRequest.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  }).lean();
}

module.exports = {
  create,
  findById,
  findByPatientId,
  findByDoctorId,
  findAll,
  updateById,
};
