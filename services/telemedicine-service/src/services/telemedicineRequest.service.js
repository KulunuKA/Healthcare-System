const axios = require("axios");
const { AppError } = require("@hc/shared");
const config = require("../config");
const repo = require("../repositories/telemedicineRequest.repository");
const { generateMeetingLink } = require("../utils/generateMeetingLink");
const {
  serializeTelemedicineRequest,
  scrubMeetingLinkForPatient,
} = require("../utils/serializeTelemedicineRequest");

async function fetchDoctorForValidation(doctorId) {
  if (!config.DOCTOR_SERVICE_URL) {
    return { skipValidation: true };
  }
  const url = `${config.DOCTOR_SERVICE_URL}/doctors/${doctorId}`;
  try {
    const res = await axios.get(url, { timeout: 8000 });
    const doctor = res.data?.data;
    if (!doctor) throw new AppError("Doctor not found", 404);
    return { doctor, skipValidation: false };
  } catch (err) {
    if (err.response?.status === 404) throw new AppError("Doctor not found", 404);
    if (err instanceof AppError) throw err;
    throw new AppError("Unable to verify doctor", 502);
  }
}

async function createRequest({ patientId, doctorId, reason, notes }) {
  const r = typeof reason === "string" ? reason.trim() : "";
  if (!r) throw new AppError("reason is required", 400);
  if (!doctorId) throw new AppError("doctorId is required", 400);

  const { doctor, skipValidation } = await fetchDoctorForValidation(doctorId);
  if (!skipValidation && doctor && doctor.offerTelemedicine === false) {
    throw new AppError("This doctor does not offer telemedicine", 400);
  }

  const doc = await repo.create({
    patientId,
    doctorId,
    reason: r,
    notes: notes != null ? String(notes).trim() : "",
    status: "pending",
  });

  return serializeTelemedicineRequest(doc);
}

function assertOwnership(req, row) {
  const role = req.user.role;
  if (role === "admin") return;
  const uid = String(req.user.sub);
  if (role === "patient" && String(row.patientId) !== uid) {
    throw new AppError("Forbidden", 403);
  }
  if (role === "doctor" && String(row.doctorId) !== uid) {
    throw new AppError("Forbidden", 403);
  }
}

async function getByIdForUser(req, id) {
  const row = await repo.findById(id);
  if (!row) throw new AppError("Request not found", 404);
  assertOwnership(req, row);
  const serialized = serializeTelemedicineRequest(row);
  if (req.user.role === "patient") {
    return scrubMeetingLinkForPatient(serialized);
  }
  return serialized;
}

async function listForPatient(patientId) {
  const rows = await repo.findByPatientId(patientId);
  return rows.map((row) =>
    scrubMeetingLinkForPatient(serializeTelemedicineRequest(row)),
  );
}

async function listAllForDoctor(doctorId, { status } = {}) {
  const rows = await repo.findByDoctorId(doctorId, { status });
  return rows.map((row) => serializeTelemedicineRequest(row));
}

async function acceptRequest({ requestId, doctorId, scheduledAt }) {
  if (!scheduledAt) throw new AppError("scheduledAt is required", 400);
  const start = new Date(scheduledAt);
  if (Number.isNaN(start.getTime())) throw new AppError("Invalid scheduledAt", 400);

  const row = await repo.findById(requestId);
  if (!row) throw new AppError("Request not found", 404);
  if (String(row.doctorId) !== String(doctorId)) throw new AppError("Forbidden", 403);
  if (row.status !== "pending") {
    throw new AppError("Only pending requests can be accepted", 400);
  }

  const meetingLink = generateMeetingLink(String(requestId));

  const updated = await repo.updateById(requestId, {
    status: "accepted",
    scheduledAt: start,
    meetingLink,
    respondedAt: new Date(),
  });

  return serializeTelemedicineRequest(updated);
}

async function rejectRequest({ requestId, doctorId }) {
  const row = await repo.findById(requestId);
  if (!row) throw new AppError("Request not found", 404);
  if (String(row.doctorId) !== String(doctorId)) throw new AppError("Forbidden", 403);
  if (row.status !== "pending") {
    throw new AppError("Only pending requests can be rejected", 400);
  }

  const updated = await repo.updateById(requestId, {
    status: "rejected",
    respondedAt: new Date(),
  });

  return serializeTelemedicineRequest(updated);
}

async function cancelRequest({ requestId, patientId }) {
  const row = await repo.findById(requestId);
  if (!row) throw new AppError("Request not found", 404);
  if (String(row.patientId) !== String(patientId)) throw new AppError("Forbidden", 403);
  if (row.status !== "pending") {
    throw new AppError("Only pending requests can be cancelled", 400);
  }

  const updated = await repo.updateById(requestId, {
    status: "cancelled",
    respondedAt: new Date(),
  });

  return serializeTelemedicineRequest(updated);
}

async function completeRequest({ requestId, doctorId }) {
  const row = await repo.findById(requestId);
  if (!row) throw new AppError("Request not found", 404);
  if (String(row.doctorId) !== String(doctorId)) throw new AppError("Forbidden", 403);
  if (row.status !== "accepted") {
    throw new AppError("Only accepted sessions can be marked completed", 400);
  }

  const updated = await repo.updateById(requestId, {
    status: "completed",
    respondedAt: new Date(),
  });

  return serializeTelemedicineRequest(updated);
}

module.exports = {
  createRequest,
  getByIdForUser,
  listForPatient,
  listAllForDoctor,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
};
