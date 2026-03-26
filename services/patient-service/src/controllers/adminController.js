const axios = require("axios");
const config = require("../config");
const Patient = require("../models/Patient");
const { asyncHandler, response, AppError } = require("@hc/shared");

const listUsers = asyncHandler(async (req, res) => {
  const users = await Patient.find({}).select("_id email role profile createdAt").lean();
  return response.sendSuccess(res, { message: "users", data: { users } });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body || {};
  if (!["patient", "admin"].includes(role)) throw new AppError("role must be patient|admin", 400);
  const updated = await Patient.findByIdAndUpdate(req.params.patientId, { role }, { new: true });
  if (!updated) throw new AppError("User not found", 404);
  return response.sendSuccess(res, { message: "role updated", data: { id: updated._id, role: updated.role } });
});

const verifyDoctor = asyncHandler(async (req, res) => {
  const doctorId = req.params.doctorId;
  if (!doctorId) throw new AppError("doctorId is required", 400);

  if (!config.DOCTOR_SERVICE_URL) throw new AppError("DOCTOR_SERVICE_URL not configured", 500);

  await axios.post(
    `${config.DOCTOR_SERVICE_URL}/internal/doctors/${doctorId}/verify`,
    {},
    { headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN } }
  );

  return response.sendSuccess(res, { message: "doctor verified" });
});

module.exports = { listUsers, updateUserRole, verifyDoctor };

