const { asyncHandler, response } = require("@hc/shared");
const patientService = require("../services/patientService");

const internalGetPatientMedical = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const medical = await patientService.getMedical(patientId);
  return response.sendSuccess(res, { message: "medical data", data: medical });
});

const internalAddPrescription = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { doctorId, medications, notes } = req.body || {};
  const result = await patientService.addPrescription({ patientId, doctorId, medications, notes });
  return response.sendSuccess(res, { message: "prescription added", data: result });
});

const internalGetPatientProfile = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const profile = await patientService.getProfile(patientId);
  return response.sendSuccess(res, { message: "profile", data: profile });
});

module.exports = {
  internalGetPatientMedical,
  internalAddPrescription,
  internalGetPatientProfile,
};

