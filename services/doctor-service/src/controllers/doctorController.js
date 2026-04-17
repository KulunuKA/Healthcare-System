const axios = require("axios");
const config = require("../config");
const { asyncHandler, response, AppError } = require("@hc/shared");
const doctorService = require("../services/doctorService");

const listDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorService.listDoctors({ specialty: req.query.specialty });
  return response.sendSuccess(res, { message: "doctors", data: doctors });
});

const setAvailability = asyncHandler(async (req, res) => {
  const updated = await doctorService.setAvailability(req.user.sub, { slots: req.body?.slots });
  return response.sendSuccess(res, { message: "availability updated", data: updated });
});

const decision = asyncHandler(async (req, res) => {
  const appointmentId = req.params.appointmentId;
  const { status } = req.body || {};
  if (!["accepted", "rejected"].includes(status)) throw new AppError("status must be accepted|rejected", 400);
  const url = `${config.APPOINTMENT_SERVICE_URL}/internal/appointments/${appointmentId}/decision`;
  await axios.post(
    url,
    { doctorId: req.user.sub, status },
    { headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN } }
  );
  return response.sendSuccess(res, { message: "decision submitted" });
});

const viewPatientReports = asyncHandler(async (req, res) => {
  const patientId = req.params.patientId;
  const url = `${config.PATIENT_SERVICE_URL}/internal/patients/${patientId}/medical`;
  const medical = await axios.get(url, {
    headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN },
  });
  return response.sendSuccess(res, { message: "patient medical data", data: medical.data.data || medical.data });
});

const issuePrescription = asyncHandler(async (req, res) => {
  const { patientId, medications, notes } = req.body || {};
  if (!patientId) throw new AppError("patientId is required", 400);
  const url = `${config.PATIENT_SERVICE_URL}/internal/patients/${patientId}/prescriptions`;
  const result = await axios.post(
    url,
    { doctorId: req.user.sub, medications, notes },
    { headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN } }
  );
  return response.sendSuccess(res, { message: "prescription issued", data: result.data.data || result.data });
});

module.exports = {
  listDoctors,
  setAvailability,
  decision,
  viewPatientReports,
  issuePrescription,
};

