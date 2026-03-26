const { asyncHandler, response } = require("@hc/shared");
const patientService = require("../services/patientService");

const uploadReports = asyncHandler(async (req, res) => {
  const files = req.files?.documents || [];
  const result = await patientService.uploadReports(req.user.sub, files);
  return response.sendSuccess(res, { statusCode: 201, message: "reports uploaded", data: result });
});

const getMedicalHistory = asyncHandler(async (req, res) => {
  const data = await patientService.getMedical(req.user.sub);
  return response.sendSuccess(res, { message: "medical data", data });
});

const getPrescriptions = asyncHandler(async (req, res) => {
  const data = await patientService.getMedical(req.user.sub);
  return response.sendSuccess(res, { message: "prescriptions", data: { prescriptions: data.prescriptions } });
});

module.exports = { uploadReports, getMedicalHistory, getPrescriptions };

