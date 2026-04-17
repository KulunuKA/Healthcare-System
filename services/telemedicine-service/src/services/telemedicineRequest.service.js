const axios = require("axios");
const { AppError } = require("@hc/shared");
const config = require("../config");
const repo = require("../repositories/telemedicineRequest.repository");
const partyLookup = require("./partyLookup.service");
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

async function attachPartyInfo(base, mode) {
  const out = { ...base };
  if (mode === "patient" || mode === "admin") {
    out.doctor =
      (await partyLookup.fetchDoctorSummary(out.doctorId)) || {
        id: String(out.doctorId),
      };
  }
  if (mode === "doctor" || mode === "admin") {
    out.patient =
      (await partyLookup.fetchPatientSummary(out.patientId)) || {
        id: String(out.patientId),
      };
  }
  return out;
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

  const s = serializeTelemedicineRequest(doc);
  return attachPartyInfo(s, "patient");
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
  let serialized = serializeTelemedicineRequest(row);
  if (req.user.role === "patient") {
    serialized = scrubMeetingLinkForPatient(serialized);
  }
  const mode =
    req.user.role === "admin"
      ? "admin"
      : req.user.role === "doctor"
        ? "doctor"
        : "patient";
  return attachPartyInfo(serialized, mode);
}

async function listForPatient(patientId) {
  const rows = await repo.findByPatientId(patientId);
  return Promise.all(
    rows.map(async (row) => {
      const s = scrubMeetingLinkForPatient(serializeTelemedicineRequest(row));
      return attachPartyInfo(s, "patient");
    }),
  );
}

async function listAllForDoctor(doctorId, { status } = {}) {
  const rows = await repo.findByDoctorId(doctorId, { status });
  return Promise.all(
    rows.map(async (row) => {
      const s = serializeTelemedicineRequest(row);
      return attachPartyInfo(s, "doctor");
    }),
  );
}

async function listForAdmin({ status } = {}) {
  const rows = await repo.findAll({ status });
  return Promise.all(
    rows.map(async (row) => {
      const s = serializeTelemedicineRequest(row);
      return attachPartyInfo(s, "admin");
    }),
  );
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

  const s = serializeTelemedicineRequest(updated);
  return attachPartyInfo(s, "doctor");
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

  const s = serializeTelemedicineRequest(updated);
  return attachPartyInfo(s, "doctor");
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

  const s = serializeTelemedicineRequest(updated);
  return attachPartyInfo(s, "patient");
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

  const s = serializeTelemedicineRequest(updated);
  return attachPartyInfo(s, "doctor");
}

module.exports = {
  createRequest,
  getByIdForUser,
  listForPatient,
  listAllForDoctor,
  listForAdmin,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
};
