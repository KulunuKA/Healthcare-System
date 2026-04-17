const axios = require("axios");
const config = require("../config");

async function fetchDoctorSummary(doctorId) {
  if (!doctorId || !config.DOCTOR_SERVICE_URL) return null;
  try {
    const res = await axios.get(
      `${config.DOCTOR_SERVICE_URL}/doctors/${doctorId}`,
      { timeout: 8000 },
    );
    const d = res.data?.data;
    if (!d) return null;
    return {
      id: String(d.id || d._id || doctorId),
      fullName: d.fullName || "Doctor",
      specialty: d.specialty || "",
      email: d.email || "",
    };
  } catch {
    return null;
  }
}

async function fetchPatientSummary(patientId) {
  if (!patientId || !config.PATIENT_SERVICE_URL || !config.INTERNAL_SERVICE_TOKEN) {
    return null;
  }
  try {
    const res = await axios.get(
      `${config.PATIENT_SERVICE_URL}/internal/patients/${patientId}/profile`,
      {
        timeout: 8000,
        headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN },
      },
    );
    const p = res.data?.data;
    if (!p) return null;
    const pr = p.profile || {};
    const name = [pr.firstName, pr.lastName].filter(Boolean).join(" ").trim();
    return {
      id: String(p.id || p._id || patientId),
      email: p.email || "",
      displayName: name || p.email || "Patient",
    };
  } catch {
    return null;
  }
}

module.exports = { fetchDoctorSummary, fetchPatientSummary };
